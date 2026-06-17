import { useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, ExternalLink, ChevronRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, Text, Heading } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { courses as dataCourses } from '@/lib/data';
import { PATHS } from '@/routes';
import { DASHBOARD_CONFIG } from '@/lib/dashboard';
import { env } from '@/lib/env';
import { resolveFavorite, sortFavorites } from '@/lib/favorites';
import type { ResolvedFavorite } from '@/lib/favorites';
import useStore from '@/store';

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
}

const getFavoriteMetadata = (item: ResolvedFavorite, lang: 'da' | 'en') => {
  if (item.type === 'course') {
    const course = dataCourses[item.entityId]
    if (course?.nextAssignment) {
      return lang === 'da'
        ? `Næste aflevering: ${course.nextAssignment.deadline}`
        : `Next assignment: ${course.nextAssignment.deadlineEn}`
    }
    return lang === 'da' ? 'Opdateret i går' : 'Updated yesterday'
  }
  if (item.type === 'file') {
    for (const course of Object.values(dataCourses)) {
      for (const section of course.sections) {
        const fileItem = section.items.find(i => i.id === item.entityId)
        if (fileItem) {
          const ext = (fileItem.type || 'PDF').toUpperCase()
          return lang === 'da'
            ? `${ext} · Opdateret 10. jun`
            : `${ext} · Updated Jun 10`
        }
      }
    }
    return lang === 'da' ? 'PDF · Opdateret nyligt' : 'PDF · Recently updated'
  }
  if (item.type === 'tool') {
    return lang === 'da' ? 'Eksternt værktøj' : 'External tool'
  }
  if (item.type === 'forum') {
    return lang === 'da' ? 'Forum · Aktivt' : 'Forum · Active'
  }
  return ''
}

function FavoritesWidgetInner({ size = 'medium' }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const favorites = useStore(state => state.favorites)
  const courses = useStore(state => state.courses)
  const resolved = useMemo(() => {
    const sorted = sortFavorites(favorites)
    return sorted
      .map(fav => resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as ResolvedFavorite[]
  }, [favorites, lang, courses, t])

  const limit = size === 'small' ? 2 : size === 'medium' ? 6 : DASHBOARD_CONFIG.FAVORITES_LIMIT
  const overflow = favorites.length - limit
  const display = resolved.slice(0, limit)

  const handleSeeAll = useCallback(() => {
    navigate(PATHS.FAVORITES)
  }, [navigate])

  return (
    <Card className="widget-card h-full w-full favorites-widget shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
      <Card.Header padding="compact" className="bg-bg-highlight/50 border-b border-[var(--border-color)]">
        <Stack direction="row" align="center" gap="sm">
          <div className="text-primary shrink-0">
            <Star size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('dashboard.widget_favorites')}
          </Heading>
        </Stack>
        <Button variant="ghost" size="sm" className="text-sm font-extrabold text-primary dark:text-white normal-case tracking-normal hover:underline h-[44px] min-h-[44px]" onClick={handleSeeAll} iconRight={ChevronRight} aria-label={lang === 'da' ? 'Se alle favoritter' : 'See all favorites'}>
          {lang === 'da' ? 'Se alle' : 'See all'}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="overflow-visible p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        {display.length > 0 ? (
          <div className="flex flex-col gap-2xs w-full">
            {display.map((item) => {
              const metadata = getFavoriteMetadata(item, lang)
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.external) {
                      env.open(item.link)
                    } else {
                      navigate(item.link)
                    }
                  }}
                  className="flex items-center justify-between py-sm px-sm border-b border-border/30 last:border-0 cursor-pointer transition-colors group/row hover:bg-bg-hover"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (item.external) {
                        env.open(item.link)
                      } else {
                        navigate(item.link)
                      }
                    }
                  }}
                >
                  <div className="flex items-center gap-xs min-w-0 flex-1">
                    <div className="shrink-0" style={{ color: item.iconColor }}>
                      <item.icon size={16} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-xs">
                        <span className="text-sm font-bold text-main truncate block">{item.title}</span>
                        {item.external && <ExternalLink size={14} className="text-text-secondary shrink-0" />}
                      </div>
                      <span className="text-sm font-medium text-text-secondary truncate block mt-3xs leading-relaxed">{metadata}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-xs ml-sm shrink-0">
                    <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 group-hover/row:translate-x-[2px] transition-all duration-200 shrink-0" />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center py-xs gap-[var(--space-2xs)]">
            <div className="text-primary/40 shrink-0">
              <Star size={24} strokeWidth={1.5} />
            </div>
            <Heading level={3} as="h3" className="text-xs font-bold text-main mt-xs">
              {lang === 'da' ? 'Ingen favoritter endnu' : 'No favorites yet'}
            </Heading>
            <Text size="xs" className="text-center max-w-[200px] text-text-muted italic">
              {lang === 'da' ? 'Markér kurser som favoritter for at vise dem her.' : 'Mark courses as favorites to show them here.'}
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(PATHS.COURSES)}
              className="mt-xs font-bold text-xs h-[32px] min-h-[32px] flex items-center px-sm"
            >
              {lang === 'da' ? 'Gå til kurser' : 'Go to courses'}
            </Button>
          </div>
        )}
        {overflow > 0 && size !== 'small' && (
          <div className="mt-[var(--space-xs)] text-center pb-[var(--space-xs)]">
            <Text size="xs" weight="bold" className="text-primary uppercase tracking-widest opacity-60">
              {`+${overflow} ${t('more_favorites')}`}
            </Text>
          </div>
        )}
      </Card.Body>
      {display.length > 0 && size !== 'small' && (
        <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center cursor-pointer hover:bg-bg-hover transition-colors" onClick={handleSeeAll} role="button" tabIndex={0}>
          <Text size="xs" weight="medium" className="text-muted font-medium">{favorites.length} {favorites.length === 1 ? (lang === 'da' ? 'favorit' : 'favorite') : (lang === 'da' ? 'favoritter' : 'favorites')}</Text>
          <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
            <Text size="xs" weight="bold" className="text-primary dark:text-white uppercase">{lang === 'da' ? 'Se alle favoritter' : 'See all favorites'}</Text>
            <ChevronRight size={14} strokeWidth={2.5} className="text-primary dark:text-white" />
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}

const FavoritesWidget = memo(FavoritesWidgetInner)

export { FavoritesWidget }
