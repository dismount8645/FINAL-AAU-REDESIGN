import { memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck, ChevronRight, MapPin, Clock } from 'lucide-react'
import type { CalendarEvents, CalendarEvent } from '@/types'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import { cn } from '@/lib/utils'

interface CalendarUpcomingWidgetProps {
  events: CalendarEvents
  currentDate: Date
  monthNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
}

const CalendarUpcomingWidget = ({
  events,
  currentDate,
  monthNames,
  t,
  handleEventClick,
}: CalendarUpcomingWidgetProps) => {
  const navigate = useNavigate()
  const { lang } = useStore()

  const futureEvents = useMemo(() => {
    const now = new Date()
    const isFutureMonth =
      currentDate.getFullYear() > now.getFullYear() ||
      (currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() > now.getMonth())

    const filterStartDate = isFutureMonth
      ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      : new Date(now.setHours(0, 0, 0, 0))

    return Object.entries(events)
      .map(([dateStr, event]) => {
        const [y, m, d_num] = dateStr.split('-').map(Number)
        return { date: new Date(y, m, d_num), dateKey: dateStr, ...event }
      })
      .filter((e) => e.date >= filterStartDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }, [events, currentDate])

  const getEventTitle = (e: CalendarEvent) => {
    return e.title || (lang === 'da' ? e.titleDa : e.titleEn) || ''
  }

  return (
    <Card className="upcoming-events-widget overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
      <Card.Header className="border-b border-border/50 bg-card py-4">
        <Stack direction="row" align="center" gap="sm">
          <Icon icon={CalendarCheck} variant="primary" size="sm" className="bg-primary/10 text-primary" />
          <Text weight="bold" size="md" className="tracking-tight">
            {t('upcoming')}
          </Text>
        </Stack>
      </Card.Header>

      <Card.Body className="p-0">
        <Stack gap="none">
          {futureEvents.length > 0 ? (
            futureEvents.map((e, idx) => (
              <button
                key={`${e.dateKey}-${idx}`}
                type="button"
                className={cn(
                  "upcoming-event-item w-full flex items-center gap-4 p-4 text-left transition-all duration-200",
                  "border-b border-border/40 last:border-0 hover:bg-muted/30 focus-visible:bg-muted/50 focus-visible:outline-none"
                )}
                onClick={() => handleEventClick(e, e.dateKey)}
              >
                {/* Date Box */}
                <Stack
                  align="center"
                  justify="center"
                  className="bg-muted/40 p-2 rounded-lg min-w-[50px] border border-border/50 shadow-sm shrink-0"
                >
                  <Text size="2xs" weight="extrabold" className="text-muted-foreground leading-tight uppercase tracking-widest">
                    {monthNames[e.date.getMonth()].substring(0, 3)}
                  </Text>
                  <Text size="lg" weight="extrabold" className="text-primary leading-tight">
                    {e.date.getDate()}
                  </Text>
                </Stack>

                {/* Event Info */}
                <Stack gap="2xs" className="flex-1 overflow-hidden">
                  <Text size="sm" weight="bold" className="truncate text-main leading-snug">
                    {getEventTitle(e)}
                  </Text>
                  <Stack direction="row" gap="xs" align="center" className="text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <Text size="xs" weight="medium">{e.time}</Text>
                  </Stack>
                  {e.location && (
                    <Stack direction="row" gap="xs" align="center" className="text-primary/70">
                      <MapPin className="w-3 h-3" />
                      <Text size="xs" weight="medium" className="truncate italic">{e.location}</Text>
                    </Stack>
                  )}
                </Stack>

                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </button>
            ))
          ) : (
            <Stack align="center" justify="center" className="py-12 px-6 text-center bg-muted/5">
              <CalendarCheck className="w-10 h-10 text-muted-foreground/20 mb-3" />
              <Text size="sm" weight="medium" className="text-muted-foreground">{t('no_events_short')}</Text>
            </Stack>
          )}
        </Stack>
      </Card.Body>

      <Card.Footer className="bg-muted/20 p-4 border-t border-border/50">
        <Button variant="ghost" full size="sm" onClick={() => navigate('/calendar')} className="font-bold text-xs uppercase tracking-widest hover:bg-primary/5">
          {t('view_all')}
        </Button>
      </Card.Footer>
    </Card>
  )
}

export default memo(CalendarUpcomingWidget)
