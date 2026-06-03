import { memo, type ReactNode, MouseEventHandler } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { type LucideIcon, Bell } from 'lucide-react';
import { Text } from '@/components/Typography';
import { cn } from '@/lib/utils';

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
        "flex items-center gap-[var(--space-md)] px-[var(--space-sm)] py-[var(--space-xs)] rounded-[var(--radius-md)] transition-all duration-150",
        onClick ? "cursor-pointer hover:bg-bg-hover focus-visible:outline-none focus-visible:shadow-focus" : "cursor-default",
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

if (import.meta.vitest) {
  describe('StatusItem', () => {
    it('renders title', () => {
      render(<StatusItem title="Status" />)
      expect(screen.getByText('Status')).toBeInTheDocument()
    })
  
    it('renders with icon', () => {
      const { container } = render(<StatusItem icon={Bell} title="Notifications" />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  
    it('renders subtitle', () => {
      render(<StatusItem title="Item" subtitle="Subtitle text" />)
      expect(screen.getByText('Subtitle text')).toBeInTheDocument()
    })
  
    it('renders subtitle with icon', () => {
      const { container } = render(<StatusItem title="Item" subtitle="With icon" subtitleIcon="fa-clock" />)
      expect(container.querySelector('.fa-clock')).toBeInTheDocument()
    })
  
    it('renders right slot', () => {
      render(<StatusItem title="Item" right={<span>Right</span>} />)
      expect(screen.getByText('Right')).toBeInTheDocument()
    })
  
    it('applies highlighted class when unread', () => {
      const { container } = render(<StatusItem title="Item" unread />)
      expect(container.firstChild).toHaveClass('bg-bg-highlight')
    })
  
    it('calls onClick when clicked', () => {
      const onClick = vi.fn()
      render(<StatusItem title="Item" onClick={onClick} />)
      fireEvent.click(screen.getByText('Item').closest('[role="button"]')!)
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  
    it('calls onClick on Enter key', () => {
      const onClick = vi.fn()
      render(<StatusItem title="Item" onClick={onClick} />)
      const el = screen.getByText('Item').closest('[role="button"]')!
      fireEvent.keyDown(el, { key: 'Enter' })
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  
    it('calls onClick on Space key', () => {
      const onClick = vi.fn()
      render(<StatusItem title="Item" onClick={onClick} />)
      const el = screen.getByText('Item').closest('[role="button"]')!
      fireEvent.keyDown(el, { key: ' ' })
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  
    it('ignores other keys when onClick set', () => {
      const onClick = vi.fn()
      render(<StatusItem title="Item" onClick={onClick} />)
      const el = screen.getByText('Item').closest('[role="button"]')!
      fireEvent.keyDown(el, { key: 'Escape' })
      expect(onClick).not.toHaveBeenCalled()
    })
  
    it('applies custom className', () => {
      const { container } = render(<StatusItem title="Item" className="custom-class" />)
      expect(container.firstChild).toHaveClass('custom-class')
    })
  
    it('is not clickable without onClick', () => {
      const { container } = render(<StatusItem title="Item" />)
      expect(container.firstChild).not.toHaveAttribute('role')
      expect(container.firstChild).not.toHaveAttribute('tabindex')
    })
  
    it('renders without subtitle', () => {
      render(<StatusItem title="Item" />)
      expect(screen.getByText('Item')).toBeInTheDocument()
    })
  })
}
