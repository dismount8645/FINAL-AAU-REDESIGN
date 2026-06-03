import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BellOff, Inbox } from 'lucide-react'
import { createMockNotifications, getNotificationIcon } from '@/lib/notifications'
import PageHeader from '@/components/PageHeader'
import Grid from '@/components/Grid'
import Card from '@/components/Card'
import Stack from '@/components/Stack'
import { Text } from '@/components/Typography'
import EmptyState from '@/components/EmptyState'
import Badge from '@/components/Badge'
import useStore from '@/store/useStore'
import { useNotificationsState } from '@/lib/useNotificationsState'
import {
  NotificationItemRow,
  NotificationDetailView,
  NotificationFilters
} from '@/components'

function Notifications() {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const navigate = useNavigate()

  const initialNotifications = useMemo(() => createMockNotifications(t), [t])

  const {
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
    setSelectedId
  } = useNotificationsState({ initialNotifications })

  const getIcon = getNotificationIcon

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
        <Grid.Item span={4} tabletSpan={2} mobileSpan={4}>
          <Card className="panel-card flex flex-col p-[var(--space-0)]">
            <div className="notifications-tabs-container px-md pt-md border-b border-border bg-bg-card">
              <NotificationFilters
                view={view}
                onChangeView={setView}
                unreadCount={unreadCount}
                onMarkAllRead={markAllRead}
                t={t}
              />
            </div>

            <div className="panel-scroll">
              <AnimatePresence mode="wait">
                {filtered.length > 0 ? (
                  <motion.div
                    key="notifications-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {Object.entries(grouped).map(([date, items]) => (
                      <Stack key={date} gap="none">
                        <div className="notification-group-title p-[var(--space-sm)_var(--space-md)] bg-bg-placeholder/50 dark:bg-white/5 border-y border-border/50 first:border-t-0">
                          <Text size="2xs" weight="black" className="text-text-muted tracking-widest uppercase">{date}</Text>
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
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="notifications-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <EmptyState
                      icon={view === 'active' ? BellOff : Inbox}
                      title={view === 'active' ? t('no_notifications') : t('archive_empty')}
                      message={view === 'active' ? t('notif_all_caught_up') : ''}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </Grid.Item>

        <Grid.Item span={8} tabletSpan={4} mobileSpan={4}>
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
