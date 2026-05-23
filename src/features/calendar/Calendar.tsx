"use client"

import { useState, useCallback, useMemo, memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CalendarEvent } from '@/types'
import Grid from '@/components/ui/Grid'
import Stack from '@/components/ui/Stack'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/common/PageHeader'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { Skeleton } from '@/components/ui/Skeleton'
import useStore from '@/store/useStore'
import { useToast } from '@/context/ToastContext'
import {
  Upload,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { useCalendar } from './hooks/useCalendar'
import { cn } from '@/lib/utils'
import {
  CalendarMonthView,
  CalendarWeekView,
  CalendarDayView,
  CalendarUpcomingWidget,
  CalendarNewEventDialog,
  CalendarEventDetailsDialog,
} from './components/index'

/**
 * Calendar Feature - High-performance AAU schedule management.
 * Enforces 8pt grid, 150ms motion physics, and strict brand token usage.
 */

// Memoized View Components
const MonthView = memo(CalendarMonthView)
const WeekView = memo(CalendarWeekView)
const DayView = memo(CalendarDayView)

const Calendar = () => {
  const { t, isMobile, lang } = useStore()
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
    
    const processResult = (result: { success: boolean, error?: string } | false) => {
      if (result && !result.success) {
        toast.error(t(result.error || 'error_occurred'))
        return
      }
      
      if (result && result.success) {
        setActiveModal(null)
        setNewEvent({ title: '', date: '', startTime: '', endTime: '', course: '', description: '' })
        toast.success(t('event_created'))
      }
    }

    if (resultOrPromise instanceof Promise) {
      resultOrPromise.then(processResult)
    } else {
      processResult(resultOrPromise as any)
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
        titleProps={{ 'data-testid': 'page-header-title' }}
        subtitle={t('calendar_subtitle')}
        icon={CalendarIcon}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('calendar') },
        ]}
        actions={
          <Stack direction="row" gap="sm" className="flex-wrap">
            <Button variant="ghost" size="sm" icon={Upload} onClick={() => setActiveModal('import')} className="hover:bg-bg-hover">
              {t('import_ics')}
            </Button>
            <Button variant="ghost" size="sm" icon={Download} onClick={() => setActiveModal('export')} className="hover:bg-bg-hover">
              {t('export_ics')}
            </Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setActiveModal('new')} className="shadow-sm hover:shadow-md transition-all active:scale-95">
              {t('new_event')}
            </Button>
          </Stack>
        }
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ErrorBoundary name="CalendarContent">
          <Grid columns={12} gap="lg">
            <Grid.Item span={9} mobileSpan={12} className="min-w-0">
              <Card variant="elevated" className="main-calendar-card h-full">
                <Card.Header padding="default" className="bg-bg-highlight/30 backdrop-blur-md">
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
                            view === 'month' && "grid-cols-[var(--calendar-sidebar-width,50px)_repeat(7,1fr)]",
                            view === 'week' && (isMobile ? "grid-cols-[var(--calendar-sidebar-width-mobile,40px)_repeat(7,1fr)] min-w-[1000px]" : "grid-cols-[var(--calendar-sidebar-width,80px)_repeat(7,1fr)] min-w-[1200px]"),
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

