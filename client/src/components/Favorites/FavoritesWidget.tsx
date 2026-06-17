import { useCallback, useMemo } from 'react';

import { Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { FavoriteItem } from '@/components/Favorites';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text, Heading } from '@/components/ui';
import { DASHBOARD_CONFIG } from '@/lib/dashboard';
import { PATHS } from '@/routes';
import { env } from '@/lib/env';
import * as favUtils from '@/lib/favorites';
import type { ResolvedFavorite } from '@/lib/favorites';
import useStore from '@/store';
import type { WidgetProps } from '@/lib/types';

export default function FavoritesWidget({ span, isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const toggleFavorite = useStore(state => state.toggleFavorite)

  const limit = DASHBOARD_CONFIG.FAVORITES_LIMIT
  const favorites = useStore(state => state.favorites)
  const courses = useStore(state => state.courses)
  const resolved = useMemo(() => {
    const sorted = favUtils.sortFavorites(favorites)
    return sorted
      .map(fav => favUtils.resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as ResolvedFavorite[]
  }, [favorites, lang, courses, t])
  const overflow = favorites.length - limit
  const display = resolved.slice(0, limit)

  const handleSeeAll = useCallback(() => {
    if (!isEditing) navigate(PATHS.FAVORITES)
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
        {display.length > 0 ? (
          <div className="grid gap-[var(--space-sm)] p-[var(--space-xs)]"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            }}
          >
            {display.map((item) => (
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

