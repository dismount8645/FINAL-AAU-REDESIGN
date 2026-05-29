"use client"

import { memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck, ChevronRight, MapPin, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CalendarEvents, CalendarEvent } from '@/types'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import useStore from '@/store/useStore'
import { cn } from '@/lib/utils'

interface CalendarUpcomingWidgetProps {
  events: CalendarEvents
  currentDate: Date
  monthNames: string[]
  t: (key: string) => string
  handleEventClick: (event: CalendarEvent, dateKey: string) => void
}

/**
 * CalendarUpcomingWidget - Professional AAU schedule overview.
 */
const CalendarUpcomingWidget = ({
  events,
  currentDate,
  monthNames,
  t,
  handleEventClick,
}: CalendarUpcomingWidgetProps) => {
  const navigate = useNavigate()
  const lang = useStore(state => state.lang)

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
    <Card variant="default" className="upcoming-events-widget h-full">
      <Card.Header padding="default" className="bg-bg-highlight/20 min-h-[72px] sm:min-h-[76px] flex items-center">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] rounded-[var(--radius-sm)] bg-primary/10 text-primary">
            <CalendarCheck size={18} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-main">
            {t('upcoming')}
          </span>
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
                  {/* Date Box */}
                  <Stack
                    align="center"
                    justify="center"
                    gap="none"
                    className="bg-bg-card p-[var(--space-2xs)] rounded-[var(--radius-md)] min-w-[52px] h-[52px] border border-[var(--border-color)]/60 shadow-sm shrink-0"
                  >
                    <span className="text-[0.625rem] font-black text-muted uppercase tracking-widest leading-none">
                      {monthNames[e.date.getMonth()].substring(0, 3)}
                    </span>
                    <span className="text-[1.25rem] font-black text-primary dark:text-indigo-200 leading-none mt-[2px]">
                      {e.date.getDate()}
                    </span>
                  </Stack>

                  {/* Event Info */}
                  <Stack gap="none" className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-main truncate leading-snug">
                      {getEventTitle(e)}
                    </span>
                    <Stack direction="row" gap="xs" align="center" className="text-muted">
                      <Clock size={12} strokeWidth={2.5} />
                      <span className="text-[0.6875rem] font-bold uppercase tracking-tight">{e.time}</span>
                    </Stack>
                    {e.location && (
                      <Stack direction="row" gap="xs" align="center" className="text-primary/80 dark:text-white">
                        <MapPin size={12} strokeWidth={2.5} />
                        <span className="text-[0.6875rem] font-bold italic truncate">{e.location}</span>
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
                className="py-[var(--space-xl)] px-[var(--space-lg)] text-center bg-bg-highlight/5"
              >
                <CalendarCheck size={40} className="text-muted/65 mx-auto mb-[var(--space-sm)]" />
                <p className="text-sm font-bold text-muted">{t('no_events_short')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>
      </Card.Body>

      <Card.Footer padding="compact" className="bg-bg-highlight/10">
        <Button variant="ghost" full size="sm" onClick={() => navigate('/calendar')} className="normal-case tracking-normal text-xs font-bold">
          {t('view_all')}
        </Button>
      </Card.Footer>
    </Card>
  )
}

export default memo(CalendarUpcomingWidget)
