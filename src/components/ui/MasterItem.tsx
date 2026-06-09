import { memo, type ReactNode, type MouseEvent, type KeyboardEvent } from 'react'
import { type LucideIcon } from 'lucide-react'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
export interface MasterItemProps {
  leading?: LucideIcon | ReactNode
  leadingClassName?: string
  title: ReactNode
  subtitle?: ReactNode
  meta?: ReactNode
  trailing?: ReactNode
  unread?: boolean
  selected?: boolean
  loading?: boolean
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
  className?: string
}

export const MasterItem = memo(function MasterItem({
  leading: Leading,
  leadingClassName = '',
  title,
  subtitle,
  meta,
  trailing,
  unread = false,
  selected = false,
  loading = false,
  onClick,
  className = '',
}: MasterItemProps) {
  const isClickable = !!onClick

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(e as unknown as MouseEvent<HTMLDivElement>)
    }
  }

  const renderLeading = () => {
    if (!Leading) return null
    const isLucideIcon = typeof Leading === 'function' || (typeof Leading === 'object' && Leading !== null && 'render' in Leading)
    if (isLucideIcon) {
      const IconComp = Leading as LucideIcon
      return (
        <div className={`shrink-0 flex items-center justify-center transition-all w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)] ${leadingClassName}`}>
          <IconComp size={18} strokeWidth={2.5} />
        </div>
      )
    }
    return <div className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center">{Leading}</div>
  }

  if (loading) {
    return (
      <Stack
        direction="row"
        align="center"
        gap="sm"
        role="status"
        aria-busy="true"
        className={cn('group p-sm border-b border-border/40', className)}
      >
        <Skeleton variant="rectangular" className="w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)]" />
        <Stack gap="none" className="flex-1 min-w-0">
          <Skeleton variant="text" width="60%" />
          <div className="h-2" />
          <Skeleton variant="text" width="40%" />
        </Stack>
        {trailing && <Skeleton variant="rectangular" className="w-6 h-6 rounded-[var(--radius-sm)]" />}
      </Stack>
    )
  }

  return (
    <Stack
      direction="row"
      align="center"
      gap="sm"
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(`group p-sm border-b border-border/40 transition-all duration-150 relative bg-bg-card focus-visible:outline-none focus-visible:shadow-focus ${
        isClickable ? 'cursor-pointer hover:bg-bg-hover' : ''
      } ${unread ? 'is-unread font-semibold' : ''} ${
        selected ? 'is-selected bg-primary/5 dark:bg-primary/10 active bg-bg-highlight dark:bg-white/5' : ''
      }`, className)}
    >
      {selected && <div className="panel-active-indicator" />}

      {renderLeading()}

      <Stack gap="none" className="flex-1 min-w-0">
        <div className="line-clamp-2" title={typeof title === 'string' ? title : undefined}>{title}</div>
        {subtitle && <div className="truncate text-text-muted text-xs">{subtitle}</div>}
        {meta}
      </Stack>

      {trailing && <div className="shrink-0 flex items-center gap-sm">{trailing}</div>}
    </Stack>
  )
})

export default MasterItem

if (import.meta.vitest) {
  describe('MasterItem', () => {
    it('renders title and subtitle', () => {
      render(<MasterItem title="Test Title" subtitle="Test Subtitle" />)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    })

    it('handles click and keyboard interaction', () => {
      const clickSpy = vi.fn()
      render(<MasterItem title="Click Me" onClick={clickSpy} />)

      const item = screen.getByText('Click Me').closest('[role="button"]')!
      expect(item).toHaveAttribute('tabIndex', '0')

      fireEvent.click(item)
      expect(clickSpy).toHaveBeenCalledTimes(1)

      fireEvent.keyDown(item, { key: 'Enter' })
      expect(clickSpy).toHaveBeenCalledTimes(2)

      fireEvent.keyDown(item, { key: ' ' })
      expect(clickSpy).toHaveBeenCalledTimes(3)
    })

    it('applies unread and selected classes', () => {
      const { container } = render(<MasterItem title="Title" unread selected />)
      expect(container.querySelector('.is-unread')).toBeInTheDocument()
      expect(container.querySelector('.is-selected')).toBeInTheDocument()
      expect(container.querySelector('.panel-active-indicator')).toBeInTheDocument()
    })

    it('does not trigger click when non-clickable keydown or non-target keydown occurs', () => {
      const clickSpy = vi.fn()

      const { container } = render(<MasterItem title="Non Clickable" />)
      const nonClickableItem = container.firstChild as HTMLElement
      fireEvent.keyDown(nonClickableItem, { key: 'Enter' })
      expect(clickSpy).not.toHaveBeenCalled()

      const { container: container2 } = render(<MasterItem title="Clickable" onClick={clickSpy} />)
      const clickableItem = container2.firstChild as HTMLElement
      fireEvent.keyDown(clickableItem, { key: 'Escape' })
      expect(clickSpy).not.toHaveBeenCalled()
    })

    it('renders loading skeleton state', () => {
      const { container } = render(<MasterItem title="Title" loading />)
      const stack = container.firstChild as HTMLElement
      expect(stack).toHaveAttribute('role', 'status')
      expect(stack).toHaveAttribute('aria-busy', 'true')
      expect(stack.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('renders LucideIcon leading with standard sizing', () => {
      function TestIcon() { return null }
      const { container } = render(<MasterItem title="Title" leading={TestIcon} />)
      const iconContainer = container.querySelector('.shrink-0')
      expect(iconContainer).toHaveClass('w-9', 'h-9', 'sm:w-11', 'sm:h-11', 'rounded-[var(--radius-sm)]')
      expect(iconContainer).not.toHaveClass('bg-bg-highlight/50')
    })

    it('applies leadingClassName to icon container', () => {
      function TestIcon() { return null }
      const { container } = render(<MasterItem title="Title" leading={TestIcon} leadingClassName="text-danger bg-danger/10" />)
      const iconContainer = container.querySelector('.shrink-0')
      expect(iconContainer).toHaveClass('text-danger', 'bg-danger/10')
    })
  })
}
