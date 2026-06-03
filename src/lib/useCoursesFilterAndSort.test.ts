import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCoursesFilterAndSort } from '@/lib/useCoursesFilterAndSort'
import type { CourseWithStatus } from '@/store/useStore'

const mockCourses: CourseWithStatus[] = [
  { id: 1, code: 'CS101', status: 'active', img: 'img1.png', title: 'Intro to CS', titleEn: 'Intro to CS', label: 'Computer Science', labelEn: 'Computer Science' },
  { id: 2, code: 'MATH201', status: 'inactive', img: 'img2.png', title: 'Calculus', titleEn: 'Calculus', label: 'Math', labelEn: 'Math' },
  { id: 3, code: 'ENG301', status: 'upcoming', img: 'img3.png', title: 'Literature', titleEn: 'Literature', label: 'English', labelEn: 'English' },
]

const mockT = (key: string) => {
  if (key === 'course_1_title') return 'Intro to CS'
  if (key === 'course_1_label') return 'Computer Science'
  if (key === 'course_2_title') return 'Calculus'
  if (key === 'course_2_label') return 'Math'
  if (key === 'course_3_title') return 'Literature'
  if (key === 'course_3_label') return 'English'
  return key
}

describe('useCoursesFilterAndSort', () => {
  it('filters courses by tab status', () => {
    const { result } = renderHook(() =>
      useCoursesFilterAndSort({ courses: mockCourses, t: mockT, lang: 'en' })
    )

    // Default tab is 'current' -> maps to status 'active'
    expect(result.current.sortedCourses.map((c) => c.id)).toEqual([1])

    act(() => {
      result.current.setActiveTab('finished') // maps to 'inactive'
    })
    expect(result.current.sortedCourses.map((c) => c.id)).toEqual([2])

    act(() => {
      result.current.setActiveTab('upcoming') // maps to 'upcoming'
    })
    expect(result.current.sortedCourses.map((c) => c.id)).toEqual([3])
  })

  it('filters by search query', () => {
    const { result } = renderHook(() =>
      useCoursesFilterAndSort({ courses: mockCourses, t: mockT, lang: 'en' })
    )

    act(() => {
      result.current.setSearchQuery('CS101')
    })
    expect(result.current.sortedCourses.map((c) => c.id)).toEqual([1])

    act(() => {
      result.current.setSearchQuery('Nonexistent')
    })
    expect(result.current.sortedCourses).toEqual([])
  })

  it('filters by label filter', () => {
    const { result } = renderHook(() =>
      useCoursesFilterAndSort({ courses: mockCourses, t: mockT, lang: 'en' })
    )

    act(() => {
      result.current.setActiveTab('finished') // MATH201, Math
      result.current.setActiveFilter('Math')
    })
    expect(result.current.sortedCourses.map((c) => c.id)).toEqual([2])

    act(() => {
      result.current.setActiveFilter('Computer Science')
    })
    expect(result.current.sortedCourses).toEqual([])
  })

  it('sorts alphabetically or by status', () => {
    const multiCourses: CourseWithStatus[] = [
      { id: 1, status: 'active', img: 'i1', title: 'Beta Course', titleEn: 'Beta Course', label: 'L1', labelEn: 'L1' },
      { id: 2, status: 'active', img: 'i2', title: 'Alpha Course', titleEn: 'Alpha Course', label: 'L2', labelEn: 'L2' },
    ]
    const customT = (key: string) => {
      if (key === 'course_1_title') return 'Beta Course'
      if (key === 'course_2_title') return 'Alpha Course'
      return key
    }

    const { result } = renderHook(() =>
      useCoursesFilterAndSort({ courses: multiCourses, t: customT, lang: 'en' })
    )

    expect(result.current.sortedCourses.map((c) => c.id)).toEqual([2, 1])

    act(() => {
      result.current.setSortBy('alpha')
      result.current.setSortOrder('desc')
    })
    expect(result.current.sortedCourses.map((c) => c.id)).toEqual([1, 2])
  })
})
