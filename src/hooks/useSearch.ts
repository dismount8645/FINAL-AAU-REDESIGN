import { useState, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Book, House, CalendarDays, GraduationCap, FolderOpen } from 'lucide-react'
import { type LucideIcon } from 'lucide-react'
import { courses } from '@/lib/data'
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

/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  const { describe, it, expect } = await import('vitest')
  const React = await import('react')
  const { MemoryRouter } = await import('react-router-dom')
  const { renderHook } = await import('@testing-library/react')
  const { act } = React

  describe('useSearch', () => {
    beforeEach(() => {
      useStore.setState({
        t: (key: string) => key,
        localize: (item: any, field?: string) => String(item[field ?? ''] ?? ''),
      })
    })

    it('has empty default state when no query param', () => {
      const Wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(MemoryRouter, { initialEntries: ['/'] }, children)
      const { result } = renderHook(() => useSearch(), { wrapper: Wrapper })
      expect(result.current.query).toBe('')
      expect(result.current.results).toEqual([])
      expect(result.current.filteredResults).toEqual([])
      expect(result.current.activeFilter).toBe('all')
      expect(result.current.categories).toEqual(['all'])
    })

    it('filters results matching search query from URL', () => {
      const Wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(MemoryRouter, { initialEntries: ['/?q=Digital'] }, children)
      const { result } = renderHook(() => useSearch(), { wrapper: Wrapper })
      expect(result.current.results.length).toBeGreaterThan(0)
      result.current.results.forEach(r => {
        const matchesLabel = r.label.toLowerCase().includes('digital')
        const matchesDesc = r.description.toLowerCase().includes('digital')
        const matchesCode = (r.code ?? '').toLowerCase().includes('digital')
        const matchesProf = (r.professor ?? '').toLowerCase().includes('digital')
        expect(matchesLabel || matchesDesc || matchesCode || matchesProf).toBe(true)
      })
    })

    it('filters by category with activeFilter', () => {
      const Wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(MemoryRouter, { initialEntries: ['/?q=Digital'] }, children)
      const { result } = renderHook(() => useSearch(), { wrapper: Wrapper })
      const allResults = [...result.current.results]

      act(() => { result.current.setActiveFilter('pages') })
      expect(result.current.filteredResults.length).toBeLessThan(allResults.length)
      result.current.filteredResults.forEach(r => {
        expect(r.group.toLowerCase()).toBe('pages')
      })
    })

    it('returns empty results when query matches nothing', () => {
      const Wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(MemoryRouter, { initialEntries: ['/?q=zzzz_nonexistent'] }, children)
      const { result } = renderHook(() => useSearch(), { wrapper: Wrapper })
      expect(result.current.results).toEqual([])
      expect(result.current.filteredResults).toEqual([])
    })

    it('getActionLabel returns correct label for each group', () => {
      const courseResult: SearchResult = { label: 'Course', path: '/c', icon: Book, group: 'courses', description: 'd' }
      const pageResult: SearchResult = { label: 'Dashboard', path: '/', icon: Book, group: 'pages', description: 'd' }
      const fallbackResult: SearchResult = { label: 'Other', path: '/o', icon: Book, group: 'custom', description: 'd' }

      const Wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(MemoryRouter, { initialEntries: ['/'] }, children)
      const { result } = renderHook(() => useSearch(), { wrapper: Wrapper })

      expect(result.current.getActionLabel(courseResult)).toBe('go_to_course')
      expect(result.current.getActionLabel(pageResult)).toBe('open Dashboard')
      expect(result.current.getActionLabel(fallbackResult)).toBe('go_to_content')
    })

    it('categories include all plus unique groups from results', () => {
      const Wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(MemoryRouter, { initialEntries: ['/?q=a'] }, children)
      const { result } = renderHook(() => useSearch(), { wrapper: Wrapper })
      expect(result.current.categories[0]).toBe('all')
      expect(result.current.categories.length).toBeGreaterThanOrEqual(2)
    })
  })
}
