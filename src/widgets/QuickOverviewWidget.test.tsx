import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import QuickOverviewWidget from '@/widgets/QuickOverviewWidget'
import { renderWithProviders } from '@/test/test-utils'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('QuickOverviewWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders today events', () => {
    renderWithProviders(<QuickOverviewWidget span={12} isEditing={false} />)
    expect(screen.getByText('Hurtig oversigt')).toBeInTheDocument()
    expect(screen.getByText('08:15')).toBeInTheDocument()
    expect(screen.getByText('Forelæsning')).toBeInTheDocument()
    expect(screen.getByText('23:59')).toBeInTheDocument()
    expect(screen.getByText('Projektrapport')).toBeInTheDocument()
  })

  it('navigates to calendar when link is clicked', () => {
    renderWithProviders(<QuickOverviewWidget span={12} isEditing={false} />)
    const link = screen.getByText('Gå til kalender')
    fireEvent.click(link)
    expect(mockNavigate).toHaveBeenCalledWith('/calendar')
  })

  it('does not navigate when isEditing is true', () => {
    renderWithProviders(<QuickOverviewWidget span={12} isEditing={true} />)
    const link = screen.getByText('Gå til kalender')
    fireEvent.click(link)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('renders events for small span', () => {
    renderWithProviders(<QuickOverviewWidget span={4} isEditing={false} />)
    expect(screen.getByText('08:15')).toBeInTheDocument()
    expect(screen.getByText('Forelæsning')).toBeInTheDocument()
  })

  it('renders events for medium span', () => {
    renderWithProviders(<QuickOverviewWidget span={8} isEditing={false} />)
    expect(screen.getByText('23:59')).toBeInTheDocument()
    expect(screen.getByText('Projektrapport')).toBeInTheDocument()
  })

  it('renders divider between events', () => {
    const { container } = renderWithProviders(<QuickOverviewWidget span={12} isEditing={false} />)
    const body = container.querySelector('.card__body')
    const dividers = body?.querySelectorAll('.border-border')
    expect(dividers?.length).toBe(1)
  })
})
