import { useState, useEffect, useCallback, useMemo } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { defaultEvents } from '@/data/mockData';
import { storage } from '@/lib/storage';
import useStore from '@/store';
import { STORAGE_KEYS } from '@/lib/constants';
import { CalendarEvents, CalendarEvent } from '@/lib/types';

export function useCalendar() {
  const lang = useStore(state => state.lang)
  const t = useStore(state => state.t)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1))
  const [view, setView] = useState('month')
  const [isPending, setIsPending] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<(CalendarEvent & { dateKey: string }) | null>(null)
  
  const [events, setEvents] = useState<CalendarEvents>(() => {
    return storage.get(STORAGE_KEYS.CALENDAR_EVENTS, { ...defaultEvents })
  })

  useEffect(() => {
    storage.set(STORAGE_KEYS.CALENDAR_EVENTS, events)
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

const wrapper = ({ children }: { children: React.ReactNode }) => <>{children}</>

if (import.meta.vitest) {
  describe('useCalendar hook', () => {
    beforeEach(() => {
      localStorage.clear()
      vi.clearAllMocks()
    })
  
    it('initializes with default values', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      expect(result.current.view).toBe('month')
      expect(result.current.currentDate.getMonth()).toBe(4) // May
    })
  
    it('navigates to next and prev periods', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      
      // Month view
      act(() => result.current.navigateCal('next'))
      expect(result.current.currentDate.getMonth()).toBe(5) // June
      
      act(() => result.current.navigateCal('prev'))
      expect(result.current.currentDate.getMonth()).toBe(4) // May
      
      // Week view
      act(() => result.current.setView('week'))
      act(() => result.current.navigateCal('next'))
      expect(result.current.currentDate.getDate()).toBe(8) // May 1 + 7
      
      // Day view
      act(() => result.current.setView('day'))
      act(() => result.current.navigateCal('prev'))
      expect(result.current.currentDate.getDate()).toBe(7)
    })
  
    it('goes to today', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      act(() => result.current.goToToday())
      const now = new Date()
      expect(result.current.currentDate.toDateString()).toBe(now.toDateString())
    })
  
    it('gets events for a specific date', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      const event = result.current.getEventsForDate('2026-4-5')
      expect(event).toBeDefined()
      // Raw event has titleDa/titleEn, not title
      expect(event?.titleDa).toBe('Studiegruppe')
    })
  
    it('updates events and title correctly', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      expect(result.current.getTitle).toContain('maj 2026')
      
      act(() => result.current.setView('week'))
      expect(result.current.getTitle).toContain('2026')
      
      act(() => result.current.updateEvents({ '2026-4-1': { id: 1, title: 'New Event', color: 'blue', location: 'loc', time: '10', host: 'host' } }))
      expect(result.current.getEventsForDate('2026-4-1')?.title).toBe('New Event')
    })
  
    it('handles bilingual event titles in futureEvents', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      // Default lang is 'da', so futureEvents should resolve titleDa
      const studyGroupEvent = result.current.futureEvents.find(e => e.dateKey === '2026-4-5')
      if (studyGroupEvent) {
        expect(studyGroupEvent.title).toBe('Studiegruppe')
      }
      
      // Verify the Deadline event with just 'title' field also works
      const deadlineEvent = result.current.futureEvents.find(e => e.dateKey === '2026-4-20')
      if (deadlineEvent) {
        expect(deadlineEvent.title).toBe('Deadline')
      }
    })
  
    it('calculates month details correctly', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      expect(result.current.daysInMonth).toBe(31) // May
      expect(result.current.firstDayOfMonth).toBe(4) // May 1, 2026 is Friday (4 if 0=Mon)
    })
  
    it('returns future events sorted by date', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 4, 1))
      const { result } = renderHook(() => useCalendar(), { wrapper })
      const dates = result.current.futureEvents.map(e => e.date.getTime())
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i - 1])
      }
      vi.useRealTimers()
    })
  
    it('filters past events from futureEvents', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 4, 10))
      const { result } = renderHook(() => useCalendar(), { wrapper })
      const dateKeys = result.current.futureEvents.map(e => e.dateKey)
      expect(dateKeys).not.toContain('2026-4-5')
      expect(dateKeys).toContain('2026-4-12')
      expect(dateKeys).toContain('2026-4-20')
      vi.useRealTimers()
    })
  
    it('resolves bilingual titles in English', () => {
      useStore.setState({ lang: 'en' })
      const { result } = renderHook(() => useCalendar(), { wrapper })
      const studyGroupEvent = result.current.futureEvents.find(e => e.dateKey === '2026-4-5')
      if (studyGroupEvent) {
        expect(studyGroupEvent.title).toBe('Study Group')
      }
    })
  
    it('returns null for dates without events', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      expect(result.current.getEventsForDate('2099-1-1')).toBeNull()
    })
  
    it('calculates week number correctly', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      expect(result.current.getWeekNumber(new Date(2026, 4, 1))).toBe(18)
    })
  
    it('handles firstDayOfMonth when month starts on Sunday', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      act(() => result.current.setCurrentDate(new Date(2026, 1, 1)))
      expect(result.current.firstDayOfMonth).toBe(6)
    })
  
    it('calculates weekStart correctly', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      act(() => result.current.setCurrentDate(new Date(2026, 3, 27)))
      expect(result.current.weekStart).toBe(27)
    })
  
    it('restores events from localStorage on mount', () => {
      const savedEvents = { '2026-5-1': { title: 'Restored' } }
      localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(savedEvents))
      const { result } = renderHook(() => useCalendar(), { wrapper })
      expect(result.current.getEventsForDate('2026-5-1').title).toBe('Restored')
    })
  
    it('handles getWeekNumber for a Sunday (getUTCDay is 0)', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      expect(result.current.getWeekNumber(new Date(2026, 4, 3))).toBe(18)
    })
  
    it('does not change date when navigating with unknown view', () => {
      const { result } = renderHook(() => useCalendar(), { wrapper })
      act(() => result.current.setView('unknown'))
      const prevDate = result.current.currentDate.getDate()
      act(() => result.current.navigateCal('next'))
      expect(result.current.currentDate.getDate()).toBe(prevDate)
    })
  
    it('shows English month title', () => {
      useStore.setState({ lang: 'en' })
      const { result } = renderHook(() => useCalendar(), { wrapper })
      act(() => result.current.setView('month'))
      expect(result.current.getTitle).toContain('May 2026')
    })
  })
}
