import { useState, useEffect, useCallback, memo } from 'react'
import PageHeader from '@/components/PageHeader'
import Stack from '@/components/Stack'
import Card from '@/components/Card'
import Badge from '@/components/Badge'
import { Heading, Text } from '@/components/Typography'
import Button from '@/components/Button'
import useStore from '@/store/useStore'
import { ASSETS } from '@/lib'
import { useCoursesFilterAndSort } from '@/lib'
import { CoursesTabs, CoursesFilters, CoursesGrid } from '@/components'
import { env } from '@/lib/env'

const forums = [
  { id: 10, title: 'Studienævn for DDK', titleEn: 'Study Board for DDK', label: 'Information', labelEn: 'Information', img: '/assets/img/grafik/billeder/Studerende og studieliv/_2WB0369.webp', color: 'var(--color-success)' },
  { id: 11, title: 'Semesterforum (4. Semester)', titleEn: 'Semester Forum (4th Semester)', label: 'Fælles', labelEn: 'Shared', img: '/assets/img/grafik/billeder/Bygninger og campus/_2WB3689.webp', color: 'var(--color-primary)' },
]

function Courses() {
  const t = useStore((state) => state.t)
  const lang = useStore((state) => state.lang)
  const courses = useStore((state) => state.courses)
  const toggleFavorite = useStore((state) => state.toggleFavorite)
  const isFavorite = useStore((state) => state.isFavorite)
  const _favorites = useStore((state) => state.favorites)
  void _favorites

  const [showCourses, setShowCourses] = useState<boolean>(true)
  const [showForums, setShowForums] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(
    typeof window !== 'undefined' && import.meta.env.MODE !== 'test'
  )

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  const {
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
  } = useCoursesFilterAndSort({ courses, t, lang })

  const handleToggleFavorite = useCallback((type: 'course' | 'forum', id: number) => {
    toggleFavorite(type, id)
  }, [toggleFavorite])

  return (
    <Stack className="courses-page">
      <PageHeader
        pageKey="courses"
        title={t('courses')}
        subtitle={t('courses.subtitle')}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('courses') },
        ]}
      />

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
    </Stack>
  )
}

export default memo(Courses)
