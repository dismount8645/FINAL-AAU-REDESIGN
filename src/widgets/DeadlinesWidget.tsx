import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Clock } from 'lucide-react'
import { Text } from '@/components/ui/Typography'
import StatusItem from '@/components/ui/StatusItem'
import Card from '@/components/ui/Card'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'
import { dashboardDeadlines } from '@/data/dashboardWidgets'
import { getHoursUntil, hoursFromNow } from '@/utils/dates'
import { getWidgetDisplayLayout } from '@/utils/widgetLayout'

const getUrgencyColor = (deadlineDate: string): { text: string; iconColor: string } => {
  const hoursLeft = getHoursUntil(deadlineDate)
  if (hoursLeft < 0) return { text: 'text-danger', iconColor: 'var(--color-danger)' }
  if (hoursLeft < 24) return { text: 'text-danger', iconColor: 'var(--color-danger)' }
  if (hoursLeft < 72) return { text: 'text-warning', iconColor: 'var(--color-warning)' }
  return { text: 'text-primary dark:text-slate-200', iconColor: 'var(--color-primary)' }
}

export default function DeadlinesWidget({ span, isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const { t, localize } = useStore()

  const { itemsToShow, gridColumns } = useMemo(() => getWidgetDisplayLayout(span), [span])
  const visibleDeadlines = useMemo(() => (
    dashboardDeadlines.slice(0, itemsToShow).map((deadline) => {
      const deadlineDate = hoursFromNow(deadline.deadlineHoursFromNow)
      return {
        ...deadline,
        deadlineDate,
        title: localize(deadline, 'title'),
        urgency: getUrgencyColor(deadlineDate),
      }
    })
  ), [itemsToShow, localize])

  return (
    <Card className="widget-card h-full w-full flex flex-col">
      <Card.Header className="py-[var(--space-xs)] px-[var(--space-sm)]">
        <Text weight="bold" size="lg" className="card__title">{t('next_assignment')}</Text>
        <button
          type="button"
          className="widget-action text-primary dark:text-slate-200"
          onClick={() => { if (!isEditing) navigate('/calendar') }}
        >
          {t('see_all_deadlines')}<ChevronRight size={14} strokeWidth={2} />
        </button>
      </Card.Header>

      <Card.Body className="h-full w-full flex-1 p-[var(--space-xs)]">
        <div className="widget-content-grid" style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}>
          {visibleDeadlines.map((dl) => (
            <StatusItem
              key={dl.id}
              icon={Clock}
              iconColor={dl.urgency.iconColor}
              title={dl.title}
              subtitle={t(dl.dateKey)}
              subtitleClassName={dl.urgency.text}
              onClick={() => { if (!isEditing) navigate(`/submission/${dl.courseId}/${dl.id}`) }}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}
