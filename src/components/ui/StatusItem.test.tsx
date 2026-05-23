import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
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
    expect(container.firstChild).toHaveClass('bg-[var(--bg-highlight)]')
  })
})
