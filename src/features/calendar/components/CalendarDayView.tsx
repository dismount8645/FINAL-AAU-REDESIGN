import { memo, useMemo } from 'react'
import type { CalendarEvents, CalendarEvent } from '@/types'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Badge from '@/components/ui/Badge'
import { Heading, Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import { CalendarClock, MapPin, User } from 'lucide-react'

interface CalendarDayViewProps {
  currentDate: Date
  events: CalendarEvents
  dayNames: string[]
  monthNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
}

const CalendarDayView = ({
  currentDate,
  events,
  dayNames,
  monthNames,
  t,
  handleEventClick,
}: CalendarDayViewProps) => {
  const { lang } = useStore()
  
  const { dateKey, dayName, formattedDate } = useMemo(() => {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`
    const dowIdx = currentDate.getDay() - 1
    const name = dayNames[dowIdx < 0 ? 6 : dowIdx]
    const date = `${currentDate.getDate()}. ${monthNames[currentDate.getMonth()]}`
    return { dateKey: key, dayName: name, formattedDate: date }
  }, [currentDate, dayNames, monthNames])

  const event = events[dateKey]

  const getEventTitle = (e: CalendarEvent) => {
    return e.title || (lang === 'da' ? e.titleDa : e.titleEn) || ''
  }

  return (
    <Stack gap="xl" className="calendar-day-detail p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Stack gap="sm">
        <div className="flex items-center gap-3">
          <Badge variant="primary" className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
            {dayName}
          </Badge>
          <div className="h-px flex-1 bg-border/40" />
        </div>
        <Heading level={2} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-main">
          {formattedDate}
        </Heading>
      </Stack>

      <div className="grid gap-6">
        {event ? (
          <Card
            className="calendar__day-event-card group cursor-pointer border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative"
            onClick={() => handleEventClick(event, dateKey)}
          >
            {/* Aesthetic accent stripe */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-2 z-10"
              style={{ backgroundColor: event.color }}
            />
            
            <Card.Body className="p-6 sm:p-8 pl-8 sm:pl-10 bg-card group-hover:bg-muted/5 transition-colors">
              <Stack gap="lg">
                <Stack gap="xs">
                  <Text size="xs" weight="bold" className="uppercase tracking-widest text-primary/70">
                    {t('event_details')}
                  </Text>
                  <Heading level={3} className="text-2xl font-bold leading-tight">
                    {getEventTitle(event)}
                  </Heading>
                </Stack>

                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <Stack direction="row" gap="sm" align="center" className="text-muted-foreground">
                    <CalendarClock className="w-4 h-4 text-primary" />
                    <Text size="sm" weight="semibold">{event.time}</Text>
                  </Stack>
                  
                  {event.location && (
                    <Stack direction="row" gap="sm" align="center" className="text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <Text size="sm" weight="semibold">{event.location}</Text>
                    </Stack>
                  )}

                  {event.host && (
                    <Stack direction="row" gap="sm" align="center" className="text-muted-foreground">
                      <User className="w-4 h-4 text-primary" />
                      <Text size="sm" weight="semibold">{event.host}</Text>
                    </Stack>
                  )}
                </div>

                {event.description && (
                  <div className="bg-muted/30 p-4 rounded-lg italic text-sm text-muted-foreground border-l-2 border-border">
                    {event.description}
                  </div>
                )}
              </Stack>
            </Card.Body>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border/60 opacity-60">
            <CalendarClock className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <Text weight="medium" className="text-muted-foreground">{t('no_events')}</Text>
          </div>
        )}
      </div>
    </Stack>
  )
}

export default memo(CalendarDayView)
