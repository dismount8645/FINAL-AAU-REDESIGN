import type { CalendarEvent } from '@/lib/types';

export const parseEventDuration = (timeStr: string): number => {
  const parts = timeStr.split(' - ');
  if (parts.length < 2) return 1;
  try {
    const [startH, startM] = parts[0].split(':').map(Number);
    const [endH, endM] = parts[1].split(':').map(Number);
    const startDec = startH + startM / 60;
    const endDec = endH + endM / 60;
    return Math.max(1, Math.ceil(endDec - startDec));
  } catch {
    return 1;
  }
};

export const isEventDeadline = (event: CalendarEvent): boolean => {
  return !!(
    event.color === 'var(--color-danger-dark)' ||
    event.color === 'var(--color-danger)' ||
    event.typeEn?.toLowerCase() === 'deadline'
  );
};

export const getEventTitleText = (event: CalendarEvent, lang: string): string => {
  return event.title || (lang === 'da' ? event.titleDa : event.titleEn) || '';
};

export const getEventCourseText = (event: CalendarEvent, lang: string): string => {
  const courseTitle = lang === 'da' ? event.courseTitleDa : event.courseTitleEn;
  if (!courseTitle) return '';
  return courseTitle + (event.courseCode ? ` (${event.courseCode})` : '');
};

export const getEventTypeText = (event: CalendarEvent, lang: string): string => {
  return (lang === 'da' ? event.typeDa : event.typeEn) || '';
};
