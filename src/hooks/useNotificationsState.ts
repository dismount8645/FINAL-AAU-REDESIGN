import { useState, useMemo, type MouseEvent } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { NotificationItem } from '@/lib/types';
import { formatRelativeDateGroup } from '@/lib/dates';
import useStore from '@/store';

export interface UseNotificationsStateOptions {
  initialNotifications: NotificationItem[]
}

export function useNotificationsState({ initialNotifications }: UseNotificationsStateOptions) {
  const lang = useStore(state => state.lang)
  const t = useStore(state => state.t)
  const decrementNotificationCount = useStore(state => state.decrementNotificationCount)
  const setNotificationCount = useStore(state => state.setNotificationCount)

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [view, setView] = useState<'active' | 'archive'>('active')
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)

  const archiveNotification = (id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setNotifications(prev => prev.map((n) => (n.id === id ? { ...n, archived: true } : n)))
  }

  const restoreNotification = (id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setNotifications(prev => prev.map((n) => (n.id === id ? { ...n, archived: false } : n)))
  }

  const markAsRead = (id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setNotifications(prev => prev.map((n) => {
      if (n.id === id && !n.isRead) {
        decrementNotificationCount()
        return { ...n, isRead: true }
      }
      return n
    }))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map((n) => ({ ...n, isRead: true })))
    setNotificationCount(0)
  }

  const filtered = useMemo(() => {
    return notifications.filter((n) => (view === 'active' ? !n.archived : n.archived))
  }, [notifications, view])

  const grouped = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {}
    filtered.forEach(n => {
      const dateKey = formatRelativeDateGroup(n.date, lang)
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(n)
    })
    return groups
  }, [filtered, lang])

  const selectedNotification = useMemo(() => {
    return notifications.find(n => n.id === selectedId) || (filtered.length > 0 ? filtered[0] : null)
  }, [notifications, selectedId, filtered])

  const currentSelectedId = selectedNotification?.id || null

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead && !n.archived).length
  }, [notifications])

  return {
    notifications,
    setNotifications,
    selectedId,
    setSelectedId,
    view,
    setView,
    archiveNotification,
    restoreNotification,
    markAsRead,
    markAllRead,
    filtered,
    grouped,
    selectedNotification,
    currentSelectedId,
    unreadCount,
    lang,
    t
  }
}

const mockInitialNotifications = (): NotificationItem[] => [
  {
    id: 1,
    type: 'AFLEVERING',
    text: 'Notification 1',
    date: new Date('2026-05-24T08:00:00Z'),
    isRead: false,
    archived: false,
    course: 'Interaktionsdesign',
    content: 'Content 1',
    link: '/course/1',
  },
  {
    id: 2,
    type: 'FORUM',
    text: 'Notification 2',
    date: new Date('2026-05-24T06:00:00Z'),
    isRead: true,
    archived: false,
    course: 'Interaktionsdesign',
    content: 'Content 2',
    link: '/course/1',
  },
  {
    id: 3,
    type: 'SYSTEM',
    text: 'Notification 3',
    date: new Date('2026-05-23T08:00:00Z'),
    isRead: true,
    archived: true,
    course: 'System',
    content: 'Content 3',
    link: '/',
  },
]

if (import.meta.vitest) {
  describe('useNotificationsState', () => {
    const decrementNotificationCount = vi.fn()
    const setNotificationCount = vi.fn()
  
    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({
        lang: 'da',
        decrementNotificationCount,
        setNotificationCount,
      })
    })
  
    it('calculates unreadCount, filtered, and selectedNotification correctly', () => {
      const { result } = renderHook(() =>
        useNotificationsState({ initialNotifications: mockInitialNotifications() })
      )
  
      expect(result.current.unreadCount).toBe(1) // Only id 1 is unread and not archived
      expect(result.current.filtered.length).toBe(2) // 2 active (not archived)
      expect(result.current.selectedNotification?.id).toBe(1) // first active is selected by default
    })
  
    it('marks a notification as read and calls decrementNotificationCount', () => {
      const { result } = renderHook(() =>
        useNotificationsState({ initialNotifications: mockInitialNotifications() })
      )
  
      const dummyEvent = { stopPropagation: vi.fn() } as any
  
      act(() => {
        result.current.markAsRead(1, dummyEvent)
      })
  
      expect(dummyEvent.stopPropagation).toHaveBeenCalled()
      expect(decrementNotificationCount).toHaveBeenCalledTimes(1)
      expect(result.current.notifications.find(n => n.id === 1)?.isRead).toBe(true)
      expect(result.current.unreadCount).toBe(0)
    })
  
    it('archives a notification and filters it out of active list', () => {
      const { result } = renderHook(() =>
        useNotificationsState({ initialNotifications: mockInitialNotifications() })
      )
  
      const dummyEvent = { stopPropagation: vi.fn() } as any
  
      act(() => {
        result.current.archiveNotification(1, dummyEvent)
      })
  
      expect(dummyEvent.stopPropagation).toHaveBeenCalled()
      expect(result.current.notifications.find(n => n.id === 1)?.archived).toBe(true)
      expect(result.current.filtered.length).toBe(1) // only id 2 remains active
      expect(result.current.selectedNotification?.id).toBe(2) // selections falls back to 2
    })
  
    it('restores a notification back from archives', () => {
      const { result } = renderHook(() =>
        useNotificationsState({ initialNotifications: mockInitialNotifications() })
      )
  
      const dummyEvent = { stopPropagation: vi.fn() } as any
  
      act(() => {
        result.current.restoreNotification(3, dummyEvent)
      })
  
      expect(dummyEvent.stopPropagation).toHaveBeenCalled()
      expect(result.current.notifications.find(n => n.id === 3)?.archived).toBe(false)
      expect(result.current.filtered.length).toBe(3) // 3 active now
    })
  
    it('marks all as read and updates store notification count to 0', () => {
      const { result } = renderHook(() =>
        useNotificationsState({ initialNotifications: mockInitialNotifications() })
      )
  
      act(() => {
        result.current.markAllRead()
      })
  
      expect(setNotificationCount).toHaveBeenCalledWith(0)
      expect(result.current.notifications.every(n => n.isRead)).toBe(true)
      expect(result.current.unreadCount).toBe(0)
    })
  })
}
