import { useMemo, useCallback, memo, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Star, Hourglass, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

interface Grade {
  id: number
  course: string
  title: string
  score: string | number | null
  date: string
}

/**
 * GradeItem - Individual grade entry with refactored A11y and tokens.
 */
const GradeItem = memo(forwardRef<HTMLDivElement, { 
  grade: Grade 
}>(({ grade }, ref) => {
  const t = useStore(state => state.t)
  
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="group/item"
    >
      <StatusItem
        icon={grade.score !== null ? Star : Hourglass}
        iconColor={grade.score !== null ? 'var(--aau-light-orange)' : 'var(--text-disabled)'}
        title={grade.title}
        className="bg-transparent hover:bg-bg-hover px-[var(--space-2xs)] rounded-[var(--radius-lg)] transition-colors duration-150"
        right={
          <AnimatePresence mode="wait">
            {grade.score !== null ? (
              <motion.div
                key="score"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="recent-grades__score flex items-center justify-center w-8 h-8 bg-primary text-white rounded-[var(--radius-full)] text-[0.75rem] font-black shadow-sm group-hover/item:scale-110 transition-transform"
              >
                {grade.score}
              </motion.div>
            ) : (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Badge variant="default" pill className="text-[0.625rem] uppercase tracking-tighter h-5 px-1.5 flex items-center">
                  {t('not_graded')}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        }
      />
    </motion.div>
  )
}))

GradeItem.displayName = 'GradeItem'

/**
 * RecentGradesWidget - Performance overview and academic results.
 */
const RecentGradesWidget = ({ span, isEditing }: WidgetProps) => {
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
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Trophy size={18} strokeWidth={2} />
          </div>
          <Heading level={4} className="m-0 text-xs font-black uppercase tracking-tight text-main">
            {t('recent_grades')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size="xs"
          className="font-black uppercase tracking-widest text-primary hover:bg-bg-card/50"
          onClick={handleViewAll}
          iconRight={ChevronRight}
        >
          {t('view_all')}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        {visibleGrades.length > 0 ? (
          <div className="grid gap-[var(--space-xs)]" style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}>
            <AnimatePresence mode="popLayout">
              {visibleGrades.map((g) => (
                <GradeItem
                  key={g.id || g.title}
                  grade={g as Grade}
                />
              ))}
            </AnimatePresence>
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

      <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="xs" weight="medium" className="text-muted italic">
          {t('academic_results')}
        </Text>
        <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
          <Button 
            variant="ghost" 
            size="xs" 
            className="text-primary uppercase font-black tracking-tighter p-0 h-auto hover:bg-transparent"
            onClick={handleViewAll}
            iconRight={ChevronRight}
          >
            {t('details')}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}

RecentGradesWidget.displayName = 'RecentGradesWidget'

export default memo(RecentGradesWidget)
