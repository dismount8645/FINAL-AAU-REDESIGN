import React, { memo, useMemo, useCallback } from 'react'
import type { CalendarEvents, CalendarEvent } from '@/lib/types'
import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Badge } from '@/components/ui'
import { Heading, Text } from '@/components/ui'
import useStore from '@/store'
import { CalendarClock, MapPin, User, Info, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UI_PALETTE as eventPalette } from '@/lib/theme'

/* ───────── CalendarDayView ───────── */

interface CalendarDayViewProps {
  currentDate: Date
  events: CalendarEvents
  dayNames: string[]
  monthNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
}

const CalendarDayViewComponent = ({
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
    <Stack gap="xl" className="p-[var(--space-lg)] sm:p-[var(--space-xl)] animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
      <Stack gap="md" className="relative">
        <div className="flex items-center gap-4">
          <Badge 
            variant={isToday ? 'primary' : 'secondary'} 
            className={cn(
              "px-4 py-1.5 text-[0.65rem] font-black rounded-full shadow-sm transition-all duration-300",
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
            <div 
              className="absolute left-0 top-0 bottom-0 w-2.5 z-10 transition-all duration-500 group-hover:w-4"
              style={{ backgroundColor: event.color }}
            />
            
            <Card.Body className="p-[var(--space-xl)] sm:p-[var(--space-2xl)] pl-[var(--space-2xl)] sm:pl-[var(--space-2xl)] bg-card group-hover:bg-muted/5 transition-colors">
              <Stack gap="xl">
                <Stack gap="sm">
                  <div className="flex items-center gap-2 text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                    <Info size={14} />
                    <Text size="xs" weight="black" className="tracking-wide">
                      {t('event_details')}
                    </Text>
                  </div>
                  <Heading level={3} className="text-3xl sm:text-4xl font-black leading-[1.1] tracking-tight group-hover:text-primary transition-colors">
                    {getEventTitle(event)}
                  </Heading>
                </Stack>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-lg)] py-[var(--space-lg)] border-y border-border/50">
                  <Stack gap="xs">
                    <Text size="xs" weight="bold" className="text-text-muted/50">{t('time')}</Text>
                    <Stack direction="row" gap="sm" align="center" className="text-text-main">
                      <CalendarClock className="w-4 h-4 text-primary" />
                      <Text size="sm" weight="bold">{event.time}</Text>
                    </Stack>
                  </Stack>
                  
                  {event.location && (
                    <Stack gap="xs">
                      <Text size="xs" weight="bold" className="text-text-muted/50">{t('location')}</Text>
                      <Stack direction="row" gap="sm" align="center" className="text-text-main">
                        <MapPin className="w-4 h-4 text-primary" />
                        <Text size="sm" weight="bold" className="truncate">{event.location}</Text>
                      </Stack>
                    </Stack>
                  )}

                  {event.host && (
                    <Stack gap="xs">
                      <Text size="xs" weight="bold" className="text-text-muted/50">{t('host')}</Text>
                      <Stack direction="row" gap="sm" align="center" className="text-text-main">
                        <User className="w-4 h-4 text-primary" />
                        <Text size="sm" weight="bold" className="truncate">{event.host}</Text>
                      </Stack>
                    </Stack>
                  )}
                </div>

                {event.description && (
                  <Stack gap="sm" className="bg-muted/30 p-[var(--space-lg)] rounded-xl border border-border/50 relative overflow-hidden group/desc">
                    <div className="absolute top-0 right-0 p-[var(--space-md)] opacity-5 group-hover/desc:opacity-10 transition-opacity">
                      <Info size={40} />
                    </div>
                    <Text size="sm" className="text-text-muted leading-relaxed relative z-10 italic">
                      "{event.description}"
                    </Text>
                  </Stack>
                )}

                <div className="flex justify-end pt-[var(--space-sm)]">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-4 transition-all">
                    <span>{t('view_full_details')}</span>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Stack>
            </Card.Body>
          </Card>
        ) : (
          <button
            type="button"
            className="w-full flex flex-col items-center justify-center py-[var(--space-4xl)] bg-muted/20 rounded-[var(--radius-3xl)] border-4 border-dashed border-border/40 opacity-50 hover:opacity-80 transition-opacity group cursor-pointer border-none focus-visible:outline-none focus-visible:shadow-focus"
            onClick={() => handleEventClick({ id: 0, title: '', color: '', location: '', time: '', host: '' }, dateKey)}
          >
            <div className="w-[5rem] h-[5rem] rounded-full bg-muted/40 flex items-center justify-center mb-[var(--space-lg)] group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <CalendarClock className="w-10 h-10 text-text-muted/40" />
            </div>
            <Text size="xl" weight="black" className="text-text-muted tracking-tight mb-[var(--space-sm)]">{t('calendar.no_events_today')}</Text>
            <Text size="sm" className="text-text-muted/60">{t('calendar.click_to_add_event')}</Text>
          </button>
        )}
      </div>
    </Stack>
  )
}

export const CalendarDayView = memo(CalendarDayViewComponent)

/* ───────── CalendarMonthView ───────── */

interface CalendarMonthViewProps {
  currentDate: Date
  events: CalendarEvents
  dayNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
  handleDayClick: (dateKey: string) => void
  getWeekNumber: (date: Date) => number
}

const CalendarMonthViewComponent = ({
  currentDate,
  events,
  dayNames,
  t,
  handleEventClick,
  handleDayClick,
  getWeekNumber,
}: CalendarMonthViewProps) => {
  const lang = useStore(state => state.lang)

  const { days, firstDay, startingWeekNum, year, month } = useMemo(() => {
    const y = currentDate.getFullYear()
    const m = currentDate.getMonth()
    const totalDays = new Date(y, m + 1, 0).getDate()
    let first = new Date(y, m, 1).getDay() - 1
    if (first < 0) first = 6
    const weekStart = getWeekNumber(new Date(y, m, 1))
    
    return { days: totalDays, firstDay: first, startingWeekNum: weekStart, year: y, month: m }
  }, [currentDate, getWeekNumber])

  const renderDay = useCallback((dayIndex: number) => {
    const getEventTitle = (event: CalendarEvent) => {
      return event.title || (lang === 'da' ? event.titleDa : event.titleEn) || ''
    }
    const dateKey = `${year}-${month}-${dayIndex}`
    const event = events[dateKey]
    const now = new Date()
    const isToday = 
      dayIndex === now.getDate() &&
      month === now.getMonth() &&
      year === now.getFullYear()

    const palette = event ? eventPalette[event.color] || { bg: '', text: '' } : { bg: '', text: '' }
    const eventStyle = {
      background: palette.bg || event?.color,
      color: palette.text || 'var(--color-text-main)',
    }

    return (
      <Stack
        key={`day-${dayIndex}`}
        className={cn(
          "calendar-day min-w-0 min-h-[100px] sm:min-h-[120px] p-xs sm:p-[var(--space-sm)] flex flex-col gap-[var(--space-2xs)] relative transition-all duration-150 bg-card group",
          "border-b border-r border-border/40 hover:z-10 hover:shadow-lg focus-within:z-10",
          isToday && "bg-primary/5 after:absolute after:inset-0 after:ring-1 after:ring-inset after:ring-primary/20"
        )}
      >
        <button
          type="button"
          onClick={() => handleDayClick(dateKey)}
          className="absolute inset-0 w-full h-full opacity-0 z-0 cursor-pointer focus-visible:opacity-100 focus-visible:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`${dayIndex}. ${t('month_' + month)} - ${t('create_event')}`}
        />

        <div className="flex justify-between items-start pointer-events-none z-10 relative" aria-hidden="true">
          <Text
            weight="bold"
            className={cn(
              "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm transition-all duration-300",
              isToday 
                ? "bg-primary text-white shadow-md scale-110" 
                : "text-text-muted group-hover:text-text-main group-hover:bg-muted/50"
            )}
          >
            {dayIndex}
          </Text>
        </div>

        {event && (
          <button
            type="button"
            className="calendar-event-mini w-full px-xs py-2xs sm:px-[var(--space-sm)] sm:py-[var(--space-2xs)] rounded-md text-left shadow-sm border border-border/30 hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all overflow-hidden focus-visible:outline-none focus-visible:shadow-focus z-10 relative"
            style={eventStyle}
            onClick={(e) => {
              e.stopPropagation()
              handleEventClick(event, dateKey)
            }}
            aria-label={`${getEventTitle(event)}${event.time ? `, ${event.time}` : ''}${event.location ? `, ${event.location}` : ''}`}
            title={`${getEventTitle(event)}${event.time ? ` (${event.time})` : ''}${event.location ? ` - ${event.location}` : ''}`}
          >
            <Text size="xs" weight="bold" className="line-clamp-2 block select-none leading-tight">
              {getEventTitle(event)}
            </Text>
            {event.time && (
              <Text size="2xs" className="opacity-80 block line-clamp-2 mt-[var(--space-2xs)] font-medium">
                {event.time}
              </Text>
            )}
          </button>
        )}
      </Stack>
    )
  }, [year, month, events, handleEventClick, handleDayClick, t, lang])

  const gridCells = useMemo(() => {
    const cells = []
    let currentDayIdx = 1

    for (let row = 0; row < 6; row++) {
      const rowWeekNum = startingWeekNum + row
      cells.push(
        <div 
          key={`wn-${rowWeekNum}`} 
          className="calendar-week-num flex items-center justify-center bg-muted/20 text-[0.65rem] sm:text-xs font-bold text-text-muted border-r border-b border-border/40 select-none min-w-0"
        >
          {rowWeekNum}
        </div>
      )

      for (let col = 0; col < 7; col++) {
        const cellIdx = row * 7 + col
        const isPrevMonth = cellIdx < firstDay
        const isNextMonth = (cellIdx - firstDay) >= days

        if (isPrevMonth || isNextMonth) {
          cells.push(
            <div 
              key={`empty-${row}-${col}`} 
              className="calendar-day empty bg-muted/5 opacity-40 border-b border-r border-border/30 min-w-0" 
            />
          )
        } else {
          cells.push(renderDay(currentDayIdx))
          currentDayIdx++
        }
      }
    }
    return cells
  }, [days, firstDay, startingWeekNum, renderDay])

  return (
    <>
      <div className="calendar-grid-header sticky top-0 z-20 bg-muted/90 backdrop-blur-sm p-[var(--space-sm)] text-center text-[0.6rem] sm:text-xs font-bold text-text-muted border-b border-r border-border/60">
        {t('week')}
      </div>
      {dayNames.map((day) => (
        <div 
          key={day} 
          className="calendar-grid-header sticky top-0 z-20 bg-muted/90 backdrop-blur-sm p-[var(--space-sm)] text-center text-[0.6rem] sm:text-xs font-bold text-text-muted border-b border-border/60 min-w-0 truncate"
        >
          {day}
        </div>
      ))}

      {gridCells}
    </>
  )
}

export const CalendarMonthView = memo(CalendarMonthViewComponent)

/* ───────── CalendarWeekView ───────── */

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

const CalendarWeekViewComponent = ({
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
      <div className="calendar-grid-header sticky top-0 z-30 bg-muted/95 backdrop-blur-md p-3 text-center text-[0.6rem] sm:text-xs font-bold text-text-muted border-b border-r border-border/60 shadow-sm">
        {t('time')}
      </div>

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

      {HOURS.map((hour) => {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`
        
        return (
          <React.Fragment key={`row-${hour}`}>
            <div className="calendar-time-label flex items-start justify-end p-2 pr-4 text-[0.65rem] sm:text-[0.7rem] font-bold text-text-muted bg-muted/5 border-r border-b border-border/40 select-none">
               {timeStr}
            </div>

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

export const CalendarWeekView = memo(CalendarWeekViewComponent)
