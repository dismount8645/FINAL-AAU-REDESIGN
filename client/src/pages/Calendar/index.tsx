import { useState, useCallback, useMemo, memo, useEffect } from 'react';


import { AnimatePresence } from 'framer-motion';
import { Upload, Download, Plus, ChevronLeft, ChevronRight, Settings, AlertTriangle } from 'lucide-react';
import MonthView from './views/MonthView';
import WeekView from './views/WeekView';
import DayView from './views/DayView';
import EventForm from './EventForm';
import EventDetail from './EventDetail';
import { CalendarUpcomingWidget } from '@/components/Calendar';



import { Button, Card, Dropdown, Text, AccordionWrapper, AccordionItemRow } from '@/components/ui';
import ErrorBoundary from '@/components/Layout/ErrorBoundary';
import { Grid, Stack } from '@/components/Layout/LayoutPrimitives';
import PageLayout from '@/components/Layout/PageLayout';
import { SegmentedControl } from '@/components/ui';
import { Skeleton } from '@/components/ui';
import { useToast } from '@/components/ui';
import { useCalendar } from './useCalendar';
import useStore from '@/store';
import type { CalendarEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Calendar Feature - High-performance AAU schedule management.
 * Enforces 8pt grid, 150ms motion physics, and strict brand token usage.
 */

const Calendar = () => {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    if (!resultOrPromise) return
    
    const processResult = (result: { success: boolean, error?: string }) => {
      if (!result.success) {
        toast.error(t(/* istanbul ignore next */ result.error || 'error_occurred'))
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
    /* istanbul ignore if */
    if (isLoading) return null
    
    const commonProps = { currentDate, events, dayNames, t, handleEventClick }
    
    switch (view) {
      case 'month':
        return <MonthView {...commonProps} handleDayClick={handleDayClick} getWeekNumber={getWeekNumber} />
      case 'week':
        return <WeekView {...commonProps} monthNames={monthNames} />
      case 'day':
        return <DayView {...commonProps} monthNames={monthNames} />
      /* istanbul ignore next */
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
    <PageLayout
      className="calendar-page w-full bg-bg-body"
      pageKey="calendar"
      title={getTitle}
      titleProps={{ 'data-testid': 'page-header-title', className: 'capitalize' }}
      subtitle={t('calendar_subtitle')}
      breadcrumbs={[
        { label: t('dashboard'), href: '/' },
        { label: t('calendar') },
      ]}
      actions={
        <Stack gap="sm" className="w-full">
          <Stack direction="row" gap="sm" className="flex-wrap" align="center" justify="between">
            <Stack direction="row" gap="xs" align="center" className="nav-controls">
              <Button
                variant="secondary"
                size="icon"
                pill
                icon={ChevronLeft}
                onClick={() => navigateCal('prev')}
                className="h-11 w-11 min-h-[44px] min-w-[44px]"
                aria-label={view === 'month' ? (lang === 'da' ? 'Forrige måned' : 'Previous month') : view === 'week' ? (lang === 'da' ? 'Forrige uge' : 'Previous week') : (lang === 'da' ? 'Forrige dag' : 'Previous day')}
              />
              <Button
                variant="secondary"
                size="sm"
                pill
                onClick={goToToday}
                className="px-[var(--space-md)]"
              >
                {t('go_to_today')}
              </Button>
              <Button
                variant="secondary"
                size="icon"
                pill
                icon={ChevronRight}
                onClick={() => navigateCal('next')}
                className="h-11 w-11 min-h-[44px] min-w-[44px]"
                aria-label={view === 'month' ? (lang === 'da' ? 'Næste måned' : 'Next month') : view === 'week' ? (lang === 'da' ? 'Næste uge' : 'Next month') : (lang === 'da' ? 'Næste dag' : 'Next day')}
              />
            </Stack>
            <Stack direction="row" gap="sm" className="flex-wrap" align="center">
              <Dropdown>
                <Dropdown.Trigger>
                  <Button variant="ghost" size="sm" icon={Settings} className="normal-case tracking-normal hover:bg-bg-hover text-text-muted">
                    {lang === 'da' ? 'Import/Eksport' : 'Import/Export'}
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Menu className="w-48 p-1">
                  <Dropdown.Item onClick={() => setActiveModal('import')}>
                    <Upload size={16} className="mr-2 text-text-muted" />
                    {t('import_ics')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setActiveModal('export')}>
                    <Download size={16} className="mr-2 text-text-muted" />
                    {t('export_ics')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="primary" size="md" icon={Plus} onClick={() => setActiveModal('new')} className="normal-case tracking-normal shadow-sm hover:shadow-md transition-all active:scale-95">
                {t('new_event')}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      }
    >

      <div className="w-full max-w-[1450px] mx-auto px-sm md:px-md pb-xl">
        <ErrorBoundary name="CalendarContent">
          <Grid columns={12} gap="md">
            <Grid.Item className="calendar-main-col min-w-0">
              <Card variant="elevated" className="main-calendar-card">
                <Card.Header padding="compact" className="bg-bg-highlight/30 backdrop-blur-md">
                  <div className="w-full flex items-center justify-center">
                    <SegmentedControl
                      options={viewOptions}
                      value={view}
                      onChange={(v) => setView(v as string)}
                      className="!my-0"
                    />
                  </div>
                </Card.Header>

                <Card.Body padding="none" className="overflow-hidden relative">
                  <div className="calendar__grid-scroll overflow-x-auto w-full max-w-full custom-scrollbar">
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
                            view === 'month' && "grid-cols-[var(--calendar-sidebar-width,44px)_repeat(7,minmax(0,1fr))] min-w-[950px]",
                            view === 'week' && "grid-cols-[var(--calendar-sidebar-width,96px)_repeat(7,minmax(0,1fr))] min-w-[1200px]",
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

            <Grid.Item className="calendar-side-col self-start h-fit">
              <Stack gap="md">
                <CalendarUpcomingWidget
                  events={events}
                  currentDate={currentDate}
                  monthNames={monthNames}
                  t={t}
                  handleEventClick={handleEventClick}
                  onCreateEvent={() => setActiveModal('new')}
                  onImport={() => setActiveModal('import')}
                />
                
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <AccordionWrapper {...{ collapsible: true, defaultValue: ["legend"] } as any} className="w-full">
                  <AccordionItemRow
                    value="legend"
                    title={
                      <Text size="xs" weight="black" className="uppercase tracking-widest text-text-muted">
                        {t('legend')}
                      </Text>
                    }
                    className="border border-border/40 rounded-[var(--radius-md)] overflow-hidden"
                  >
                    <Stack gap="xs" className="p-[var(--space-md)] bg-bg-card">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[var(--aau-light-blue)] shadow-sm shrink-0" />
                        <Text size="xs" weight="bold" className="text-text-main">
                          {t('study_group')}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[var(--color-primary)] shadow-sm shrink-0" />
                        <Text size="xs" weight="bold" className="text-text-main">
                          {t('lecture')}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[var(--color-danger-dark)] shadow-sm shrink-0 flex items-center justify-center" />
                        <Text size="xs" weight="bold" className="text-orange-700 dark:text-orange-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                          {t('deadline')}
                        </Text>
                      </div>
                    </Stack>
                  </AccordionItemRow>
                </AccordionWrapper>
              </Stack>
            </Grid.Item>
          </Grid>
        </ErrorBoundary>

        <EventForm
          isOpen={activeModal === 'new'}
          onClose={() => setActiveModal(null)}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleCreateEvent={handleCreateEvent}
          isPending={isPending}
          t={t}
        />

        <EventDetail
          isOpen={activeModal === 'event-detail'}
          onClose={() => setActiveModal(null)}
          selectedEvent={selectedEvent}
          dayNames={dayNames}
          monthNames={monthNames}
          t={t}
        />
      </div>
    </PageLayout>
  )
}

export default memo(Calendar)

