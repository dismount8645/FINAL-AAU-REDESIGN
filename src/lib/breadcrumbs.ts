import { type CourseListItem } from '@/types';

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
