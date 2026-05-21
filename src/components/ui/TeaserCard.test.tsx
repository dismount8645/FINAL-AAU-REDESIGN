import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import TeaserCard from '@/components/ui/TeaserCard'

describe('TeaserCard', () => {
  it('renders correctly with title and description', () => {
    renderWithProviders(<TeaserCard title="Card Title" description="Card Description" />)
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
  })

  it('applies horizontal variant classes', () => {
    const { container } = renderWithProviders(<TeaserCard variant="horizontal" title="Test" />)
    const wrapper = container.firstChild as HTMLElement
    // Checking for the horizontal variant class defined in CVA
    expect(wrapper.className).toContain('lg:flex-row')
  })

  it('renders badge correctly', () => {
    renderWithProviders(<TeaserCard badge="New" badgeColor="success" title="Test" />)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders progress bar when progress is provided', () => {
    renderWithProviders(<TeaserCard progress={75} title="Test" />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
  })

  it('calls onClick when card is clicked via the overlay button', () => {
    const handleClick = vi.fn()
    renderWithProviders(<TeaserCard onClick={handleClick} title="Click Me" />)
    
    // The main action is now an overlay button for A11y
    const overlayButton = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(overlayButton)
    
    expect(handleClick).toHaveBeenCalled()
  })

  it('calls onStarToggle and prevents propagation when star is clicked', () => {
    const handleStarToggle = vi.fn()
    const handleCardClick = vi.fn()
    renderWithProviders(
      <TeaserCard 
        title="Test" 
        onClick={handleCardClick} 
        onStarToggle={handleStarToggle} 
        isStarred={false} 
      />
    )
    
    // Using a more resilient matcher that handles both translation keys and actual translations
    const starBtn = screen.getByRole('button', { name: /(add_favorite|Tilføj til favoritter)/i })
    fireEvent.click(starBtn)
    
    expect(handleStarToggle).toHaveBeenCalledWith(true)
    expect(handleCardClick).not.toHaveBeenCalled()
  })

  it('renders action button correctly', () => {
    renderWithProviders(
      <TeaserCard 
        title="Test" 
        action={<button data-testid="custom-action">View</button>} 
      />
    )
    expect(screen.getByTestId('custom-action')).toBeInTheDocument()
  })

  it('renders image when provided', () => {
    const { container } = renderWithProviders(<TeaserCard title="Test" image="/test.jpg" />)
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/test.jpg')
  })

  it('renders image with aria-hidden when title is provided', () => {
    const { container } = renderWithProviders(<TeaserCard title="Test Title" image="/test.jpg" />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders badge without image', () => {
    renderWithProviders(<TeaserCard badge="Sale" badgeColor="warning" title="Test" />)
    expect(screen.getByText('Sale')).toBeInTheDocument()
  })
})
