import React from 'react'
import type { CalendarEvents, CalendarEvent } from '@/types'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import { eventPalette } from './constants'

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
  const [startH, startM] = parts[0].split(':').map(Number)
  const [endH, endM] = parts[1].split(':').map(Number)
  const startDec = startH + startM / 60
  const endDec = endH + endM / 60
  return Math.max(1, Math.round(endDec - startDec))
}

export default function CalendarWeekView({
  currentDate,
  events,
  dayNames,
  monthNames,
  t,
  handleEventClick,
}: CalendarWeekViewProps) {
  const { lang } = useStore()
  const first = currentDate.getDate() - (currentDate.getDay() || 7) + 1
  const weekCells: React.ReactNode[] = []
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  const coveredCells = new Set<string>()

  const getEventTitle = (event: CalendarEvent) => {
    return event.title || (lang === 'da' ? event.titleDa : event.titleEn) || ''
  }

  weekCells.push(
    <Stack key="tid-h" className="calendar-grid-header bg-background p-[var(--space-sm)] text-center font-bold text-[0.85rem] text-main">
      {t('time')}
    </Stack>
  )
  dayNames.forEach((h, i) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), first + i)
    weekCells.push(
      <Stack key={h} className="calendar-grid-header bg-background p-[var(--space-sm)] text-center font-bold text-[0.85rem] text-main">
        <Text size="xs" muted className="calendar__weekday-label">
          {h}
        </Text>
        <Text size="sm">
          {d.getDate()}. {monthNames[d.getMonth()].substring(0, 3)}
        </Text>
      </Stack>
    )
  })

  hours.forEach((hour) => {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`
    weekCells.push(
      <Stack key={`time-${hour}`} className="calendar-time-label flex items-start justify-end p-[var(--space-xs)_var(--space-sm)] text-[0.75rem] text-main bg-background">
        {timeStr}
      </Stack>
    )
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), first + i)
      const dateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      const cellId = `${dateKey}-${hour}`

      if (coveredCells.has(cellId)) continue

      const event = events[dateKey]
      const isEventThisHour = event && event.time.startsWith(hour.toString().padStart(2, '0'))

      if (isEventThisHour) {
        const duration = parseEventDuration(event.time)
        for (let d_idx = 1; d_idx < duration; d_idx++) {
          coveredCells.add(`${dateKey}-${hour + d_idx}`)
        }

        const eventPillStyle = {
          background: (eventPalette[event.color] || {}).bg || event.color,
          color: (eventPalette[event.color] || {}).text || 'var(--text-main)',
        }
        weekCells.push(
          <Stack
            key={`week-cell-${hour}-${i}`}
            className="calendar-day week-view-cell min-h-[60px] p-[2px] bg-card"
            style={{ gridRow: `span ${duration}` }}
          >
            <button
              type="button"
              className="calendar-event-pill w-full h-full p-[var(--space-xs)_var(--space-sm)] rounded-[var(--radius-sm)] cursor-pointer flex flex-col justify-start overflow-hidden text-left font-semibold border border-[var(--border-color)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-[0.98] transition-all"
              style={eventPillStyle}
              onClick={() => handleEventClick(event, dateKey)}
            >
              <Text size="xs" weight="semibold" className="truncate w-full">
                {getEventTitle(event)}
              </Text>
              <Text size="xs" muted className="calendar__event-time text-[10px] opacity-75">
                {event.time}
              </Text>
            </button>
          </Stack>
        )
      } else {
        weekCells.push(
          <Stack key={`week-cell-${hour}-${i}`} className="calendar-day week-view-cell min-h-[60px] p-[2px] bg-card" />
        )
      }
    }
  })

  return <>{weekCells}</>
}
