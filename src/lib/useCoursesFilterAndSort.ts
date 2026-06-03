import { useState, useMemo } from 'react';
import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { CourseWithStatus, Lang } from '@/lib/store';

export interface UseCoursesFilterAndSortProps {
  courses: CourseWithStatus[]
  t: (key: string) => string
  lang: Lang
}

export function useCoursesFilterAndSort({ courses, t, lang }: UseCoursesFilterAndSortProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'finished' | 'upcoming'>('current')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [sortBy, setSortBy] = useState<'alpha' | 'status'>('status')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const labelFilters = useMemo(() => {
    const labels = new Set<string>()
    courses.forEach((c) => {
      const label = t(`course_${c.id}_label`)
      if (label) labels.add(label)
    })
    return Array.from(labels).sort()
  }, [courses, t])

  const filteredCourses = useMemo(() => {
    const tabMap = {
      current: 'active',
      finished: 'inactive',
      upcoming: 'upcoming',
    }
    return courses.filter((c) => {
      const matchesTab = c.status === tabMap[activeTab]
      const matchesSearch =
        searchQuery.trim() === '' ||
        t(`course_${c.id}_title`).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.code && c.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t(`course_${c.id}_label`).toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = !activeFilter || t(`course_${c.id}_label`) === activeFilter
      return matchesTab && matchesSearch && matchesFilter
    })
  }, [courses, activeTab, searchQuery, activeFilter, t])

  const sortedCourses = useMemo(() => {
    return [...filteredCourses].sort((a, b) => {
      if (sortBy === 'status') {
        const statusWeight: Record<string, number> = { active: 0, upcoming: 1, inactive: 2 }
        const diff = (statusWeight[a.status] ?? 0) - (statusWeight[b.status] ?? 0)
        if (diff !== 0) return diff * (sortOrder === 'asc' ? 1 : -1)
      }
      const aTitle = t(`course_${a.id}_title`)
      const bTitle = t(`course_${b.id}_title`)
      return sortOrder === 'asc'
        ? aTitle.localeCompare(bTitle, lang)
        : bTitle.localeCompare(aTitle, lang)
    })
  }, [filteredCourses, sortOrder, sortBy, t, lang])

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    sortBy,
    setSortBy,
    activeFilter,
    setActiveFilter,
    labelFilters,
    sortedCourses,
  }
}

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

if (import.meta.vitest) {
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
}
