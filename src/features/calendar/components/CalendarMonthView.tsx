import React from 'react'
import type { CalendarEvents, CalendarEvent } from '@/types'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import { eventPalette } from './constants'

interface CalendarMonthViewProps {
  currentDate: Date
  events: CalendarEvents
  dayNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
  handleDayClick: (dateKey: string) => void
  getWeekNumber: (date: Date) => number
}

export default function CalendarMonthView({
  currentDate,
  events,
  dayNames,
  t,
  handleEventClick,
  handleDayClick,
  getWeekNumber,
}: CalendarMonthViewProps) {
  const { lang } = useStore()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() - 1
  if (firstDay < 0) firstDay = 6
  const gridCells: React.ReactNode[] = []
  let weekNum = getWeekNumber(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))

  const getEventTitle = (event: CalendarEvent) => {
    return event.title || (lang === 'da' ? event.titleDa : event.titleEn) || ''
  }

  gridCells.push(
    <Stack key="uge-h" className="calendar-grid-header bg-background p-[var(--space-sm)] text-center font-bold text-[0.85rem] text-main">
      {t('week')}
    </Stack>
  )
  dayNames.forEach((h) =>
    gridCells.push(
      <Stack key={h} className="calendar-grid-header bg-background p-[var(--space-sm)] text-center font-bold text-[0.85rem] text-main">
        {h}
      </Stack>
    )
  )
  gridCells.push(
    <Stack key={`wn-${weekNum}`} className="calendar-week-num flex items-center justify-center text-[0.8rem] text-muted bg-background font-semibold">
      {weekNum}
    </Stack>
  )
  for (let i = 0; i < firstDay; i++) {
    gridCells.push(<Stack key={`empty-${i}`} className="calendar-day empty bg-background opacity-30"></Stack>)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    if ((i + firstDay - 1) % 7 === 0 && i > 1) {
      weekNum++
      gridCells.push(
        <Stack key={`wn-${weekNum}`} className="calendar-week-num flex items-center justify-center text-[0.8rem] text-muted bg-background font-semibold">
          {weekNum}
        </Stack>
      )
    }
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${i}`
    const event = events[dateKey]
    const isToday =
      i === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()
    
    const eventStyle = event
      ? {
          background: (eventPalette[event.color] || {}).bg || event.color,
          color: (eventPalette[event.color] || {}).text || 'var(--text-main)',
        }
      : {}

    gridCells.push(
      <Stack
        key={`day-${i}`}
        className={`calendar-day min-h-[var(--space-3xl)] p-[var(--space-xs)] flex flex-col gap-[var(--space-xs)] relative transition-colors duration-[var(--transition-fast)] bg-card hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
          isToday ? 'today' : ''
        } cursor-pointer`}
        onClick={() => (event ? handleEventClick(event, dateKey) : handleDayClick(dateKey))}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (event) {
              handleEventClick(event, dateKey)
            } else {
              handleDayClick(dateKey)
            }
          }
        }}
      >
        <div className="flex justify-end">
          <Text
            weight="bold"
            size="md"
            className={`day-number text-[0.9rem] text-main w-[var(--space-2xl)] h-[var(--space-2xl)] flex items-center justify-center rounded-[var(--radius-pill)] font-medium ${
              isToday ? 'today bg-primary text-white shadow-[var(--shadow-sm)]' : ''
            }`}
          >
            {i}
          </Text>
        </div>
        {event && (
          <div
            className="calendar-event-mini w-full px-[var(--space-2xs)] py-[var(--space-3xs)] rounded-[var(--radius-sm)] text-left text-2xs font-semibold truncate border border-[var(--border-color)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-[0.98] transition-all tracking-tight"
            style={eventStyle}
            tabIndex={0}
            role="button"
            onClick={(e) => {
              e.stopPropagation()
              handleEventClick(event, dateKey)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                handleEventClick(event, dateKey)
              }
            }}
          >
            <Text size="xs" weight="semibold" className="truncate select-none">
              {getEventTitle(event)}
            </Text>
          </div>
        )}
      </Stack>
    )
  }

  return <>{gridCells}</>
}
