import { useCallback, memo } from 'react';

import { ChevronRight, Calendar, Clock, MapPin, AlertCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text, Heading } from '@/components/ui';
import useStore from '@/store';
import { PATHS } from '@/routes';

export interface OverviewEvent {
  time: string
  titleKey: string
  moduleKey?: string
  location?: string
}

export const todayEvents: OverviewEvent[] = [
  { time: '08:15', titleKey: 'lecture', moduleKey: 'course_1_title', location: 'Fibigerstræde 15' },
  { time: '13:00', titleKey: 'study_group', moduleKey: 'course_2_title', location: 'Kroghstræde 3' },
  { time: '23:59', titleKey: 'project_report', moduleKey: 'course_4_title' },
]

const getBadgeInfo = (event: OverviewEvent, lang: 'da' | 'en') => {
  if (event.time === '23:59') {
    return {
      text: lang === 'da' ? 'Aflevering' : 'Submission',
      badgeClass: 'bg-[var(--color-bg-danger-tint)] text-[var(--color-danger)] border-[var(--color-danger)]/30',
      Icon: AlertCircle
    }
  }
  if (event.titleKey === 'study_group') {
    return {
      text: lang === 'da' ? 'Studiegruppe' : 'Study Group',
      badgeClass: 'bg-accent/10 text-accent border-accent/20',
      Icon: Users
    }
  }
  return {
    text: lang === 'da' ? 'Undervisning' : 'Class',
    badgeClass: 'bg-primary/5 text-primary border-primary/20',
    Icon: Clock,
    iconBgClass: 'bg-[var(--color-bg-warning-tint)] text-[var(--aau-dark-orange)] border-[var(--aau-dark-orange)]/20'
  }
}

const OverviewItem = memo(({
  event,
  onClick
}: {
  event: OverviewEvent,
  onClick: () => void
}) => {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)

  const { text, badgeClass, Icon } = getBadgeInfo(event, lang)

  const title = event.titleKey === 'project_report'
    ? (lang === 'da' ? 'Projektrapport skal afleveres' : 'Submit Projektrapport')
    : t(event.titleKey)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="flex items-center gap-md p-xs border border-[var(--border-color)]/40 rounded-[var(--radius-md)] bg-bg-card hover:bg-bg-hover cursor-pointer transition-colors min-h-[52px]"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex flex-col w-[50px] shrink-0 justify-center">
        <span className="font-mono text-xs font-semibold text-muted">{event.time}</span>
      </div>

      <div className="flex flex-col gap-4xs flex-1 min-w-0">
        <div className="flex items-center gap-xs flex-wrap">
          <Text size="sm" weight="bold" className="text-main truncate">
            {title} {event.moduleKey && `· ${t(event.moduleKey)}`}
          </Text>
          <span className={`inline-flex items-center gap-xs px-1.5 py-0.5 rounded text-[10px] font-medium border ${badgeClass}`}>
            <Icon size={10} className="shrink-0" />
            {text}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-sm text-xs text-muted flex-wrap">
            <span className="flex items-center gap-4xs">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{event.location}</span>
            </span>
          </div>
        )}
      </div>
      <ChevronRight size={16} className="text-muted/60 shrink-0" />
    </div>
  )
})

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
}

const QuickOverviewWidget = ({ size: _size = 'medium' }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)

  const handleGoToCalendar = useCallback(() => {
    navigate(PATHS.CALENDAR)
  }, [navigate])

  const limit = 3

  return (
    <Card className="quick-overview-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('dashboard.widget_quickOverview')}
          </Heading>
        </Stack>
        <Button
          variant="ghost"
          size="xs"
          iconRight={ChevronRight}
          onClick={handleGoToCalendar}
          className="text-xs font-bold text-primary dark:text-white"
        >
          {lang === 'da' ? 'Se kalender' : 'See calendar'}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        <div className="w-full flex flex-col gap-[var(--space-2xs)]">
          <Text size="xs" weight="bold" className="text-text-muted uppercase tracking-wider mb-[2px]">
            {t('todays_schedule')}
          </Text>
          {todayEvents.slice(0, limit).map((event) => (
            <OverviewItem
              key={event.titleKey}
              event={event}
              onClick={handleGoToCalendar}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

export default memo(QuickOverviewWidget)
