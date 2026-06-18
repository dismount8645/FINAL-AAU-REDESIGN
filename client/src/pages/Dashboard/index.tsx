import { useLocation, useNavigate, useBlocker } from 'react-router-dom';
import { useState, useMemo, useEffect, useRef } from 'react';
import { WidgetGrid } from '@/components/Widgets/WidgetGrid';
import PageLayout from '@/components/Layout/PageLayout';
import useStore from '@/store';
import { mockDashboardDeadlines, defaultEvents } from '@/lib/data';
import { todayEvents } from '@/components/Widgets/QuickOverviewWidget';
import { PATHS } from '@/routes';
import { getDeadlineInfo } from '@/lib/utils';
import type { DashboardWidgetConfig } from '@/store/slices/uiSlice';
import DailySummaryStrip from './DailySummaryStrip';
import FocusBanner from './FocusBanner';
import EditModeIndicator from './EditModeIndicator';
import DashboardHeader from './DashboardHeader';
import NavigationBlockerDialog from './NavigationBlockerDialog';

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

  const isFavoritesAutoHidden = false

  const visibleWidgetsResult = useMemo(() => {
    const list = dashboardLayout
      .filter(w => {
        if (w.visible === false) return false
        if (w.id === 'favorites' && isFavoritesAutoHidden) return false
        return true
      })
      .map(w => {
        if (w.id === 'messages' && isFavoritesAutoHidden && w.size === 'small') {
          return { ...w, size: 'medium' as const, span: 8 }
        }
        return w
      })

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
          title: lang === 'da' ? (evt.titleDa || evt.title || '') : (evt.titleEn || evt.title || ''),
          courseId: 1,
          courseTitle: lang === 'da' ? (evt.courseTitleDa || '') : (evt.courseTitleEn || ''),
          date: eventDate,
          info,
        }
      })

    const allItems = [...assignments, ...events]

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

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      backupLayout !== null && currentLocation.pathname !== nextLocation.pathname
  )

  const showBlockerModal = blocker.state === 'blocked'

  const handleNavigate = (target: { type: 'calendar' | 'submission'; courseId?: number; submissionId?: number }) => {
    if (target.type === 'calendar') {
      navigate(PATHS.CALENDAR)
    } else {
      navigate(PATHS.SUBMISSION(target.courseId!, target.submissionId!))
    }
  }

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

  const handleEdit = () => {
    setBackupLayout(dashboardLayout)
    setIsEditing(true)
  }

  const handleSave = () => {
    setBackupLayout(null)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    if (backupLayout) {
      setDashboardLayout(backupLayout)
      setBackupLayout(null)
    }
    setIsEditing(false)
  }

  const handleReset = () => {
    resetDashboardLayout()
  }

  const handleOpenWidgetsModal = () => {
    modalLayoutSnapshot.current = JSON.parse(JSON.stringify(dashboardLayout))
    setIsModalOpen(true)
  }

  const handleDismissWidgetsModal = () => {
    if (modalLayoutSnapshot.current) {
      setDashboardLayout(modalLayoutSnapshot.current)
      modalLayoutSnapshot.current = null
    }
    setIsModalOpen(false)
  }

  const handleDoneWidgetsModal = () => {
    modalLayoutSnapshot.current = null
    setIsModalOpen(false)
  }

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
        <DashboardHeader
          isEditing={isEditing}
          isModalOpen={isModalOpen}
          isResetDialogOpen={isResetDialogOpen}
          dashboardLayout={dashboardLayout}
          favorites={favorites}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancelEdit={handleCancelEdit}
          onReset={handleReset}
          onOpenWidgetsModal={handleOpenWidgetsModal}
          onDismissWidgetsModal={handleDismissWidgetsModal}
            onDoneWidgetsModal={handleDoneWidgetsModal}
            onResetDialogChange={setIsResetDialogOpen}
            onToggleWidget={handleToggleWidget}
          t={t}
          lang={lang}
        />
      }
    >
      <div className="dashboard-content-wrapper w-full pb-[var(--space-xl)] pt-2xs">
        <DailySummaryStrip
          activityCount={activityCount}
          deadlineCount={deadlineCount}
          messageCount={messageCount}
          nextEvent={nextEvent}
          t={t}
          lang={lang}
        />

        {!isEditing && urgentItem && (
          <FocusBanner
            urgentItem={urgentItem}
            extraUrgentCount={extraUrgentCount}
            firstName={firstName}
            onNavigate={handleNavigate}
            t={t}
            lang={lang}
          />
        )}

        {isEditing && (
          <EditModeIndicator lang={lang} />
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

      <NavigationBlockerDialog
        open={showBlockerModal}
        onSaveAndProceed={handleSaveAndProceed}
        onDiscardAndProceed={handleDiscardAndProceed}
        onCancelNavigation={handleCancelNavigation}
        lang={lang}
      />
    </PageLayout>
  )
}

export default Dashboard
