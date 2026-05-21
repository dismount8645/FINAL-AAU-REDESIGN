import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Star, Hourglass } from 'lucide-react'
import StatusItem from '@/components/ui/StatusItem'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'
import { dashboardGrades } from '@/data/dashboardWidgets'
import { getWidgetDisplayLayout } from '@/utils/widgetLayout'

export default function RecentGradesWidget({ span, isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const { t, localize } = useStore()

  const { itemsToShow, gridColumns } = useMemo(() => getWidgetDisplayLayout(span, 3, 2), [span])
  const visibleGrades = useMemo(() => (
    dashboardGrades.slice(0, itemsToShow).map((grade) => ({
      ...grade,
      title: localize(grade, 'course'),
    }))
  ), [itemsToShow, localize])

  return (
    <Card className="widget-card h-full w-full flex flex-col">
      <Card.Header className="py-[var(--space-xs)] px-[var(--space-sm)]">
        <Text weight="bold" size="lg" className="card__title">{t('recent_grades')}</Text>
        <button
          type="button"
          className="widget-action text-primary dark:text-slate-200"
          onClick={() => !isEditing && navigate('/grades')}
        >
          {t('view_all')}<ChevronRight size={14} strokeWidth={2} />
        </button>
      </Card.Header>

      <Card.Body className="h-full w-full flex-1 p-[var(--space-xs)]">
        <div className="widget-content-grid" style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}>
          {visibleGrades.map((g) => (
            <StatusItem
              key={g.title}
              icon={g.score !== null ? Star : Hourglass}
              title={g.title}
              right={
                g.score !== null ? (
                  <Stack align="center" justify="center" className="recent-grades__score w-[24px] h-[24px] bg-primary text-white rounded-[var(--radius-pill)] text-[0.8rem] font-bold">
                    {g.score}
                  </Stack>
                ) : (
                  <Badge variant="default" className="recent-grades__badge text-[0.7rem] px-[8px] py-[2px]">{t('not_graded')}</Badge>
                )
              }
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}
