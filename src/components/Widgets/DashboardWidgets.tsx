import { useMemo, useCallback, memo } from 'react';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import {
  Calendar, ChevronRight, Clock, AlertCircle, CheckCircle2,
  Star, BookOpen, Trophy, Hourglass
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, Text, Heading, MasterItem, Badge, EmptyState } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
const dashboardDeadlines = [
  { id: 204, category: 'deadlines', titleDa: 'To-Do App', titleEn: 'To-Do App', iconName: 'FileText', dateKey: 'deadline_monday', courseId: 2, deadlineHoursFromNow: 48 },
  { id: 105, category: 'deadlines', titleDa: 'Designskitse', titleEn: 'Design Sketch', iconName: 'PenTool', dateKey: 'deadline_friday', courseId: 1, deadlineHoursFromNow: 96 },
  { id: 303, category: 'deadlines', titleDa: 'Analyseopgave', titleEn: 'Analysis Assignment', iconName: 'FileText', dateKey: 'course_deadline_in_7_days', courseId: 3, deadlineHoursFromNow: 168 }
]

const dashboardGrades = [
  { id: 1, category: 'grades', courseDa: 'Digital Design', courseEn: 'Digital Design', iconName: 'Trophy', score: 12 },
  { id: 2, category: 'grades', courseDa: 'Webudvikling', courseEn: 'Web Development', iconName: 'Trophy', score: 10 },
  { id: 5, category: 'grades', courseDa: 'Bachelorprojekt', courseEn: 'Bachelor Project', iconName: 'Trophy', score: null },
  { id: 3, category: 'grades', courseDa: 'Videnskabsteori', courseEn: 'Philosophy of Science', iconName: 'Trophy', score: 7 }
]
import { hoursFromNow, calculateUrgency } from '@/lib/dates';
import { DASHBOARD_CONFIG } from '@/lib/dashboard';
import { FavoriteItem } from '@/components/Favorites';
import { env } from '@/lib/env';
import { sortFavorites, resolveFavorite } from '@/lib/favorites';
import useStore from '@/store';

const DEADLINES_TO_SHOW = 3
const GRADES_TO_SHOW = 3
const GRID_COLUMNS = 3

// --- Helpers ---

type UrgencyLevel = 'overdue' | 'critical' | 'soon' | 'normal'

interface UrgencyConfig {
  level: UrgencyLevel
  color: string
  icon: typeof AlertCircle
  labelClass: string
}

const getUrgencyConfig = (deadlineDate: string): UrgencyConfig => {
  const level = calculateUrgency(deadlineDate)
  if (level === 'overdue') return {
    level: 'overdue',
    color: 'var(--color-aau-dark-pink)',
    icon: AlertCircle,
    labelClass: 'text-danger font-black uppercase tracking-tighter'
  }
  if (level === 'critical') return {
    level: 'critical',
    color: 'var(--color-aau-dark-pink)',
    icon: Clock,
    labelClass: 'text-danger font-bold'
  }
  if (level === 'soon') return {
    level: 'soon',
    color: 'var(--color-aau-dark-orange)',
    icon: Clock,
    labelClass: 'text-warning font-semibold'
  }
  return {
    level: 'normal',
    color: 'var(--color-text-main)',
    icon: CheckCircle2,
    labelClass: 'text-primary dark:text-main'
  }
}

interface ProcessedDeadline {
  id: number
  titleDa: string
  titleEn: string
  dateKey: string
  courseId: number
  deadlineHoursFromNow: number
  deadlineDate: string
  title: string
  urgency: UrgencyConfig
}

// --- DeadlinesWidget ---

function DeadlinesWidget() {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  const deadlines = useMemo(() => (
    dashboardDeadlines.slice(0, DEADLINES_TO_SHOW).map((deadline) => {
      const deadlineDate = hoursFromNow(deadline.deadlineHoursFromNow)
      return {
        ...deadline,
        deadlineDate,
        title: localize(deadline, 'title'),
        urgency: getUrgencyConfig(deadlineDate),
      }
    })
  ), [localize])

  const handleSeeAll = useCallback(() => {
    navigate('/calendar')
  }, [navigate])

  const handleDeadlineClick = useCallback((dl: ProcessedDeadline) => {
    navigate(`/submission/${dl.courseId}/${dl.id}`)
  }, [navigate])

  return (
    <Card className="deadlines-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('next_assignment')}
          </Heading>
        </Stack>
        <Button variant="ghost" size="xs" className="font-black uppercase tracking-widest text-primary dark:text-white hover:bg-bg-card/50" onClick={handleSeeAll} iconRight={ChevronRight} aria-label={t('see_all_deadlines')}>
          {t('see_all_deadlines')}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        {deadlines.length > 0 ? (
          <div className="grid gap-x-[var(--space-lg)] gap-y-[var(--space-xs)]" style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))` }}>
            {deadlines.map((dl) => (
              <MasterItem
                key={dl.id}
                onClick={() => handleDeadlineClick(dl)}
                className={`p-[var(--space-2xs)] border border-transparent rounded-[var(--radius-lg)] hover:border-[var(--border-color)]/40 ${dl.urgency.level === 'overdue' ? 'bg-danger/5 hover:bg-danger/10' : ''}`}
                leading={
                  <div className="shrink-0 flex items-center justify-center" style={{ color: dl.urgency.color }}>
                    <dl.urgency.icon size={20} strokeWidth={2} />
                  </div>
                }
                title={dl.title}
                subtitle={
                  <span className={`${dl.urgency.labelClass} text-xs mt-0.5`}>
                    {t(dl.dateKey)}
                  </span>
                }
              />
            ))}
          </div>
        ) : (
          <Stack align="center" justify="center" gap="md" className="h-full py-[var(--space-xl)] opacity-50 italic">
            <CheckCircle2 size={40} className="text-[var(--aau-dark-green)]/40" />
            <Text size="sm">{t('all_caught_up')}</Text>
          </Stack>
        )}
      </Card.Body>
      {deadlines.length > 0 && (
        <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center">
          <Text size="xs" weight="medium" className="text-muted italic">{deadlines.length} {t('upcoming')}</Text>
          <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
            <Text size="xs" weight="bold" className="text-primary dark:text-white uppercase tracking-tighter">{t('click_to_view')}</Text>
            <Clock size={10} strokeWidth={2.5} className="text-primary dark:text-white" />
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}

// --- FavoritesWidget ---

function FavoritesWidgetInner() {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const favorites = useStore(state => state.favorites)
  const toggleFavorite = useStore(state => state.toggleFavorite)
  const courses = useStore(state => state.courses)

  const limit = DASHBOARD_CONFIG.FAVORITES_LIMIT

  const { overflow, resolved } = useMemo(() => {
    const sorted = sortFavorites(favorites)
    const display = sorted.slice(0, limit)
    const overflow = sorted.length - limit
    const resolved = display
      .map(fav => resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as NonNullable<ReturnType<typeof resolveFavorite>>[]
    return { overflow, resolved }
  }, [favorites, limit, lang, courses, t])

  const handleSeeAll = useCallback(() => {
    navigate('/favorites')
  }, [navigate])

  return (
    <Card className="widget-card h-full w-full favorites-widget shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
      <Card.Header padding="compact" className="bg-bg-highlight/50 border-b border-[var(--border-color)]">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Star size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('favorites')}
          </Heading>
        </Stack>
        <Button variant="ghost" size="xs" className="text-[0.65rem] font-black uppercase tracking-widest text-primary" onClick={handleSeeAll} iconRight={ChevronRight} aria-label={t('see_all')}>
          {t('see_all')}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="overflow-visible">
        {resolved.length > 0 ? (
          <div className="grid gap-[var(--space-sm)] p-[var(--space-xs)]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {resolved.map((item) => (
              <FavoriteItem
                key={item.id}
                item={item}
                lang={lang}
                onRemove={(type, entityId) => toggleFavorite(type, entityId)}
                onClick={() => {
                  if (item.external) {
                    env.open(item.link)
                  } else {
                    navigate(item.link)
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center py-lg gap-[var(--space-md)]">
            <div className="p-[var(--space-md)] bg-bg-highlight rounded-[var(--radius-pill)]">
              <Star size={32} strokeWidth={2} className="text-[var(--aau-light-orange)]" fill="currentColor" />
            </div>
            <Text muted size="sm" className="text-center max-w-[240px] italic">
              {t('no_favorites_hint')}
            </Text>
          </div>
        )}
        {overflow > 0 && (
          <div className="mt-[var(--space-sm)] text-center pb-[var(--space-sm)]">
            <Text size="xs" weight="bold" className="text-primary uppercase tracking-widest opacity-60">
              {`+${overflow} ${t('more_favorites')}`}
            </Text>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

const FavoritesWidget = memo(FavoritesWidgetInner)

// --- RecentGradesWidget ---

function RecentGradesWidget() {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  const visibleGrades = useMemo(() => (
    dashboardGrades.slice(0, GRADES_TO_SHOW).map((grade, index) => ({
      id: index + 1,
      course: grade.courseEn,
      title: localize(grade, 'course'),
      score: grade.score,
      date: '',
    }))
  ), [localize])

  const handleViewAll = useCallback(() => {
    navigate('/grades')
  }, [navigate])

  return (
    <Card className="recent-grades-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Trophy size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('grades.recent_grades')}
          </Heading>
        </Stack>
        <Button variant="ghost" size="xs" className="font-black uppercase tracking-widest text-primary hover:bg-bg-card/50" onClick={handleViewAll} iconRight={ChevronRight} aria-label={t('view_all')}>
          {t('view_all')}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        {visibleGrades.length > 0 ? (
          <div className="grid gap-[var(--space-xs)]" style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))` }}>
            {visibleGrades.map((g) => (
              <MasterItem
                key={g.id || g.title}
                onClick={() => navigate('/grades')}
                className="bg-transparent hover:bg-bg-hover px-[var(--space-2xs)] rounded-[var(--radius-lg)] transition-colors duration-150 border-none"
                leading={g.score !== null ? Star : Hourglass}
                leadingClassName={g.score !== null ? 'text-warning' : 'text-text-disabled'}
                title={g.title}
                trailing={
                  g.score !== null ? (
                    <div className="recent-grades__score flex items-center justify-center w-8 h-8 bg-primary text-white rounded-[var(--radius-full)] text-[0.75rem] font-black shadow-sm group-hover/item:scale-110 transition-transform">
                      {g.score}
                    </div>
                  ) : (
                    <Badge variant="default" pill className="text-[0.625rem] uppercase tracking-tighter h-[1.25rem] px-[var(--space-2xs)] flex items-center">
                      {t('not_graded')}
                    </Badge>
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-[var(--space-md)]">
            <EmptyState icon={Trophy} title={t('no_recent_grades')} message={t('no_grades_message')} className="bg-transparent border-none p-0" />
          </div>
        )}
      </Card.Body>
      <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="xs" weight="medium" className="text-muted italic">{t('academic_results')}</Text>
        <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
          <Button variant="ghost" size="xs" className="text-primary uppercase font-black tracking-tighter p-0 h-auto hover:bg-transparent" onClick={handleViewAll} iconRight={ChevronRight}>
            {t('details')}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}

export { DeadlinesWidget, FavoritesWidget, RecentGradesWidget }

// --- Tests ---

let mockNavigate: ReturnType<typeof vi.fn>
if (import.meta.vitest) {
  mockNavigate = vi.fn()
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    }
  })

  describe('DeadlinesWidget', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({ lang: 'da' })
    })
    it('renders correctly', () => {
      renderWithProviders(<DeadlinesWidget />)
      expect(screen.getByText('Næste aflevering')).toBeInTheDocument()
      expect(screen.getByText('To-Do App')).toBeInTheDocument()
      expect(screen.getByText('Designskitse')).toBeInTheDocument()
      expect(screen.getByText('Analyseopgave')).toBeInTheDocument()
    })
    it('navigates to submission when item is clicked', () => {
      renderWithProviders(<DeadlinesWidget />)
      fireEvent.click(screen.getByText('To-Do App'))
      expect(mockNavigate).toHaveBeenCalledWith('/submission/2/204')
    })
    it('navigates to calendar when footer button is clicked', () => {
      renderWithProviders(<DeadlinesWidget />)
      fireEvent.click(screen.getByText(/Se alle deadlines/i))
      expect(mockNavigate).toHaveBeenCalledWith('/calendar')
    })
    it('renders correctly in English', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<DeadlinesWidget />)
      expect(screen.getByText('Monday 09:00')).toBeInTheDocument()
    })
    it('handles past deadline urgency color', () => {
      const orig = [...dashboardDeadlines]
      dashboardDeadlines[0] = { ...dashboardDeadlines[0], deadlineHoursFromNow: -24 }
      renderWithProviders(<DeadlinesWidget />)
      expect(screen.getByText('Mandag 09:00')).toHaveClass('text-danger')
      dashboardDeadlines.splice(0, dashboardDeadlines.length, ...orig)
    })
    it('handles overdue deadlines', () => {
      const orig = [...dashboardDeadlines]
      dashboardDeadlines[0] = { ...dashboardDeadlines[0], deadlineHoursFromNow: -24 }
      renderWithProviders(<DeadlinesWidget />)
      const button = screen.getByRole('button', { name: /To-Do App/i })
      expect(button.className).toContain('bg-danger/5')
      dashboardDeadlines.splice(0, dashboardDeadlines.length, ...orig)
    })
    it('renders empty state when there are no deadlines', () => {
      useStore.setState({ lang: 'en' })
      const orig = [...dashboardDeadlines]
      dashboardDeadlines.splice(0, dashboardDeadlines.length)
      renderWithProviders(<DeadlinesWidget />)
      expect(screen.getByText(/caught up/i)).toBeInTheDocument()
      dashboardDeadlines.push(...orig)
    })
  })

  describe('FavoritesWidget', () => {

    const mockCourses = [
      { id: 1, title: 'Course 1', titleEn: 'Course 1', sections: [], status: 'active', label: 'Course 1', labelEn: 'Course 1', img: '' },
    ] as any
    const mockFavorites = [
      { id: 'fav1', type: 'course', entityId: 1, order: 0, addedAt: Date.now() },
    ] as any
    const mockResolvedCourse = {
      id: 'fav1', type: 'course' as const, entityId: 1, title: 'Course 1', icon: BookOpen, iconBg: 'blue', iconColor: 'white', link: '/course/1',
    }

    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({ lang: 'da', favorites: mockFavorites, courses: mockCourses })
      const resolveFav = resolveFavorite as any
      vi.mocked(resolveFav).mockImplementation((fav: any) => ({ ...mockResolvedCourse, id: fav?.id || 'fav1' }))
    })

    it('renders favorites correctly', () => {
      render(<MemoryRouter><FavoritesWidget /></MemoryRouter>)
      expect(screen.getByText('Course 1')).toBeInTheDocument()
    })
    it('navigates to favorites page when see_all is clicked', () => {
      render(<MemoryRouter><FavoritesWidget /></MemoryRouter>)
      fireEvent.click(screen.getByText('Se alle'))
      expect(mockNavigate).toHaveBeenCalledWith('/favorites')
    })
    it('renders empty state when no favorites', () => {
      useStore.setState({ favorites: [] })
      const resolveFav = resolveFavorite as any
      vi.mocked(resolveFav).mockReturnValue(null)
      render(<MemoryRouter><FavoritesWidget /></MemoryRouter>)
      expect(screen.getByText(/Klik p/i)).toBeInTheDocument()
    })
    it('shows overflow message when more than 12 favorites', () => {
      const manyFavorites = Array.from({ length: 15 }, (_, i) => ({ id: `fav${i}`, type: 'course', entityId: i, order: i, addedAt: Date.now() })) as any
      useStore.setState({ favorites: manyFavorites, courses: mockCourses })
      render(<MemoryRouter><FavoritesWidget /></MemoryRouter>)
      expect(screen.getByText(/flere favoritter/i)).toBeInTheDocument()
    })
    it('handles external links', () => {
      const windowSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      const resolveFav = resolveFavorite as any
      vi.mocked(resolveFav).mockReturnValue({ ...mockResolvedCourse, title: 'External Tool', link: 'https://example.com', external: true })
      render(<MemoryRouter><FavoritesWidget /></MemoryRouter>)
      fireEvent.click(screen.getByText('External Tool'))
      expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
    })
  })

  describe('RecentGradesWidget', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })
    it('renders correctly', () => {
      renderWithProviders(<RecentGradesWidget />)
      expect(screen.getByText(/Seneste karakterer/i)).toBeInTheDocument()
      expect(screen.getByText('Digital Design')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })
    it('navigates to grades when footer button is clicked', () => {
      renderWithProviders(<RecentGradesWidget />)
      fireEvent.click(screen.getByText(/Se alle/i))
      expect(mockNavigate).toHaveBeenCalledWith('/grades')
    })
    it('shows not graded badge for ungraded courses', () => {
      renderWithProviders(<RecentGradesWidget />)
      expect(screen.getByText('Ikke bedømt')).toBeInTheDocument()
    })
    it('navigates to grades when master item is clicked', () => {
      renderWithProviders(<RecentGradesWidget />)
      fireEvent.click(screen.getByText('Digital Design'))
      expect(mockNavigate).toHaveBeenCalledWith('/grades')
    })
  })
}
