import { memo, useMemo, useCallback } from 'react'
import type { CalendarEvents, CalendarEvent } from '@/types'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import { eventPalette } from './constants'
import { cn } from '@/lib/utils'

interface CalendarMonthViewProps {
  currentDate: Date
  events: CalendarEvents
  dayNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
  handleDayClick: (dateKey: string) => void
  getWeekNumber: (date: Date) => number
}

const CalendarMonthView = ({
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
          "calendar-day min-h-[100px] sm:min-h-[120px] p-[var(--space-sm)] flex flex-col gap-[var(--space-2xs)] relative transition-all duration-150 bg-card group cursor-pointer",
          "border-b border-r border-border/40 hover:z-10 hover:shadow-lg focus-within:shadow-focus focus-within:outline-none",
          isToday && "bg-primary/5 after:absolute after:inset-0 after:ring-1 after:ring-inset after:ring-primary/20"
        )}
        onClick={() => (event ? handleEventClick(event, dateKey) : handleDayClick(dateKey))}
        tabIndex={0}
        role="button"
        aria-label={`${dayIndex}. ${t('month_' + month)}`}
      >
        <div className="flex justify-between items-start">
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
          <div
            className="calendar-event-mini w-full px-[var(--space-sm)] py-[var(--space-2xs)] rounded-md text-left shadow-sm border border-border/30 hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all overflow-hidden"
            style={eventStyle}
            onClick={(e) => {
              e.stopPropagation()
              handleEventClick(event, dateKey)
            }}
          >
            <Text size="xs" weight="bold" className="truncate block select-none leading-tight">
              {getEventTitle(event)}
            </Text>
            {event.time && (
              <Text size="2xs" className="opacity-80 block truncate mt-[var(--space-2xs)] font-medium">
                {event.time}
              </Text>
            )}
          </div>
        )}
      </Stack>
    )
  }, [year, month, events, handleEventClick, handleDayClick, t, lang])

  // Generate all grid cells (8 columns x 6 rows = 48 items)
  const gridCells = useMemo(() => {
    const cells = []
    let currentDayIdx = 1

    for (let row = 0; row < 6; row++) {
      // Column 0: Week Number
      const rowWeekNum = startingWeekNum + row
      cells.push(
        <div 
          key={`wn-${rowWeekNum}`} 
          className="calendar-week-num flex items-center justify-center bg-muted/20 text-[0.65rem] sm:text-xs font-bold text-text-muted border-r border-b border-border/40 select-none"
        >
          {rowWeekNum}
        </div>
      )

      // Columns 1-7: Days
      for (let col = 0; col < 7; col++) {
        const cellIdx = row * 7 + col
        const isPrevMonth = cellIdx < firstDay
        const isNextMonth = (cellIdx - firstDay) >= days

        if (isPrevMonth || isNextMonth) {
          cells.push(
            <div 
              key={`empty-${row}-${col}`} 
              className="calendar-day empty bg-muted/5 opacity-40 border-b border-r border-border/30" 
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
      {/* Header Row */}
      <div className="calendar-grid-header sticky top-0 z-20 bg-muted/90 backdrop-blur-sm p-[var(--space-sm)] text-center text-[0.6rem] sm:text-xs font-bold text-text-muted border-b border-r border-border/60">
        {t('week')}
      </div>
      {dayNames.map((day) => (
        <div 
          key={day} 
          className="calendar-grid-header sticky top-0 z-20 bg-muted/90 backdrop-blur-sm p-[var(--space-sm)] text-center text-[0.6rem] sm:text-xs font-bold text-text-muted border-b border-border/60"
        >
          {day}
        </div>
      ))}

      {/* Grid Content */}
      {gridCells}
    </>
  )
}

export default memo(CalendarMonthView)

