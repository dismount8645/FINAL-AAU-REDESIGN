import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import InfoCard from '@/components/ui/InfoCard'
import { User } from 'lucide-react'

describe('InfoCard', () => {
  it('renders content', () => {
    render(<InfoCard icon={User} title="Test Title" description="Test Description" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders with col direction and no description', () => {
    render(<InfoCard icon={User} title="Test Title" direction="col" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
  })

  it('renders with action', () => {
    render(<InfoCard icon={User} title="Test Title" action={<button>Click Me</button>} />)
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument()
  })

  it('applies hover-lift class when onClick is provided', () => {
    const { container } = render(<InfoCard icon={User} title="Clickable" onClick={() => {}} />)
    const card = container.querySelector('.info-card')
    expect(card).toHaveClass('hover-lift')
  })

  it('handles help text toggle', () => {
    render(<InfoCard icon={User} title="Title" helpText="Help information" />)
    
    expect(screen.queryByText('Help information')).not.toBeInTheDocument()
    
    const helpButton = screen.getByLabelText('Help')
    fireEvent.click(helpButton)
    
    expect(screen.getByText('Help information')).toBeInTheDocument()
    
    fireEvent.click(helpButton)
    expect(screen.queryByText('Help information')).not.toBeInTheDocument()
  })

  it('handles star toggle', () => {
    const onStarToggle = vi.fn()
    render(<InfoCard icon={User} title="Title" onStarToggle={onStarToggle} isStarred={false} />)
    
    const starButton = screen.getByLabelText('Add to favorites')
    fireEvent.click(starButton)
    
    expect(onStarToggle).toHaveBeenCalled()
  })

  it('renders correctly when starred', () => {
    const onStarToggle = vi.fn()
    render(<InfoCard icon={User} title="Title" onStarToggle={onStarToggle} isStarred={true} />)
    
    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument()
  })

  it('stops propagation on star click', () => {
    const onClick = vi.fn()
    const onStarToggle = vi.fn()
    render(<InfoCard icon={User} title="Title" onClick={onClick} onStarToggle={onStarToggle} />)
    
    const starButton = screen.getByLabelText('Add to favorites')
    fireEvent.click(starButton)
    
    expect(onStarToggle).toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('stops propagation on help click', () => {
    const onClick = vi.fn()
    render(<InfoCard icon={User} title="Title" onClick={onClick} helpText="Help" />)
    
    const helpButton = screen.getByLabelText('Help')
    fireEvent.click(helpButton)
    
    expect(onClick).not.toHaveBeenCalled()
  })
})
