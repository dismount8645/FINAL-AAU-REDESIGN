import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Favorites from '@/pages/Favorites'
import { MemoryRouter } from 'react-router-dom'
import useStore from '@/store/useStore'
import * as favUtils from '@/utils/favorites'
import { Wrench } from 'lucide-react'
import { DASHBOARD_CONFIG } from '@/config/dashboard'

vi.mock('@/store/useStore', () => {
  let currentState: any = {}
  const mockFn = vi.fn((selector) => {
    return selector ? selector(currentState) : currentState
  })
  ;(mockFn as any).mockReturnValue = (val: any) => {
    currentState = val
    return mockFn
  }
  return {
    default: mockFn,
  }
})
vi.mock('@/utils/favorites', async () => {
  const actual = await vi.importActual('@/utils/favorites')
  return {
    ...actual,
    resolveFavorite: vi.fn(),
    sortFavorites: vi.fn((f) => f),
  }
})

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Favorites Page', () => {
  const mockT = vi.fn((key) => key)
  const mockToggleFavorite = vi.fn()
  const mockReorderFavorites = vi.fn()
  const mockSetBreadcrumbs = vi.fn()

  const mockCourses = [
    { id: 1, title: 'Danish Course', titleEn: 'English Course', sections: [] },
  ]

  const mockFavorites = [
    { id: 'fav1', type: 'course', entityId: 1, order: 0 },
  ]

  const mockResolvedCourse = {
    id: 'fav1',
    type: 'course' as const,
    entityId: 1,
    title: 'English Course',
    icon: Wrench,
    iconBg: 'blue',
    iconColor: 'white',
    link: '/course/1',
  }

  const baseStoreMock = {
    t: mockT,
    lang: 'en',
    favorites: mockFavorites,
    toggleFavorite: mockToggleFavorite,
    reorderFavorites: mockReorderFavorites,
    courses: mockCourses,
    setBreadcrumbs: mockSetBreadcrumbs,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    const mockStore = useStore as any
    mockStore.mockReturnValue(baseStoreMock)
    const mockResolve = favUtils.resolveFavorite as any
    mockResolve.mockImplementation((fav: any) => ({
      ...mockResolvedCourse,
      id: fav?.id || 'fav1',
    }))
  })

  it('renders favorites correctly', () => {
    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )

    expect(screen.getByText('English Course')).toBeInTheDocument()
    expect(screen.getByText(`1/${DASHBOARD_CONFIG.FAVORITES_LIMIT} favorites_limit`)).toBeInTheDocument()
  })

  it('filters favorites by search query', () => {
    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText('search_favorites_placeholder')
    fireEvent.change(searchInput, { target: { value: 'Non-existent' } })

    expect(screen.queryByText('English Course')).not.toBeInTheDocument()
    expect(screen.getByText('no_favorites_match')).toBeInTheDocument()
  })

  it('clears search via SearchInput X button', () => {
    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText('search_favorites_placeholder')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    const clearBtn = screen.getByRole('button', { name: 'Clear search' })
    fireEvent.click(clearBtn)
    expect(searchInput).toHaveValue('')
  })

  it('filters favorites by type', () => {
    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )

    const toolsFilter = screen.getByText('Tools')
    fireEvent.click(toolsFilter)

    expect(screen.queryByText('English Course')).not.toBeInTheDocument()
  })

  it('removes a favorite when clicking remove button', () => {
    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )

    const removeButton = screen.getByLabelText('Remove from favorites')
    fireEvent.click(removeButton)

    expect(mockToggleFavorite).toHaveBeenCalledWith('course', 1)
  })

  it('removes all favorites when clicking remove all button', () => {
    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )

    const removeAllButton = screen.getByText('remove_all')
    fireEvent.click(removeAllButton)

    expect(mockToggleFavorite).toHaveBeenCalledWith('course', 1)
  })

  it('navigates to favorite link when clicked', () => {
    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('English Course'))
    expect(mockNavigate).toHaveBeenCalledWith('/course/1')
  })

  it('renders empty state when no favorites', () => {
    (useStore as any).mockReturnValue({
      ...baseStoreMock,
      favorites: [],
    })
    ;(favUtils.resolveFavorite as any).mockReturnValue(null)

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )

    expect(screen.getByText('favorites_empty')).toBeInTheDocument()

    fireEvent.click(screen.getByText('go_to_dashboard'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('handles drag end', () => {
    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )
    const item = screen.getByText('English Course').closest('div[draggable="true"]')
    if (item && item.parentElement) {
      fireEvent.dragStart(item.parentElement)
      fireEvent.dragEnd(item.parentElement)
    }
  })

  it('handles drag and drop to reorder', () => {
    const favorites = [
      { id: 'fav1', type: 'course', entityId: 1, order: 0 },
      { id: 'fav2', type: 'course', entityId: 2, order: 1 },
    ]
    ;(useStore as any).mockReturnValue({
      ...baseStoreMock,
      favorites,
    })
    ;(favUtils.resolveFavorite as any)
      .mockReturnValueOnce({ ...mockResolvedCourse, id: 'fav1', title: 'Course 1' })
      .mockReturnValueOnce({ ...mockResolvedCourse, id: 'fav2', title: 'Course 2' })

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )

    const item1 = screen.getByText('Course 1').closest('div[draggable="true"]')
    const item2 = screen.getByText('Course 2').closest('div[draggable="true"]')

    if (!item1 || !item2) throw new Error('Items not found')

    // The outer div has the onDragStart/onDragOver
    // FavoriteItem also has a draggable div. We want the outer one.
    const outer1 = item1.parentElement
    const outer2 = item2.parentElement

    if (!outer1 || !outer2) throw new Error('Outer items not found')

    fireEvent.dragStart(outer1)
    fireEvent.dragOver(outer2)

    expect(mockReorderFavorites).toHaveBeenCalledWith(0, 1)
  })

  it('opens external link in new tab', () => {
    const windowSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    
    const mockExternalFav = {
      id: 'fav-tool',
      type: 'tool' as const,
      entityId: 1,
      title: 'External Tool',
      icon: Wrench,
      iconBg: 'green',
      iconColor: 'white',
      link: 'https://example.com',
      external: true,
    }
    
    ;(favUtils.resolveFavorite as any).mockReturnValue(mockExternalFav)

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('External Tool'))
    expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
  })
})
