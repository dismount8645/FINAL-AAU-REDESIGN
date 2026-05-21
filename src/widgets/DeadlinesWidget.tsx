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

const getUrgencyConfig = (deadlineDate: string): { level: UrgencyLevel, color: string, icon: any, labelClass: string } => {
  const hoursLeft = getHoursUntil(deadlineDate)
  
  if (hoursLeft < 0) return { 
    level: 'overdue', 
    color: 'var(--color-danger)', 
    icon: AlertCircle,
    labelClass: 'text-danger font-black uppercase tracking-tighter' 
  }
  if (hoursLeft < 24) return { 
    level: 'critical', 
    color: 'var(--color-danger)', 
    icon: Clock,
    labelClass: 'text-danger font-bold' 
  }
  if (hoursLeft < 72) return { 
    level: 'soon', 
    color: 'var(--color-warning)', 
    icon: Clock,
    labelClass: 'text-warning font-semibold' 
  }
  return { 
    level: 'normal', 
    color: 'var(--color-primary)', 
    icon: CheckCircle2,
    labelClass: 'text-primary dark:text-slate-200' 
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
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-[var(--bg-highlight)]/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-[var(--aau-blue)] text-white rounded-[var(--radius-md)] shadow-sm">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={4} className="m-0 text-sm font-bold text-[var(--text-main)]">
            {t('next_assignment')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-[0.65rem] font-black uppercase tracking-widest text-[var(--aau-blue)]"
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
                  "p-1 rounded-[var(--radius-lg)] transition-all duration-200 hover:bg-[var(--bg-hover)] group/item cursor-pointer",
                  dl.urgency.level === 'overdue' && "bg-[var(--aau-dark-pink)]/5 hover:bg-[var(--aau-dark-pink)]/10"
                )}
                onClick={() => handleDeadlineClick(dl)}
              >
                <StatusItem
                  icon={dl.urgency.icon}
                  iconColor={dl.urgency.color}
                  title={dl.title}
                  subtitle={t(dl.dateKey)}
                  subtitleClassName={cn(dl.urgency.labelClass, "text-xs mt-0.5")}
                  className="bg-transparent hover:bg-transparent px-2"
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
        <Card.Footer padding="compact" className="bg-[var(--bg-highlight)]/30 border-t border-[var(--border-color)]/20 justify-between items-center">
          <Text size="xs" weight="medium" className="text-[var(--text-muted)] italic">
            {deadlines.length} {t('upcoming')}
          </Text>
          <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-500 translate-x-2 group-hover/widget:translate-x-0">
            <Text size="xs" weight="bold" className="text-[var(--aau-blue)] uppercase tracking-tighter">{t('click_to_view')}</Text>
            <Clock size={10} strokeWidth={2.5} className="text-[var(--aau-blue)]" />
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}

export default memo(DeadlinesWidget)

