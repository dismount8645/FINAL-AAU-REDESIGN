import { memo } from 'react';


import { X, type LucideIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui';
import Button from '@/components/ui/Button';
import { cn, getFavoriteLabel } from '@/lib/utils';
import type { Lang } from '@/lib/utils';
import { translations } from '@/translations';
import type { FavoriteType } from '@/lib/types';

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
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
  draggable?: boolean
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
      className={cn(
        "group relative flex items-center gap-xs p-xs rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-bg-card hover:border-primary/30 focus-within:shadow-focus focus-within:outline-none transition-all cursor-pointer select-none",
        "hover:-translate-y-1 active:scale-[0.98] duration-150 ease-[var(--transition-ease)]",
        draggable && "active:opacity-60",
      )}
    >
      {/* Primary Semantic Navigation - Stretched Link Pattern */}
      {item.external ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 rounded-[var(--radius-xl)] focus:outline-none"
          aria-label={item.title}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault()
            }
          }}
        />
      ) : (
        <Link
          to={item.link}
          className="absolute inset-0 z-10 rounded-[var(--radius-xl)] focus:outline-none"
          aria-label={item.title}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault()
            }
          }}
        />
      )}

      <div
        className={cn(
          "relative z-20 flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] shrink-0 pointer-events-none",
          typeClasses[item.type]
        )}
      >
        <Icon size={18} strokeWidth={2} />
      </div>

      <div className="relative z-20 flex-1 min-w-0 pointer-events-none">
        <div className="text-sm font-medium truncate text-main">
          {item.title}
        </div>
        <Badge
          className={cn(
            "rounded-[var(--radius-pill)] px-[var(--space-sm)] text-[0.7rem] font-bold leading-tight",
            typeClasses[item.type]
          )}
        >
          {getFavoriteLabel(item.type, lang)}
        </Badge>
      </div>

      <div className="relative z-30 flex items-center justify-center w-6 h-6 shrink-0 ml-auto">
        <ChevronRight 
          size={16} 
          strokeWidth={2.5} 
          className="text-muted/60 absolute transition-opacity duration-150 group-hover:opacity-0" 
        />
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          onClick={(e) => { 
            e.stopPropagation()
            e.preventDefault()
            onRemove(item.type, item.entityId) 
          }}
          className="text-muted hover:text-danger hover:bg-danger/10 absolute opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-all"
          aria-label={(translations[lang as 'da' | 'en']?.remove_favorite as string) || 'Remove from favorites'}
        >
          <X size={14} strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
})

export default FavoriteItem

