import { useState, useMemo, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUp, MessageSquare, Clock, Star, Bell, BellOff, Inbox } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import Grid from '@/components/ui/Grid'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import useStore from '@/store/useStore'
import { formatRelativeDateGroup } from '@/utils/dates'
import {
  NotificationItem,
  NotificationItemRow,
  NotificationDetailView,
  NotificationFilters
} from './notifications/index'

function Notifications() {
  const { lang, t, decrementNotificationCount, setNotificationCount } = useStore()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [view, setView] = useState<'active' | 'archive'>('active')

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: 'AFLEVERING',
      text: t('notif_1_text'),
      date: new Date(),
      isRead: false,
      archived: false,
      course: 'Interaktionsdesign',
      content: t('notif_1_content'),
      link: '/course/1',
    },
    {
      id: 2,
      type: 'FORUM',
      text: t('notif_2_text'),
      date: new Date(Date.now() - 3600000 * 2),
      isRead: false,
      archived: false,
      course: 'Interaktionsdesign',
      content: t('notif_2_content'),
      link: '/course/1',
    },
    {
      id: 3,
      type: 'SYSTEM',
      text: t('notif_3_text'),
      date: new Date(Date.now() - 86400000),
      isRead: true,
      archived: false,
      course: 'System',
      content: t('notif_3_content'),
      link: '/',
    },
    {
      id: 4,
      type: 'DEADLINE',
      text: t('notif_4_text'),
      date: new Date(Date.now() - 86400000 * 2),
      isRead: true,
      archived: false,
      course: 'Administration',
      content: t('notif_4_content'),
      link: '/',
    },
    {
      id: 5,
      type: 'FEEDBACK',
      text: t('notif_5_text'),
      date: new Date(Date.now() - 86400000 * 5),
      isRead: true,
      archived: false,
      course: 'Webudvikling',
      content: t('notif_5_content'),
      link: '/course/2',
    },
  ])

  const archiveNotification = (id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, archived: true } : n)))
  }

  const restoreNotification = (id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, archived: false } : n)))
  }

  const markAsRead = (id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setNotifications(notifications.map((n) => {
      if (n.id === id && !n.isRead) {
        decrementNotificationCount()
        return { ...n, isRead: true }
      }
      return n
    }))
  }

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
    setNotificationCount(0)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'AFLEVERING': return FileUp
      case 'FORUM': return MessageSquare
      case 'DEADLINE': return Clock
      case 'FEEDBACK': return Star
      default: return Bell
    }
  }

  const filtered = notifications.filter((n) => (view === 'active' ? !n.archived : n.archived))

  const grouped = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {}
    filtered.forEach(n => {
      const dateKey = formatRelativeDateGroup(n.date, lang)
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(n)
    })
    return groups
  }, [filtered, lang])

  const selectedNotification = notifications.find(n => n.id === selectedId) || (filtered.length > 0 ? filtered[0] : null)
  const currentSelectedId = selectedNotification?.id || null
  const unreadCount = notifications.filter(n => !n.isRead && !n.archived).length

  return (
    <Stack className="container notifications-page flex flex-col pb-[var(--space-2xl)]">
      <PageHeader
        pageKey="notifications"
        title={t('notifications')}
        subtitle={t('notifications_page_subtitle')}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('notifications') },
        ]}
        className="!mb-[var(--space-lg)]"
      >
        <Badge variant={unreadCount > 0 ? 'danger' : 'default'} className={unreadCount > 0 ? 'bg-primary text-white shadow-[var(--shadow-md)] font-black px-xs' : ''}>
          {unreadCount} {unreadCount === 1 ? t('new_singular') : t('new_plural')}
        </Badge>
      </PageHeader>

      <Grid>
        <Grid.Item span={4} tabletSpan={3} mobileSpan={4}>
          <Card className="panel-card flex flex-col p-[var(--space-0)]">
            <div className="notifications-tabs-container px-md pt-md border-b border-border bg-[var(--bg-card)]">
              <NotificationFilters
                view={view}
                onChangeView={setView}
                unreadCount={unreadCount}
                onMarkAllRead={markAllRead}
                t={t}
              />
            </div>

            <div className="panel-scroll">
              {filtered.length > 0 ? (
                Object.entries(grouped).map(([date, items]) => (
                  <Stack key={date} gap="none">
                    <div className="notification-group-title p-[var(--space-sm)_var(--space-md)] bg-slate-50 dark:bg-white/5 border-y border-border/50 first:border-t-0">
                      <Text size="2xs" weight="black" className="text-slate-500 dark:text-slate-400 tracking-widest uppercase">{date}</Text>
                    </div>
                    {items.map((notif) => (
                      <NotificationItemRow
                        key={notif.id}
                        notif={notif}
                        isSelected={currentSelectedId === notif.id}
                        view={view}
                        lang={lang}
                        t={t}
                        getIcon={getIcon}
                        onSelect={() => setSelectedId(notif.id)}
                        onMarkRead={markAsRead}
                        onArchive={archiveNotification}
                        onRestore={restoreNotification}
                      />
                    ))}
                  </Stack>
                ))
              ) : (
                <EmptyState
                  icon={view === 'active' ? BellOff : Inbox}
                  title={view === 'active' ? t('no_notifications') : t('archive_empty')}
                  message={view === 'active' ? t('notif_all_caught_up') : ''}
                />
              )}
            </div>
          </Card>
        </Grid.Item>

        <Grid.Item span={8} tabletSpan={5} mobileSpan={4}>
          <Card className="panel-card flex flex-col p-[var(--space-0)]">
            <NotificationDetailView
              selectedNotification={selectedNotification}
              lang={lang}
              t={t}
              getIcon={getIcon}
              onNavigate={navigate}
            />
          </Card>
        </Grid.Item>
      </Grid>
    </Stack>
  )
}

export default Notifications
