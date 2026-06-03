import { useState, useMemo, type MouseEvent } from 'react'
import useStore from '@/lib/store'
import { formatRelativeDateGroup } from '@/lib/dates'
import type { NotificationItem } from '@/components/notificationsTypes'

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
