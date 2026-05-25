import { useMemo, memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Clock, AlertCircle, CheckCircle2, Calendar } from 'lucide-react'
import { Text, Heading } from '@/components/ui/Typography'
import StatusItem from '@/components/ui/StatusItem'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'
import { dashboardDeadlines } from '@/data/dashboardWidgets'
import { getHoursUntil, hoursFromNow } from '@/utils/dates'
import { getWidgetDisplayLayout } from '@/utils/widgetLayout'
import { cn } from '@/lib/utils'

// --- Helpers & Constants ---

type UrgencyLevel = 'overdue' | 'critical' | 'soon' | 'normal'

interface UrgencyConfig {
  level: UrgencyLevel
  color: string
  icon: typeof AlertCircle
  labelClass: string
}

const getUrgencyConfig = (deadlineDate: string): UrgencyConfig => {
  const hoursLeft = getHoursUntil(deadlineDate)
  
  if (hoursLeft < 0) return { 
    level: 'overdue', 
    color: 'var(--color-aau-dark-pink)', 
    icon: AlertCircle,
    labelClass: 'text-danger font-black uppercase tracking-tighter' 
  }
  if (hoursLeft < 24) return { 
    level: 'critical', 
    color: 'var(--color-aau-dark-pink)', 
    icon: Clock,
    labelClass: 'text-danger font-bold' 
  }
  if (hoursLeft < 72) return { 
    level: 'soon', 
    color: 'var(--color-aau-dark-orange)', 
    icon: Clock,
    labelClass: 'text-warning font-semibold' 
  }
  return { 
    level: 'normal', 
    color: 'var(--color-text-main)', 
    icon: CheckCircle2,
    labelClass: 'text-primary dark:text-main' 
  }
}

// --- Main Component ---

const DeadlinesWidget = ({ span, isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  const { itemsToShow, gridColumns } = useMemo(() => getWidgetDisplayLayout(span), [span])
  
  const deadlines = useMemo(() => (
    dashboardDeadlines.slice(0, itemsToShow).map((deadline) => {
      const deadlineDate = hoursFromNow(deadline.deadlineHoursFromNow)
      return {
        ...deadline,
        deadlineDate,
        title: localize(deadline, 'title'),
        urgency: getUrgencyConfig(deadlineDate),
      }
    })
  ), [itemsToShow, localize])

  const handleSeeAll = useCallback(() => {
    if (!isEditing) navigate('/calendar')
  }, [isEditing, navigate])

  const handleDeadlineClick = useCallback((dl: typeof deadlines[0]) => {
    if (!isEditing) navigate(`/submission/${dl.courseId}/${dl.id}`)
  }, [isEditing, navigate])

  return (
    <Card className={cn(
      "deadlines-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={4} className="m-0 text-sm font-bold text-main">
            {t('next_assignment')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size="xs"
          className="font-black uppercase tracking-widest text-primary dark:text-white hover:bg-bg-card/50"
          onClick={handleSeeAll}
          iconRight={ChevronRight}
        >
          {t('see_all_deadlines')}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        {deadlines.length > 0 ? (
          <div 
            className="grid gap-x-[var(--space-lg)] gap-y-[var(--space-xs)]" 
            style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
          >
            {deadlines.map((dl) => (
              <div 
                key={dl.id} 
                className={cn(
                  "p-[var(--space-2xs)] rounded-[var(--radius-lg)] transition-all duration-150 hover:bg-bg-hover group/item cursor-pointer",
                  dl.urgency.level === 'overdue' && "bg-danger/5 hover:bg-danger/10"
                )}
                onClick={() => handleDeadlineClick(dl)}
              >
                <StatusItem
                  icon={dl.urgency.icon}
                  iconColor={dl.urgency.color}
                  title={dl.title}
                  subtitle={t(dl.dateKey)}
                  subtitleClassName={cn(dl.urgency.labelClass, "text-xs mt-0.5")}
                  className="bg-transparent hover:bg-transparent px-[var(--space-2xs)]"
                />
              </div>
            ))}
          </div>
        ) : (
          <Stack align="center" justify="center" gap="md" className="h-full py-[var(--space-xl)] opacity-50 italic">
            <CheckCircle2 size={40} className="text-[var(--aau-dark-green)]/40" />
            <Text size="sm">{t('all_caught_up')}</Text>
          </Stack>
        )}
      </Card.Body>
      
      {/* Aesthetic Footer hint */}
      {deadlines.length > 0 && (
        <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center">
          <Text size="xs" weight="medium" className="text-muted italic">
            {deadlines.length} {t('upcoming')}
          </Text>
          <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
            <Text size="xs" weight="bold" className="text-primary dark:text-white uppercase tracking-tighter">{t('click_to_view')}</Text>
            <Clock size={10} strokeWidth={2.5} className="text-primary dark:text-white" />
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}

export default memo(DeadlinesWidget)

