import { useNavigate } from 'react-router-dom'
import { ChevronRight, Calendar, Clock } from 'lucide-react'
import { useCallback, memo } from 'react'

import { Text, Heading } from '@/components/ui/Typography'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'
import { cn } from '@/lib/utils'

const todayEvents = [
  { time: '08:15', titleKey: 'lecture' },
  { time: '23:59', titleKey: 'project_report' },
]

const QuickOverviewWidget = ({ isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)

  const handleGoToCalendar = useCallback(() => {
    if (!isEditing) navigate('/calendar')
  }, [isEditing, navigate])

  return (
    <Card className={cn(
      "quick-overview-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-[var(--bg-highlight)]/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-[var(--aau-blue)] text-white rounded-[var(--radius-md)] shadow-sm">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={4} className="m-0 text-sm font-bold text-[var(--text-main)]">
            {t('quick_overview')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-[0.65rem] font-black uppercase tracking-widest text-[var(--aau-blue)]"
          onClick={handleGoToCalendar}
          iconRight={ChevronRight}
        >
          {t('calendar')}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        <div className="h-full w-full flex flex-col gap-[var(--space-xs)]">
          {todayEvents.map((event, index) => (
            <div
              key={event.titleKey}
              className={cn(
                "flex items-center justify-start gap-[var(--space-md)] py-[var(--space-sm)] px-[var(--space-sm)] rounded-[var(--radius-lg)] transition-colors",
                "hover:bg-[var(--bg-highlight)]/50 border border-transparent hover:border-[var(--border-color)]/40",
                index < todayEvents.length - 1 ? 'border-b-[var(--border-color)]/20' : ''
              )}
            >
              <div className="flex flex-col items-center justify-center min-w-[50px] py-1 bg-[var(--bg-highlight)] rounded-[var(--radius-md)] border border-[var(--border-color)]/40">
                <Text size="xs" weight="black" className="text-[var(--aau-blue)] leading-none">{event.time.split(':')[0]}</Text>
                <Text size="2xs" weight="bold" className="text-[var(--text-muted)] leading-none mt-1">{event.time.split(':')[1]}</Text>
              </div>
              <Text size="sm" weight="bold" className="text-[var(--text-main)] truncate">{t(event.titleKey)}</Text>
            </div>
          ))}
        </div>
      </Card.Body>

      <Card.Footer padding="compact" className="bg-[var(--bg-highlight)]/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="xs" weight="medium" className="text-[var(--text-muted)] italic">
          {t('todays_schedule')}
        </Text>
        <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-500 translate-x-2 group-hover/widget:translate-x-0">
          <Text size="xs" weight="bold" className="text-[var(--aau-blue)] uppercase tracking-tighter">{t('open')}</Text>
          <Clock size={10} strokeWidth={2.5} className="text-[var(--aau-blue)]" />
        </div>
      </Card.Footer>
    </Card>
  )
}

export default memo(QuickOverviewWidget)

