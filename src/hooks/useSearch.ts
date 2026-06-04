import { useState, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Book, House, CalendarDays, GraduationCap, FolderOpen } from 'lucide-react'
import { type LucideIcon } from 'lucide-react'
import { courses } from '@/data/mockData'
import useStore from '@/store'

export interface SearchResult {
  label: string
  path: string
  icon: LucideIcon
  group: string
  description: string
  img?: string
  code?: string
  professor?: string
}

export interface UseSearchReturn {
  query: string
  results: SearchResult[]
  filteredResults: SearchResult[]
  categories: string[]
  activeFilter: string
  setActiveFilter: (f: string) => void
  getActionLabel: (res: SearchResult) => string
  subtitle: string
}

export function useSearch(): UseSearchReturn {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const query = (queryParams.get('q') || '').trim()

  const [activeFilter, setActiveFilter] = useState<string>('all')

  const results = useMemo(() => {
    const courseItems = Object.entries(courses).map(([id, course]) => ({
      label: localize(course, 'title'),
      path: `/course/${id}`,
      icon: Book,
      group: course.group || t('courses'),
      description: course.description || t('moodle_course_module'),
      img: course.img,
      code: course.code,
      professor: course.professor,
    })) as SearchResult[]

    const pages: SearchResult[] = [
      { label: t('dashboard'), path: '/', icon: House, group: t('pages'), description: t('personal_overview') },
      { label: t('calendar'), path: '/calendar', icon: CalendarDays, group: t('pages'), description: t('schedule_and_deadlines') },
      { label: t('courses'), path: '/courses', icon: GraduationCap, group: t('pages'), description: t('overview_all_modules') },
      { label: t('resources'), path: '/resources', icon: FolderOpen, group: t('pages'), description: t('tools_and_guidelines') },
    ]

    const searchData = [...pages, ...courseItems]
    if (!query) return []
    const q = query.toLowerCase()
    return searchData.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.code?.toLowerCase().includes(q) ||
      item.professor?.toLowerCase().includes(q)
    )
  }, [query, t, localize])

  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') return results
    return results.filter(r => r.group.toLowerCase() === activeFilter.toLowerCase())
  }, [results, activeFilter])

  const categories = useMemo(() => {
    const cats = ['all']
    results.forEach(r => {
      if (!cats.includes(r.group)) cats.push(r.group)
    })
    return cats
  }, [results])

  const getActionLabel = useCallback((res: SearchResult) => {
    if (res.group === t('courses')) return t('go_to_course')
    if (res.group === t('pages')) return `${t('open')} ${res.label}`
    return t('go_to_content')
  }, [t])

  const subtitle = useMemo(() => {
    const resultsText = results.length === 1 ? t('search_results_singular') : t('search_results_plural')
    return t('search_found_results')
      .replace('{count}', results.length.toString())
      .replace('{results}', resultsText)
  }, [results.length, t])

  return { query, results, filteredResults, categories, activeFilter, setActiveFilter, getActionLabel, subtitle }
}
