import { useState, useMemo } from 'react'
import type { CourseWithStatus, Lang } from '@/lib/store'

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
