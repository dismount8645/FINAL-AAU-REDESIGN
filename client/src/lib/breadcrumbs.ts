
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


