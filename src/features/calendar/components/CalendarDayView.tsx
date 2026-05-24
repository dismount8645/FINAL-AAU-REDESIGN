import { memo, useMemo } from 'react'
import type { CalendarEvents, CalendarEvent } from '@/types'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Badge from '@/components/ui/Badge'
import { Heading, Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import { CalendarClock, MapPin, User, Info, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const lang = useStore(state => state.lang)
  
  const { dateKey, dayName, formattedDate, isToday } = useMemo(() => {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`
    const dowIdx = currentDate.getDay() - 1
    const name = dayNames[dowIdx < 0 ? 6 : dowIdx]
    const date = `${currentDate.getDate()}. ${monthNames[currentDate.getMonth()]}`
    
    const now = new Date()
    const today = 
      currentDate.getDate() === now.getDate() &&
      currentDate.getMonth() === now.getMonth() &&
      currentDate.getFullYear() === now.getFullYear()

    return { dateKey: key, dayName: name, formattedDate: date, isToday: today }
  }, [currentDate, dayNames, monthNames])

  const event = events[dateKey]

  const getEventTitle = (e: CalendarEvent) => {
    return e.title || (lang === 'da' ? e.titleDa : e.titleEn) || ''
  }

  return (
    <Stack gap="xl" className="calendar-day-detail p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
      <Stack gap="md" className="relative">
        <div className="flex items-center gap-4">
          <Badge 
            variant={isToday ? 'primary' : 'secondary'} 
            className={cn(
              "px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.2em] rounded-full shadow-sm transition-all duration-300",
              isToday && "ring-4 ring-primary/10 scale-110"
            )}
          >
            {isToday ? t('today') : dayName}
          </Badge>
          <div className="h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
          <Heading level={2} className="text-4xl sm:text-5xl font-black tracking-tighter text-text-main">
            {formattedDate}
          </Heading>
          <Text size="lg" weight="bold" className="text-text-muted/60 font-mono tracking-tighter">
            {currentDate.getFullYear()}
          </Text>
        </div>
      </Stack>

      <div className="grid gap-8">
        {event ? (
          <Card
            className="calendar__day-event-card group cursor-pointer border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative rounded-2xl"
            onClick={() => handleEventClick(event, dateKey)}
          >
            {/* Aesthetic accent gradient */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-2.5 z-10 transition-all duration-500 group-hover:w-4"
              style={{ backgroundColor: event.color }}
            />
            
            <Card.Body className="p-8 sm:p-10 pl-10 sm:pl-12 bg-card group-hover:bg-muted/5 transition-colors">
              <Stack gap="xl">
                <Stack gap="sm">
                  <div className="flex items-center gap-2 text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                    <Info size={14} />
                    <Text size="xs" weight="black" className="uppercase tracking-[0.2em]">
                      {t('event_details')}
                    </Text>
                  </div>
                  <Heading level={3} className="text-3xl sm:text-4xl font-black leading-[1.1] tracking-tight group-hover:text-primary transition-colors">
                    {getEventTitle(event)}
                  </Heading>
                </Stack>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-y border-border/50">
                  <Stack gap="xs">
                    <Text size="xs" weight="bold" className="text-text-muted/50 uppercase tracking-widest">{t('time')}</Text>
                    <Stack direction="row" gap="sm" align="center" className="text-text-main">
                      <CalendarClock className="w-4 h-4 text-primary" />
                      <Text size="sm" weight="bold">{event.time}</Text>
                    </Stack>
                  </Stack>
                  
                  {event.location && (
                    <Stack gap="xs">
                      <Text size="xs" weight="bold" className="text-text-muted/50 uppercase tracking-widest">{t('location')}</Text>
                      <Stack direction="row" gap="sm" align="center" className="text-text-main">
                        <MapPin className="w-4 h-4 text-primary" />
                        <Text size="sm" weight="bold" className="truncate">{event.location}</Text>
                      </Stack>
                    </Stack>
                  )}

                  {event.host && (
                    <Stack gap="xs">
                      <Text size="xs" weight="bold" className="text-text-muted/50 uppercase tracking-widest">{t('host')}</Text>
                      <Stack direction="row" gap="sm" align="center" className="text-text-main">
                        <User className="w-4 h-4 text-primary" />
                        <Text size="sm" weight="bold" className="truncate">{event.host}</Text>
                      </Stack>
                    </Stack>
                  )}
                </div>

                {event.description && (
                  <Stack gap="sm" className="bg-muted/30 p-6 rounded-xl border border-border/50 relative overflow-hidden group/desc">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/desc:opacity-10 transition-opacity">
                      <Info size={40} />
                    </div>
                    <Text size="sm" className="text-text-muted leading-relaxed relative z-10 italic">
                      "{event.description}"
                    </Text>
                  </Stack>
                )}

                <div className="flex justify-end pt-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-4 transition-all">
                    <span>{t('view_full_details')}</span>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Stack>
            </Card.Body>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-[2.5rem] border-4 border-dashed border-border/40 opacity-50 hover:opacity-80 transition-opacity group cursor-pointer" onClick={() => handleEventClick({ id: 0, title: '', color: '', location: '', time: '', host: '' }, dateKey)}>
            <div className="w-20 h-20 rounded-full bg-muted/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <CalendarClock className="w-10 h-10 text-text-muted/40" />
            </div>
            <Text size="xl" weight="black" className="text-text-muted tracking-tight mb-2">{t('no_events_today')}</Text>
            <Text size="sm" className="text-text-muted/60">{t('click_to_add_event')}</Text>
          </div>
        )}
      </div>
    </Stack>
  )
}

export default memo(CalendarDayView)

