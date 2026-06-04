import { describe, it, expect } from 'vitest';
import { type CourseListItem } from '@/lib/types';

export const getAutomaticBreadcrumbs = (
  pathname: string,
  lang: 'da' | 'en',
  courses: CourseListItem[],
  t: (key: string) => string
): { label: string; href?: string }[] => {
  if (pathname === '/' || pathname === '/dashboard') {
    return [{ label: t('dashboard') }];
  }

  const crumbs: { label: string; href?: string }[] = [
    { label: t('dashboard'), href: '/' }
  ];

  // Course Details Pattern: /course/:id
  const courseMatch = pathname.match(/^\/course\/(\d+)/);
  if (courseMatch) {
    const courseId = parseInt(courseMatch[1], 10);
    const course = courses.find(c => c.id === courseId);
    crumbs.push({ label: t('courses'), href: '/courses' });
    /* istanbul ignore next */
    if (course) {
      crumbs.push({ label: lang === 'da' ? course.title : (course.titleEn || course.title) });
    }
    return crumbs;
  }

  // Submission Pattern: /submission/:courseId/:assignmentId
  const submissionMatch = pathname.match(/^\/submission\/(\d+)\/(\d+)/);
  if (submissionMatch) {
    const courseId = parseInt(submissionMatch[1], 10);
    const course = courses.find(c => c.id === courseId);
    crumbs.push({ label: t('courses'), href: '/courses' });
    /* istanbul ignore next */
    if (course) {
      crumbs.push({ label: lang === 'da' ? course.title : (course.titleEn || course.title), href: `/course/${courseId}` });
    }
    crumbs.push({ label: t('submission') });
    return crumbs;
  }

  // Forum Pattern: /forum/:id
  const forumMatch = pathname.match(/^\/forum\/(\d+)/);
  if (forumMatch) {
    crumbs.push({ label: t('courses'), href: '/courses' });
    crumbs.push({ label: t('forum_thread') });
    return crumbs;
  }

  // Exact mappings
  if (pathname.startsWith('/calendar')) {
    crumbs.push({ label: t('calendar') });
  } else if (pathname.startsWith('/courses')) {
    crumbs.push({ label: t('courses') });
  } else if (pathname.startsWith('/settings')) {
    crumbs.push({ label: t('settings') });
  } else if (pathname.startsWith('/messages')) {
    crumbs.push({ label: t('messages') });
  } else if (pathname.startsWith('/support')) {
    crumbs.push({ label: t('support') });
  } else if (pathname.startsWith('/grades')) {
    crumbs.push({ label: t('my_grades') });
  } else if (pathname.startsWith('/notifications')) {
    crumbs.push({ label: t('notifications') });
  } else if (pathname.startsWith('/resources')) {
    crumbs.push({ label: t('resources') });
  } else if (pathname.startsWith('/search')) {
    crumbs.push({ label: t('search_results') });
  } else {
    // Dynamic fallback for any other segments
    const segments = pathname.split('/').filter(Boolean);
    segments.forEach((seg, idx) => {
      const isLast = idx === segments.length - 1;
      /* istanbul ignore next */
      const label = t(seg) || seg;
      crumbs.push({
        label,
        href: isLast ? undefined : '/' + segments.slice(0, idx + 1).join('/')
      });
    });
  }

  return crumbs;
};

import { courseList } from '@/data/registry';

const mockT = (key: string) => key;

if (import.meta.vitest) {
  describe('getAutomaticBreadcrumbs', () => {
    it('returns dashboard for root', () => {
      const result = getAutomaticBreadcrumbs('/', 'da', courseList, mockT);
      expect(result).toEqual([{ label: 'dashboard' }]);
    });
  
    it('returns course details crumbs', () => {
      const result = getAutomaticBreadcrumbs('/course/1', 'da', courseList, mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'courses', href: '/courses' },
        { label: 'Digital Design og Kommunikation' }
      ]);
    });
  
    it('returns course details crumbs in English', () => {
      const result = getAutomaticBreadcrumbs('/course/1', 'en', courseList, mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'courses', href: '/courses' },
        { label: 'Digital Design and Communication' }
      ]);
    });
  
    it('returns submission crumbs', () => {
      const result = getAutomaticBreadcrumbs('/submission/1/2', 'da', courseList, mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'courses', href: '/courses' },
        { label: 'Digital Design og Kommunikation', href: '/course/1' },
        { label: 'submission' }
      ]);
    });
  
    it('returns forum crumbs', () => {
      const result = getAutomaticBreadcrumbs('/forum/1', 'da', courseList, mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'courses', href: '/courses' },
        { label: 'forum_thread' }
      ]);
    });
  
    it('returns exact match for settings', () => {
      const result = getAutomaticBreadcrumbs('/settings', 'da', courseList, mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'settings' }
      ]);
    });
  
    it('handles general segments fallback', () => {
      const result = getAutomaticBreadcrumbs('/some/other/path', 'da', courseList, mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'some', href: '/some' },
        { label: 'other', href: '/some/other' },
        { label: 'path' }
      ]);
    });
  });
}
