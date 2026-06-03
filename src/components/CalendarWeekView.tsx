import React, { memo, useMemo } from 'react'
import type { CalendarEvents, CalendarEvent } from '@/types'
import Stack from '@/components/Stack'
import { Text } from '@/components/Typography'
import useStore from '@/store/useStore'
import { eventPalette } from './calendarConstants'
import { cn } from '@/lib/utils'

interface CalendarWeekViewProps {
  currentDate: Date
  events: CalendarEvents
  dayNames: string[]
  monthNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
}

const parseEventDuration = (timeStr: string): number => {
  const parts = timeStr.split(' - ')
  if (parts.length < 2) return 1
  try {
    const [startH, startM] = parts[0].split(':').map(Number)
    const [endH, endM] = parts[1].split(':').map(Number)
    const startDec = startH + startM / 60
    const endDec = endH + endM / 60
    return Math.max(1, Math.ceil(endDec - startDec))
  } catch {
    return 1
  }
}

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

const CalendarWeekView = ({
  currentDate,
  events,
  dayNames,
  monthNames,
  t,
  handleEventClick,
}: CalendarWeekViewProps) => {
  const lang = useStore(state => state.lang)

  const { weekDays } = useMemo(() => {
    const start = currentDate.getDate() - (currentDate.getDay() || 7) + 1
    const days = dayNames.map((name, i) => {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), start + i)
      return {
        name,
        date: d.getDate(),
        month: d.getMonth(),
        dateKey: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      }
    })
    return { weekDays: days }
  }, [currentDate, dayNames])

  const getEventTitle = (event: CalendarEvent) => {
    return event.title || (lang === 'da' ? event.titleDa : event.titleEn) || ''
  }

  const coveredCells = useMemo(() => {
    const covered = new Set<string>()
    HOURS.forEach(hour => {
      weekDays.forEach(day => {
        const event = events[day.dateKey]
        if (event && event.time.startsWith(hour.toString().padStart(2, '0'))) {
          const duration = parseEventDuration(event.time)
          for (let d = 1; d < duration; d++) {
            covered.add(`${day.dateKey}-${hour + d}`)
          }
        }
      })
    })
    return covered
  }, [events, weekDays])

  return (
    <>
      {/* Time Header */}
      <div className="calendar-grid-header sticky top-0 z-30 bg-muted/95 backdrop-blur-md p-3 text-center text-[0.6rem] sm:text-xs font-bold text-text-muted border-b border-r border-border/60 shadow-sm">
        {t('time')}
      </div>

      {/* Week Day Headers */}
      {weekDays.map((day) => (
        <div 
          key={day.dateKey} 
          className="calendar-grid-header sticky top-0 z-30 bg-muted/95 backdrop-blur-md p-3 text-center border-b border-border/60 shadow-sm"
        >
          <Text size="xs" weight="bold" className="text-text-muted block mb-1.5 opacity-80">
            {day.name}
          </Text>
          <Text size="sm" weight="extrabold" className="text-text-main">
            {day.date}. {monthNames[day.month].substring(0, 3)}
          </Text>
        </div>
      ))}

      {/* Hour Rows */}
      {HOURS.map((hour) => {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`
        
        return (
          <React.Fragment key={`row-${hour}`}>
            {/* Hour Label */}
            <div className="calendar-time-label flex items-start justify-end p-2 pr-4 text-[0.65rem] sm:text-[0.7rem] font-bold text-text-muted bg-muted/5 border-r border-b border-border/40 select-none">
               {timeStr}
            </div>

            {/* Day Slots for this Hour */}
            {weekDays.map((day) => {
              const cellId = `${day.dateKey}-${hour}`
              if (coveredCells.has(cellId)) return null

              const event = events[day.dateKey]
              const isEventStart = event && event.time.startsWith(hour.toString().padStart(2, '0'))

              if (isEventStart) {
                const duration = parseEventDuration(event.time)
                const palette = eventPalette[event.color] || {}
                
                return (
                  <div
                    key={`slot-${day.dateKey}-${hour}`}
                    className="calendar-day min-w-0 p-1 border-b border-r border-border/40 group relative"
                    style={{ gridRow: `span ${duration}` }}
                  >
                    <button
                      type="button"
                      title={`${getEventTitle(event)}${event.time ? ` (${event.time})` : ''}${event.location ? ` - ${event.location}` : ''}`}
                      aria-label={`${getEventTitle(event)}${event.time ? `, ${event.time}` : ''}${event.location ? `, ${event.location}` : ''}`}
                      onClick={() => handleEventClick(event, day.dateKey)}
                      className={cn(
                        "w-full h-full p-2.5 rounded-lg text-left transition-all duration-300",
                        "border border-border/30 shadow-sm group-hover:shadow-lg group-hover:scale-[1.01] group-hover:z-10",
                        "active:scale-[0.98] focus-visible:outline-none focus-visible:shadow-focus focus-visible:z-10"
                      )}
                      style={{
                        background: palette.bg || event.color,
                        color: palette.text || 'var(--color-text-main)',
                      }}
                    >
                      <Stack gap="2xs">
                        <Text size="xs" weight="extrabold" className="line-clamp-2 block leading-tight tracking-tight opacity-90">
                          {getEventTitle(event)}
                        </Text>
                        <Text size="2xs" className="opacity-80 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                          {event.time}
                        </Text>
                        {event.location && (
                          <Text size="2xs" className="opacity-70 line-clamp-1 block mt-1.5 font-medium border-t border-current/10 pt-1">
                            {event.location}
                          </Text>
                        )}
                      </Stack>
                    </button>
                  </div>
                )
              }

              return (
                <div 
                  key={`slot-${day.dateKey}-${hour}`} 
                  className="calendar-day min-w-0 bg-card hover:bg-muted/30 transition-colors border-b border-r border-border/40 min-h-[60px]" 
                />
              )
            })}
          </React.Fragment>
        )
      })}
    </>
  )
}

export default memo(CalendarWeekView)

