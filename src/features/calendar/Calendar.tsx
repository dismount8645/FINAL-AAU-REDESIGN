import { useState, useCallback, useMemo } from 'react'
import type { CalendarEvent } from '@/types'
import Grid from '@/components/ui/Grid'
import Stack from '@/components/ui/Stack'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/common/PageHeader'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import useStore from '@/store/useStore'
import { useToast } from '@/context/ToastContext'
import {
  Upload,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useCalendar } from './hooks/useCalendar'
import {
  CalendarMonthView,
  CalendarWeekView,
  CalendarDayView,
  CalendarUpcomingWidget,
  CalendarNewEventDialog,
  CalendarEventDetailsDialog,
} from './components/index'

function Calendar() {
  const { t, isMobile } = useStore()
  const toast = useToast()

  const {
    currentDate,
    view,
    setView,
    events,
    updateEvents,
    monthNames,
    dayNames,
    getWeekNumber,
    navigateCal,
    goToToday,
    getTitle,
  } = useCalendar()

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<(CalendarEvent & { dateKey: string }) | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    course: '',
    description: '',
  })

  const handleEventClick = useCallback((event: CalendarEvent, dateKey: string): void => {
    setSelectedEvent({ ...event, dateKey })
    setActiveModal('event-detail')
  }, [])

  const handleDayClick = useCallback((dateKey: string): void => {
    setNewEvent((prev) => ({ ...prev, date: dateKey }))
    setActiveModal('new')
  }, [])

  const handleCreateEvent = (): void => {
    if (!newEvent.title || !newEvent.date) return
    const dateKey = newEvent.date
    const newCalendarEvent: CalendarEvent = {
      id: Date.now(),
      title: newEvent.title,
      color: newEvent.course ? 'var(--aau-light-blue)' : 'var(--color-primary)',
      location: newEvent.course,
      time:
        newEvent.startTime && newEvent.endTime
          ? `${newEvent.startTime} - ${newEvent.endTime}`
          : newEvent.startTime || t('all_day'),
      host: 'Mig',
    }
    const existing = events[dateKey]
    if (existing) {
      toast.error(t('event_exists'))
      return
    }
    updateEvents({ ...events, [dateKey]: newCalendarEvent })
    setActiveModal(null)
    setNewEvent({ title: '', date: '', startTime: '', endTime: '', course: '', description: '' })
    toast.success(t('event_created'))
  }

  const gridContent = useMemo(() => {
    if (view === 'month') {
      return (
        <CalendarMonthView
          currentDate={currentDate}
          events={events}
          dayNames={dayNames}
          t={t}
          handleEventClick={handleEventClick}
          handleDayClick={handleDayClick}
          getWeekNumber={getWeekNumber}
        />
      )
    } else if (view === 'week') {
      return (
        <CalendarWeekView
          currentDate={currentDate}
          events={events}
          dayNames={dayNames}
          monthNames={monthNames}
          t={t}
          handleEventClick={handleEventClick}
        />
      )
    } else {
      return (
        <CalendarDayView
          currentDate={currentDate}
          events={events}
          dayNames={dayNames}
          monthNames={monthNames}
          t={t}
          handleEventClick={handleEventClick}
        />
      )
    }
  }, [view, currentDate, events, dayNames, monthNames, t, handleEventClick, handleDayClick, getWeekNumber])

  return (
    <Stack className="calendar-page">
      <PageHeader
        pageKey="calendar"
        title={getTitle}
        subtitle={t('calendar_subtitle')}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('calendar') },
        ]}
        actions={
          <>
            <Button variant="ghost" size="sm" icon={Upload} onClick={() => setActiveModal('import')}>
              {t('import_ics')}
            </Button>
            <Button variant="ghost" size="sm" icon={Download} onClick={() => setActiveModal('export')}>
              {t('export_ics')}
            </Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setActiveModal('new')}>
              {t('new_event')}
            </Button>
          </>
        }
      />

      <div className="container container--calendar pb-[var(--space-2xl)]">
        <ErrorBoundary name="CalendarContent">
          <Grid columns={12} gap="var(--space-lg)">
            <Grid.Item span={9} mobileSpan={12}>
              <Card className="main-calendar-card">
                <Card.Header className="p-sm sm:p-md">
                  <Stack direction="row" gap="sm" align="center" justify="between" className="calendar-controls flex-wrap gap-y-sm">
                    <Stack direction="row" gap="xs" align="center" className="tabs-container flex-wrap bg-bg-hover/50 p-3xs rounded-[var(--radius-md)]">
                      {(['month', 'week', 'day'] as const).map((v) => (
                        <Button
                          key={v}
                          variant={view === v ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => setView(v)}
                          className="calendar__view-btn rounded-[var(--radius-sm)] capitalize px-sm sm:px-md h-[44px] min-w-[44px] text-xs dark:text-slate-300"
                        >
                          {t(v)}
                        </Button>
                      ))}
                    </Stack>

                    <Stack direction="row" gap="sm" align="center" className="nav-controls ml-auto">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={ChevronLeft}
                        onClick={() => navigateCal('prev')}
                        aria-label={t('previous')}
                        className="h-[var(--space-3xl)] w-[var(--space-3xl)] p-[var(--space-0)]"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={goToToday}
                        className="h-[var(--space-3xl)] px-md text-xs"
                      >
                        {t('today')}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        iconRight={ChevronRight}
                        onClick={() => navigateCal('next')}
                        aria-label={t('next')}
                        className="h-[var(--space-3xl)] w-[var(--space-3xl)] p-[var(--space-0)]"
                      />
                    </Stack>
                  </Stack>
                </Card.Header>

                <Card.Body className="p-[var(--space-0)] sm:p-lg overflow-hidden">
                  <Stack
                    className={`calendar__grid-scroll overflow-x-auto w-full max-w-full min-h-[500px] min-w-0 ${
                      view === 'week' ? 'custom-scrollbar' : ''
                    } sm:overflow-x-auto`}
                    style={{
                      overflowY: view === 'week' ? 'auto' : 'visible',
                      maxHeight: view === 'week' ? 'calc(100vh - 20rem)' : 'none',
                    }}
                  >
                    <Stack
                      className="calendar-grid-container border border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--border-color)] overflow-hidden min-w-0"
                      display="grid"
                      style={{
                        gridTemplateColumns:
                          view === 'month'
                            ? '50px repeat(7, 1fr)'
                            : view === 'week'
                            ? isMobile
                              ? '40px repeat(7, 1fr)'
                              : '80px repeat(7, 1fr)'
                            : '1fr',
                        minWidth: view === 'week' ? 'var(--container-max-width)' : 'auto',
                        gap: 0,
                      }}
                    >
                      {gridContent}
                    </Stack>
                  </Stack>
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

export default Calendar
