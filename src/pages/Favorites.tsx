import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import useStore from '@/store/useStore'
import { sortFavorites, resolveFavorite } from '@/utils/favorites'
import type { FavoriteType } from '@/types'
import { env } from '@/utils/env'
import { DASHBOARD_CONFIG } from '@/config/dashboard'
import { FavoritesFilter, FavoritesList } from './favorites/index'

function Favorites() {
  const navigate = useNavigate()
  const { t, lang, favorites, toggleFavorite, reorderFavorites, courses } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<FavoriteType | 'all'>('all')

  const sorted = useMemo(() => sortFavorites(favorites), [favorites])

  const resolved = useMemo(() => {
    return sorted
      .map(fav => resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as NonNullable<ReturnType<typeof resolveFavorite>>[]
  }, [sorted, lang, courses, t])

  const filtered = useMemo(() => {
    let items = resolved
    if (typeFilter !== 'all') {
      items = items.filter(item => item.type === typeFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(item => item.title.toLowerCase().includes(q))
    }
    return items
  }, [resolved, typeFilter, searchQuery])

  return (
    <Stack className="favorites-page">
      <PageHeader
        pageKey="favorites"
        title={t('favorites_page_title')}
        subtitle={t('favorites_page_subtitle')}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('favorites') },
        ]}
      />

      <div className="container pb-[var(--space-2xl)]">
        <div className="flex items-center justify-between mb-[var(--space-lg)]">
          <div className="flex items-center gap-[var(--space-sm)]">
            <Text size="sm" muted>
              {resolved.length}/{DASHBOARD_CONFIG.FAVORITES_LIMIT} {t('favorites_limit')}
            </Text>
          </div>
          {resolved.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sorted.forEach(f => toggleFavorite(f.type, f.entityId))
              }}
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
              {t('remove_all')}
            </Button>
          )}
        </div>

        <FavoritesFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          lang={lang}
          t={t}
        />

        <FavoritesList
          filtered={filtered}
          lang={lang}
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          t={t}
          onRemove={(type, entityId) => toggleFavorite(type, entityId)}
          onReorder={reorderFavorites}
          onNavigate={(link, external) => {
            if (external) {
              env.open(link)
            } else {
              navigate(link)
            }
          }}
          onGoToDashboard={() => navigate('/')}
        />
      </div>
    </Stack>
  )
}

export default Favorites