import type { MouseEventHandler } from 'react'
import { type LucideIcon, FileText, Play, Link2, Upload, File, Check } from 'lucide-react'
import useStore from '@/store/useStore'

type LessonType = 'pdf' | 'video' | 'link' | 'assignment' | 'file'

export interface LessonItemProps {
  type?: LessonType
  title?: string
  metadata?: string
  completed?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  onToggle?: () => void
  className?: string
  isAutomatic?: boolean
}

export default function LessonItem({
  type = 'file',
  title,
  metadata,
  completed,
  onClick,
  onToggle,
  className = '',
  isAutomatic = false,
}: LessonItemProps) {
  const { t } = useStore()
  const iconMap: Record<LessonType, LucideIcon> = {
    pdf: FileText,
    video: Play,
    link: Link2,
    assignment: Upload,
    file: File,
  }
  
  const typeStyles = {
    pdf: 'text-danger bg-danger-light',
    video: 'text-success bg-success-light',
    assignment: 'text-accent bg-accent-light',
    link: 'text-info bg-info-light',
    file: 'text-muted bg-hover'
  }

  /* istanbul ignore next */
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAutomatic) onToggle?.()
  }

  return (
    <div
      className={`flex items-center p-sm sm:p-md gap-sm sm:gap-md rounded-[var(--radius-md)] border bg-card transition cursor-pointer mb-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${className}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
        }
      }}
    >
      <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)] shrink-0 ${typeStyles[type] || typeStyles.file}`}>
        {(() => { const IconComponent = iconMap[type] || iconMap.file; return <IconComponent size={16} strokeWidth={2} aria-hidden="true" />; })()}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-main m-0">{title}</p>
        {metadata ? <p className="text-xs text-main/60 m-0 mt-xs">{metadata}</p> : null}
      </div>
        <button
          className={`lesson-item__checkbox group/check flex items-center justify-center w-6 h-6 border rounded-[var(--radius-sm)] transition shrink-0 ${completed ? 'bg-primary border-primary text-white' : (isAutomatic ? 'border-dashed opacity-30 cursor-default' : 'border-border bg-transparent hover:border-primary/50 dark:border-white/20')}`}
          onClick={handleCheckboxClick}
          aria-label={completed ? t('mark_incomplete') : t('mark_complete')}
          type="button"
          disabled={isAutomatic}
        >
          {completed ? <Check size={14} strokeWidth={2} aria-hidden="true" /> : (!isAutomatic && <Check size={14} strokeWidth={2} aria-hidden="true" className="opacity-0 group-hover/check:opacity-20 transition-opacity" />)}
        </button>
    </div>
  )
}
