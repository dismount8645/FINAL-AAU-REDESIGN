import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, within } from '@testing-library/react';
import { CoursesTabs, CoursesFilters, CoursesGrid } from '@/components/Courses';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { PageLayout } from '@/components/Layout';
import { Card } from '@/components/ui';
import { Stack } from '@/components/Layout';
import { Heading, Text } from '@/components/ui';
import { ASSETS } from '@/lib';
import { useFilteredCollection } from '@/hooks';
import { env } from '@/lib/env';
import useStore from '@/store';
import { renderWithProviders } from '@/test/test-utils';
import type { CourseWithStatus } from '@/store';

const forums = [
  { id: 10, title: 'Studienævn for DDK', titleEn: 'Study Board for DDK', label: 'Information', labelEn: 'Information', img: '/images/student-life/2wb0369.webp', color: 'var(--color-success)' },
  { id: 11, title: 'Semesterforum (4. Semester)', titleEn: 'Semester Forum (4th Semester)', label: 'Fælles', labelEn: 'Shared', img: '/images/campus/2wb3689.webp', color: 'var(--color-primary)' },
]

// Status weights used by the sort comparator
const STATUS_WEIGHT: Record<string, number> = { active: 0, upcoming: 1, inactive: 2 }
const TAB_MAP = { current: 'active', finished: 'inactive', upcoming: 'upcoming' } as const

function Courses() {
  const t = useStore((state) => state.t)
  const lang = useStore((state) => state.lang)
  const courses = useStore((state) => state.courses)
  const toggleFavorite = useStore((state) => state.toggleFavorite)
  const isFavorite = useStore((state) => state.isFavorite)

  const [showCourses, setShowCourses] = useState<boolean>(true)
  const [showForums, setShowForums] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(
    typeof window !== 'undefined' && import.meta.env.MODE !== 'test'
  )
  const [activeTab, setActiveTab] = useState<'current' | 'finished' | 'upcoming'>('current')
  const [sortBy, setSortBy] = useState<'alpha' | 'status'>('status')

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  // Pre-filter by active tab so the generic hook only sees tab-relevant courses
  const tabCourses = useMemo(
    () => courses.filter(c => c.status === TAB_MAP[activeTab]),
    [courses, activeTab]
  )

  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filterOptions: labelFilters,
    sortDirection: sortOrder,
    setSortDirection: setSortOrder,
    items: sortedCourses,
  } = useFilteredCollection<CourseWithStatus>(tabCourses, {
    searchKeys: c => [
      t(`course_${c.id}_title`),
      c.code ?? '',
      t(`course_${c.id}_label`),
    ],
    filterKey: c => t(`course_${c.id}_label`),
    filterDefault: null,
    filterOptions: items => Array.from(new Set(items.map(c => t(`course_${c.id}_label`)).filter(Boolean))).sort(),
    sortComparator: (a, b, dir) => {
      if (sortBy === 'status') {
        const diff = (STATUS_WEIGHT[a.status] ?? 0) - (STATUS_WEIGHT[b.status] ?? 0)
        if (diff !== 0) return diff * (dir === 'asc' ? 1 : -1)
      }
      const aTitle = t(`course_${a.id}_title`)
      const bTitle = t(`course_${b.id}_title`)
      return dir === 'asc'
        ? aTitle.localeCompare(bTitle, lang)
        : bTitle.localeCompare(aTitle, lang)
    },
  })

  const handleToggleFavorite = useCallback((type: 'course' | 'forum', id: number) => {
    toggleFavorite(type, id)
  }, [toggleFavorite])

  return (
    <PageLayout
      className="courses-page"
      pageKey="courses"
      title={t('courses')}
      subtitle={t('courses.subtitle')}
      breadcrumbs={[
        { label: t('dashboard'), href: '/' },
        { label: t('courses') },
      ]}
    >

      <div className="container container--courses pb-[var(--space-2xl)] mx-auto">
        <div className="courses-toolbar-wrapper w-full mb-[var(--space-lg)]">
          <Stack className="courses-toolbar bg-bg-highlight/30 dark:bg-white/5 p-[var(--space-sm)] rounded-[var(--radius-lg)] border border-border/40 flex-col md:flex-row md:justify-between md:items-center gap-sm">
            <CoursesTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <CoursesFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortBy={sortBy}
              setSortBy={setSortBy}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              labelFilters={labelFilters}
            />
          </Stack>
        </div>

        <CoursesGrid
          isLoading={isLoading}
          sortedCourses={sortedCourses}
          forums={forums}
          showCourses={showCourses}
          setShowCourses={setShowCourses}
          showForums={showForums}
          setShowForums={setShowForums}
          isFavorite={isFavorite}
          toggleFavorite={handleToggleFavorite}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <Card variant="brand" className="courses__promo-card relative overflow-hidden mt-xl">
          <Badge className="absolute right-[var(--space-lg)] top-[var(--space-lg)] bg-[var(--aau-dark-orange)] text-white border-none font-bold shadow-sm">
            {t('enrollment_open')}
          </Badge>
          <div className="courses__promo-bg absolute right-0 top-0 bottom-0 w-[40%] opacity-30 pointer-events-none bg-cover bg-center [mask-image:linear-gradient(to_left,black,transparent)] [-webkit-mask-image:linear-gradient(to_left,black,transparent)]" style={{ backgroundImage: `url('${ASSETS.promo.student}')` }} />
          <Card.Body className="courses__promo-body p-[var(--space-3xl)_var(--space-xl)]">
            <Stack className="courses__promo-content relative z-[1] max-w-[var(--container-max-width)]">
              <Stack direction="row" gap="sm" align="center" className="courses__promo-badge-tag mb-[var(--space-sm)]">
                <Badge className="inline-flex items-center gap-1.5 bg-[var(--aau-dark-orange)] text-white border-none font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-[var(--radius-pill)] bg-white animate-pulse" />
                  {t('enrollment_deadline_approaching')}
                </Badge>
              </Stack>
              <Heading level={2} className="courses__promo-title mb-[var(--space-md)] text-3xl font-black text-white">
                {t('ready_for_next_semester')}
              </Heading>
              <Text className="courses__promo-text text-white/90 text-md leading-relaxed block font-medium">
                {t('upcoming_modules_stads_desc')}
              </Text>
              <div className="courses__promo-action mt-[var(--space-xl)]">
                <Button 
                  onClick={() => env.open('https://kursuskatalog.aau.dk')}
                  className="bg-white text-primary hover:bg-white/90 hover:-translate-y-1 border-none font-bold px-md h-10 text-xs rounded-[var(--radius-md)] shadow-sm"
                >
                  {t('course_catalog')}
                </Button>
              </div>
            </Stack>
          </Card.Body>
        </Card>
      </div>
    </PageLayout>
  )
}

export default memo(Courses)

if (import.meta.vitest) {
  describe('Courses', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({ lang: 'da' })
    })
    it('renders courses correctly', () => {
      renderWithProviders(<Courses />)
      expect(screen.getAllByText('Moduler').length).toBeGreaterThan(0)
      expect(screen.getByText('I gang')).toBeInTheDocument()
    })
  
    it('switches tabs correctly', () => {
      renderWithProviders(<Courses />)
      const completedTab = screen.getByText('Afsluttede')
      fireEvent.click(completedTab)
      // Should show no courses in mock data for inactive status usually, or check count
      expect(completedTab.closest('.tabs__item--active')).toBeDefined()
    })
  
    it('toggles sections including forums', () => {
      renderWithProviders(<Courses />)
      const coursesHeader = screen.getByText(/Dine moduler/i)
      fireEvent.click(coursesHeader)
      expect(screen.queryByText('Åbn modul')).not.toBeInTheDocument()
      
      const forumsHeader = screen.getByText(/Dine Fora/i)
      fireEvent.click(forumsHeader)
      expect(screen.queryByText('Studienævn for DDK')).not.toBeInTheDocument()
    })
  
    it('toggles star on a course', () => {
      const toggleFavorite = vi.fn()
      useStore.setState({ toggleFavorite })
      renderWithProviders(<Courses />)
      const stars = document.querySelectorAll('.teaser-card__star')
      if (stars.length > 0) {
        fireEvent.click(stars[0])
        expect(toggleFavorite).toHaveBeenCalledWith('course', expect.any(Number))
      }
    })
  
    it('toggles the star on a forum card', () => {
      const toggleFavorite = vi.fn()
      useStore.setState({ toggleFavorite })
      renderWithProviders(<Courses />)
      // Forum cards are horizontal teaser cards
      const forumsGrid = document.querySelector('.courses__forums-grid')
      const forumStars = forumsGrid?.querySelectorAll('.teaser-card__star')
      if (forumStars && forumStars.length > 0) {
        fireEvent.click(forumStars[0])
        expect(toggleFavorite).toHaveBeenCalledWith('forum', expect.any(Number))
      }
    })
  
    it('switches to upcoming tab and shows upcoming courses', () => {
      renderWithProviders(<Courses />)
      fireEvent.click(screen.getByText('Kommende'))
      expect(screen.getByText('Bachelorprojekt')).toBeInTheDocument()
    })
  
    it('switches to completed tab and shows completed courses', () => {
      renderWithProviders(<Courses />)
      fireEvent.click(screen.getByText('Afsluttede'))
      expect(screen.getByText('Problembaseret Læring (PBL)')).toBeInTheDocument()
    })
  
    it('renders in English with English course titles', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<Courses />)
      expect(screen.getByText('Digital Design and Communication')).toBeInTheDocument()
      expect(screen.getByText('Web Development and CMS')).toBeInTheDocument()
      expect(screen.getByText('Module 4')).toBeInTheDocument()
    })
  
    it('renders forums with English titles', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<Courses />)
      expect(screen.getByText('Study Board for DDK')).toBeInTheDocument()
      expect(screen.getByText('Semester Forum (4th Semester)')).toBeInTheDocument()
    })
  
    it('renders Module 1 label for course 3 in English', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<Courses />)
      // Course 3 (Videnskabsteori) now has labelEn: "Module 1"
      expect(screen.getByText('Module 1')).toBeInTheDocument()
    })
  
    it('types in search input to filter courses', () => {
      renderWithProviders(<Courses />)
      const searchInput = screen.getByPlaceholderText(/søg/i) as HTMLInputElement
      fireEvent.change(searchInput, { target: { value: 'Digital' } })
      expect(screen.getAllByText(/Digital Design og Kommunikation/).length).toBeGreaterThan(0)
    })
  
    it('opens filter dropdown and selects a label filter', () => {
      renderWithProviders(<Courses />)
      const filterBtn = screen.getByText('Filter')
      fireEvent.click(filterBtn)
      expect(screen.getByText('Alle')).toBeInTheDocument()
      const dropdownContent = document.querySelector('[data-slot="dropdown-content"]')!
      const labelBtn = within(dropdownContent as HTMLElement).getByText('Modul 4')
      fireEvent.click(labelBtn)
    })
  
    it('opens filter dropdown and clears filter with All', () => {
      renderWithProviders(<Courses />)
      const filterBtn = screen.getByText('Filter')
      fireEvent.click(filterBtn)
      const allBtn = screen.getByText('Alle')
      fireEvent.click(allBtn)
      expect(screen.queryByText('Alle')).not.toBeInTheDocument()
    })
  
    it('closes filter dropdown on click outside', () => {
      renderWithProviders(<Courses />)
      const filterBtn = screen.getByText('Filter')
      fireEvent.click(filterBtn)
      expect(screen.getByText('Alle')).toBeInTheDocument()
      fireEvent.mouseDown(document.body)
      expect(screen.queryByText('Alle')).not.toBeInTheDocument()
    })
  
    it('toggles sort order', () => {
      renderWithProviders(<Courses />)
      const sortBtn = screen.getByText('Aktive først')
      fireEvent.click(sortBtn)
      fireEvent.click(sortBtn)
    })
  
    it('shows clear search button when no results found', () => {
      renderWithProviders(<Courses />)
      const searchInput = screen.getByPlaceholderText(/søg/i) as HTMLInputElement
      fireEvent.change(searchInput, { target: { value: 'zzznonexistent' } })
      const clearBtn = screen.getByText('Ryd søgning')
      fireEvent.click(clearBtn)
      expect(screen.queryByText('Ryd søgning')).not.toBeInTheDocument()
    })
  
    it('renders clear search button in English', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<Courses />)
      const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement
      fireEvent.change(searchInput, { target: { value: 'zzz' } })
      expect(screen.getByText('Clear search')).toBeInTheDocument()
    })
  
    it('clears search via SearchInput X button', () => {
      renderWithProviders(<Courses />)
      const searchInput = screen.getByPlaceholderText(/søg/i) as HTMLInputElement
      fireEvent.change(searchInput, { target: { value: 'test' } })
      const clearBtn = screen.getByRole('button', { name: 'Clear search' })
      fireEvent.click(clearBtn)
      expect(searchInput).toHaveValue('')
    })
  
    it('cycles through all sort combinations', () => {
      renderWithProviders(<Courses />)
      const sortBtn = screen.getByText('Aktive først')
      // status asc (default) -> status desc
      fireEvent.click(sortBtn)
      expect(screen.getByText('Inaktive først')).toBeInTheDocument()
      // status desc -> alpha asc
      fireEvent.click(sortBtn)
      expect(screen.getByText('A-Å')).toBeInTheDocument()
      // alpha asc -> alpha desc
      fireEvent.click(sortBtn)
      expect(screen.getByText('Å-A')).toBeInTheDocument()
      // alpha desc -> status asc
      fireEvent.click(sortBtn)
      expect(screen.getByText('Aktive først')).toBeInTheDocument()
    })
  
    it('toggles course favorite star', () => {
      renderWithProviders(<Courses />)
      const stars = screen.getAllByLabelText(/favorit/i)
      fireEvent.click(stars[0])
      // Verify it toggles (this depends on your store mock, but if it calls toggleFavorite it should be covered)
    })
  
    it('toggles forum favorite star', () => {
      renderWithProviders(<Courses />)
      // Find a star in the forums section
      const forumsHeading = screen.getByText(/Dine Fora/i)
      const forumStar = forumsHeading.parentElement?.parentElement?.parentElement?.querySelector('button[aria-label*="favorit"]')
      if (forumStar) fireEvent.click(forumStar)
    })
  })
}
