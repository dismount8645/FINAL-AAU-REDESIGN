import { useMemo } from 'react';
import { mockDashboardDeadlines, defaultEvents, messagesData } from '@/lib/data';
import { PATHS } from '@/routes';
import type { CourseListItem } from '@/lib/types';

interface GroupedResults {
  courses: CourseListItem[];
  assignments: typeof mockDashboardDeadlines;
  messages: typeof messagesData;
  calendar: typeof defaultEvents[keyof typeof defaultEvents][];
}

export function useSearchFiltering(debouncedQuery: string, courses: CourseListItem[], lang: string) {
  // Grouped search results
  const groupedResults = useMemo<GroupedResults>(() => {
    const query = debouncedQuery.trim().toLowerCase();
    if (query.length < 3) {
      return { courses: [], assignments: [], messages: [], calendar: [] };
    }

    // 1. Courses
    const filteredCourses = courses.filter(c =>
      c.title.toLowerCase().includes(query) ||
      (c.titleEn && c.titleEn.toLowerCase().includes(query)) ||
      (c.code && c.code.toLowerCase().includes(query))
    );

    // 2. Assignments
    const filteredAssignments = mockDashboardDeadlines.filter(d =>
      d.titleDa.toLowerCase().includes(query) ||
      d.titleEn.toLowerCase().includes(query)
    );

    // 3. Messages (filter thread sender names or subject snippets)
    const filteredMessages = messagesData.filter(m =>
      (m.name && m.name.toLowerCase().includes(query)) ||
      (m.nameDa && m.nameDa.toLowerCase().includes(query)) ||
      (m.nameEn && m.nameEn.toLowerCase().includes(query)) ||
      (m.msgDa && m.msgDa.toLowerCase().includes(query)) ||
      (m.msgEn && m.msgEn.toLowerCase().includes(query))
    );

    // 4. Calendar events
    const filteredCalendar = Object.values(defaultEvents).filter(e =>
      (e.title && e.title.toLowerCase().includes(query)) ||
      (e.titleDa && e.titleDa.toLowerCase().includes(query)) ||
      (e.titleEn && e.titleEn.toLowerCase().includes(query)) ||
      (e.location && e.location.toLowerCase().includes(query))
    );

    return {
      courses: filteredCourses,
      assignments: filteredAssignments,
      messages: filteredMessages,
      calendar: filteredCalendar
    };
  }, [courses, debouncedQuery]);

  const totalResultCount = useMemo(() => {
    return (
      groupedResults.courses.length +
      groupedResults.assignments.length +
      groupedResults.messages.length +
      groupedResults.calendar.length
    );
  }, [groupedResults]);

  // Flattened results for keyboard navigation
  const flattenedResults = useMemo(() => {
    const list: {
      type: 'course' | 'assignment' | 'message' | 'calendar';
      id: string | number;
      title: string;
      subtitle: string;
      link: string;
      raw: any;
    }[] = [];

    groupedResults.courses.forEach(c => {
      list.push({
        type: 'course',
        id: `course-${c.id}`,
        title: lang === 'da' ? c.title : c.titleEn,
        subtitle: c.code ?? '',
        link: PATHS.COURSE(c.id),
        raw: c
      });
    });

    groupedResults.assignments.forEach(a => {
      list.push({
        type: 'assignment',
        id: `assignment-${a.id}`,
        title: lang === 'da' ? a.titleDa : a.titleEn,
        subtitle: lang === 'da' ? 'Afleveringsopgave' : 'Assignment',
        link: PATHS.SUBMISSION(a.courseId, a.id),
        raw: a
      });
    });

    groupedResults.messages.forEach(m => {
      list.push({
        type: 'message',
        id: `message-${m.id}`,
        title: lang === 'da' ? (m.nameDa || m.name || '') : (m.nameEn || m.name || ''),
        subtitle: lang === 'da' ? m.msgDa : m.msgEn,
        link: PATHS.MESSAGES,
        raw: m
      });
    });

    groupedResults.calendar.forEach(e => {
      list.push({
        type: 'calendar',
        id: `calendar-${e.id}`,
        title: lang === 'da' ? (e.titleDa || e.title || '') : (e.titleEn || e.title || ''),
        subtitle: `${e.time} · ${e.location}`,
        link: PATHS.CALENDAR,
        raw: e
      });
    });

    return list;
  }, [groupedResults, lang]);

  return {
    groupedResults,
    totalResultCount,
    flattenedResults
  };
}
