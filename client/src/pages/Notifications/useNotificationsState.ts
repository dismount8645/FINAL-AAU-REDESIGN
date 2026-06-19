import { useState, useMemo, type MouseEvent } from 'react';


import type { NotificationItem } from '@/lib/types';
import { useFormat } from '@/hooks/useFormat'
import useStore from '@/store';
import { useManagedCollection } from '@/hooks/useManagedCollection'

interface UseNotificationsStateOptions {
  initialNotifications: NotificationItem[]
}

export function useNotificationsState({ initialNotifications }: UseNotificationsStateOptions) {
  const lang = useStore(state => state.lang)
  const t = useStore(state => state.t)
  const decrementNotificationCount = useStore(state => state.decrementNotificationCount)
  const setNotificationCount = useStore(state => state.setNotificationCount)
  const { formatRelativeDateGroup } = useFormat()

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const {
    items: notifications,
    setItems: setNotifications,
    archiveItem: archiveNotification,
    restoreItem: restoreNotification,
    view,
    setView,
    filteredItems,
    searchQuery,
    setSearchQuery,
  } = useManagedCollection(initialNotifications, {
    searchKeys: (n: NotificationItem) => [n.text, n.course, n.content],
  })

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

  const grouped = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {}
    filteredItems.forEach(n => {
      const dateKey = formatRelativeDateGroup(n.date)
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(n)
    })
    return groups
  }, [filteredItems, formatRelativeDateGroup])

  const selectedNotification = useMemo(() => {
    return notifications.find(n => n.id === selectedId) || (filteredItems.length > 0 ? filteredItems[0] : null)
  }, [notifications, selectedId, filteredItems])

  const currentSelectedId = selectedNotification?.id || null

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead && !n.archived).length
  }, [notifications])

  return {
    notifications,
    setNotifications,
    selectedId,
    setSelectedId,
    view: view as 'active' | 'archive',
    setView: (v: 'active' | 'archive') => setView(v),
    archiveNotification,
    restoreNotification,
    markAsRead,
    markAllRead,
    filtered: filteredItems,
    grouped,
    selectedNotification,
    currentSelectedId,
    unreadCount,
    searchQuery,
    setSearchQuery,
    lang,
    t
  }
}


