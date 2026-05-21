import { memo, type ReactNode, MouseEventHandler } from 'react'
import { type LucideIcon } from 'lucide-react'
import { Text } from '@/components/ui/Typography'

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
      className={`flex items-center gap-md px-sm -mx-sm py-1.5 rounded-[var(--radius-md)] transition cursor-${onClick ? 'pointer' : 'default'} ${unread ? 'bg-highlight' : ''} ${onClick ? 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none' : ''} ${className}`}
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
      {Icon ? (
        <div 
          className="flex items-center justify-center w-8 h-8 shrink-0" 
          style={{ color: iconColor || 'var(--color-primary)' }}
        >
          <Icon size={20} strokeWidth={2} aria-hidden="true" />
        </div>
      ) : null}
      <div className="flex flex-col flex-1 min-w-0">
        <Text weight="bold" className="truncate text-base m-0 leading-tight">{title}</Text>
        {subtitle ? (
          <Text size="sm" muted={!subtitleClassName} className={`truncate m-0 leading-tight ${subtitleClassName}`}>
            {subtitleIcon ? <i className={`fa-solid ${subtitleIcon} mr-xs`} aria-hidden="true" /> : null}
            {subtitle}
          </Text>
        ) : null}
      </div>
      {right ? <div className="flex items-center justify-center w-auto min-w-[60px] shrink-0">{right}</div> : null}
    </div>
  )
})

export default StatusItem
