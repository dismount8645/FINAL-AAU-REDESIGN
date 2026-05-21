import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Book, House, CalendarDays, GraduationCap, FolderOpen, Search } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import Grid from '@/components/ui/Grid'
import Stack from '@/components/ui/Stack'
import EmptyState from '@/components/ui/EmptyState'
import { courses } from '@/data/mockData'
import useStore from '@/store/useStore'

import { type LucideIcon } from 'lucide-react'
import {
  SearchResultCard,
  SearchResultFilters,
} from './searchResults/index'

interface SearchResult {
  label: string
  path: string
  icon: LucideIcon
  group: string
  description: string
  img?: string
  code?: string
  professor?: string
}

function useSearch(): { query: string; results: SearchResult[] } {
  const { t, localize } = useStore()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const query = (queryParams.get('q') || '').trim()

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
    return searchData.filter((item) => 
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.code?.toLowerCase().includes(q) ||
      item.professor?.toLowerCase().includes(q)
    )
  }, [query, t, localize])

  return { query, results }
}

function SearchResults() {
  const { t } = useStore()
  const navigate = useNavigate()
  const { query, results } = useSearch()
  const [activeFilter, setActiveFilter] = useState<string>('all')

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

  const getActionLabel = (res: SearchResult) => {
    if (res.group === t('courses')) return t('go_to_course')
    if (res.group === t('pages')) return `${t('open')} ${res.label}`
    return t('go_to_content')
  }

  const resultsText = results.length === 1 ? t('search_results_singular') : t('search_results_plural')
  const subtitle = t('search_found_results')
    .replace('{count}', results.length.toString())
    .replace('{results}', resultsText)

  return (
    <Stack tag="main" className="search-results-page">
      <PageHeader
        pageKey="search"
        title={`${t('search_results')} for "${query}"`}
        subtitle={subtitle}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('search_results') },
        ]}
      />

      <div className="container pb-3xl">
        {results.length > 0 ? (
          <Stack gap="xl">
            <SearchResultFilters
              categories={categories}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <Grid columns={12} gap="lg">
              {filteredResults.map((res, i) => (
                <Grid.Item span={12} tabletSpan={6} mobileSpan={1} key={i}>
                  <SearchResultCard
                    item={res}
                    query={query}
                    actionLabel={getActionLabel(res)}
                    onClick={() => navigate(res.path)}
                  />
                </Grid.Item>
              ))}
            </Grid>
          </Stack>
        ) : (
          <EmptyState
            icon={Search}
            title={t('no_search_results')}
            description={t('search_no_results_desc')}
          />
        )}
      </div>
    </Stack>
  )
}

export default SearchResults

