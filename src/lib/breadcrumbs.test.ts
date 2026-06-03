import { describe, it, expect } from 'vitest';
import { getAutomaticBreadcrumbs } from './breadcrumbs';
import { type CourseListItem } from '@/lib/types';

const mockCourses: CourseListItem[] = [
  { id: 1, title: 'Matematik 1', titleEn: 'Math 1', code: 'MAT1' }
] as unknown as CourseListItem[];

const mockT = (key: string) => key;

describe('getAutomaticBreadcrumbs', () => {
  it('returns dashboard for root', () => {
    const result = getAutomaticBreadcrumbs('/', 'da', mockCourses, mockT);
    expect(result).toEqual([{ label: 'dashboard' }]);
  });

  it('returns course details crumbs', () => {
    const result = getAutomaticBreadcrumbs('/course/1', 'da', mockCourses, mockT);
    expect(result).toEqual([
      { label: 'dashboard', href: '/' },
      { label: 'courses', href: '/courses' },
      { label: 'Matematik 1' }
    ]);
  });

  it('returns course details crumbs in English', () => {
    const result = getAutomaticBreadcrumbs('/course/1', 'en', mockCourses, mockT);
    expect(result).toEqual([
      { label: 'dashboard', href: '/' },
      { label: 'courses', href: '/courses' },
      { label: 'Math 1' }
    ]);
  });

  it('returns submission crumbs', () => {
    const result = getAutomaticBreadcrumbs('/submission/1/2', 'da', mockCourses, mockT);
    expect(result).toEqual([
      { label: 'dashboard', href: '/' },
      { label: 'courses', href: '/courses' },
      { label: 'Matematik 1', href: '/course/1' },
      { label: 'submission' }
    ]);
  });

  it('returns forum crumbs', () => {
    const result = getAutomaticBreadcrumbs('/forum/1', 'da', mockCourses, mockT);
    expect(result).toEqual([
      { label: 'dashboard', href: '/' },
      { label: 'courses', href: '/courses' },
      { label: 'forum_thread' }
    ]);
  });

  it('returns exact match for settings', () => {
    const result = getAutomaticBreadcrumbs('/settings', 'da', mockCourses, mockT);
    expect(result).toEqual([
      { label: 'dashboard', href: '/' },
      { label: 'settings' }
    ]);
  });

  it('handles general segments fallback', () => {
    const result = getAutomaticBreadcrumbs('/some/other/path', 'da', mockCourses, mockT);
    expect(result).toEqual([
      { label: 'dashboard', href: '/' },
      { label: 'some', href: '/some' },
      { label: 'other', href: '/some/other' },
      { label: 'path' }
    ]);
  });
});
