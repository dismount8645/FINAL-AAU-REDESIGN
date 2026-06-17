import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, Heading } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { PATHS } from '@/routes';
import useStore from '@/store';

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
}

interface MockCalendarEvent {
  id: number
  title: string
  time: string
  location?: string
}

const mockCalendarEvents: MockCalendarEvent[] = [
  { id: 1, title: 'Forelæsning: UX & Interaktionsdesign', time: 'I dag, 08:15 - 12:00', location: 'Fibigerstræde 15' },
  { id: 2, title: 'Gruppearbejde: Semesterprojekt', time: 'I morgen, 10:00 - 15:00', location: 'Kroghstræde 3' },
  { id: 3, title: 'Workshop: CSS & Advanced Grid', time: 'Fredag, 12:30 - 14:00', location: 'Online' },
]

function CalendarWidget({ size: _size = 'medium' }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)

  const todayEvents = useMemo(() => {
    return mockCalendarEvents.filter(e => 
      e.time.toLowerCase().includes('i dag') || e.time.toLowerCase().includes('today')
    )
  }, [])

  const upcomingEvent = useMemo(() => {
    if (todayEvents.length > 0) return null
    return mockCalendarEvents.find(e => 
      !e.time.toLowerCase().includes('i dag') && !e.time.toLowerCase().includes('today')
    ) || null
  }, [todayEvents])

  const handleSeeAll = useCallback(() => {
    navigate(PATHS.CALENDAR)
  }, [navigate])

  return (
    <Card className="calendar-widget w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="text-primary shrink-0">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('nav.calendar')}
          </Heading>
        </Stack>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs font-medium text-primary dark:text-white normal-case tracking-normal hover:underline h-[44px] min-h-[44px] px-md flex items-center" 
          onClick={handleSeeAll} 
          iconRight={ChevronRight}
          aria-label={lang === 'da' ? 'Åbn kalender' : 'Open calendar'}
        >
          {lang === 'da' ? 'Åbn kalender' : 'Open calendar'}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col gap-sm overflow-y-auto">
        <div className="flex flex-col gap-2xs">
          <div className="text-xs font-semibold text-text-secondary mb-xs">
            {lang === 'da' ? 'Dagens program' : "Today's Schedule"}
          </div>
          {todayEvents.length > 0 ? (
            <div className="flex flex-col gap-2xs">
              {todayEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={handleSeeAll}
                  className="flex items-center justify-between py-sm px-md border border-[var(--border-color)]/60 bg-bg-highlight/20 rounded-[var(--radius-md)] hover:bg-bg-hover cursor-pointer transition-colors min-h-[52px] group/row"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-main truncate block">{evt.title}</span>
                    <div className="text-xs text-text-secondary mt-[2px] leading-relaxed font-medium">
                      {evt.time} {evt.location && `· ${evt.location}`}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 group-hover/row:translate-x-[2px] transition-all duration-200 shrink-0" />
                </div>
              ))}
            </div>
          ) : upcomingEvent ? (
            <div className="flex flex-col gap-2xs">
              <div className="text-xs text-text-secondary italic pl-xs mb-xs leading-relaxed">
                {lang === 'da' ? 'Ingen planlagte aktiviteter i dag. Næste aftale:' : 'No activities today. Next appointment:'}
              </div>
              <div className="flex flex-col gap-2xs">
                <div
                  key={upcomingEvent.id}
                  onClick={handleSeeAll}
                  className="flex items-center justify-between py-sm px-md border border-[var(--border-color)]/60 bg-bg-highlight/20 rounded-[var(--radius-md)] hover:bg-bg-hover cursor-pointer transition-colors min-h-[52px] group/row"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-main truncate block">{upcomingEvent.title}</span>
                    <div className="text-xs text-text-secondary mt-[2px] leading-relaxed font-medium">
                      {upcomingEvent.time} {upcomingEvent.location && `· ${upcomingEvent.location}`}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 group-hover/row:translate-x-[2px] transition-all duration-200 shrink-0" />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-text-secondary italic py-2xs pl-xs leading-relaxed">
              {lang === 'da' ? 'Ingen kalenderaftaler' : 'No calendar appointments'}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export { CalendarWidget }
