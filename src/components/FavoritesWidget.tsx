import { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ChevronRight } from 'lucide-react'
import Card from '@/components/Card'
import Stack from '@/components/Stack'
import Button from '@/components/Button'
import { Text, Heading } from '@/components/Typography'
import useStore from '@/store/useStore'
import type { WidgetProps } from '@/types'
import { sortFavorites, resolveFavorite } from '@/lib/favorites'
import FavoriteItem from '@/components/FavoriteItem'
import { env } from '@/lib/env'

import { DASHBOARD_CONFIG } from '@/lib/dashboard'

export default function FavoritesWidget({ span, isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const favorites = useStore(state => state.favorites)
  const toggleFavorite = useStore(state => state.toggleFavorite)
  const courses = useStore(state => state.courses)

  const limit = DASHBOARD_CONFIG.FAVORITES_LIMIT

  const { overflow, resolved } = useMemo(() => {
    const sorted = sortFavorites(favorites)
    const display = sorted.slice(0, limit)
    const overflow = sorted.length - limit
    const resolved = display
      .map(fav => resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as NonNullable<ReturnType<typeof resolveFavorite>>[]
    return { overflow, resolved }
  }, [favorites, limit, lang, courses, t])

  const handleSeeAll = useCallback(() => {
    if (!isEditing) navigate('/favorites')
  }, [isEditing, navigate])

  return (
    <Card className="widget-card h-full w-full favorites-widget @container/widget shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
      <Card.Header padding="compact" className="bg-bg-highlight/50 border-b border-[var(--border-color)]">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Star size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('favorites')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size={span && span > 4 ? "xs" : "icon-xs"}
          className="text-[0.65rem] font-black uppercase tracking-widest text-primary"
          onClick={handleSeeAll}
          iconRight={ChevronRight}
          aria-label={t('see_all')}
        >
          {span && span > 4 ? t('see_all') : ''}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="overflow-visible">
        {resolved.length > 0 ? (
          <div className="grid gap-[var(--space-sm)] p-[var(--space-xs)]"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            }}
          >
            {resolved.map((item) => (
              <FavoriteItem
                key={item.id}
                item={item}
                lang={lang}
                onRemove={(type, entityId) => toggleFavorite(type, entityId)}
                onClick={() => {
                  if (!isEditing) {
                    if (item.external) {
                      env.open(item.link)
                    } else {
                      navigate(item.link)
                    }
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center py-lg gap-[var(--space-md)]">
            <div className="p-[var(--space-md)] bg-bg-highlight rounded-[var(--radius-pill)]">
              <Star size={32} strokeWidth={2} className="text-[var(--aau-light-orange)]" fill="currentColor" />
            </div>
            <Text muted size="sm" className="text-center max-w-[240px] italic">
              {t('no_favorites_hint')}
            </Text>
          </div>
        )}

        {overflow > 0 && (
          <div className="mt-[var(--space-sm)] text-center pb-[var(--space-sm)]">
            <Text size="xs" weight="bold" className="text-primary uppercase tracking-widest opacity-60">
              {`+${overflow} ${t('more_favorites')}`}
            </Text>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}