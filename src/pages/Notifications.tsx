import { useMemo } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellOff, Inbox } from 'lucide-react';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import NotificationItemRow from '@/components/NotificationItemRow';
import NotificationDetailView from '@/components/NotificationDetailView';
import NotificationFilters from '@/components/NotificationFilters';
import Badge from '@/components/Badge';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import Grid from '@/components/Grid';
import PageHeader from '@/components/PageHeader';
import Stack from '@/components/Stack';
import { Text } from '@/components/Typography';
import { createMockNotifications, getNotificationIcon } from '@/lib/notifications';
import useStore from '@/lib/store';
import { useNotificationsState } from '@/lib/useNotificationsState';

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

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

if (import.meta.vitest) {
  describe('Notifications Page', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
    })
  
    const renderNotifications = (lang: 'da' | 'en' = 'da') => {
      useStore.setState({ lang })
      return render(
        <MemoryRouter>
          <Notifications />
        </MemoryRouter>
      )
    }
  
    it('renders notifications correctly', () => {
      renderNotifications('da')
      expect(screen.getAllByText(/Modul 4: Projektrapport v1/i)[0]).toBeInTheDocument()
    })
  
    it('filters by active and archive', () => {
      renderNotifications('da')
      const tabs = screen.getAllByText('Arkiv')
      const archiveTab = tabs.find(t => t.closest('.notifications-tabs-container'))
      fireEvent.click(archiveTab!)
      expect(screen.getByText('Arkivet er tomt')).toBeInTheDocument()
    })
  
    it('marks all as read', () => {
      renderNotifications('da')
      const markAllBtn = screen.getByText('Markér alle som læst')
      fireEvent.click(markAllBtn)
      expect(screen.queryByText('Markér alle som læst')).not.toBeInTheDocument()
    })
  
    it('archives a notification', () => {
      const { container } = renderNotifications('da')
      const actionButtons = container.querySelectorAll('.notification-actions button')
      fireEvent.click(actionButtons[1])
  
      const tabs = screen.getAllByText('Arkiv')
      const archiveTab = tabs.find(t => t.closest('.notifications-tabs-container'))
      fireEvent.click(archiveTab!)
      expect(screen.getAllByText(/Modul 4: Projektrapport v1/i)[0]).toBeInTheDocument()
    })
  
    it('renders in English correctly', () => {
      renderNotifications('en')
      expect(screen.getAllByText(/Module 4: Project Report v1/i)[0]).toBeInTheDocument()
      expect(screen.getByText('Mark all as read')).toBeInTheDocument()
  
      fireEvent.click(screen.getByText('Mark all as read'))
      expect(screen.queryByText('Mark all as read')).not.toBeInTheDocument()
    })
  
    it('selects a notification and views details', () => {
      renderNotifications('da')
      const notificationItem = screen.getAllByText(/Modul 4: Projektrapport v1/i)[0].closest('.notification-item')!
      fireEvent.click(notificationItem)
      expect(screen.getByText(/Din aflevering "Modul 4: Projektrapport v1" er nu uploadet korrekt/i)).toBeInTheDocument()
    })
  
    it('navigates to content from notification detail', () => {
      renderNotifications('da')
      const notificationItem = screen.getAllByText(/Modul 4: Projektrapport v1/i)[0].closest('.notification-item')!
      fireEvent.click(notificationItem)
      const goBtn = screen.getByText('Gå til indhold')
      fireEvent.click(goBtn)
      expect(mockNavigate).toHaveBeenCalledWith('/course/1')
    })
  
    it('marks individual notification as read', () => {
      const { container } = renderNotifications('da')
      const checkButtons = container.querySelectorAll('.notification-actions button[title="Markér som læst"]')
      if (checkButtons.length > 0) {
        fireEvent.click(checkButtons[0])
      }
      const unreadItems = container.querySelectorAll('.notification-item.is-unread')
      expect(unreadItems.length).toBeLessThan(2)
    })
  
    it('restores a notification from archive', () => {
      const { container } = renderNotifications('da')
  
      const firstItem = container.querySelectorAll('.notification-item')[0]
      const buttons = firstItem.querySelectorAll('.notification-actions button')
      fireEvent.click(buttons[buttons.length - 1])
  
      const tabs = screen.getAllByText('Arkiv')
      const archiveTab = tabs.find(t => t.closest('.notifications-tabs-container'))
      fireEvent.click(archiveTab!)
      expect(screen.getAllByText(/Modul 4: Projektrapport v1/i)[0]).toBeInTheDocument()
  
      const restoreBtns = container.querySelectorAll('.notification-actions button')
      fireEvent.click(restoreBtns[restoreBtns.length - 1])
  
      const activeTabs = screen.getAllByText('Aktiv')
      const activeTab = activeTabs.find(t => t.closest('.notifications-tabs-container'))
      fireEvent.click(activeTab!)
      expect(screen.getAllByText(/Modul 4: Projektrapport v1/i)[0]).toBeInTheDocument()
    })
  
    it('renders all notification type labels', () => {
      renderNotifications('da')
      expect(screen.getByText('SYSTEM')).toBeInTheDocument()
      expect(screen.getByText('DEADLINE')).toBeInTheDocument()
      expect(screen.getByText('FEEDBACK')).toBeInTheDocument()
    })
  
    it('shows empty archive state in English', () => {
      renderNotifications('en')
      fireEvent.click(screen.getByText('Archive'))
      expect(screen.getByText('Archive is empty')).toBeInTheDocument()
    })
  
    it('shows empty state in active view when all notifications are archived', () => {
      const { container } = renderNotifications('da')
      // Click archive on each notification until none remain.
      // Re-query each iteration to avoid stale DOM refs after re-render.
      let btn: Element | null
      while ((btn = container.querySelector('.notification-actions button:last-child'))) {
        fireEvent.click(btn)
      }
      expect(screen.getByText('Ingen notifikationer fundet')).toBeInTheDocument()
    })
  
    it('shows empty state in active view with English text', () => {
      useStore.setState({ lang: 'en' })
      const { container } = renderNotifications('en')
      let btn: Element | null
      while ((btn = container.querySelector('.notification-actions button:last-child'))) {
        fireEvent.click(btn)
      }
      expect(screen.getByText('No notifications found')).toBeInTheDocument()
    })
  })
}
