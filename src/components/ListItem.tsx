import { memo, type ReactNode, HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { type LucideIcon, ChevronRight } from 'lucide-react'
import { Text } from '@/components/Typography'

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
  const isInternal = href && !href.startsWith('http') && !href.startsWith('//')

  const keyboardProps = (onClick && !href) ? {
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick(e as unknown as React.MouseEvent<HTMLElement>)
      }
    }
  } : {}

  const content = (
    <>
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
    </>
  )

  const commonClassName = [
    'flex items-center gap-sm px-md py-sm rounded-[var(--radius-sm)] transition-colors duration-150 no-underline text-inherit',
    (onClick || href) ? 'cursor-pointer hover:bg-bg-hover focus-visible:outline-none focus-visible:shadow-focus' : '',
    active ? 'bg-primary text-primary-foreground font-bold shadow-[var(--shadow-sm)]' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (isInternal && href) {
    return (
      <Link
        to={href}
        className={commonClassName}
        onClick={onClick}
        {...keyboardProps}
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={commonClassName}
        onClick={onClick}
        {...keyboardProps}
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    )
  }

  return (
    <div
      className={commonClassName}
      onClick={onClick}
      {...keyboardProps}
      {...(props as HTMLAttributes<HTMLDivElement>)}
    >
      {content}
    </div>
  )
})

export default ListItem
