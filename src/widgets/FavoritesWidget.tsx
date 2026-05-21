import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ChevronRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import type { WidgetProps } from '@/types'
import { sortFavorites, resolveFavorite } from '@/utils/favorites'
import FavoriteItem from '@/components/ui/FavoriteItem'
import { env } from '@/utils/env'

import { DASHBOARD_CONFIG } from '@/config/dashboard'

export default function FavoritesWidget({ isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const { t, lang, favorites, toggleFavorite, courses } = useStore()

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

  return (
    <Card className="widget-card h-full w-full favorites-widget @container/widget">
      <Card.Header>
        <Text weight="bold" size="lg" className="card__title">
          {t('favorites')}
        </Text>
        <button
          type="button"
          className="text-sm text-primary dark:text-slate-200 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap transition-all hover:opacity-80 bg-transparent border-none p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm"
          onClick={() => navigate('/favorites')}
        >
          {t('see_all')}<ChevronRight size={14} strokeWidth={2} />
        </button>
      </Card.Header>

      <Card.Body>
        {resolved.length > 0 ? (
          <div className="grid gap-xs"
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
            <div className="p-[var(--space-md)] bg-[var(--bg-body)] rounded-[var(--radius-pill)]">
              <Star size={24} strokeWidth={2} className="text-[var(--aau-light-orange)]" fill="var(--aau-light-orange)" />
            </div>
            <Text muted className="text-center max-w-[240px]">
              {t('no_favorites_hint')}
            </Text>
          </div>
        )}

        {overflow > 0 && (
          <div className="mt-xs text-center">
            <Text size="sm" muted>
              {`+${overflow} ${t('more_favorites')}`}
            </Text>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}