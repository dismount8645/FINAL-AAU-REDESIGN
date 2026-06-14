
import { courseList } from '@/lib/data';
import routes from '@/routes';

export const getAutomaticBreadcrumbs = (
  pathname: string,
  lang: 'da' | 'en',
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
    const course = courseList.find(c => c.id === courseId);
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
    const course = courseList.find(c => c.id === courseId);
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

  // Dynamic mapping from routes config
  const staticRoutes = routes.filter(r => r.path !== '/' && !r.path.includes(':'))
  const matchedRoute = staticRoutes.find(r => pathname.startsWith(r.path))
  if (matchedRoute) {
    crumbs.push({ label: t(matchedRoute.breadcrumbKey ?? matchedRoute.label) })
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

const mockT = (key: string) => key;

if (import.meta.vitest) {
  describe('getAutomaticBreadcrumbs', () => {
    it('returns dashboard for root', () => {
      const result = getAutomaticBreadcrumbs('/', 'da', mockT);
      expect(result).toEqual([{ label: 'dashboard' }]);
    });
  
    it('returns course details crumbs', () => {
      const result = getAutomaticBreadcrumbs('/course/1', 'da', mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'courses', href: '/courses' },
        { label: 'Digital Design og Kommunikation' }
      ]);
    });
  
    it('returns course details crumbs in English', () => {
      const result = getAutomaticBreadcrumbs('/course/1', 'en', mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'courses', href: '/courses' },
        { label: 'Digital Design and Communication' }
      ]);
    });
  
    it('returns submission crumbs', () => {
      const result = getAutomaticBreadcrumbs('/submission/1/2', 'da', mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'courses', href: '/courses' },
        { label: 'Digital Design og Kommunikation', href: '/course/1' },
        { label: 'submission' }
      ]);
    });
  
    it('returns forum crumbs', () => {
      const result = getAutomaticBreadcrumbs('/forum/1', 'da', mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'courses', href: '/courses' },
        { label: 'forum_thread' }
      ]);
    });
  
    it('returns exact match for settings', () => {
      const result = getAutomaticBreadcrumbs('/settings', 'da', mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'settings' }
      ]);
    });
  
    it('handles general segments fallback', () => {
      const result = getAutomaticBreadcrumbs('/some/other/path', 'da', mockT);
      expect(result).toEqual([
        { label: 'dashboard', href: '/' },
        { label: 'some', href: '/some' },
        { label: 'other', href: '/some/other' },
        { label: 'path' }
      ]);
    });

    it('generates breadcrumbs for /calendar', () => {
      const result = getAutomaticBreadcrumbs('/calendar', 'da', mockT);
      expect(result).toHaveLength(2);
      expect(result[1].label).toBe('calendar');
    });

    it('generates breadcrumbs for /courses', () => {
      const result = getAutomaticBreadcrumbs('/courses', 'da', mockT);
      expect(result).toHaveLength(2);
      expect(result[1].label).toBe('courses');
    });

    it('generates breadcrumbs for /messages', () => {
      const result = getAutomaticBreadcrumbs('/messages', 'da', mockT);
      expect(result).toHaveLength(2);
      expect(result[1].label).toBe('messages');
    });

    it('generates breadcrumbs for /support', () => {
      const result = getAutomaticBreadcrumbs('/support', 'da', mockT);
      expect(result).toHaveLength(2);
      expect(result[1].label).toBe('support');
    });

    it('generates breadcrumbs for /notifications', () => {
      const result = getAutomaticBreadcrumbs('/notifications', 'da', mockT);
      expect(result).toHaveLength(2);
      expect(result[1].label).toBe('notifications');
    });

    it('generates breadcrumbs for /resources', () => {
      const result = getAutomaticBreadcrumbs('/resources', 'da', mockT);
      expect(result).toHaveLength(2);
      expect(result[1].label).toBe('resources');
    });

    it('generates breadcrumbs for /search', () => {
      const result = getAutomaticBreadcrumbs('/search', 'da', mockT);
      expect(result).toHaveLength(2);
      expect(result[1].label).toBe('search_results');
    });
  });
}
