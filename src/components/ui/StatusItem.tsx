import { memo, type ReactNode, MouseEventHandler } from 'react'
import { type LucideIcon } from 'lucide-react'
import { Text } from '@/components/ui/Typography'
import { cn } from '@/lib/utils'

export interface StatusItemProps {
  icon?: LucideIcon
  iconColor?: string
  title?: string
  subtitle?: string
  subtitleIcon?: string
  subtitleClassName?: string
  right?: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
  unread?: boolean
  className?: string
}

const StatusItem = memo(function StatusItem({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  subtitleIcon,
  subtitleClassName = '',
  right,
  onClick,
  unread,
  className = '',
}: StatusItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-[var(--space-md)] px-[var(--space-sm)] py-[var(--space-xs)] rounded-[var(--radius-md)] transition-all duration-200",
        onClick ? "cursor-pointer hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none" : "cursor-default",
        unread && "bg-bg-highlight",
        className
      )}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
        }
      } : undefined}
    >
      {Icon && (
        <div 
          className="flex items-center justify-center w-10 h-10 shrink-0 rounded-[var(--radius-lg)] bg-bg-highlight/50"
          style={{ color: iconColor || 'var(--color-primary)' }}
        >
          <Icon size={20} strokeWidth={2} aria-hidden="true" />
        </div>
      )}
      
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        <Text weight="bold" size="md" className="truncate leading-tight text-main">
          {title}
        </Text>
        {subtitle && (
          <Text size="sm" muted={!subtitleClassName} className={cn("truncate leading-tight mt-0.5", subtitleClassName)}>
            {subtitleIcon && <i className={`fa-solid ${subtitleIcon} mr-1`} aria-hidden="true" />}
            {subtitle}
          </Text>
        )}
      </div>

      {right && (
        <div className="flex items-center justify-end min-w-[44px] shrink-0 ml-auto">
          {right}
        </div>
      )}
    </div>
  )
})

export default StatusItem
