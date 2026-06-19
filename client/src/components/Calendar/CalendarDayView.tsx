// CalendarDayView — full implementation (moved from CalendarDay.tsx)
import { memo, useMemo } from 'react';
import type { CalendarEvents, CalendarEvent } from '@/lib/types';
import { Card, Badge, Heading, Text } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store';
import { CalendarClock, MapPin, User, Info, ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isEventDeadline, getEventTitleText, getEventCourseText } from './calendar-utils';
import { EventBadge, EventInfoItem } from './CalendarEngine';

interface CalendarDayViewProps {
  currentDate: Date;
  events: CalendarEvents;
  dayNames: string[];
  monthNames: string[];
  t: (key: string) => string;
  handleEventClick: (event: CalendarEvent, dateKey: string) => void;
}

const CalendarDayViewComponent = ({
  currentDate,
  events,
  dayNames,
  monthNames,
  t,
  handleEventClick,
}: CalendarDayViewProps) => {
  const lang = useStore(state => state.lang);

  const { dateKey, dayName, formattedDate, isToday } = useMemo(() => {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
    const dowIdx = currentDate.getDay() - 1;
    const name = dayNames[dowIdx < 0 ? 6 : dowIdx];
    const date = `${currentDate.getDate()}. ${monthNames[currentDate.getMonth()]}`;

    const now = new Date();
    const today =
      currentDate.getDate() === now.getDate() &&
      currentDate.getMonth() === now.getMonth() &&
      currentDate.getFullYear() === now.getFullYear();

    return { dateKey: key, dayName: name, formattedDate: date, isToday: today };
  }, [currentDate, dayNames, monthNames]);

  const event = events[dateKey];
  const isDeadline = event ? isEventDeadline(event) : false;

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
            className={cn(
              "calendar__day-event-card group cursor-pointer border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative rounded-2xl",
              isDeadline && "ring-2 ring-orange-500/25"
            )}
            onClick={() => handleEventClick(event, dateKey)}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-2.5 z-10 transition-all duration-500 group-hover:w-4"
              style={{ backgroundColor: event.color }}
            />

            <Card.Body className="p-[var(--space-xl)] sm:p-[var(--space-2xl)] pl-[var(--space-2xl)] sm:pl-[var(--space-2xl)] bg-card group-hover:bg-muted/5 transition-colors">
              <Stack gap="xl">
                <Stack gap="xs">
                  <div className="flex flex-wrap items-center gap-xs">
                    {(() => {
                      const courseTitle = getEventCourseText(event, lang);
                      if (courseTitle) {
                        return (
                          <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary dark:text-[var(--aau-light-blue-sec)]">
                            {courseTitle}
                          </Badge>
                        );
                      }
                      return null;
                    })()}
                    <EventBadge event={event} lang={lang} />
                  </div>
                  <Heading level={3} className={cn("text-3xl sm:text-4xl font-black leading-[1.1] tracking-tight group-hover:text-primary transition-colors mt-xs flex items-center gap-2", isDeadline && "text-orange-700 dark:text-orange-300")}>
                    {isDeadline && <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400 shrink-0" />}
                    {getEventTitleText(event, lang)}
                  </Heading>
                </Stack>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-lg)] py-[var(--space-lg)] border-y border-border/50">
                  <EventInfoItem label={t('time')} icon={CalendarClock} value={event.time} />
                  {event.location && (
                    <EventInfoItem label={t('location')} icon={MapPin} value={event.location} />
                  )}
                  {event.host && (
                    <EventInfoItem label={t('host')} icon={User} value={event.host} />
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
  );
};

export const CalendarDayView = memo(CalendarDayViewComponent);
