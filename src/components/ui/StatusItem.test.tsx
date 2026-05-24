import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Bell } from 'lucide-react'
import StatusItem from '@/components/ui/StatusItem'

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
