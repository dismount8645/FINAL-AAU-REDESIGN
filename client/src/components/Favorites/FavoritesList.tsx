import { useState } from 'react'
import { Star } from 'lucide-react'
import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import Button from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui'
import { FavoriteItem, type FavoriteItemData } from '@/components/Favorites'
import type { FavoriteType } from '@/lib/types'

interface FavoritesListProps {
  filtered: FavoriteItemData[]
  lang: 'da' | 'en'
  searchQuery: string
  typeFilter: FavoriteType | 'all'
  t: (key: string) => string
  onRemove: (type: FavoriteType, entityId: number) => void
  onReorder: (dragIndex: number, hoverIndex: number) => void
  onNavigate: (link: string, external?: boolean) => void
  onGoToDashboard: () => void
}

export default function FavoritesList({
  filtered,
  lang,
  searchQuery,
  typeFilter,
  t,
  onRemove,
  onReorder,
  onNavigate,
  onGoToDashboard,
}: FavoritesListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)

  return (
    <>
      {filtered.length === 0 ? (
        <div key="empty">
          <Card className="py-[var(--space-3xl)] border-dashed">
            <Stack align="center" justify="center" gap="md">
              <div className="p-[var(--space-md)] bg-bg-main rounded-[var(--radius-pill)]">
                <Star size={24} strokeWidth={2} className="text-[var(--aau-light-orange)]" fill="var(--aau-light-orange)" />
              </div>
              <Heading level={3}>{t('favorites_empty')}</Heading>
              <Text muted className="max-w-[300px] text-center">
                {searchQuery || typeFilter !== 'all'
                  ? t('no_favorites_match')
                  : t('favorites_empty_hint')}
              </Text>
              <Button variant="primary" onClick={onGoToDashboard}>
                {t('go_to_dashboard')}
              </Button>
            </Stack>
          </Card>
        </div>
      ) : (
        <div
          key="grid"
          className={filtered.length <= 3 ? 'flex flex-wrap justify-start gap-[var(--space-xs)] transition-all duration-150' : 'grid gap-[var(--space-xs)] transition-all duration-150'}
          style={filtered.length <= 3 ? {} : { gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
        >
          {filtered.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault()
                setDropTargetIndex(index)
                if (dragIndex !== null && dragIndex !== index) {
                  onReorder(dragIndex, index)
                  setDragIndex(index)
                }
              }}
              onDragLeave={() => setDropTargetIndex(null)}
              onDragEnd={() => {
                setDragIndex(null)
                setDropTargetIndex(null)
              }}
              className={
                dragIndex === index
                  ? 'opacity-40 border-2 border-dashed border-primary rounded-[var(--radius-lg)] bg-primary/5 transition-all'
                  : dropTargetIndex === index
                  ? 'border-2 border-primary/60 rounded-[var(--radius-lg)] bg-primary/[0.04] transition-all'
                  : filtered.length <= 3 ? 'w-full sm:w-[360px] max-w-full' : ''
              }
            >
              <FavoriteItem
                item={item}
                lang={lang}
                onRemove={onRemove}
                onClick={() => onNavigate(item.link, item.external)}
                draggable
              />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
