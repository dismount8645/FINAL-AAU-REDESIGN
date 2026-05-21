import { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Star, Hourglass, Trophy } from 'lucide-react'
import StatusItem from '@/components/ui/StatusItem'
import Stack from '@/components/ui/Stack'
import { Text, Heading } from '@/components/ui/Typography'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'
import { dashboardGrades } from '@/data/dashboardWidgets'
import { getWidgetDisplayLayout } from '@/utils/widgetLayout'
import { cn } from '@/lib/utils'

export default function RecentGradesWidget({ span, isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  const { itemsToShow, gridColumns } = useMemo(() => getWidgetDisplayLayout(span, 3, 2), [span])
  const visibleGrades = useMemo(() => (
    dashboardGrades.slice(0, itemsToShow).map((grade) => ({
      ...grade,
      title: localize(grade, 'course'),
    }))
  ), [itemsToShow, localize])

  const handleViewAll = useCallback(() => {
    if (!isEditing) navigate('/grades')
  }, [isEditing, navigate])

  return (
    <Card className={cn(
      "recent-grades-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-[var(--bg-highlight)]/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-[var(--aau-blue)] text-white rounded-[var(--radius-md)] shadow-sm">
            <Trophy size={18} strokeWidth={2} />
          </div>
          <Heading level={4} className="m-0 text-sm font-bold text-[var(--text-main)]">
            {t('recent_grades')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-[0.65rem] font-black uppercase tracking-widest text-[var(--aau-blue)]"
          onClick={handleViewAll}
          iconRight={ChevronRight}
        >
          {t('view_all')}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        {visibleGrades.length > 0 ? (
          <div className="grid gap-[var(--space-sm)]" style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}>
            {visibleGrades.map((g) => (
              <StatusItem
                key={g.title}
                icon={g.score !== null ? Star : Hourglass}
                iconColor={g.score !== null ? 'var(--aau-light-orange)' : 'var(--text-disabled)'}
                title={g.title}
                right={
                  g.score !== null ? (
                    <Stack align="center" justify="center" className="recent-grades__score w-7 h-7 bg-[var(--aau-blue)] text-white rounded-full text-[0.75rem] font-bold shadow-sm">
                      {g.score}
                    </Stack>
                  ) : (
                    <Badge variant="default" pill className="text-[0.6rem] uppercase tracking-tighter">{t('not_graded')}</Badge>
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-[var(--space-md)]">
            <EmptyState
              icon={Trophy}
              title={t('no_recent_grades')}
              message={t('no_grades_message')}
              className="bg-transparent border-none p-0"
            />
          </div>
        )}
      </Card.Body>

      <Card.Footer padding="compact" className="bg-[var(--bg-highlight)]/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="xs" weight="medium" className="text-[var(--text-muted)] italic">
          {t('academic_results')}
        </Text>
        <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-500 translate-x-2 group-hover/widget:translate-x-0">
          <Text size="xs" weight="bold" className="text-[var(--aau-blue)] uppercase tracking-tighter">{t('details')}</Text>
          <ChevronRight size={10} strokeWidth={2.5} className="text-[var(--aau-blue)]" />
        </div>
      </Card.Footer>
    </Card>
  )
}
