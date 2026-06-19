import { memo, useMemo, Fragment } from 'react';
import type { CalendarEvents, CalendarEvent } from '@/lib/types';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text } from '@/components/ui';
import useStore from '@/store';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UI_PALETTE as eventPalette } from '@/lib/theme';
import { parseEventDuration, isEventDeadline, getEventTitleText } from './calendar-utils';

interface CalendarWeekViewProps {
  currentDate: Date;
  events: CalendarEvents;
  dayNames: string[];
  monthNames: string[];
  t: (key: string) => string;
  handleEventClick: (event: CalendarEvent, dateKey: string) => void;
}

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const CalendarWeekViewComponent = ({
  currentDate,
  events,
  dayNames,
  monthNames,
  t,
  handleEventClick,
}: CalendarWeekViewProps) => {
  const lang = useStore(state => state.lang);

  const { weekDays } = useMemo(() => {
    const start = currentDate.getDate() - (currentDate.getDay() || 7) + 1;
    const days = dayNames.map((name, i) => {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), start + i);
      return {
        name,
        date: d.getDate(),
        month: d.getMonth(),
        dateKey: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
      };
    });
    return { weekDays: days };
  }, [currentDate, dayNames]);

  const coveredCells = useMemo(() => {
    const covered = new Set<string>();
    HOURS.forEach(hour => {
      weekDays.forEach(day => {
        const event = events[day.dateKey];
        if (event && event.time.startsWith(hour.toString().padStart(2, '0'))) {
          const duration = parseEventDuration(event.time);
          for (let d = 1; d < duration; d++) {
            covered.add(`${day.dateKey}-${hour + d}`);
          }
        }
      });
    });
    return covered;
  }, [events, weekDays]);

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
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;

        return (
          <Fragment key={`row-${hour}`}>
            <div className="calendar-time-label flex items-start justify-end p-2 pr-4 text-[0.65rem] sm:text-[0.7rem] font-bold text-text-muted bg-muted/5 border-r border-b border-border/40 select-none">
               {timeStr}
            </div>

            {weekDays.map((day) => {
              const cellId = `${day.dateKey}-${hour}`;
              if (coveredCells.has(cellId)) return null;

              const event = events[day.dateKey];
              const isEventStart = event && event.time.startsWith(hour.toString().padStart(2, '0'));

              if (isEventStart) {
                const duration = parseEventDuration(event.time);
                const palette = eventPalette[event.color] || {};
                const isDeadline = isEventDeadline(event);

                return (
                  <div
                    key={`slot-${day.dateKey}-${hour}`}
                    className="calendar-day min-w-0 p-1 border-b border-r border-border/40 group relative"
                    style={{ gridRow: `span ${duration}` }}
                  >
                    <button
                      type="button"
                      title={`${getEventTitleText(event, lang)}${event.time ? ` (${event.time})` : ''}${event.location ? ` - ${event.location}` : ''}`}
                      aria-label={`${getEventTitleText(event, lang)}${event.time ? `, ${event.time}` : ''}${event.location ? `, ${event.location}` : ''}`}
                      onClick={() => handleEventClick(event, day.dateKey)}
                      className={cn(
                        "w-full h-full p-2.5 rounded-lg text-left transition-all duration-300",
                        "border border-border/30 shadow-sm group-hover:shadow-lg group-hover:scale-[1.01] group-hover:z-10",
                        "active:scale-[0.98] focus-visible:outline-none focus-visible:shadow-focus focus-visible:z-10",
                        isDeadline && "border-2 border-orange-500 ring-2 ring-orange-500/20 shadow-md"
                      )}
                      style={{
                        background: palette.bg || event.color,
                        color: palette.text || 'var(--color-text-main)',
                      }}
                    >
                      <Stack gap="2xs">
                        {(() => {
                          const courseCode = event.courseCode;
                          const eventType = lang === 'da' ? event.typeDa : event.typeEn;
                          if (courseCode || eventType) {
                            return (
                              <div className="flex flex-wrap items-center gap-3xs opacity-80 mb-3xs">
                                {courseCode && <span className="text-[9px] font-extrabold px-1 bg-white/20 rounded">{courseCode}</span>}
                                {eventType && (
                                  <span className={cn(
                                    "text-[9px] font-black uppercase flex items-center gap-0.5",
                                    isDeadline && "text-orange-700 dark:text-orange-200 bg-orange-500/10 px-1 rounded"
                                  )}>
                                    {isDeadline && <AlertTriangle className="w-2.5 h-2.5 shrink-0 text-orange-500 dark:text-orange-400" />}
                                    {eventType}
                                  </span>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })()}
                        <Text size="xs" weight={isDeadline ? "black" : "extrabold"} className={cn("line-clamp-2 block leading-tight tracking-tight opacity-90", isDeadline && "text-orange-800 dark:text-orange-200")}>
                          {getEventTitleText(event, lang)}
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
                );
              }

              return (
                <div
                  key={`slot-${day.dateKey}-${hour}`}
                  className="calendar-day min-w-0 bg-card hover:bg-muted/30 transition-colors border-b border-r border-border/40 min-h-[60px]"
                />
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
};

export const CalendarWeekView = memo(CalendarWeekViewComponent);
