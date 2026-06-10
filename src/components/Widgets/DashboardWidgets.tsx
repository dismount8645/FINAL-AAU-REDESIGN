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
  courseTitle: string
  urgency: UrgencyConfig
}

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
  hideFirst?: boolean
}

function DeadlinesWidget({ size = 'medium', hideFirst = false }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  const courses = useStore(state => state.courses)

  const limit = size === 'small' ? 1 : size === 'medium' ? 3 : 5

  const deadlines = useMemo(() => {
    const start = hideFirst ? 1 : 0
    const end = limit + (hideFirst ? 1 : 0)
    return mockDashboardDeadlines.slice(start, end).map((deadline) => {
      const deadlineDate = hoursFromNow(deadline.deadlineHoursFromNow)
      const course = courses.find(c => c.id === deadline.courseId)
      const courseTitle = course ? localize(course, 'title') : ''
      return {
        ...deadline,
        deadlineDate,
        courseTitle,
        title: localize(deadline, 'title'),
        urgency: getUrgencyConfig(deadlineDate),
      }
    })
  }, [localize, courses, limit, hideFirst])

  const handleSeeAll = useCallback(() => {
    navigate(PATHS.CALENDAR)
  }, [navigate])

  const handleDeadlineClick = useCallback((dl: ProcessedDeadline) => {
    navigate(PATHS.SUBMISSION(dl.courseId, dl.id))
  }, [navigate])

  const nextDl = deadlines[0]

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
        {size !== 'small' && (
          <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-primary dark:text-white" onClick={handleSeeAll} iconRight={ChevronRight} aria-label={t('common.see_assignments')}>
            {t('common.see_assignments')}
          </Button>
        )}
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col gap-[var(--space-xs)]">
        {deadlines.length > 0 ? (
          size === 'small' ? (
            <div className="flex flex-col gap-2xs flex-1 justify-center">
              <MasterItem
                onClick={() => handleDeadlineClick(nextDl)}
                className="p-2xs border rounded-[var(--radius-md)] border-[var(--border-color)]/60 bg-bg-highlight/40 hover:bg-bg-hover"
                leading={
                  <div className="shrink-0 flex items-center justify-center" style={{ color: nextDl.urgency.color }}>
                    <nextDl.urgency.icon size={14} strokeWidth={2.5} />
                  </div>
                }
                title={
                  <span className="text-xs font-bold text-main truncate block">
                    {nextDl.title}
                  </span>
                }
                subtitle={
                  <span className={`${nextDl.urgency.labelClass} text-[9px] block`}>
                    {t(nextDl.dateKey)}
                  </span>
                }
              />
            </div>
          ) : size === 'medium' ? (
            <div className="flex flex-col gap-2xs flex-1 justify-center">
              {deadlines.map((dl) => (
                <div
                  key={dl.id}
                  onClick={() => handleDeadlineClick(dl)}
                  className={`flex items-center justify-between p-xs border rounded-[var(--radius-md)] cursor-pointer transition-colors ${
                    dl.urgency.level === 'overdue' ? 'bg-danger/5 border-danger/20' : 'bg-bg-highlight/20 border-[var(--border-color)]/60'
                  } hover:bg-bg-hover`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDeadlineClick(dl); }}
                >
                  <div className="flex items-center gap-xs min-w-0 flex-1">
                    <div className="shrink-0" style={{ color: dl.urgency.color }}>
                      <dl.urgency.icon size={14} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-main truncate block">{dl.title}</span>
                      <span className="text-[10px] text-muted truncate block">{dl.courseTitle}</span>
                    </div>
                  </div>
                  <div className="text-right ml-sm shrink-0">
                    <span className={`${dl.urgency.labelClass} text-xs font-bold block`}>{t(dl.dateKey)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Large 2x2 variant layout: Shows up to 5 items with list row layout and extra action tags/status labels
            <div className="flex flex-col gap-2xs flex-1">
              {deadlines.map((dl, idx) => (
                <MasterItem
                  key={dl.id}
                  onClick={() => handleDeadlineClick(dl)}
                  className={`p-xs border rounded-[var(--radius-md)] hover:bg-bg-hover hover:border-[var(--border-color)]/50 ${
                    idx === 0 ? 'bg-bg-highlight/40 border-primary/30' : 'bg-transparent border-transparent'
                  }`}
                  leading={
                    <div className="shrink-0 flex items-center justify-center" style={{ color: dl.urgency.color }}>
                      <dl.urgency.icon size={16} strokeWidth={2.5} />
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-xs">
                      <span className="text-xs font-bold text-main truncate block">{dl.title}</span>
                      {idx === 0 && (
                        <span className="px-1.5 py-0.5 bg-danger/10 text-danger text-[9px] font-extrabold uppercase rounded-[var(--radius-xs)] tracking-wider">
                          Næste
                        </span>
                      )}
                    </div>
                  }
                  subtitle={
                    <div className="flex items-center gap-2xs text-[10px] text-muted">
                      <span className="truncate max-w-[120px]">{dl.courseTitle}</span>
                      <span>·</span>
                      <span className={dl.urgency.labelClass}>{t(dl.dateKey)}</span>
                    </div>
                  }
                  trailing={
                    <Button
                      variant={idx === 0 ? "primary" : "ghost"}
                      size="xs"
                      className="font-bold text-[9px] uppercase tracking-wider h-6 px-2 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeadlineClick(dl);
                      }}
                    >
                      {t('go_to_assignment')}
                    </Button>
                  }
                />
              ))}
            </div>
          )
        ) : (
          <Stack align="center" justify="center" gap="sm" className="h-full py-[var(--space-lg)] opacity-50 italic">
            <CheckCircle2 size={32} className="text-[var(--aau-dark-green)]/40" />
            <Text size="xs">{t('all_caught_up')}</Text>
          </Stack>
        )}
      </Card.Body>
      {deadlines.length > 0 && size !== 'small' && (
        <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center cursor-pointer hover:bg-bg-hover transition-colors" onClick={handleSeeAll} role="button" tabIndex={0}>
          <Text size="xs" weight="medium" className="text-muted font-medium">{deadlines.length} {t('dashboard.upcoming_count')}</Text>
          <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
            <Text size="xs" weight="bold" className="text-primary dark:text-white uppercase">{t('see_all_deadlines')}</Text>
            <ChevronRight size={14} strokeWidth={2.5} className="text-primary dark:text-white" />
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}

function FavoritesWidgetInner({ size = 'medium' }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const toggleFavorite = useStore(state => state.toggleFavorite)

  const favorites = useStore(state => state.favorites)
  const courses = useStore(state => state.courses)
  const resolved = useMemo(() => {
    const sorted = sortFavorites(favorites)
    return sorted
      .map(fav => resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as ResolvedFavorite[]
  }, [favorites, lang, courses, t])

  const limit = size === 'small' ? 2 : size === 'medium' ? 6 : DASHBOARD_CONFIG.FAVORITES_LIMIT
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
        {size !== 'small' && (
          <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-primary" onClick={handleSeeAll} iconRight={ChevronRight} aria-label={t('see_all')}>
            {t('see_all')}
          </Button>
        )}
      </Card.Header>
<Card.Body padding="compact" className="overflow-visible p-[var(--space-2xs)]">
        {display.length > 0 ? (
          <div className="flex flex-col">
            <div className="grid gap-[var(--space-xs)]" style={{ gridTemplateColumns: size === 'small' ? '1fr' : 'repeat(auto-fill, minmax(130px, 1fr))' }}>
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
          <div className="h-full w-full flex flex-col items-center justify-center py-sm gap-[var(--space-2xs)]">
            <div className="p-[var(--space-xs)] bg-bg-highlight rounded-[var(--radius-pill)]">
              <Star size={18} strokeWidth={2} className="text-[var(--aau-light-orange)]" fill="currentColor" />
            </div>
            <Text muted size="xs" className="text-center max-w-[200px] italic">
              {t('no_favorites_hint')}
            </Text>
            {size !== 'small' && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => navigate(PATHS.COURSES)}
                className="mt-xs font-bold text-xs"
              >
                {t('courses')}
              </Button>
            )}
          </div>
        )}
        {overflow > 0 && size !== 'small' && (
          <div className="mt-[var(--space-xs)] text-center pb-[var(--space-xs)]">
            <Text size="xs" weight="bold" className="text-primary uppercase tracking-widest opacity-60">
              {`+${overflow} ${t('more_favorites')}`}
            </Text>
          </div>
        )}
      </Card.Body>
      {display.length > 0 && size !== 'small' && (
        <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center cursor-pointer hover:bg-bg-hover transition-colors" onClick={handleSeeAll} role="button" tabIndex={0}>
          <Text size="xs" weight="medium" className="text-muted font-medium">{favorites.length} {favorites.length === 1 ? (lang === 'da' ? 'favorit' : 'favorite') : (lang === 'da' ? 'favoritter' : 'favorites')}</Text>
          <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
            <Text size="xs" weight="bold" className="text-primary dark:text-white uppercase">{lang === 'da' ? 'Administrér favoritter' : 'Manage favorites'}</Text>
            <ChevronRight size={14} strokeWidth={2.5} className="text-primary dark:text-white" />
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}

const FavoritesWidget = memo(FavoritesWidgetInner)

// --- SupportWidget ---

function SupportWidget({ size = 'medium' }: WidgetProps) {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  return (
    <Card className="support-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="p-[var(--space-2xs)] bg-bg-highlight text-primary rounded-[var(--radius-md)] border border-[var(--border-color)]/60">
            <Headphones size={14} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('contact_its_support')}
          </Heading>
        </Stack>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex flex-col justify-center gap-[var(--space-2xs)]">
        {size !== 'small' && (
          <Text size="xs" className="text-text-muted leading-relaxed">
            {t('aau_it_services')}
          </Text>
        )}
        
        {size === 'large' && (
          <div className="flex flex-col gap-[2px] text-[11px] text-muted border-y border-[var(--border-color)]/40 py-[var(--space-2xs)] my-[var(--space-2xs)]">
            <div className="flex justify-between">
              <span className="font-bold">{lang === 'da' ? 'Telefon:' : 'Phone:'}</span>
              <span>+45 9940 2020</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">{lang === 'da' ? 'Åbningstider:' : 'Hours:'}</span>
              <span>{lang === 'da' ? 'Man-Fre 08:00–15:30' : 'Mon-Fri 08:00–15:30'}</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => env.open('https://support.its.aau.dk/')}
          className="inline-flex items-center gap-xs text-xs text-primary hover:text-primary/80 font-semibold transition-colors group/support-btn self-start"
        >
          <ExternalLink size={12} strokeWidth={2} className="shrink-0" />
          <span className="group-hover/support-btn:underline underline-offset-2">{t('contact_support')}</span>
        </button>
      </Card.Body>
    </Card>
  )
}

// --- MessagesWidget ---

interface MockMessage {
  id: number
  sender: string
  subject: string
  time: string
  unread: boolean
}

const mockMessages: MockMessage[] = [
  { id: 1, sender: 'Mette Frederiksen', subject: 'Gruppemøde i morgen kl. 10', time: '10:45', unread: true },
  { id: 2, sender: 'Lars Poulsen (Underviser)', subject: 'Feedback på aflevering 2 er klar', time: 'I går', unread: false },
  { id: 3, sender: 'Studievejledningen', subject: 'Bekræftelse af tid til vejledning', time: '8. jun', unread: false },
]

function MessagesWidget({ size = 'medium' }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const limit = size === 'small' ? 1 : size === 'medium' ? 2 : 3

  return (
    <Card className="messages-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <BookOpen size={16} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('nav.messages')}
          </Heading>
        </Stack>
        {size !== 'small' && (
          <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-primary" onClick={() => navigate(PATHS.MESSAGES)}>
            {t('view_all')}
          </Button>
        )}
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-2xs w-full">
          {mockMessages.slice(0, limit).map((msg) => (
            <div
              key={msg.id}
              onClick={() => navigate(PATHS.MESSAGES)}
              className="flex items-start justify-between p-xs rounded-[var(--radius-md)] hover:bg-bg-hover cursor-pointer transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-xs">
                  <span className={`text-xs truncate block ${msg.unread ? 'font-bold text-main' : 'text-main'}`}>
                    {msg.sender}
                  </span>
                  {msg.unread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <span className="text-[10px] text-muted truncate block">{msg.subject}</span>
              </div>
              <span className="text-[9px] text-muted shrink-0 ml-xs">{msg.time}</span>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

// --- CalendarWidget ---

interface MockCalendarEvent {
  id: number
  title: string
  time: string
  location?: string
}

const mockCalendarEvents: MockCalendarEvent[] = [
  { id: 1, title: 'Forelæsning: UX & Interaktionsdesign', time: 'I dag, 08:15 - 12:00', location: 'Fibigerstræde 15' },
  { id: 2, title: 'Gruppearbejde: Semesterprojekt', time: 'I morgen, 10:00 - 15:00', location: 'Kroghstræde 3' },
  { id: 3, title: 'Workshop: CSS & Advanced Grid', time: 'Fredag, 12:30 - 14:00', location: 'Online' },
]

function CalendarWidget({ size = 'medium' }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const limit = size === 'small' ? 1 : size === 'medium' ? 2 : 3

  return (
    <Card className="calendar-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Calendar size={16} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('nav.calendar')}
          </Heading>
        </Stack>
        {size !== 'small' && (
          <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-primary" onClick={() => navigate(PATHS.CALENDAR)}>
            {t('view_all')}
          </Button>
        )}
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-2xs w-full">
          {mockCalendarEvents.slice(0, limit).map((evt) => (
            <div
              key={evt.id}
              onClick={() => navigate(PATHS.CALENDAR)}
              className="flex flex-col p-xs rounded-[var(--radius-md)] hover:bg-bg-hover cursor-pointer transition-colors border border-transparent hover:border-[var(--border-color)]/30"
            >
              <span className="text-xs font-bold text-main truncate block">{evt.title}</span>
              <div className="flex items-center justify-between text-[9px] text-muted mt-[2px]">
                <span>{evt.time}</span>
                {evt.location && <span>{evt.location}</span>}
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

// --- CourseProgressWidget ---

interface MockCourseProgress {
  id: number
  title: string
  percentage: number
}

const mockCourseProgress: MockCourseProgress[] = [
  { id: 1, title: 'Digital Design og Kommunikation', percentage: 75 },
  { id: 2, title: 'Webudvikling og CMS', percentage: 40 },
  { id: 3, title: 'Videnskabsteori', percentage: 90 },
]

function CourseProgressWidget({ size = 'medium' }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const limit = size === 'small' ? 1 : size === 'medium' ? 2 : 3

  return (
    <Card className="course-progress-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Trophy size={16} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('common.your_progress')}
          </Heading>
        </Stack>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-xs w-full">
          {mockCourseProgress.slice(0, limit).map((course) => (
            <div key={course.id} className="flex flex-col gap-[2px]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-main truncate max-w-[80%]">{course.title}</span>
                <span className="text-[10px] text-muted font-bold">{course.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-highlight rounded-full overflow-hidden border border-[var(--border-color)]/20">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${course.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

export { DeadlinesWidget, FavoritesWidget, SupportWidget, MessagesWidget, CalendarWidget, CourseProgressWidget }

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
      renderWithProviders(<DeadlinesWidget size="large" />)
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
}
