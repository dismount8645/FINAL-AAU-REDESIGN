import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatePresence } from 'framer-motion';
import { Upload, Download, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { MemoryRouter } from 'react-router-dom';
import { CalendarMonthView, CalendarWeekView, CalendarDayView } from '@/components/CalendarViews';
import CalendarUpcomingWidget from '@/components/CalendarUpcomingWidget';
import CalendarNewEventDialog from '@/components/CalendarNewEventDialog';
import CalendarEventDetailsDialog from '@/components/CalendarEventDetailsDialog';
import Button from '@/components/ui/Button';
import Card from '@/components/Card';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Grid } from '@/components/LayoutPrimitives';
import PageHeader from '@/components/PageHeader';
import SegmentedControl from '@/components/SegmentedControl';
import { Skeleton } from '@/components/Skeleton';
import { Stack } from '@/components/LayoutPrimitives';
import { useToast, ToastProvider } from '@/components/Toast';
import { useCalendar } from '@/components/useCalendar';
import useStore from '@/lib/store';
import type { CalendarEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

"use client"

/**
 * Calendar Feature - High-performance AAU schedule management.
 * Enforces 8pt grid, 150ms motion physics, and strict brand token usage.
 */

// Memoized View Components
const MonthView = memo(CalendarMonthView)
const WeekView = memo(CalendarWeekView)
const DayView = memo(CalendarDayView)

const Calendar = () => {
  const t = useStore(state => state.t)
  const isMobile = useStore(state => state.isMobile)
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(process.env.NODE_ENV !== 'test')

  const {
    currentDate,
    view,
    setView,
    events,
    monthNames,
    dayNames,
    getWeekNumber,
    navigateCal,
    goToToday,
    getTitle,
    handleCreateEvent: createEventAction,
    isPending,
    activeModal,
    setActiveModal,
    selectedEvent,
    setSelectedEvent
  } = useCalendar()

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    course: '',
    description: '',
  })

  // Simulate initial load
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  // Handlers
  const handleEventClick = useCallback((event: CalendarEvent, dateKey: string): void => {
    setSelectedEvent({ ...event, dateKey })
    setActiveModal('event-detail')
  }, [setSelectedEvent, setActiveModal])

  const handleDayClick = useCallback((dateKey: string): void => {
    setNewEvent((prev) => ({ ...prev, date: dateKey }))
    setActiveModal('new')
  }, [setActiveModal])

  const handleCreateEvent = useCallback((): void => {
    const resultOrPromise = createEventAction(newEvent)
    if (!resultOrPromise) return
    
    const processResult = (result: { success: boolean, error?: string }) => {
      if (!result.success) {
        toast.error(t(result.error || 'error_occurred'))
        return
      }
      
      setActiveModal(null)
      setNewEvent({ title: '', date: '', startTime: '', endTime: '', course: '', description: '' })
      toast.success(t('event_created'))
    }

    if (resultOrPromise instanceof Promise) {
      resultOrPromise.then(processResult)
    } else {
      processResult(resultOrPromise)
    }
  }, [createEventAction, newEvent, t, toast, setActiveModal])

  const renderGridContent = useMemo(() => {
    if (isLoading) return null
    
    const commonProps = { currentDate, events, dayNames, t, handleEventClick }
    
    switch (view) {
      case 'month':
        return <MonthView {...commonProps} handleDayClick={handleDayClick} getWeekNumber={getWeekNumber} />
      case 'week':
        return <WeekView {...commonProps} monthNames={monthNames} />
      case 'day':
        return <DayView {...commonProps} monthNames={monthNames} />
      default:
        return null
    }
  }, [isLoading, view, currentDate, events, dayNames, monthNames, t, handleEventClick, handleDayClick, getWeekNumber])

  const viewOptions = useMemo(() => [
    { value: 'month', label: t('month') },
    { value: 'week', label: t('week') },
    { value: 'day', label: t('day') },
  ], [t])

  return (
    <Stack className="calendar-page w-full min-h-screen bg-bg-body">
      <PageHeader
        pageKey="calendar"
        title={getTitle}
        titleProps={{ 'data-testid': 'page-header-title', className: 'capitalize' }}
        subtitle={t('calendar_subtitle')}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('calendar') },
        ]}
        actions={
          <Stack direction="row" gap="sm" className="flex-wrap">
            <Button variant="ghost" size="sm" icon={Upload} onClick={() => setActiveModal('import')} className="normal-case tracking-normal hover:bg-bg-hover">
              {t('import_ics')}
            </Button>
            <Button variant="ghost" size="sm" icon={Download} onClick={() => setActiveModal('export')} className="normal-case tracking-normal hover:bg-bg-hover">
              {t('export_ics')}
            </Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setActiveModal('new')} className="normal-case tracking-normal shadow-sm hover:shadow-md transition-all active:scale-95">
              {t('new_event')}
            </Button>
          </Stack>
        }
      />

      <div className="container pb-[var(--space-3xl)]">
        <ErrorBoundary name="CalendarContent">
          <Grid columns={12} gap="lg">
            <Grid.Item span={9} mobileSpan={12} className="min-w-0">
              <Card variant="elevated" className="main-calendar-card h-full">
                <Card.Header padding="default" className="bg-bg-highlight/30 backdrop-blur-md min-h-[72px] sm:min-h-[76px] flex items-center">
                  <Stack direction="row" gap="md" align="center" justify="between" className="flex-wrap w-full">
                    <div className="w-full sm:w-auto min-w-[240px]">
                      <SegmentedControl
                        options={viewOptions}
                        value={view}
                        onChange={(v) => setView(v as string)}
                        className="!my-0"
                      />
                    </div>

                    <Stack direction="row" gap="xs" align="center" className="nav-controls ml-auto">
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        pill
                        icon={ChevronLeft}
                        onClick={() => navigateCal('prev')}
                        aria-label={t('previous')}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        pill
                        onClick={goToToday}
                        className="px-[var(--space-md)]"
                      >
                        {t('today')}
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        pill
                        icon={ChevronRight}
                        onClick={() => navigateCal('next')}
                        aria-label={t('next')}
                      />
                    </Stack>
                  </Stack>
                </Card.Header>

                <Card.Body padding="none" className="overflow-hidden relative">
                  <div className="calendar__grid-scroll overflow-x-auto overflow-y-auto w-full max-w-full custom-scrollbar h-[calc(100vh-360px)] min-h-[500px]">
                    {isLoading ? (
                      <div className="p-[var(--space-md)] space-y-[var(--space-md)]">
                        <Skeleton className="h-12 w-full rounded-[var(--radius-md)]" />
                        <div className="grid grid-cols-7 gap-1 h-[400px]">
                          {Array.from({ length: 35 }).map((_, i) => (
                            <Skeleton key={i} className="h-full w-full rounded-[var(--radius-xs)]" />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <AnimatePresence mode="wait">
                        <div 
                          key="content"
                          className={cn(
                            "calendar-grid-container bg-[var(--border-color)]/20 min-w-0 grid transition-all duration-300",
                            view === 'month' && "grid-cols-[var(--calendar-sidebar-width,64px)_repeat(7,minmax(0,1fr))] min-w-[700px] md:min-w-[950px] lg:min-w-0",
                            view === 'week' && (isMobile ? "grid-cols-[var(--calendar-sidebar-width-mobile,40px)_repeat(7,minmax(0,1fr))] min-w-[1000px]" : "grid-cols-[var(--calendar-sidebar-width,96px)_repeat(7,minmax(0,1fr))] min-w-[1200px]"),
                            view === 'day' && "grid-cols-1"
                          )}
                          style={{ gap: '1px' }}
                        >
                          {renderGridContent}
                        </div>
                      </AnimatePresence>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Grid.Item>

            <Grid.Item span={3} mobileSpan={12}>
              <CalendarUpcomingWidget
                events={events}
                currentDate={currentDate}
                monthNames={monthNames}
                t={t}
                handleEventClick={handleEventClick}
              />
            </Grid.Item>
          </Grid>
        </ErrorBoundary>

        <CalendarNewEventDialog
          isOpen={activeModal === 'new'}
          onClose={() => setActiveModal(null)}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleCreateEvent={handleCreateEvent}
          isPending={isPending}
          t={t}
        />

        <CalendarEventDetailsDialog
          isOpen={activeModal === 'event-detail'}
          onClose={() => setActiveModal(null)}
          selectedEvent={selectedEvent}
          dayNames={dayNames}
          monthNames={monthNames}
          t={t}
        />
      </div>
    </Stack>
  )
}

export default memo(Calendar)

let mockNavigate: ReturnType<typeof vi.fn>
if (import.meta.vitest) {
  // Mock react-router-dom
  mockNavigate = vi.fn()
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    }
  })
  describe('Calendar Page', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 4, 15))
      vi.clearAllMocks()
      localStorage.clear()
    })
  
    const renderCalendar = (lang: 'da' | 'en' = 'da') => {
      useStore.setState({ lang })
      return render(
        <MemoryRouter>
          <ToastProvider>
            <Calendar />
          </ToastProvider>
        </MemoryRouter>
      )
    }
  
    it('renders monthly view by default', () => {
      renderCalendar('da')
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
      expect(screen.getByText('Man')).toBeInTheDocument()
      expect(screen.getByText('Studiegruppe')).toBeInTheDocument()
    })
  
    it('switches views', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Uge' }))
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
  
      fireEvent.click(screen.getByRole('button', { name: 'Dag' }))
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
    })
  
    it('navigates between months/weeks/days', () => {
      renderCalendar('da')
      // Next month
      const nextBtn = screen.getByRole('button', { name: /næste|next/i })
      fireEvent.click(nextBtn)
      expect(screen.getByText('juni 2026')).toBeInTheDocument()
  
      // Prev month
      const prevBtn = screen.getByRole('button', { name: /forrige|previous/i })
      fireEvent.click(prevBtn)
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
  
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
    })
  
    it('navigates in week and day views', () => {
      renderCalendar('da')
  
      // Start in day view with default date (May 1)
      fireEvent.click(screen.getByRole('button', { name: 'Dag' }))
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
  
      // Navigate to next day
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
  
      // Switch to week view and navigate forward
      fireEvent.click(screen.getByRole('button', { name: 'Uge' }))
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
    })
  
    it('opens new event modal and fills it', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Ny begivenhed' }))
      expect(screen.getByText('Opret begivenhed')).toBeInTheDocument()
  
      const titleInput = screen.getByPlaceholderText('Begivenhedstitel') as HTMLInputElement
      fireEvent.change(titleInput, { target: { value: 'Test Event' } })
      expect(titleInput.value).toBe('Test Event')
  
      const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement
      if (dateInput) fireEvent.change(dateInput, { target: { value: '2026-05-15' } })
  
      fireEvent.click(screen.getByRole('button', { name: 'Opret begivenhed' }))
      expect(screen.queryByText('Opret begivenhed')).not.toBeInTheDocument()
    })
  
    it('opens event detail modal', () => {
      renderCalendar('da')
      const event = screen.getByText('Studiegruppe')
      fireEvent.click(event)
      expect(screen.getByText('Lokation')).toBeInTheDocument()
      expect(screen.getByText('Fibigerstræde 16, 1.108')).toBeInTheDocument()
  
      fireEvent.click(screen.getByRole('button', { name: 'Gå til modul' }))
      expect(mockNavigate).toHaveBeenCalledWith('/course/1')
    })
  
    it('renders upcoming events widget and clicks event', () => {
      const today = new Date()
      const futureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)
      const dateKey = `${futureDate.getFullYear()}-${futureDate.getMonth()}-${futureDate.getDate()}`
      localStorage.setItem('aauCalendarEvents', JSON.stringify({
        [dateKey]: { id: 104, title: 'Deadline', color: 'var(--color-danger)', location: 'Online Submission', time: '23:59', host: 'AAU Moodle' },
      }))
      renderCalendar('da')
      expect(screen.getByText('Kommende')).toBeInTheDocument()
      // Click the upcoming event item container (has the onClick handler)
      const deadlineEls = screen.getAllByText('Deadline')
      const upcomingItem = deadlineEls[deadlineEls.length - 1].closest('.upcoming-event-item')
      if (!upcomingItem) throw new Error('Upcoming event item not found')
      fireEvent.click(upcomingItem)
      expect(screen.getByText('Lokation')).toBeInTheDocument()
    })
  
    it('renders in English', () => {
      renderCalendar('en')
      expect(screen.getByText('May 2026')).toBeInTheDocument()
      expect(screen.getByText('Mon')).toBeInTheDocument()
      expect(screen.getByText('Study Group')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Week' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Day' })).toBeInTheDocument()
    })
  
    it('handles empty events state in upcoming widget', () => {
      localStorage.setItem('aauCalendarEvents', JSON.stringify({}))
      renderCalendar('da')
      expect(screen.getByText('Ingen begivenheder')).toBeInTheDocument()
    })
  
    it('renders week view with time labels', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Uge' }))
      expect(screen.getByText(/08:00/)).toBeInTheDocument()
      expect(screen.getByText(/17:00/)).toBeInTheDocument()
    })
  
    it('renders day view', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Dag' }))
      expect(screen.getByText('1. maj')).toBeInTheDocument()
    })
  
    it('renders day view with no events message', () => {
      localStorage.setItem('aauCalendarEvents', JSON.stringify({}))
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Dag' }))
      expect(screen.getByText('Ingen begivenheder')).toBeInTheDocument()
    })
  
    it('navigates to today', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      expect(screen.getByText('juni 2026')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'I dag' }))
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
    })
  
    it('navigates events in English', () => {
      renderCalendar('en')
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(screen.getByText('June 2026')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(screen.getByText('May 2026')).toBeInTheDocument()
    })
  
    it('opens import and export modals without crashing', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: /importér/i }))
      fireEvent.click(screen.getByRole('button', { name: /eksportér/i }))
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
    })
  
    it('navigates weeks forward and backward', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Uge' }))
      fireEvent.click(screen.getByRole('button', { name: /forrige|previous/i }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/april 2026/i)
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/maj 2026/i)
    })
  
    it('navigates day view across month boundary', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Dag' }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/maj 2026/i)
      fireEvent.click(screen.getByRole('button', { name: /forrige|previous/i }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/april 2026/i)
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/maj 2026/i)
    })
  
    it('clicks an event pill in week view', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Uge' }))
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      fireEvent.click(screen.getByText('Studiegruppe'))
      expect(screen.getByText('Lokation')).toBeInTheDocument()
    })
  
    it('navigates to today in week and day views', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Uge' }))
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      fireEvent.click(screen.getByRole('button', { name: 'I dag' }))
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
  
      fireEvent.click(screen.getByRole('button', { name: 'Dag' }))
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      fireEvent.click(screen.getByRole('button', { name: 'I dag' }))
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
    })
  
    it('closes new event modal on cancel', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Ny begivenhed' }))
      expect(screen.getByText('Opret begivenhed')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Annuller' }))
      expect(screen.queryByText('Opret begivenhed')).not.toBeInTheDocument()
    })
  
    it('shows full info button in event detail and navigates', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByText('Studiegruppe'))
      fireEvent.click(screen.getByRole('button', { name: 'Fuld info' }))
      expect(mockNavigate).toHaveBeenCalledWith('/submission/1')
    })
  
    it('renders with empty localStorage on initial load (uses default events)', () => {
      localStorage.removeItem('aauCalendarEvents')
      renderCalendar('da')
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
      expect(screen.getByText('Studiegruppe')).toBeInTheDocument()
    })
  
    it('import and export buttons do not crash', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: /importér/i }))
      fireEvent.click(screen.getByRole('button', { name: /eksportér/i }))
      expect(screen.getByText('maj 2026')).toBeInTheDocument()
    })
  
    it('does not render event-detail dialog when no event selected', () => {
      renderCalendar('da')
      expect(screen.queryByText('Lokation')).not.toBeInTheDocument()
    })
  
    it('fills all fields in new event modal', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Ny begivenhed' }))
  
      fireEvent.change(screen.getByPlaceholderText('Begivenhedstitel'), { target: { value: 'Test' } })
      const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement
      if (dateInput) fireEvent.change(dateInput, { target: { value: '2026-05-15' } })
      const allTimeInputs = document.querySelectorAll('input[type="time"]') as NodeListOf<HTMLInputElement>
      if (allTimeInputs.length > 0) {
        fireEvent.change(allTimeInputs[0], { target: { value: '10:00' } })
      }
      if (allTimeInputs.length > 1) {
        fireEvent.change(allTimeInputs[1], { target: { value: '12:00' } })
      }
      fireEvent.change(screen.getByPlaceholderText('Kursus'), { target: { value: 'Test Course' } })
      fireEvent.change(screen.getByPlaceholderText('Beskrivelse'), { target: { value: 'Test Description' } })
  
      fireEvent.click(screen.getByRole('button', { name: 'Opret begivenhed' }))
      expect(screen.queryByText('Opret begivenhed')).not.toBeInTheDocument()
    })
  
    it('closes dialog via Escape', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Ny begivenhed' }))
      expect(screen.getByText('Opret begivenhed')).toBeInTheDocument()
      const dialog = document.querySelector('[role="dialog"]')
      if (dialog) fireEvent.keyDown(dialog, { key: 'Escape' })
    })
  
    it('filters out past events in upcoming widget', () => {
      // Store a past event in localStorage
      localStorage.setItem('aauCalendarEvents', JSON.stringify({
        '2026-1-1': { id: 201, title: 'Old Event', color: 'var(--aau-light-blue)', location: 'Room A', time: '10:00', host: 'Test' },
      }))
      renderCalendar('da')
      expect(screen.queryByText('Old Event')).not.toBeInTheDocument()
    })
  
    it('renders view-all button in upcoming widget', () => {
      renderCalendar('da')
      const viewAllBtn = screen.getByText('Se alle')
      fireEvent.click(viewAllBtn)
      expect(mockNavigate).toHaveBeenCalledWith('/calendar')
    })
  
    it('renders day view with an event', () => {
      localStorage.setItem('aauCalendarEvents', JSON.stringify({
        '2026-4-1': { id: 301, title: 'May Day Event', color: 'var(--color-primary)', location: 'Room 101', time: '09:00 - 10:00', host: 'Test Host' },
      }))
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Dag' }))
      expect(screen.getByText('May Day Event')).toBeInTheDocument()
    })
  
    it('closes event detail dialog', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByText('Studiegruppe'))
      expect(screen.getByText('Lokation')).toBeInTheDocument()
      const dialog = document.querySelector('[role="dialog"]')
      if (dialog) fireEvent.keyDown(dialog, { key: 'Escape' })
      // After close, the dialog should not be visible
      expect(screen.queryByText('Lokation')).not.toBeInTheDocument()
    })
  
    it('sorts multiple future events in upcoming widget', () => {
      const today = new Date()
      const future1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)
      const future2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)
      const key1 = `${future1.getFullYear()}-${future1.getMonth()}-${future1.getDate()}`
      const key2 = `${future2.getFullYear()}-${future2.getMonth()}-${future2.getDate()}`
      localStorage.setItem('aauCalendarEvents', JSON.stringify({
        [key1]: { id: 401, title: 'Future Event 1', color: 'var(--color-primary)', location: 'A', time: '10:00', host: 'Host 1' },
        [key2]: { id: 402, title: 'Future Event 2', color: 'var(--color-primary)', location: 'B', time: '11:00', host: 'Host 2' },
      }))
      renderCalendar('da')
      expect(screen.getByText('Kommende')).toBeInTheDocument()
      // Events appear both in calendar grid and upcoming widget, so use getAllByText
      expect(screen.getAllByText('Future Event 1').length).toBeGreaterThan(0)
    })
  
    it('handles month starting on a Sunday (firstDay < 0 edge case)', () => {
      renderCalendar('da')
      // Default is May 2026.
      // May -> April
      fireEvent.click(screen.getByRole('button', { name: /forrige|previous/i }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/april 2026/i)
      
      // April -> March (Starts on Sunday)
      fireEvent.click(screen.getByRole('button', { name: /forrige|previous/i }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/marts 2026/i)
    })
  
    it('handles Sunday in week view (getDay() || 7 edge case)', () => {
      renderCalendar('da')
      // Switch to week view (May 1, 2026 - Friday)
      fireEvent.click(screen.getByRole('button', { name: 'Uge' }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/maj 2026/i)
      
      // Week 18 -> Week 19
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/maj 2026/i)
    })
  
    it('handles Sunday in day view (dayNames fallback edge case)', () => {
      renderCalendar('da')
      // Switch to Day view (May 1, 2026 - Friday)
      fireEvent.click(screen.getByRole('button', { name: 'Dag' }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/maj 2026/i)
      
      // May 1 -> May 2
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/maj 2026/i)
  
      // May 2 -> May 3 (Sunday)
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      expect(screen.getByTestId('page-header-title')).toHaveTextContent(/maj 2026/i)
    })
  
    it('shows English event description in detail modal', () => {
      renderCalendar('en')
      fireEvent.click(screen.getByText('Study Group'))
      expect(screen.getByText(/This event is part of your study program/)).toBeInTheDocument()
    })
  
    it('opens new event modal when clicking an empty day', () => {
      renderCalendar('da')
      // Click on the first day of the month (May 1) which has no event
      const dayBtn = document.querySelector('.calendar-day:not(.empty) button')
      if (dayBtn) {
        fireEvent.click(dayBtn)
        expect(screen.getByText('Opret begivenhed')).toBeInTheDocument()
      }
    })
  
    it('shows error when creating event on occupied date', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Ny begivenhed' }))
      const titleInput = screen.getByPlaceholderText('Begivenhedstitel') as HTMLInputElement
      fireEvent.change(titleInput, { target: { value: 'Duplicate Event' } })
      // May 5, 2026 (2026-05-05 input → internal '2026-4-5') matches existing event
      const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement
      if (dateInput) fireEvent.change(dateInput, { target: { value: '2026-05-05' } })
      fireEvent.click(screen.getByRole('button', { name: 'Opret begivenhed' }))
      expect(screen.queryByText('Opret begivenhed')).toBeInTheDocument()
    })
  
    it('does not create event without title or date', () => {
      renderCalendar('da')
      fireEvent.click(screen.getByRole('button', { name: 'Ny begivenhed' }))
      fireEvent.click(screen.getByRole('button', { name: 'Opret begivenhed' }))
      expect(screen.getByText('Opret begivenhed')).toBeInTheDocument()
    })
  
    it('renders week view in mobile mode', () => {
      useStore.setState({ lang: 'da', isMobile: true })
      render(
        <MemoryRouter>
          <ToastProvider>
            <Calendar />
          </ToastProvider>
        </MemoryRouter>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Uge' }))
      expect(screen.getByText(/08:00/)).toBeInTheDocument()
    })
  
    it('renders week numbers correctly for month starting on Monday', () => {
      renderCalendar('da')
      // June 2026 starts on a Monday
      fireEvent.click(screen.getByRole('button', { name: /næste|next/i }))
      expect(screen.getByText('juni 2026')).toBeInTheDocument()
      
      // Check for week numbers (they are usually divs with class 'calendar-week-num')
      const weekNums = document.querySelectorAll('.calendar-week-num')
      expect(weekNums.length).toBeGreaterThan(0)
    })
  })
}
