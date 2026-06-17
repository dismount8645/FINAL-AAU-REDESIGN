import { memo, useMemo, useCallback } from 'react'
import type { CalendarEvents, CalendarEvent } from '@/lib/types'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text } from '@/components/ui'
import useStore from '@/store'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UI_PALETTE as eventPalette } from '@/lib/theme'

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

  const { days, firstDay, startingWeekNum, year, month, rowCount } = useMemo(() => {
    const y = currentDate.getFullYear()
    const m = currentDate.getMonth()
    const totalDays = new Date(y, m + 1, 0).getDate()
    let first = new Date(y, m, 1).getDay() - 1
    if (first < 0) first = 6
    const weekStart = getWeekNumber(new Date(y, m, 1))
    const rows = Math.ceil((first + totalDays) / 7)

    return { days: totalDays, firstDay: first, startingWeekNum: weekStart, year: y, month: m, rowCount: rows }
  }, [currentDate, getWeekNumber])

  const renderDay = useCallback((dayIndex: number) => {
    const getEventTitle = (event: CalendarEvent) => {
      return event.title || (lang === 'da' ? event.titleDa : event.titleEn) || ''
    }
    const dateKey = `${year}-${month}-${dayIndex}`
    const event = events[dateKey]
    const isDeadline = event && (event.color === 'var(--color-danger-dark)' || event.color === 'var(--color-danger)' || event.typeEn?.toLowerCase() === 'deadline')
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
          "calendar-day min-w-0 min-h-[44px] sm:min-h-[55px] md:min-h-[65px] lg:min-h-[75px] p-[var(--space-2xs)] sm:p-xs flex flex-col gap-[var(--space-3xs)] relative transition-all duration-150 bg-card group",
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
            className={cn(
              "calendar-event-mini w-full px-xs py-2xs sm:px-[var(--space-sm)] sm:py-[var(--space-2xs)] rounded-md text-left shadow-sm border border-border/30 hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all overflow-hidden focus-visible:outline-none focus-visible:shadow-focus z-10 relative",
              isDeadline && "border-2 border-orange-500 font-extrabold shadow-md ring-1 ring-orange-500/20"
            )}
            style={eventStyle}
            onClick={(e) => {
              e.stopPropagation()
              handleEventClick(event, dateKey)
            }}
            aria-label={`${getEventTitle(event)}${event.time ? `, ${event.time}` : ''}${event.location ? `, ${event.location}` : ''}`}
            title={`${getEventTitle(event)}${event.time ? ` (${event.time})` : ''}${event.location ? ` - ${event.location}` : ''}`}
          >
            <Text weight="bold" className={cn("line-clamp-2 block select-none leading-snug text-xs sm:text-sm", isDeadline && "font-black text-orange-800 dark:text-orange-300 flex items-center gap-1")}>
              {isDeadline && <AlertTriangle className="w-3 h-3 shrink-0 text-orange-600 dark:text-orange-400 animate-pulse" />}
              {(() => {
                const courseCode = event.courseCode
                const prefix = courseCode ? `${courseCode}: ` : ''
                return `${prefix}${getEventTitle(event)}`
              })()}
            </Text>
            {event.time && (
              <Text className="opacity-90 block line-clamp-2 mt-[2px] font-semibold text-[10px] sm:text-xs">
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

    for (let row = 0; row < rowCount; row++) {
      const rowWeekNum = startingWeekNum + row
      cells.push(
        <div
          key={`wn-${rowWeekNum}`}
          className="calendar-week-num flex items-center justify-center bg-bg-highlight/50 text-[0.7rem] sm:text-sm font-mono font-black text-text-main border-r-2 border-r-border/60 border-b border-border/40 select-none min-w-0"
          title={`${t('week')} ${rowWeekNum}`}
        >
          W{rowWeekNum}
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
  }, [days, firstDay, startingWeekNum, renderDay, rowCount])

  return (
    <>
      <div className="calendar-grid-header sticky top-0 z-20 bg-muted/95 backdrop-blur-sm p-[var(--space-2xs)] sm:p-[var(--space-sm)] text-center text-[0.65rem] sm:text-xs font-black uppercase tracking-wider text-text-muted/60 border-b border-r-2 border-r-border/60 border-border/60">
        {t('week')}
      </div>
      {dayNames.map((day) => (
        <div
          key={day}
          className="calendar-grid-header sticky top-0 z-20 bg-muted/90 backdrop-blur-sm p-[var(--space-2xs)] sm:p-[var(--space-sm)] text-center text-[0.65rem] sm:text-xs font-bold text-text-muted border-b border-border/60 min-w-0 truncate"
        >
          {day}
        </div>
      ))}

      {gridCells}
    </>
  )
}

export const CalendarMonthView = memo(CalendarMonthViewComponent)
