import { memo } from 'react'
import { X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFavoriteLabel } from '@/utils/favorites'
import type { FavoriteType } from '@/types'
import type { Lang } from '@/store/useStore'
import { translations } from '@/data/translations'

const typeClasses: Record<FavoriteType, string> = {
  course: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground',
  tool: 'bg-success/10 text-success dark:bg-success/20 dark:text-success',
  file: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning',
  forum: 'bg-info/10 text-info dark:bg-info/20 dark:text-info',
  link: 'bg-[var(--aau-light-pink)]/10 text-[var(--aau-light-pink)] dark:bg-[var(--aau-light-pink)]/20 dark:text-[var(--aau-light-pink)]',
}

export interface FavoriteItemData {
  id: string
  type: FavoriteType
  entityId: number
  title: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  link: string
  external?: boolean
}

interface FavoriteItemProps {
  item: FavoriteItemData
  lang: Lang
  onRemove: (type: FavoriteType, entityId: number) => void
  onClick?: () => void
  onDragStart?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
  draggable?: boolean
  compact?: boolean
}

const FavoriteItem = memo(function FavoriteItem({
  item,
  lang,
  onRemove,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  draggable = false,
}: FavoriteItemProps) {
  const Icon = item.icon
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={cn(
        "group relative flex items-center gap-xs p-xs rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-bg-card hover:bg-bg-hover hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all cursor-pointer select-none",
        draggable && "active:opacity-60 active:scale-[0.97]",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] shrink-0",
          typeClasses[item.type]
        )}
      >
        <Icon size={18} strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate text-main">
          {item.title}
        </div>
        <span
          className={cn(
            "inline-flex items-center text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-[var(--radius-pill)] mt-0.5",
            typeClasses[item.type]
          )}
        >
          {getFavoriteLabel(item.type, lang)}
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(item.type, item.entityId) }}
        className="w-7 h-7 relative flex items-center justify-center rounded-[var(--radius-lg)] text-muted hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-danger focus-visible:outline-none transition-all shrink-0 after:absolute after:inset-[-8px] after:content-['']"
        aria-label={(translations[lang]?.remove_favorite as string) || 'Remove from favorites'}
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  )
})

export default FavoriteItem
