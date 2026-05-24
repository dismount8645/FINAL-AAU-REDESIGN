import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useNotificationsState } from '@/hooks/useNotificationsState'
import useStore from '@/store/useStore'
import type { NotificationItem } from '@/pages/notifications/types'

vi.mock('@/store/useStore', () => {
  let currentState: any = {}
  const mockFn = vi.fn((selector) => {
    return selector ? selector(currentState) : currentState
  })
  ;(mockFn as any).mockReturnValue = (val: any) => {
    currentState = val
    return mockFn
  }
  return {
    default: mockFn,
  }
})

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

describe('useNotificationsState', () => {
  const decrementNotificationCount = vi.fn()
  const setNotificationCount = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useStore as any).mockReturnValue({
      lang: 'en',
      t: (k: string) => k,
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
