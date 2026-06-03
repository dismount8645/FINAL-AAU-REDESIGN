import { useNavigate } from 'react-router-dom'
import { ChevronRight, Calendar, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, memo, forwardRef } from 'react'

import { Text, Heading } from '@/components/Typography'
import Card from '@/components/Card'
import Stack from '@/components/Stack'
import Button from '@/components/Button'
import type { WidgetProps } from '@/lib/types'
import useStore from '@/lib/store'
import { cn } from '@/lib/utils'

interface OverviewEvent {
  time: string
  titleKey: string
}

const todayEvents: OverviewEvent[] = [
  { time: '08:15', titleKey: 'lecture' },
  { time: '23:59', titleKey: 'project_report' },
]

/**
 * OverviewItem - Individual schedule entry with refactored A11y and tokens.
 */
const OverviewItem = memo(forwardRef<HTMLButtonElement, { 
  event: OverviewEvent,
  isLast: boolean,
  onClick: () => void 
}>(({ event, isLast, onClick }, ref) => {
  const t = useStore(state => state.t)
  const [hours, minutes] = event.time.split(':')
  
  return (
    <motion.button
      ref={ref}
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      type="button"
      className={cn(
        "w-full text-left flex items-center justify-start gap-[var(--space-md)] py-[var(--space-sm)] px-[var(--space-sm)] rounded-[var(--radius-lg)] transition-all duration-150",
        "hover:bg-bg-highlight/50 border border-transparent hover:border-[var(--border-color)]/40 group/item outline-none",
        "focus-visible:outline-none focus-visible:shadow-focus",
        !isLast && 'border-b-[var(--border-color)]/20'
      )}
      onClick={onClick}
    >
      <div className="flex flex-row items-center justify-center gap-[2px] min-w-[56px] py-[var(--space-2xs)] bg-bg-highlight rounded-[var(--radius-md)] border border-[var(--border-color)]/40 group-hover/item:border-primary/30 transition-colors">
        <Text size="xs" weight="black" className="text-primary leading-none">{hours}</Text>
        <span className="text-primary text-xs font-black leading-none">:</span>
        <Text size="xs" weight="bold" className="text-muted leading-none opacity-60 font-mono">{minutes}</Text>
      </div>
      <Text size="sm" weight="bold" className="text-main group-hover/item:text-primary transition-colors truncate">
        {t(event.titleKey)}
      </Text>
    </motion.button>
  )
}))

OverviewItem.displayName = 'OverviewItem'

/**
 * QuickOverviewWidget - Real-time schedule and upcoming agenda.
 */
const QuickOverviewWidget = ({ span, isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)

  const handleGoToCalendar = useCallback(() => {
    if (!isEditing) navigate('/calendar')
  }, [isEditing, navigate])

  return (
    <Card className={cn(
      "quick-overview-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('common.quick_overview')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size={span && span > 4 ? "xs" : "icon-xs"}
          className="font-black uppercase tracking-widest text-primary hover:bg-bg-card/50"
          onClick={handleGoToCalendar}
          iconRight={ChevronRight}
          aria-label={t('calendar')}
        >
          {span && span > 4 ? t('calendar') : ''}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        <div className="h-full w-full flex flex-col gap-[var(--space-xs)]">
          <Text size="xs" weight="bold" className="text-text-muted uppercase tracking-wider mb-[2px]">
            {t('todays_schedule')}
          </Text>
          <AnimatePresence mode="popLayout">
            {todayEvents.map((event, index) => (
              <OverviewItem
                key={event.titleKey}
                event={event}
                isLast={index === todayEvents.length - 1}
                onClick={handleGoToCalendar}
              />
            ))}
          </AnimatePresence>
        </div>
      </Card.Body>

      <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-end items-center">
        <div className="flex items-center gap-[var(--space-xs)] opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-[var(--space-sm)] group-hover/widget:translate-x-0">
          <Button 
            variant="ghost" 
            size="xs" 
            className="text-primary uppercase font-black tracking-tighter p-0 h-auto hover:bg-transparent"
            onClick={handleGoToCalendar}
            iconRight={Clock}
          >
            {t('open')}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default memo(QuickOverviewWidget)

