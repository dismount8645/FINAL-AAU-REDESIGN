import { memo, type ReactNode, HTMLAttributes } from 'react'
import { type LucideIcon, ChevronRight } from 'lucide-react'
import { Text } from '@/components/ui/Typography'

export interface ListItemProps extends HTMLAttributes<HTMLElement> {
  icon?: LucideIcon
  iconColor?: string
  title?: string
  subtitle?: string
  right?: ReactNode
  href?: string
  active?: boolean
}

const ListItem = memo(function ListItem({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  right,
  onClick,
  href,
  active,
  children,
  className = '',
  ...props
}: ListItemProps) {
  const Tag = href ? 'a' : 'div'
  const linkProps = href ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: href.startsWith('http') ? 'noopener noreferrer' : undefined } : {}
  const keyboardProps = (onClick && !href) ? {
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick(e as any)
      }
    }
  } : {}

  return (
    <Tag
      className={[
        'flex items-center gap-sm px-md py-sm rounded-[var(--radius-sm)] transition-colors duration-150 no-underline text-inherit',
        (onClick || href) ? 'cursor-pointer hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none' : '',
        active ? 'bg-primary text-primary-foreground font-bold shadow-[var(--shadow-sm)]' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      {...linkProps}
      {...keyboardProps}
      {...props}
    >
      {Icon ? (
        <div className="w-5 flex items-center justify-center shrink-0 text-primary" style={iconColor ? { color: iconColor } : undefined}>
          <Icon size={16} strokeWidth={2} aria-hidden="true" />
        </div>
      ) : null}
      <div className="flex-1 min-w-0">
        {title ? <Text className="m-0 leading-normal">{title}</Text> : null}
        {children && !title ? <Text className="m-0 leading-normal">{children}</Text> : null}
        {subtitle ? <Text size="xs" muted className="m-0 leading-tight">{subtitle}</Text> : null}
      </div>
      {right ? <div className="shrink-0 flex items-center">{right}</div> : (
        (onClick || href) ? (
          <ChevronRight size={14} strokeWidth={2} className="opacity-40 shrink-0" aria-hidden="true" />
        ) : null
      )}
    </Tag>
  )
})

export default ListItem
