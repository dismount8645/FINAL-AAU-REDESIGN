import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FavoritesWidget from '@/widgets/FavoritesWidget'
import { MemoryRouter } from 'react-router-dom'
import useStore from '@/store/useStore'
import * as favUtils from '@/utils/favorites'
import { BookOpen } from 'lucide-react'

vi.mock('@/store/useStore')
vi.mock('@/utils/favorites', async () => {
  const actual = await vi.importActual('@/utils/favorites')
  return {
    ...actual,
    resolveFavorite: vi.fn(),
    sortFavorites: vi.fn((f) => f),
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

describe('FavoritesWidget', () => {
  const mockT = vi.fn((key) => key)
  const mockToggleFavorite = vi.fn()

  const mockCourses = [
    { id: 1, title: 'Course 1', titleEn: 'Course 1', sections: [] },
  ]

  const mockFavorites = [
    { id: 'fav1', type: 'course', entityId: 1, order: 0 },
  ]

  const mockResolvedCourse = {
    id: 'fav1',
    type: 'course' as const,
    entityId: 1,
    title: 'Course 1',
    icon: BookOpen,
    iconBg: 'blue',
    iconColor: 'white',
    link: '/course/1',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    const mockStore = useStore as any
    const state = {
      t: mockT,
      lang: 'en',
      favorites: mockFavorites,
      toggleFavorite: mockToggleFavorite,
      courses: mockCourses,
    }
    mockStore.mockImplementation((selector: any) => selector ? selector(state) : state)
    const mockResolve = favUtils.resolveFavorite as any
    mockResolve.mockImplementation((fav: any) => ({
      ...mockResolvedCourse,
      id: fav?.id || 'fav1',
    }))
  })

  it('renders favorites correctly', () => {
    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )

    expect(screen.getByText('Course 1')).toBeInTheDocument()
  })

  it('navigates to favorites page when "see_all" is clicked', () => {
    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText(/see_all/i))
    expect(mockNavigate).toHaveBeenCalledWith('/favorites')
  })

  it('does not navigate when "see_all" is clicked and isEditing is true', () => {
    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={true} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText(/see_all/i))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('renders empty state when no favorites', () => {
    const mockStore = useStore as any
    const state = {
      t: mockT,
      lang: 'en',
      favorites: [],
      toggleFavorite: mockToggleFavorite,
      courses: mockCourses,
    }
    mockStore.mockImplementation((selector: any) => selector ? selector(state) : state)
    const mockResolve = favUtils.resolveFavorite as any
    mockResolve.mockReturnValue(null)

    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )

    expect(screen.getByText('no_favorites_hint')).toBeInTheDocument()
  })

  it('renders empty state in Danish', () => {
    const mockStore = useStore as any
    const state = {
      t: mockT,
      lang: 'da',
      favorites: [],
      toggleFavorite: mockToggleFavorite,
      courses: mockCourses,
    }
    mockStore.mockImplementation((selector: any) => selector ? selector(state) : state)
    const mockResolve = favUtils.resolveFavorite as any
    mockResolve.mockReturnValue(null)

    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )

    expect(screen.getByText('no_favorites_hint')).toBeInTheDocument()
  })

  it('shows overflow message when more than 12 favorites', () => {
    const manyFavorites = Array.from({ length: 15 }, (_, i) => ({
      id: `fav${i}`,
      type: 'course',
      entityId: i,
      order: i,
    }))

    const mockStore = useStore as any
    const state = {
      t: mockT,
      lang: 'en',
      favorites: manyFavorites,
      toggleFavorite: mockToggleFavorite,
      courses: mockCourses,
    }
    mockStore.mockImplementation((selector: any) => selector ? selector(state) : state)

    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )

    expect(screen.getByText('+3 more_favorites')).toBeInTheDocument()
  })

  it('shows overflow message in Danish', () => {
    const manyFavorites = Array.from({ length: 15 }, (_, i) => ({
      id: `fav${i}`,
      type: 'course',
      entityId: i,
      order: i,
    }))

    const mockStore = useStore as any
    const state = {
      t: mockT,
      lang: 'da',
      favorites: manyFavorites,
      toggleFavorite: mockToggleFavorite,
      courses: mockCourses,
    }
    mockStore.mockImplementation((selector: any) => selector ? selector(state) : state)

    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )

    expect(screen.getByText('+3 more_favorites')).toBeInTheDocument()
  })

  it('does not navigate when isEditing is true', () => {
    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={true} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Course 1'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('handles external links in new tab', () => {
    const windowSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    
    const mockExternalFav = {
      ...mockResolvedCourse,
      title: 'External Tool',
      link: 'https://example.com',
      external: true,
    }
    const mockResolve = favUtils.resolveFavorite as any
    mockResolve.mockReturnValue(mockExternalFav)

    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('External Tool'))
    expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
  })

  it('navigates to internal favorite link when clicked', () => {
    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Course 1'))
    expect(mockNavigate).toHaveBeenCalledWith('/course/1')
  })

  it('calls toggleFavorite when remove button is clicked', () => {
    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )

    // The button is hidden by default (opacity-0), but fireEvent should still work
    const removeBtn = document.querySelector('.lucide-x')?.parentElement
    fireEvent.click(removeBtn!)
    expect(mockToggleFavorite).toHaveBeenCalledWith('course', 1)
  })
})
