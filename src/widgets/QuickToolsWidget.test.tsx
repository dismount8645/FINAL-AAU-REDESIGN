import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QuickToolsWidget from '@/widgets/QuickToolsWidget'
import { MemoryRouter } from 'react-router-dom'
import useStore from '@/store/useStore'

// Mock useStore for atomic selectors
vi.mock('@/store/useStore', () => {
  const mockState = {
    t: (key: string) => key,
    favorites: [],
    toggleFavorite: vi.fn(),
  }
  return {
    default: vi.fn((selector) => selector(mockState)),
  }
})

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('QuickToolsWidget', () => {
  const mockT = vi.fn((key) => key)
  const mockToggleFavorite = vi.fn()
  const mockFavorites: any[] = []

  beforeEach(() => {
    vi.clearAllMocks()
    mockFavorites.length = 0
    ;(useStore as any).mockImplementation((selector: any) => {
      const state = {
        t: mockT,
        favorites: mockFavorites,
        toggleFavorite: mockToggleFavorite,
      }
      return selector(state)
    })
    window.open = vi.fn()
  })

  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <QuickToolsWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    expect(screen.getByText('quick_access')).toBeInTheDocument()
    expect(screen.getByText('digital_exam')).toBeInTheDocument()
    expect(screen.getByText('stads')).toBeInTheDocument()
  })

  it('opens tool url on click', () => {
    render(
      <MemoryRouter>
        <QuickToolsWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    const toolButton = screen.getByText('digital_exam').closest('button')
    fireEvent.click(toolButton!)
    expect(window.open).toHaveBeenCalledWith(
      'https://digitalservices.aau.dk/dse/exam',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('toggles favorite on star click', () => {
    render(
      <MemoryRouter>
        <QuickToolsWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    const starButton = screen.getAllByRole('button', { name: /add_favorite/i })[0]
    fireEvent.click(starButton)
    expect(mockToggleFavorite).toHaveBeenCalledWith('tool', 1)
  })

  it('shows favorite state correctly', () => {
    mockFavorites.push({ type: 'tool', entityId: 1 })
    render(
      <MemoryRouter>
        <QuickToolsWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    const starButton = screen.getByRole('button', { name: /remove_favorite/i })
    expect(starButton).toBeInTheDocument()
  })

  it('navigates to toolbox on footer click', () => {
    render(
      <MemoryRouter>
        <QuickToolsWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText(/toolbox/i))
    expect(mockNavigate).toHaveBeenCalledWith('/resources')
  })

  it('does not navigate to toolbox when isEditing is true', () => {
    render(
      <MemoryRouter>
        <QuickToolsWidget span={6} isEditing={true} />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText(/toolbox/i))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('does not open URL when isEditing is true', () => {
    render(
      <MemoryRouter>
        <QuickToolsWidget span={6} isEditing={true} />
      </MemoryRouter>
    )
    const toolButton = screen.getByText('digital_exam').closest('button')
    fireEvent.click(toolButton!)
    expect(window.open).not.toHaveBeenCalled()
  })
})
