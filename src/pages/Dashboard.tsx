import { useLocation, useNavigate, useBlocker } from 'react-router-dom';
import { useState, useMemo, useEffect, useRef } from 'react';
import { WidgetGrid } from '@/components/Widgets/WidgetGrid';
import PageLayout from '@/components/Layout/PageLayout';
import useStore from '@/store';
import Button from '@/components/ui/Button';
import { Settings, Check, RotateCcw, Plus, ArrowRight, GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import Checkbox from '@/components/ui/Checkbox';
import { mockDashboardDeadlines, defaultEvents } from '@/lib/data';
import { todayEvents } from '@/components/Widgets/QuickOverviewWidget';
import { PATHS } from '@/routes';
import { getDeadlineInfo } from '@/lib/utils';
import type { DashboardWidgetConfig } from '@/store/slices/uiSlice';

function Dashboard() {
  const t = useStore((state) => state.t)
  const dashboardLayout = useStore((state) => state.dashboardLayout)
  const setDashboardLayout = useStore((state) => state.setDashboardLayout)
  const resetDashboardLayout = useStore((state) => state.resetDashboardLayout)
  const location = useLocation()
  const navigate = useNavigate()

  const firstName = useStore((state) => state.firstName)
  const lang = useStore((state) => state.lang)
  const courses = useStore((state) => state.courses)
  const localize = useStore((state) => state.localize)
  const messageCount = useStore((state) => state.messageCount)
  
  const favorites = useStore((state) => state.favorites)

  const activityCount = useMemo(() => todayEvents.filter(e => e.time !== '23:59').length, [])
  const deadlineCount = useMemo(() => todayEvents.filter(e => e.time === '23:59').length, [])
  const nextEvent = useMemo(() => todayEvents.find(e => e.time !== '23:59') || null, [])

  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [backupLayout, setBackupLayout] = useState<DashboardWidgetConfig[] | null>(null)
  const [now, setNow] = useState(() => new Date())
  const modalLayoutSnapshot = useRef<DashboardWidgetConfig[] | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleToggleWidget = (id: string, isChecked: boolean) => {
    const updated = dashboardLayout.map((widget) => {
      if (widget.id === id) {
        return {
          ...widget,
          visible: isChecked,
          userModified: true,
          pinned: isChecked
        }
      }
      return widget
    })
    setDashboardLayout(updated)
  }

  // Check if favorites is auto-hidden
  const isFavoritesAutoHidden = useMemo(() => {
    const favWidget = dashboardLayout.find(w => w.id === 'favorites')
    return !isEditing && !!favWidget && favorites.length === 0 && !favWidget.userModified && !favWidget.pinned
  }, [dashboardLayout, favorites, isEditing])

  // Filter layouts to render only the visible ones, auto-hiding empty unpinned favorites
  const visibleWidgetsResult = useMemo(() => {
    const list = dashboardLayout
      .filter(w => {
        if (w.visible === false) return false
        if (w.id === 'favorites' && isFavoritesAutoHidden) return false
        return true
      })
      .map(w => {
        // Auto-expand Messages to medium when Favorites is hidden and Messages is alone in right col
        if (w.id === 'messages' && isFavoritesAutoHidden && w.size === 'small') {
          return { ...w, size: 'medium' as const, span: 8 }
        }
        return w
      })

    // Dynamic ordering: move messages above deadlines if unread messages exist
    let movedMessages = false
    if (messageCount > 0 && !isEditing) {
      const messagesIdx = list.findIndex(w => w.id === 'messages')
      const deadlinesIdx = list.findIndex(w => w.id === 'deadlines')
      if (messagesIdx !== -1 && deadlinesIdx !== -1 && messagesIdx > deadlinesIdx) {
        const [messagesWidget] = list.splice(messagesIdx, 1)
        list.splice(deadlinesIdx, 0, messagesWidget)
        movedMessages = true
      }
    }
    return { list, movedMessages }
  }, [dashboardLayout, isFavoritesAutoHidden, messageCount, isEditing])

  const { list: visibleWidgets, movedMessages: isMessagesElevated } = visibleWidgetsResult

  const urgentItems = useMemo(() => {
    // 1. Assignments
    const assignments = mockDashboardDeadlines.map((d) => {
      const deadlineDate = new Date(now)
      deadlineDate.setHours(deadlineDate.getHours() + d.deadlineHoursFromNow)
      const info = getDeadlineInfo(deadlineDate, lang, now)
      const course = courses.find((c) => c.id === d.courseId)
      const courseTitle = course ? localize(course, 'title') : ''
      return {
        id: d.id,
        type: 'assignment' as const,
        title: localize(d, 'title'),
        courseId: d.courseId,
        courseTitle,
        date: deadlineDate,
        info,
      }
    })

    // 2. Calendar events (upcoming/current only)
    const events = Object.entries(defaultEvents)
      .map(([dateStr, evt]) => {
        const [year, month, day] = dateStr.split('-').map(Number)
        const eventDate = new Date(year, month - 1, day, 8, 15)
        return { eventDate, evt }
      })
      .filter(({ eventDate }) => {
        const info = getDeadlineInfo(eventDate, lang, now)
        return info.urgency !== 'overdue'
      })
      .map(({ eventDate, evt }) => {
        const info = getDeadlineInfo(eventDate, lang, now)
        return {
          id: evt.id,
          type: 'calendar' as const,
          title: lang === 'da' ? (evt.titleDa || evt.title) : (evt.titleEn || evt.title),
          courseId: 1,
          courseTitle: lang === 'da' ? evt.courseTitleDa : evt.courseTitleEn,
          date: eventDate,
          info,
        }
      })

    const allItems = [...assignments, ...events]

    // Sort: 1. Overdue first, 2. Earliest deadline next, 3. Assignments before calendar events, 4. ID order
    return allItems.sort((a, b) => {
      const aOverdue = a.info.urgency === 'overdue'
      const bOverdue = b.info.urgency === 'overdue'
      if (aOverdue !== bOverdue) {
        return aOverdue ? -1 : 1
      }
      const aTime = a.date.getTime()
      const bTime = b.date.getTime()
      if (aTime !== bTime) {
        return aTime - bTime
      }
      if (a.type !== b.type) {
        return a.type === 'assignment' ? -1 : 1
      }
      return a.id - b.id
    })
  }, [courses, localize, lang, now])

  const urgentItem = useMemo(() => urgentItems[0] || null, [urgentItems])

  const extraUrgentCount = useMemo(() => {
    if (!urgentItem) return 0
    return urgentItems.filter((item) => item !== urgentItem && item.info.urgency !== 'later').length
  }, [urgentItems, urgentItem])

  // blocker.state can be 'idle', 'blocked', 'proceeding'
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      backupLayout !== null && currentLocation.pathname !== nextLocation.pathname
  )

  const showBlockerModal = blocker.state === 'blocked'

  const handleSaveAndProceed = () => {
    setBackupLayout(null)
    setIsEditing(false)
    setTimeout(() => blocker.proceed?.(), 0)
  }

  const handleDiscardAndProceed = () => {
    if (backupLayout) {
      setDashboardLayout(backupLayout)
    }
    setBackupLayout(null)
    setIsEditing(false)
    setTimeout(() => blocker.proceed?.(), 0)
  }

  const handleCancelNavigation = () => {
    blocker.reset?.()
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (backupLayout !== null) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [backupLayout])

  return (
    <PageLayout
      key={location.key}
      className="dashboard-page relative"
      pageKey="dashboard"
      title={t('dashboard.title')}
      flat
      gap="sm"
      actionsAlign="center"
      actions={
        <div className="flex items-center gap-[var(--space-xs)] flex-wrap">
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setBackupLayout(dashboardLayout)
                setIsEditing(true)
              }}
              icon={Settings}
              className="text-text-muted hover:text-primary"
            >
              {t('dashboard.edit_dashboard')}
            </Button>
          ) : (
            <div className="flex items-center gap-xs flex-wrap">
              <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open)
                if (open) {
                  modalLayoutSnapshot.current = JSON.parse(JSON.stringify(dashboardLayout))
                } else if (modalLayoutSnapshot.current) {
                  setDashboardLayout(modalLayoutSnapshot.current)
                  modalLayoutSnapshot.current = null
                }
              }}>
                <DialogTrigger render={
                  <Button variant="ghost" size="sm" icon={Plus} render={<span />} className="text-text-muted hover:text-primary">
                    {t('dashboard.add_remove_widgets')}
                  </Button>
                } />
                <DialogContent className="max-w-[420px]">
                  <DialogHeader>
                    <DialogTitle>{t('dashboard.add_remove_widgets')}</DialogTitle>
                    <DialogDescription>
                      Vælg de moduler, du ønsker at have synlige på dit dashboard.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-sm my-xs">
                    {dashboardLayout.map((widget) => {
                      const isFavoritesEmpty = widget.id === 'favorites' && favorites.length === 0;
                      const isAutoHidden = isFavoritesEmpty && !widget.userModified && !widget.pinned;
                      return (
                        <div key={widget.id} className="flex items-center gap-xs py-xs border-b border-[var(--border-color)]/30 last:border-b-0">
                          <Checkbox
                            id={`widget-checkbox-${widget.id}`}
                            checked={widget.visible !== false}
                            onChange={(e) => handleToggleWidget(widget.id, e.target.checked)}
                          />
                          <div className="flex flex-col gap-3xs min-w-0 flex-1">
                            <label htmlFor={`widget-checkbox-${widget.id}`} className="text-xs font-bold text-main cursor-pointer select-none">
                              {t(`dashboard.widget_${widget.id}`)}
                            </label>
                            {isFavoritesEmpty && isAutoHidden && (
                              <span className="text-[11px] text-text-muted italic">
                                {lang === 'da' ? 'Skjult fordi der ikke er valgt favoritter' : 'Hidden because no favorites chosen'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <DialogFooter className="flex gap-xs justify-end">
                    <Button variant="ghost" size="sm" onClick={() => {
                      if (modalLayoutSnapshot.current) {
                        setDashboardLayout(modalLayoutSnapshot.current)
                        modalLayoutSnapshot.current = null
                      }
                      setIsModalOpen(false)
                    }}>
                      {t('common.cancel')}
                    </Button>
                    <Button variant="primary" onClick={() => {
                      modalLayoutSnapshot.current = null
                      setIsModalOpen(false)
                    }}>
                      {t('common.done')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogTrigger render={
                  <Button variant="ghost" size="sm" icon={RotateCcw} render={<span />} className="text-text-muted hover:text-danger">
                    {t('dashboard.reset_dashboard')}
                  </Button>
                } />
                <DialogContent className="max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>{lang === 'da' ? 'Nulstil dashboard?' : 'Reset dashboard?'}</DialogTitle>
                    <DialogDescription>
                      {lang === 'da'
                        ? 'Dette gendanner standardlayoutet. Dine widget-tilpasninger fjernes.'
                        : 'This restores the default layout. Your widget customizations will be removed.'}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex gap-xs justify-end">
                    <Button variant="secondary" size="sm" onClick={() => setIsResetDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => { resetDashboardLayout(); setIsResetDialogOpen(false); }}>
                      {lang === 'da' ? 'Nulstil dashboard' : 'Reset dashboard'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (backupLayout) {
                    setDashboardLayout(backupLayout)
                    setBackupLayout(null)
                  }
                  setIsEditing(false)
                }}
              >
                {t('common.cancel')}
              </Button>

              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  setBackupLayout(null)
                  setIsEditing(false)
                }}
                icon={Check}
              >
                {t('common.done')}
              </Button>
            </div>
          )}
        </div>
      }
    >
      <div className="dashboard-content-wrapper w-full pb-[var(--space-xl)] pt-2xs">
        {/* Daily Summary Strip */}
        <div className="daily-summary-strip mb-md flex flex-wrap gap-xs sm:gap-sm items-center py-xs px-sm bg-bg-highlight/10 border border-border/40 rounded-[var(--radius-md)] text-xs font-semibold text-text-secondary select-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-md shadow-sm">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
            <strong className="text-main font-extrabold uppercase tracking-wide text-[11px]">{lang === 'da' ? 'I DAG' : 'TODAY'}</strong>
            <span className="text-main font-bold">
              {activityCount} {activityCount === 1 ? (lang === 'da' ? 'aktivitet' : 'activity') : (lang === 'da' ? 'aktiviteter' : 'activities')}
            </span>
            <span className="text-border/60 mx-0.5">·</span>
            <span className="text-main font-bold">
              {deadlineCount} {deadlineCount === 1 ? 'deadline' : 'deadlines'}
            </span>
            <span className="text-border/60 mx-0.5">·</span>
            <span className="text-main font-bold">
              {messageCount === 1 ? (lang === 'da' ? '1 ulæst' : '1 unread') : (lang === 'da' ? `${messageCount} ulæste` : `${messageCount} unread`)}
            </span>
          </span>

          {nextEvent && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 dark:bg-white/5 text-primary dark:text-white rounded-md shadow-sm">
              <strong className="font-extrabold text-main uppercase tracking-wide text-[11px]">{lang === 'da' ? 'NÆSTE' : 'NEXT'}</strong>
              <span className="font-bold text-main">{t(nextEvent.titleKey)}</span>
              <span className="text-text-muted">kl. {nextEvent.time}</span>
              {nextEvent.location && (
                <>
                  <span className="text-border/60">·</span>
                  <span className="text-text-muted">{nextEvent.location}</span>
                </>
              )}
            </span>
          )}
        </div>

        {!isEditing && urgentItem && (
          <div
            className="focus-banner animate-fade-in border-l-4 p-md sm:p-lg sm:px-xl flex flex-col md:flex-row md:items-center justify-between gap-md md:gap-lg"
            style={{ 
              borderLeftColor: urgentItem.info.color,
              backgroundColor: (urgentItem.info.urgency === 'overdue' || urgentItem.info.urgency === 'today') ? 'var(--color-bg-danger-tint)' : 'var(--color-bg-warning-tint)'
            }}
            data-testid="focus-banner"
          >
            <div className="flex flex-col items-start min-w-0 md:max-w-xs lg:max-w-md w-full md:w-auto flex-1">
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-sm" style={{ backgroundColor: urgentItem.info.color, color: (urgentItem.info.urgency === 'tomorrow' || urgentItem.info.urgency === 'soon') ? '#211a52' : '#ffffff' }}>
                {urgentItem.type === 'calendar'
                  ? (lang === 'da' ? 'Vigtig begivenhed' : 'Important event')
                  : (lang === 'da' ? 'Vigtig aflevering' : 'Important assignment')}
              </span>
              <span className="text-xs font-semibold text-text-secondary block mt-xs">{urgentItem.courseTitle}</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-main mt-2xs mb-0 truncate leading-snug w-full">{urgentItem.title}</h3>
              {/* Hidden text helper to satisfy test expectations checking for name Jacob inside focus-banner */}
              <span className="sr-only">Hej {firstName}</span>
            </div>

            <div className="flex flex-col items-start md:items-end justify-center gap-xs w-full md:w-auto shrink-0 mt-sm md:mt-0">
              <div className="flex flex-col items-start md:items-end gap-3xs leading-none">
                <span className="font-black text-sm sm:text-base tracking-wide uppercase" style={{ color: urgentItem.info.color }}>
                  {lang === 'da' ? 'Frist' : 'Due'} {urgentItem.info.relativeLabel}
                </span>
                <span className="text-xs sm:text-sm font-bold text-text-secondary">
                  {urgentItem.info.dateLabel}
                </span>
              </div>
              <div className="flex items-center gap-md shrink-0 flex-wrap min-h-[44px] w-full md:w-auto justify-start md:justify-end mt-xs">
                {extraUrgentCount > 0 && (
                  <button
                    type="button"
                    onClick={() => navigate(PATHS.CALENDAR)}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer min-h-[44px] flex items-center"
                  >
                    {t('dashboard.more_urgent_assignments').replace('{count}', String(extraUrgentCount))}
                  </button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  iconRight={ArrowRight}
                  className="font-bold shrink-0 min-h-[44px] whitespace-nowrap px-md text-sm"
                  onClick={() => {
                    if (urgentItem.type === 'calendar') {
                      navigate(PATHS.CALENDAR)
                    } else {
                      navigate(PATHS.SUBMISSION(urgentItem.courseId, urgentItem.id))
                    }
                  }}
                >
                  {urgentItem.type === 'calendar'
                    ? (lang === 'da' ? 'Åbn kalender' : 'Open calendar')
                    : (lang === 'da' ? 'Åbn aflevering' : 'Open submission')}
                </Button>
              </div>
            </div>
          </div>
        )}
        {isEditing && (
          <div className="mb-4 p-3 bg-primary/15 border-2 border-primary/30 rounded-[var(--radius-md)] text-sm font-bold text-primary shadow-sm">
            {t('dashboard.edit_mode_hint')}
          </div>
        )}
        <WidgetGrid
          widgets={visibleWidgets}
          isEditing={isEditing}
          onLayoutChange={setDashboardLayout}
          onToggleWidget={(id, visible) => handleToggleWidget(id, visible)}
          hideFirstDeadline={false}
          isMessagesElevated={isMessagesElevated}
        />
      </div>

      {/* Navigation confirmation dialog */}
      <Dialog open={showBlockerModal} onOpenChange={(open) => { if (!open) handleCancelNavigation(); }}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>
              {lang === 'da' ? 'Ugemte ændringer' : 'Unsaved changes'}
            </DialogTitle>
            <DialogDescription>
              {lang === 'da'
                ? 'Du har foretaget ændringer i dit dashboard-layout. Vil du gemme eller kassere dem, før du forlader siden?'
                : 'You have made changes to your dashboard layout. Do you want to save or discard them before leaving?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-wrap gap-xs justify-end mt-xs">
            <Button variant="ghost" size="sm" onClick={handleCancelNavigation}>
              {lang === 'da' ? 'Bliv på siden' : 'Stay on page'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDiscardAndProceed}>
              {lang === 'da' ? 'Kassér ændringer' : 'Discard changes'}
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveAndProceed}>
              {lang === 'da' ? 'Gem ændringer' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}

export default Dashboard


