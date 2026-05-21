import { useNavigate } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import type { CalendarEvents, CalendarEvent } from '@/types'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

interface CalendarUpcomingWidgetProps {
  events: CalendarEvents
  currentDate: Date
  monthNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
}

export default function CalendarUpcomingWidget({
  events,
  currentDate,
  monthNames,
  t,
  handleEventClick,
}: CalendarUpcomingWidgetProps) {
  const navigate = useNavigate()
  const { lang } = useStore()
  const now = new Date()
  const isFutureMonth =
    currentDate.getFullYear() > now.getFullYear() ||
    (currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() > now.getMonth())

  const filterStartDate = isFutureMonth
    ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    : new Date(now.setHours(0, 0, 0, 0))

  const futureEvents = Object.entries(events)
    .map(([dateStr, event]) => {
      const [y, m, d_num] = dateStr.split('-').map(Number)
      return { date: new Date(y, m, d_num), dateKey: dateStr, ...event }
    })
    .filter((e) => e.date >= filterStartDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const getEventTitle = (e: CalendarEvent) => {
    return e.title || (lang === 'da' ? e.titleDa : e.titleEn) || ''
  }

  return (
    <Card elevated className="upcoming-events-widget bg-[var(--bg-card)]">
      <Card.Header className="border-b border-[var(--border-color)]">
        <Text weight="bold" size="lg" className="card__title flex items-center gap-sm">
          <Icon icon={CalendarCheck} variant="primary" size="md" />
          {t('upcoming')}
        </Text>
      </Card.Header>

      <Card.Body className="p-[var(--space-0)]">
        <Stack gap="none">
          {futureEvents.length > 0 ? (
            futureEvents.slice(0, 5).map((e, idx) => (
              <Stack
                key={idx}
                direction="row"
                align="center"
                gap="sm"
                className="upcoming-event-item p-[var(--space-md)] border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                onClick={() => handleEventClick(e, e.dateKey)}
              >
                <Stack
                  align="center"
                  justify="center"
                  className="upcoming-date-box bg-[var(--bg-body)] p-[var(--space-xs)_var(--space-sm)] rounded-[var(--radius-md)] min-w-[var(--space-2xl)] border border-[var(--border-color)] shrink-0 shadow-[var(--shadow-sm)]"
                >
                  <Text size="xs" weight="extrabold" muted className="month text-2xs leading-[1.2] uppercase tracking-tight">
                    {monthNames[e.date.getMonth()].substring(0, 3).toUpperCase()}
                  </Text>
                  <Text size="xl" weight="extrabold" className="day text-[1.4rem] leading-[1.1] text-[var(--color-primary)]">
                    {e.date.getDate()}
                  </Text>
                </Stack>
                <Stack gap="2xs" className="calendar__event-info overflow-hidden flex-1">
                  <Text size="sm" weight="semibold" className="calendar__event-title-truncated truncate text-[var(--text-main)]">
                    {getEventTitle(e)}
                  </Text>
                  <Text size="xs" muted>
                    {e.time}
                  </Text>
                  {e.location && (
                    <Text size="xs" muted className="text-[var(--color-primary)]">
                      {e.location}
                    </Text>
                  )}
                </Stack>
              </Stack>
            ))
          ) : (
            <Stack align="center" justify="center" className="calendar__empty-events p-[var(--space-xl)] text-center">
              <Text size="sm" muted>{t('no_events_short')}</Text>
            </Stack>
          )}
        </Stack>
      </Card.Body>

      <Card.Footer>
        <Button variant="primary" full onClick={() => navigate('/calendar')}>
          {t('view_all')}
        </Button>
      </Card.Footer>
    </Card>
  )
}
