import { useMemo, useCallback, memo } from 'react';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import {
  Calendar, ChevronRight, Clock, AlertCircle, CheckCircle2,
  Star, BookOpen, Trophy, Hourglass, Headphones, ExternalLink
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, Text, Heading, MasterItem, Badge, EmptyState } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { mockDashboardDeadlines, mockDashboardGrades } from '@/lib/data';
import { PATHS } from '@/routes';
import { hoursFromNow, calculateUrgency } from '@/lib/utils';
import { DASHBOARD_CONFIG } from '@/lib/dashboard';
import { FavoriteItem } from '@/components/Favorites';
import { env } from '@/lib/env';
import { resolveFavorite, sortFavorites } from '@/lib/favorites';
import type { ResolvedFavorite } from '@/lib/favorites';
import useStore from '@/store';

const DEADLINES_TO_SHOW = 3
const GRADES_TO_SHOW = 3

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
    mockDashboardDeadlines.slice(0, DEADLINES_TO_SHOW).map((deadline) => {
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
    navigate(PATHS.CALENDAR)
  }, [navigate])

  const handleDeadlineClick = useCallback((dl: ProcessedDeadline) => {
    navigate(PATHS.SUBMISSION(dl.courseId, dl.id))
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
        <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-primary dark:text-white" onClick={handleSeeAll} iconRight={ChevronRight} aria-label={t('see_all_deadlines')}>
          {t('see_all_deadlines')}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-sm)] flex-1">
        {deadlines.length > 0 ? (
          <div className="flex flex-col gap-sm">
            {deadlines.map((dl) => (
              <MasterItem
                key={dl.id}
                onClick={() => handleDeadlineClick(dl)}
                className={`p-[var(--space-2xs)] border border-transparent rounded-[var(--radius-lg)] hover:border-[var(--border-color)]/40 hover:bg-bg-hover ${dl.urgency.level === 'overdue' ? 'bg-danger/5 hover:bg-danger/10' : ''}`}
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
        <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center cursor-pointer hover:bg-bg-hover transition-colors" onClick={handleSeeAll} role="button" tabIndex={0}>
          <Text size="sm" weight="medium" className="text-muted font-medium">{deadlines.length} {t('upcoming')}</Text>
          <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
            <Text size="sm" weight="bold" className="text-primary dark:text-white uppercase">{t('see_all')}</Text>
            <ChevronRight size={16} strokeWidth={2.5} className="text-primary dark:text-white" />
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
  const toggleFavorite = useStore(state => state.toggleFavorite)

  const limit = DASHBOARD_CONFIG.FAVORITES_LIMIT
  const favorites = useStore(state => state.favorites)
  const courses = useStore(state => state.courses)
  const resolved = useMemo(() => {
    const sorted = sortFavorites(favorites)
    return sorted
      .map(fav => resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as ResolvedFavorite[]
  }, [favorites, lang, courses, t])
  const overflow = favorites.length - limit
  const display = resolved.slice(0, limit)

  const handleSeeAll = useCallback(() => {
    navigate(PATHS.FAVORITES)
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
        <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-primary" onClick={handleSeeAll} iconRight={ChevronRight} aria-label={t('see_all')}>
          {t('see_all')}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="overflow-visible">
        {display.length > 0 ? (
          <div className="flex flex-col h-full">
            {display.length === 1 && (
              <Text size="xs" className="text-muted px-[var(--space-md)] pt-[var(--space-sm)]">
                {t('dashboard.favorites_empty_hint')}
              </Text>
            )}
            <div className={`grid gap-[var(--space-sm)] p-[var(--space-xs)] ${display.length === 1 ? 'flex-1' : ''}`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              {display.map((item) => (
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
            <Text size="sm" weight="bold" className="text-primary uppercase tracking-widest opacity-60">
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
    mockDashboardGrades.slice(0, GRADES_TO_SHOW).map((grade, index) => ({
      id: index + 1,
      course: grade.courseEn,
      title: localize(grade, 'course'),
      score: grade.score,
      date: '',
    }))
  ), [localize])

  const handleViewAll = useCallback(() => {
    navigate(PATHS.GRADES)
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
        <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-primary hover:bg-bg-card/50" onClick={handleViewAll} iconRight={ChevronRight} aria-label={t('view_all')}>
          {t('view_all')}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-sm)] flex-1">
        {visibleGrades.length > 0 ? (
          <div className="flex flex-col gap-[var(--space-2xs)]">
            {visibleGrades.map((g) => (
              <div key={g.id || g.title} className="flex items-center justify-between px-[var(--space-sm)] py-[var(--space-xs)] rounded-[var(--radius-lg)] hover:bg-bg-hover transition-colors duration-150 cursor-pointer" onClick={() => navigate(PATHS.GRADES)}>
                <div className="flex items-center gap-[var(--space-sm)] min-w-0 flex-1">
                  <div className={`shrink-0 ${g.score !== null ? 'text-warning' : 'text-text-disabled'}`}>
                    {g.score !== null ? <Star size={18} strokeWidth={2} /> : <Hourglass size={18} strokeWidth={2} />}
                  </div>
                  <span className="text-sm font-semibold text-main truncate">{g.title}</span>
                </div>
                {g.score !== null ? (
                  <div className="flex items-center justify-center w-9 h-9 bg-primary text-white rounded-[var(--radius-full)] text-[0.8rem] font-black shadow-sm shrink-0">
                    {g.score}
                  </div>
                ) : (
                  <Badge variant="default" pill className="text-[0.625rem] uppercase tracking-tighter h-[1.25rem] px-[var(--space-2xs)] flex items-center shrink-0">
                    {t('not_graded')}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-[var(--space-md)]">
            <EmptyState icon={Trophy} title={t('no_recent_grades')} message={t('no_grades_message')} className="bg-transparent border-none p-0" />
          </div>
        )}
      </Card.Body>
      <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="sm" weight="medium" className="text-muted italic">{t('academic_results')}</Text>
        <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
          <Button variant="ghost" size="sm" className="text-primary uppercase font-black p-0 h-auto hover:bg-transparent" onClick={handleViewAll} iconRight={ChevronRight}>
            {t('details')}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}

// --- SupportWidget ---

function SupportWidget() {
  const t = useStore(state => state.t)
  return (
    <Card className="support-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Headphones size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('contact_its_support')}
          </Heading>
        </Stack>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1 flex flex-col justify-center">
        <Text size="sm" className="text-text-muted mb-md leading-relaxed">
          {t('aau_it_services')}
        </Text>
        <Button
          variant="primary"
          full
          iconRight={ExternalLink}
          onClick={() => env.open('https://support.its.aau.dk/')}
          className="normal-case tracking-normal font-bold text-sm"
        >
          {t('contact_support')}
        </Button>
      </Card.Body>
    </Card>
  )
}

export { DeadlinesWidget, FavoritesWidget, RecentGradesWidget, SupportWidget }

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
      const orig = [...mockDashboardDeadlines]
      mockDashboardDeadlines[0] = { ...mockDashboardDeadlines[0], deadlineHoursFromNow: -24 }
      renderWithProviders(<DeadlinesWidget />)
      expect(screen.getByText('Mandag 09:00')).toHaveClass('text-danger')
      mockDashboardDeadlines.splice(0, mockDashboardDeadlines.length, ...orig)
    })
    it('handles overdue deadlines', () => {
      const orig = [...mockDashboardDeadlines]
      mockDashboardDeadlines[0] = { ...mockDashboardDeadlines[0], deadlineHoursFromNow: -24 }
      renderWithProviders(<DeadlinesWidget />)
      const button = screen.getByRole('button', { name: /To-Do App/i })
      expect(button.className).toContain('bg-danger/5')
      mockDashboardDeadlines.splice(0, mockDashboardDeadlines.length, ...orig)
    })
    it('renders empty state when there are no deadlines', () => {
      useStore.setState({ lang: 'en' })
      const orig = [...mockDashboardDeadlines]
      mockDashboardDeadlines.splice(0, mockDashboardDeadlines.length)
      renderWithProviders(<DeadlinesWidget />)
      expect(screen.getByText(/caught up/i)).toBeInTheDocument()
      mockDashboardDeadlines.push(...orig)
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
