import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ModulesWidget from '@/widgets/ModulesWidget'
import { MemoryRouter } from 'react-router-dom'
import useStore from '@/store/useStore';

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function setFavoritesForCourses(courses: any[]) {
  const favorites = courses
    .filter((c: any) => c.isStarred)
    .map((c: any, i: number) => ({
      id: `course-${c.id}`,
      type: 'course' as const,
      entityId: c.id,
      addedAt: Date.now() - i * 1000,
      order: i,
    }))
  useStore.setState({ favorites })
}

const mockCourses = [
  { id: 1, title: 'Course 1', isStarred: true, status: 'active', img: '', progress: 50 },
  { id: 2, title: 'Course 2', isStarred: true, status: 'inactive', img: '', progress: 100 },
  { id: 3, title: 'Course 3', isStarred: true, status: 'upcoming', img: '' },
]

describe('ModulesWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useStore.setState({ favorites: [], courses: [] })
  })

  const renderWidget = (courses = mockCourses, lang: any = 'da', span = 12, isEditing = false) => {
    setFavoritesForCourses(courses)
    useStore.setState({ lang, courses: courses as any })
    return render(
      <MemoryRouter>
        <ModulesWidget span={span} isEditing={isEditing} />
      </MemoryRouter>
    )
  }

  it('renders starred courses', () => {
    renderWidget()
    expect(screen.getByText('Course 1')).toBeInTheDocument()
    expect(screen.getByText('Course 2')).toBeInTheDocument()
  })

  it('renders empty state when no courses are starred', () => {
    renderWidget([])
    expect(screen.getByText(/Du har ingen favoritter endnu/i)).toBeInTheDocument()
  })

  it('renders empty state in English', () => {
    renderWidget([], 'en')
    expect(screen.getByText(/You have no favorites yet/i)).toBeInTheDocument()
  })

  it('renders horizontal layout for small spans', () => {
    renderWidget(mockCourses, 'da', 4)
    expect(screen.getByText('Course 1')).toBeInTheDocument()
  })

  it('navigates to course on card click when not editing', () => {
    renderWidget(mockCourses, 'da', 12, false)
    const course1 = screen.getByText('Course 1')
    fireEvent.click(course1)
    expect(mockNavigate).toHaveBeenCalledWith('/course/1')
  })

  it('does not navigate on card click when editing', () => {
    renderWidget(mockCourses, 'da', 12, true)
    const course1 = screen.getByText('Course 1')
    fireEvent.click(course1)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('navigates to courses on see all button click', () => {
    renderWidget(mockCourses, 'da', 12, false)
    const seeAllBtn = screen.getByText('Se alle')
    fireEvent.click(seeAllBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/courses')
  })

  it('navigates to courses on find modules button when empty', () => {
    renderWidget([], 'da', 12, false)
    const findBtn = screen.getByText('Find moduler')
    fireEvent.click(findBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/courses')
  })

  it('renders with 4 columns when more than 3 starred courses and span > 8', () => {
    const manyCourses = [
      { id: 1, title: 'C1', isStarred: true, status: 'active', img: '' },
      { id: 2, title: 'C2', isStarred: true, status: 'active', img: '' },
      { id: 3, title: 'C3', isStarred: true, status: 'active', img: '' },
      { id: 4, title: 'C4', isStarred: true, status: 'active', img: '' },
    ]
    renderWidget(manyCourses, 'da', 12, false)
    expect(screen.getByText('C1')).toBeInTheDocument()
    expect(screen.getByText('C4')).toBeInTheDocument()
  })

  it('renders third course with fallback progress when progress is undefined', () => {
    renderWidget(mockCourses, 'da', 12)
    expect(screen.getByText('Course 3')).toBeInTheDocument()
    // The progress should be 0 (upcoming, not inactive)
  })

  it('renders a course with inactive status and undefined progress (fallback to 100)', () => {
    const customCourses = [
      { id: 5, title: 'Inactive No Progress', isStarred: true, status: 'inactive', img: '' },
    ]
    renderWidget(customCourses)
    expect(screen.getByText('Inactive No Progress')).toBeInTheDocument()
  })

  it('calls toggleFavorite when star is clicked', () => {
    setFavoritesForCourses(mockCourses)
    useStore.setState({ courses: mockCourses as any })
    const toggleSpy = vi.spyOn(useStore.getState(), 'toggleFavorite')
    render(
      <MemoryRouter>
        <ModulesWidget span={12} isEditing={false} />
      </MemoryRouter>
    )
    const starBtn = screen.getAllByRole('button', { name: /Fjern fra favoritter/i })[0]
    fireEvent.click(starBtn)
    expect(toggleSpy).toHaveBeenCalledWith('course', 1)
    toggleSpy.mockRestore()
  })

  it('renders with 3 columns when 3 or fewer starred courses and span > 8', () => {
    const threeCourses = [
      { id: 1, title: 'C1', isStarred: true, status: 'active', img: '' },
      { id: 2, title: 'C2', isStarred: true, status: 'active', img: '' },
      { id: 3, title: 'C3', isStarred: true, status: 'active', img: '' },
    ]
    renderWidget(threeCourses, 'da', 12, false)
    expect(screen.getByText('C1')).toBeInTheDocument()
    expect(screen.getByText('C3')).toBeInTheDocument()
  })

  it('renders with 1 column when span <= 4', () => {
    renderWidget(mockCourses, 'da', 4, false)
    expect(screen.getByText('Course 1')).toBeInTheDocument()
  })
})
