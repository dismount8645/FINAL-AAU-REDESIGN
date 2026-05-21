import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FeedbackCard from '@/components/ui/FeedbackCard'

describe('FeedbackCard', () => {
  it('renders content', () => {
    render(<FeedbackCard content="Test Feedback" />)
    expect(screen.getByText('Test Feedback')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<FeedbackCard title="Feedback Title" />)
    expect(screen.getByText('Feedback Title')).toBeInTheDocument()
  })

  it('renders author info when provided', () => {
    render(<FeedbackCard author="John Doe" />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders avatar when provided', () => {
    render(<FeedbackCard avatar="/avatar.jpg" author="John Doe" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/avatar.jpg')
  })

  it('renders authorLabel when provided', () => {
    render(<FeedbackCard author="John" authorLabel="Instructor" />)
    expect(screen.getByText('Instructor')).toBeInTheDocument()
  })

  it('renders important badge when important is true', () => {
    render(<FeedbackCard important />)
    expect(screen.getByText('Important')).toBeInTheDocument()
  })

  it('renders custom important label', () => {
    render(<FeedbackCard important importantLabel="Urgent" />)
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('renders replies count', () => {
    render(<FeedbackCard replies={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Replies')).toBeInTheDocument()
  })

  it('renders singular reply when replies is 1', () => {
    render(<FeedbackCard replies={1} />)
    expect(screen.getByText('Reply')).toBeInTheDocument()
  })

  it('renders time when provided', () => {
    render(<FeedbackCard time="2 hours ago" />)
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    const { container } = render(<FeedbackCard onClick={onClick} />)
    fireEvent.click(container.firstChild!)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders with custom className', () => {
    const { container } = render(<FeedbackCard className="custom-card" />)
    expect(container.firstChild).toHaveClass('custom-card')
  })
})
