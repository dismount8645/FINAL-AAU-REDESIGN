import { MemoryRouter } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import FavoritesWidget from '../FavoritesWidget';
import useStore from '@/store';
import * as favUtils from '@/lib/favorites';

let mockNavigate: any
vi.mock('@/lib/favorites', async () => {
  const actual = await vi.importActual('@/lib/favorites')
  return {
    ...actual,
    resolveFavorite: vi.fn(),
    sortFavorites: vi.fn((f: any) => f),
  }
})

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockCourses = [
  { id: 1, title: 'Course 1', titleEn: 'Course 1', sections: [], status: 'active', label: 'Course 1', labelEn: 'Course 1', img: '' },
] as any

const mockFavorites = [
  { id: 'fav1', type: 'course', entityId: 1, order: 0, addedAt: Date.now() },
] as any

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

describe('FavoritesWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate = vi.fn()
    useStore.setState({
      lang: 'da',
      favorites: mockFavorites,
      courses: mockCourses,
    })
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
    fireEvent.click(screen.getByText('Se alle'))
    expect(mockNavigate).toHaveBeenCalledWith('/favorites')
  })

  it('does not navigate when isEditing is true', () => {
    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={true} />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Se alle'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('renders empty state when no favorites', () => {
    useStore.setState({ favorites: [] })
    const mockResolve = favUtils.resolveFavorite as any
    mockResolve.mockReturnValue(null)

    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    expect(screen.getByText(/Klik p/i)).toBeInTheDocument()
  })

  it('renders empty state in Danish', () => {
    useStore.setState({ lang: 'da', favorites: [], courses: mockCourses })
    const mockResolve = favUtils.resolveFavorite as any
    mockResolve.mockReturnValue(null)

    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    expect(screen.getByText(/Klik p/i)).toBeInTheDocument()
  })

  it('shows overflow message when more than 12 favorites', () => {
    const manyFavorites = Array.from({ length: 15 }, (_, i) => ({
      id: `fav${i}`,
      type: 'course' as const,
      entityId: i,
      order: i,
      addedAt: Date.now(),
    })) as any
    useStore.setState({ favorites: manyFavorites, courses: mockCourses })

    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    expect(screen.getByText(/flere favoritter/i)).toBeInTheDocument()
  })

  it('shows overflow message in Danish', () => {
    const manyFavorites = Array.from({ length: 15 }, (_, i) => ({
      id: `fav${i}`,
      type: 'course' as const,
      entityId: i,
      order: i,
      addedAt: Date.now(),
    })) as any
    useStore.setState({ lang: 'da', favorites: manyFavorites, courses: mockCourses })

    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    expect(screen.getByText(/flere favoritter/i)).toBeInTheDocument()
  })

  it('does not navigate on item click when isEditing is true', () => {
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

  it('renders remove button for each favorite', () => {
    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    const removeBtns = document.querySelectorAll('.lucide-x')
    expect(removeBtns.length).toBe(1)
  })

  it('calls toggleFavorite when remove button is clicked', () => {
    const toggleSpy = vi.spyOn(useStore.getState(), 'toggleFavorite')

    render(
      <MemoryRouter>
        <FavoritesWidget span={6} isEditing={false} />
      </MemoryRouter>
    )
    const xButton = document.querySelector('.lucide-x')?.closest('button')
    expect(xButton).toBeInTheDocument()
    fireEvent.click(xButton!)
    expect(toggleSpy).toHaveBeenCalled()
  })
})