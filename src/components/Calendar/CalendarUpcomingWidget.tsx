"use client"

import { memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck, ChevronRight, MapPin, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CalendarEvents, CalendarEvent } from '@/lib/types'
import { Card, Text } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import Button from '@/components/ui/Button'
import { PATHS } from '@/routes'
import useStore from '@/store'
import { cn } from '@/lib/utils'

interface CalendarUpcomingWidgetProps {
  events: CalendarEvents
  currentDate: Date
  monthNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
  onCreateEvent?: () => void
  onImport?: () => void
}

const CalendarUpcomingWidget = ({
  events,
  currentDate,
  monthNames,
  t,
  handleEventClick,
  onCreateEvent,
  onImport,
}: CalendarUpcomingWidgetProps) => {
  const navigate = useNavigate()
  const lang = useStore(state => state.lang)

  const futureEvents = useMemo(() => {
    const now = new Date()
    const isFutureMonth =
      currentDate.getFullYear() > now.getFullYear() ||
      (currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() > now.getMonth())

    const isPastMonth =
      currentDate.getFullYear() < now.getFullYear() ||
      (currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() < now.getMonth())

    const filterStartDate = isFutureMonth || isPastMonth
      ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      : new Date(now.setHours(0, 0, 0, 0))

    return Object.entries(events)
      .map(([dateStr, event]) => {
        const [y, m, d_num] = dateStr.split('-').map(Number)
        return { date: new Date(y, m, d_num), dateKey: dateStr, ...event }
      })
      .filter((e) => {
        const isCurrentMonthContext = 
          e.date.getFullYear() === currentDate.getFullYear() && 
          e.date.getMonth() === currentDate.getMonth()
        return isCurrentMonthContext && e.date >= filterStartDate
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }, [events, currentDate])

  const getEventTitle = (e: CalendarEvent) => {
    return e.title || (lang === 'da' ? e.titleDa : e.titleEn) || ''
  }

  return (
    <Card variant="default" className="upcoming-events-widget !h-auto">
      <Card.Header padding="default" className="bg-bg-highlight/20 min-h-[72px] sm:min-h-[76px] flex items-center">
        <Stack direction="row" align="center" justify="between" className="w-full">
          <Stack direction="row" align="center" gap="sm">
            <div className="p-[var(--space-2xs)] rounded-[var(--radius-sm)] bg-primary/10 text-primary">
              <CalendarCheck size={18} strokeWidth={2.5} />
            </div>
            <Text size="sm" weight="bold" tag="span">
              {t('upcoming')}
            </Text>
          </Stack>
          {futureEvents.length > 0 && (
            <Button variant="ghost" size="xs" onClick={() => navigate(PATHS.CALENDAR)} className="normal-case tracking-normal font-black text-xs">
              {t('common.see_all')}
            </Button>
          )}
        </Stack>
      </Card.Header>

      <Card.Body padding="none">
        <Stack gap="none">
          <AnimatePresence mode="popLayout" initial={false}>
            {futureEvents.length > 0 ? (
              futureEvents.map((e, idx) => (
                <motion.button
                  key={`${e.dateKey}-${idx}`}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05, duration: 0.15 }}
                  type="button"
                  className={cn(
                    "upcoming-event-item w-full flex items-center gap-[var(--space-md)] p-[var(--space-md)] text-left transition-all duration-150",
                    "border-b border-[var(--border-color)]/30 last:border-0 hover:bg-bg-highlight/50 focus-visible:bg-bg-highlight/70 focus-visible:outline-none focus-visible:shadow-focus"
                  )}
                  onClick={() => handleEventClick(e, e.dateKey)}
                >
                  <Stack
                    align="center"
                    justify="center"
                    gap="none"
                    className="bg-bg-card p-[var(--space-2xs)] rounded-[var(--radius-md)] min-w-[52px] h-[52px] border border-[var(--border-color)]/60 shadow-sm shrink-0"
                  >
                    <Text size="2xs" weight="black" muted tag="span" className="uppercase tracking-widest leading-none">
                      {monthNames[e.date.getMonth()].substring(0, 3)}
                    </Text>
                    <Text size="xl" weight="black" tag="span" className="text-primary dark:text-indigo-200 leading-none mt-[2px]">
                      {e.date.getDate()}
                    </Text>
                  </Stack>

                  <Stack gap="none" className="flex-1 min-w-0">
                    <Text size="sm" weight="bold" tag="span" className="line-clamp-2 block leading-snug">
                      {getEventTitle(e)}
                    </Text>
                    <Stack direction="row" gap="xs" align="center" className="text-muted shrink-0">
                      <Clock size={12} strokeWidth={2.5} />
                      <Text size="sm" weight="bold" tag="span" className="uppercase whitespace-nowrap">{e.time}</Text>
                    </Stack>
                    {e.location && (
                      <Stack direction="row" gap="xs" align="center" className="text-primary/80 dark:text-white">
                        <MapPin size={12} strokeWidth={2.5} />
                        <Text size="sm" weight="bold" tag="span" className="italic line-clamp-1 block">{e.location}</Text>
                      </Stack>
                    )}
                  </Stack>

                  <ChevronRight size={16} className="text-muted/40 shrink-0" />
                </motion.button>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-[var(--space-md)] px-[var(--space-md)] text-center bg-bg-highlight/5 flex flex-col items-center gap-sm"
              >
                <div className="flex flex-col items-center text-center">
                  <CalendarCheck size={24} className="text-muted/65 mx-auto mb-[var(--space-2xs)]" />
                  <Text size="sm" weight="bold" muted className="mb-[var(--space-2xs)]">{t('no_events_short')}</Text>
                  <Text size="2xs" muted className="leading-relaxed max-w-[180px] mx-auto">
                    {t('no_upcoming_events_hint')}
                  </Text>
                </div>
                
                <Stack gap="xs" className="w-full mt-2xs">
                  {onCreateEvent && (
                    <Button variant="primary" size="sm" onClick={onCreateEvent} className="w-full justify-center normal-case tracking-normal text-xs py-1.5 h-auto">
                      {t('new_event')}
                    </Button>
                  )}
                  {onImport && (
                    <Button variant="outline" size="sm" onClick={onImport} className="w-full justify-center normal-case tracking-normal text-xs py-1.5 h-auto">
                      {t('import_ics')}
                    </Button>
                  )}
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>
      </Card.Body>
    </Card>
  )
}

export default memo(CalendarUpcomingWidget)
