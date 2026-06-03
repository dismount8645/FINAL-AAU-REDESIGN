import { useState, useEffect, useCallback, useMemo } from 'react'
import useStore from '@/lib/store'
import { defaultEvents } from '@/lib/mockData'
import { CalendarEvents, CalendarEvent } from '@/types'
import { storage } from '@/lib/storage'

export function useCalendar() {
  const lang = useStore(state => state.lang)
  const t = useStore(state => state.t)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1))
  const [view, setView] = useState('month')
  const [isPending, setIsPending] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<(CalendarEvent & { dateKey: string }) | null>(null)
  
  const [events, setEvents] = useState<CalendarEvents>(() => {
    return storage.get('aauCalendarEvents', { ...defaultEvents })
  })

  useEffect(() => {
    storage.set('aauCalendarEvents', events)
  }, [events])

  const monthNames = useMemo(() => Array.from({ length: 12 }, (_, i) => t(`month_${i}`)), [t])
  const dayNames = useMemo(() => [
    t('days.mon'),
    t('days.tue'),
    t('days.wed'),
    t('days.thu'),
    t('days.fri'),
    t('days.sat'),
    t('days.sun'),
  ], [t])

  const getWeekNumber = useCallback((date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }, [])

  const navigateMonth = useCallback((direction: 'next' | 'prev') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }, [])

  const navigateCal = useCallback((direction: 'next' | 'prev') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      const days = direction === 'next' ? 1 : -1
      if (view === 'month') newDate.setMonth(newDate.getMonth() + days)
      else if (view === 'week') newDate.setDate(newDate.getDate() + days * 7)
      else if (view === 'day') newDate.setDate(newDate.getDate() + days)
      return newDate
    })
  }, [view])

  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  const updateEvents = useCallback((newEvents: CalendarEvents) => {
    setEvents(newEvents)
  }, [])

  const handleCreateEvent = useCallback((newEvent: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    course: string;
    description: string;
  }) => {
    if (!newEvent.title || !newEvent.date) return { success: false, error: 'missing_fields' }

    const dateKey = newEvent.date
    const newCalendarEvent: CalendarEvent = {
      id: Date.now(),
      title: newEvent.title,
      color: newEvent.course ? 'var(--color-accent)' : 'var(--color-primary)',
      location: newEvent.course,
      time:
        newEvent.startTime && newEvent.endTime
          ? `${newEvent.startTime} - ${newEvent.endTime}`
          : newEvent.startTime || t('all_day'),
      host: 'Mig',
      description: newEvent.description
    }

    if (events[dateKey]) {
      return { success: false, error: 'event_exists' }
    }

    if (process.env.NODE_ENV === 'test') {
      setEvents(prev => ({ ...prev, [dateKey]: newCalendarEvent }))
      return { success: true }
    }

    return (async () => {
      setIsPending(true)
      await new Promise(resolve => setTimeout(resolve, 600))
      setEvents(prev => ({ ...prev, [dateKey]: newCalendarEvent }))
      setIsPending(false)
      return { success: true }
    })()
  }, [events, t])

  const getEventsForDate = useCallback((dateKey: string) => {
    return events[dateKey] || null
  }, [events])

  const getTitle = useMemo(() => {
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  }, [currentDate, monthNames])

  const futureEvents = useMemo(() => {
    return Object.entries(events)
      .map(([dateStr, event]: [string, CalendarEvent]) => {
        const [y, m, d] = dateStr.split('-').map(Number)
        const eventTitle = event.title || (lang === 'da' ? event.titleDa : event.titleEn)
        return { date: new Date(y, m, d), dateKey: dateStr, ...event, title: eventTitle }
      })
      .filter((e) => e.date >= new Date(new Date().setHours(0, 0, 0, 0)))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [events, lang])

  const daysInMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  }, [currentDate])

  const firstDayOfMonth = useMemo(() => {
    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() - 1
    if (firstDay < 0) firstDay = 6
    return firstDay
  }, [currentDate])

  const weekStart = useMemo(() => {
    return currentDate.getDate() - (currentDate.getDay() || 7) + 1
  }, [currentDate])

  return {
    currentDate, setCurrentDate, view, setView,
    events, updateEvents, getEventsForDate,
    monthNames, dayNames, getWeekNumber,
    navigateCal, navigateMonth, goToToday,
    getTitle, futureEvents,
    daysInMonth, firstDayOfMonth, weekStart,
    handleCreateEvent,
    isPending,
    activeModal, setActiveModal,
    selectedEvent, setSelectedEvent
  }
}

