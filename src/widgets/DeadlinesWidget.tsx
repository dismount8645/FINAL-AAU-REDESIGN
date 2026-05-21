import { useMemo, memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Clock, AlertCircle, CheckCircle2, Calendar } from 'lucide-react'
import { Text, Heading } from '@/components/ui/Typography'
import StatusItem from '@/components/ui/StatusItem'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
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
  const { t, localize } = useStore()

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
      "shadow-sm hover:shadow-md transition-all duration-300 border-border/60"
    )}>
      <Card.Header spacing="compact" className="border-b border-border/40 bg-bg-card/30 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-primary/5 rounded-lg text-primary">
            <Calendar size={18} strokeWidth={2.5} />
          </div>
          <Text weight="black" size="lg" className="tracking-tight uppercase text-xs sm:text-sm">
            {t('next_assignment')}
          </Text>
        </Stack>
        
        <button
          type="button"
          className="group/link text-[0.7rem] font-black uppercase tracking-[0.1em] text-primary hover:text-aau-blue inline-flex items-center gap-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
          onClick={handleSeeAll}
        >
          {t('see_all_deadlines')}
          <ChevronRight size={14} className="transition-transform group-hover/link:translate-x-1" />
        </button>
      </Card.Header>

      <Card.Body spacing="compact" className="p-4 flex-1">
        {deadlines.length > 0 ? (
          <div 
            className="grid gap-x-6 gap-y-2" 
            style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
          >
            {deadlines.map((dl) => (
              <div 
                key={dl.id} 
                className={cn(
                  "p-2 rounded-xl transition-all duration-200 hover:bg-muted/30 group/item cursor-pointer",
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
                  className="!px-0 !py-0 !mx-0 hover:bg-transparent"
                />
              </div>
            ))}
          </div>
        ) : (
          <Stack align="center" justify="center" gap="md" className="h-full py-8 opacity-50 italic">
            <CheckCircle2 size={40} className="text-success/40" />
            <Text size="sm">{t('all_caught_up')}</Text>
          </Stack>
        )}
      </Card.Body>
      
      {/* Visual Footer hint */}
      {deadlines.length > 0 && (
        <div className="px-6 py-3 bg-muted/5 border-t border-border/20 text-[0.65rem] text-text-muted flex items-center justify-between">
          <span className="font-medium">{deadlines.length} {t('upcoming')}</span>
          <span className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-opacity">
            {t('click_to_view')} <Clock size={10} />
          </span>
        </div>
      )}
    </Card>
  )
}

export default memo(DeadlinesWidget)

