import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import { useWidgetDrag } from '@/hooks/useWidgetDrag'
import { DEFAULT_WIDGETS } from '@/data/mockData'
import { Edit, Check } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import useStore from '@/store/useStore'
import { WidgetCustomizer, WidgetGrid } from './dashboard/index'

function Dashboard() {
  const { t } = useStore()
  const location = useLocation()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const {
    widgets,
    toggleVisibility,
    resizeWidget,
    resetWidgets,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    draggedItemId,
    moveWidget,
  } = useWidgetDrag(DEFAULT_WIDGETS)

  const hiddenWidgets = useMemo(
    () => DEFAULT_WIDGETS.filter((dw) => !widgets.find((w) => w.id === dw.id)?.visible),
    [widgets]
  )

  const widgetLabels = useMemo<Record<string, string>>(
    () => ({
      favorites: t('nav.favorites'),
      quickOverview: t('common.quick_overview'),
      deadlines: t('common.deadline'),
      recentGrades: t('grades.recent_grades'),
      forumActivity: t('course.forum_activity'),
    }),
    [t]
  )

  const visibleWidgets = useMemo(() => widgets.filter((w) => w.visible), [widgets])

  return (
    <Stack
      className={`dashboard-page relative ${
        isEditing
          ? "dashboard--editing before:content-[''] before:fixed before:inset-0 before:bg-[rgba(var(--aau-blue-rgb),0.03)] before:pointer-events-none before:z-[1]"
          : ''
      }`}
    >
      <PageHeader
        key={location.key}
        pageKey="dashboard"
        title={t('common.welcome')}
        subtitle={t('common.assignments_count')}
        actionsAlign="center"
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={isEditing ? Check : Edit}
            onClick={() => setIsEditing(!isEditing)}
            className="dashboard__edit-trigger transition-all duration-[var(--transition-fast)]"
          >
            {isEditing ? t('common.done') : t('dashboard.edit_dashboard')}
          </Button>
        }
      />

      <div className="w-full max-w-[var(--container-max-width)] mx-auto px-[var(--space-md)] pt-[var(--space-lg)] pb-[var(--space-2xl)]">
        {isEditing && (
          <WidgetCustomizer
            hiddenWidgets={hiddenWidgets}
            widgetLabels={widgetLabels}
            toggleVisibility={toggleVisibility}
            resetWidgets={resetWidgets}
            t={t}
          />
        )}

        <WidgetGrid
          isEditing={isEditing}
          visibleWidgets={visibleWidgets}
          draggedItemId={draggedItemId}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          toggleVisibility={toggleVisibility}
          resizeWidget={resizeWidget}
          t={t}
          moveWidget={moveWidget}
        />
      </div>
    </Stack>
  )
}

export default Dashboard

