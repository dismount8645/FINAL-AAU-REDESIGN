import type { CalendarEvents, CalendarEvent } from '@/types'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Badge from '@/components/ui/Badge'
import { Heading, Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

interface CalendarDayViewProps {
  currentDate: Date
  events: CalendarEvents
  dayNames: string[]
  monthNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
}

export default function CalendarDayView({
  currentDate,
  events,
  dayNames,
  monthNames,
  t,
  handleEventClick,
}: CalendarDayViewProps) {
  const { lang } = useStore()
  const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`
  const event = events[dateKey]

  const getEventTitle = (e: CalendarEvent) => {
    return e.title || (lang === 'da' ? e.titleDa : e.titleEn) || ''
  }

  const dayContent = event ? (
    <Card
      className="calendar__day-event-card cursor-pointer border-l-[6px]"
      style={{ borderColor: event.color }}
      onClick={() => handleEventClick(event, dateKey)}
    >
      <Card.Body>
        <Stack gap="xs">
          <Heading level={3}>{getEventTitle(event)}</Heading>
          <Text size="sm" muted>
            {event.host} &bull; {event.location}
          </Text>
          <Text size="sm" weight="bold" className="calendar__event-time-lg mt-[var(--space-xs)]">
            {event.time}
          </Text>
        </Stack>
      </Card.Body>
    </Card>
  ) : (
    <Text muted>{t('no_events')}</Text>
  )

  const dayOfWeekIndex = currentDate.getDay() - 1
  const dayName = dayNames[dayOfWeekIndex < 0 ? 6 : dayOfWeekIndex]

  return (
    <Stack gap="lg" className="calendar-day-detail p-[var(--space-xl)_var(--space-md)]">
      <Stack gap="xs">
        <Badge variant="default" className="calendar__day-badge bg-[var(--color-primary)] text-white">
          {dayName}
        </Badge>
        <Heading level={2}>
          {currentDate.getDate()}. {monthNames[currentDate.getMonth()]}
        </Heading>
      </Stack>
      {dayContent}
    </Stack>
  )
}
