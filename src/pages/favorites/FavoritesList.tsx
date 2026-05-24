import { useState } from 'react'
import { Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'
import FavoriteItem from '@/components/ui/FavoriteItem'
import type { FavoriteType } from '@/types'

interface FavoritesListProps {
  filtered: any[] // We can type this based on resolveFavorite return type or simply any[]
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
    <AnimatePresence mode="wait">
      {filtered.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
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
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="grid gap-[var(--space-xs)]"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
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
                  : ''
              }
            >
              <FavoriteItem
                item={item}
                lang={lang}
                onRemove={onRemove}
                onClick={() => onNavigate(item.link, item.external)}
                draggable
                compact
              />
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
