import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TeaserCard from '@/components/ui/TeaserCard'

describe('TeaserCard', () => {
  it('renders correctly with title and description', () => {
    render(<TeaserCard title="Card Title" description="Card Description" />)
    expect(screen.getByText('Card Title')).toBeDefined()
    expect(screen.getByText('Card Description')).toBeDefined()
  })

  it('applies horizontal variant class', () => {
    const { container } = render(<TeaserCard variant="horizontal" title="Test" />)
    expect((container.firstChild as HTMLElement)?.classList.contains('teaser-card--horizontal')).toBe(true)
  })

  it('renders badge correctly', () => {
    render(<TeaserCard badge="New" badgeColor="success" title="Test" />)
    expect(screen.getByText('New')).toBeDefined()
  })

  it('renders progress bar when progress is provided', () => {
    const { container } = render(<TeaserCard progress={75} title="Test" />)
    expect(container.querySelector('.progress-bar')).toBeDefined()
  })

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn()
    render(<TeaserCard onClick={handleClick} title="Click Me" />)
    fireEvent.click(screen.getByText('Click Me'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('calls onStarToggle and prevents propagation when star is clicked', () => {
    const handleStarToggle = vi.fn()
    const handleCardClick = vi.fn()
    render(
      <TeaserCard 
        title="Test" 
        onClick={handleCardClick} 
        onStarToggle={handleStarToggle} 
        isStarred={false} 
      />
    )
    
    const starBtn = screen.getByLabelText('Tilføj til favoritter')
    fireEvent.click(starBtn)
    
    expect(handleStarToggle).toHaveBeenCalledWith(true)
    expect(handleCardClick).not.toHaveBeenCalled()
  })

  it('renders action button correctly', () => {
    render(
      <TeaserCard 
        title="Test" 
        action={<button data-testid="custom-action">View</button>} 
      />
    )
    expect(screen.getByTestId('custom-action')).toBeDefined()
  })

  it('renders image when provided', () => {
    render(<TeaserCard title="Test" image="/test.jpg" />)
    const img = screen.getByRole('img')
    expect(img.getAttribute('src')).toBe('/test.jpg')
  })

  it('does not throw when star is clicked and onStarToggle is not provided', () => {
    render(<TeaserCard title="Test" />)
    const starBtn = screen.getByLabelText('Tilføj til favoritter')
    expect(() => fireEvent.click(starBtn)).not.toThrow()
  })

  it('renders image with empty alt when no title is provided', () => {
    const { container } = render(<TeaserCard image="/test.jpg" />)
    const img = container.querySelector('img') as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', '')
  })

  it('renders badge without image', () => {
    render(<TeaserCard badge="Sale" badgeColor="warning" title="Test" />)
    expect(screen.getByText('Sale')).toBeInTheDocument()
  })
})
