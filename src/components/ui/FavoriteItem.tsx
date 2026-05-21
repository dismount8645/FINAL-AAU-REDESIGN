import { memo } from 'react'
import { X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFavoriteColor, getFavoriteLabel } from '@/utils/favorites'
import type { FavoriteType } from '@/types'
import type { Lang } from '@/store/useStore'
import { translations } from '@/data/translations'

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
  const typeColor = getFavoriteColor(item.type)
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
        "group relative flex items-center gap-xs p-xs rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all cursor-pointer select-none",
        draggable && "active:opacity-60 active:scale-[0.97]",
      )}
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] shrink-0"
        style={{ background: item.iconBg, color: item.iconColor }}
      >
        <Icon size={18} strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate text-[var(--text-main)]">
          {item.title}
        </div>
        <span
          className="inline-flex items-center text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-[var(--radius-pill)] mt-0.5"
          style={{
            background: `${typeColor}20`,
            color: typeColor,
          }}
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
