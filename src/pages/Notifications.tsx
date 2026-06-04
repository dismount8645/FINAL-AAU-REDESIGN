import { useMemo } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellOff, Inbox } from 'lucide-react';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { NotificationDetailView, NotificationFilters } from '@/components/Notifications';
import { Badge, MasterItem } from '@/components/ui';
import { Card } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import { Grid, Stack } from '@/components/Layout';
import { PageLayout } from '@/components/Layout';
import { Text } from '@/components/ui';
import { createMockNotifications, getNotificationIcon } from '@/lib/notifications';
import useStore from '@/store';
import { useNotificationsState } from '@/hooks';
import Button from '@/components/ui/Button';
import { Check, Archive, Undo2 } from 'lucide-react';
import { formatTime } from '@/lib/dates';

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
    <PageLayout
      className="container notifications-page flex flex-col pb-[var(--space-2xl)]"
      pageKey="notifications"
      title={t('notifications')}
      subtitle={t('notifications_page_subtitle')}
      breadcrumbs={[
        { label: t('dashboard'), href: '/' },
        { label: t('notifications') },
      ]}
      headerClassName="!mb-[var(--space-lg)]"
      headerChildren={
        <Badge variant={unreadCount > 0 ? 'danger' : 'default'} className={unreadCount > 0 ? 'bg-primary text-white shadow-[var(--shadow-md)] font-black px-xs' : ''}>
          {unreadCount} {unreadCount === 1 ? t('new_singular') : t('new_plural')}
        </Badge>
      }
    >

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
                        {items.map((notif) => {
                          const Icon = getIcon(notif.type)
                          return (
                            <MasterItem
                              key={notif.id}
                              selected={currentSelectedId === notif.id}
                              unread={!notif.isRead}
                              onClick={() => setSelectedId(notif.id)}
                              className="notification-item"
                              leading={
                                <div className={`notification-icon-wrapper notif-type--${notif.type.toLowerCase()} w-11 h-11 rounded-[var(--radius-xl)] flex items-center justify-center shrink-0 transition-all duration-300 shadow-[var(--shadow-sm)] border border-border/50 ${notif.isRead ? 'opacity-60 grayscale' : 'scale-105'}`}>
                                  <Icon size={20} strokeWidth={2} className={notif.isRead ? 'text-muted' : 'text-primary'} />
                                </div>
                              }
                              title={
                                <Stack direction="row" align="center" gap="xs" className="mb-0.5">
                                  <Text size="2xs" weight="black" className="text-primary uppercase tracking-tighter opacity-80">{notif.type}</Text>
                                  <Text size="2xs" muted className="opacity-40">&bull;</Text>
                                  <Text size="2xs" weight="bold" muted className="truncate">{notif.course}</Text>
                                </Stack>
                              }
                              subtitle={
                                <Text weight={notif.isRead ? 'medium' : 'black'} size="sm" className={`truncate ${notif.isRead ? 'text-muted' : 'text-main'}`}>{notif.text}</Text>
                              }
                              meta={
                                <Text size="2xs" muted className="mt-[var(--space-2xs)] opacity-60">
                                  {formatTime(notif.date, lang)}
                                </Text>
                              }
                              trailing={
                                <div className="notification-meta flex items-center gap-sm shrink-0">
                                  {!notif.isRead && (
                                    <div className="w-2.5 h-2.5 rounded-[var(--radius-pill)] bg-primary shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.5)]" />
                                  )}
                                  <div className="notification-actions flex gap-3xs opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                    {!notif.isRead && (
                                      <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        pill
                                        icon={Check}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          markAsRead(notif.id, e)
                                        }}
                                        title={t('mark_as_read')}
                                        aria-label={t('mark_as_read')}
                                        className="bg-bg-card border border-border shadow-[var(--shadow-sm)] hover:border-primary"
                                      />
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      pill
                                      icon={view === 'active' ? Archive : Undo2}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        view === 'active' ? archiveNotification(notif.id, e) : restoreNotification(notif.id, e)
                                      }}
                                      title={view === 'active' ? t('archive') : t('restore')}
                                      aria-label={view === 'active' ? t('archive') : t('restore')}
                                      className="bg-bg-card border border-border shadow-[var(--shadow-sm)] hover:border-primary"
                                    />
                                  </div>
                                </div>
                              }
                            />
                          )
                        })}
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
    </PageLayout>
  )
}

export default Notifications

let mockNavigate: ReturnType<typeof vi.fn>
if (import.meta.vitest) {
  mockNavigate = vi.fn()
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    }
  })
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
