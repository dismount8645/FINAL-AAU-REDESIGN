import { useState, useMemo, useCallback, memo } from 'react'
import PageHeader from '@/components/common/PageHeader'
import Stack from '@/components/ui/Stack'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Heading, Text } from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import useStore from '@/store/useStore'
import { ASSETS } from '@/constants'
import { CoursesTabs, CoursesFilters, CoursesGrid } from './courses/index'

const forums = [
  { id: 10, title: 'Studienævn for DDK', titleEn: 'Study Board for DDK', label: 'Information', labelEn: 'Information', img: '/assets/img/grafik/billeder/Studerende og studieliv/_2WB0351.jpg', color: 'var(--color-success)' },
  { id: 11, title: 'Semesterforum (4. Semester)', titleEn: 'Semester Forum (4th Semester)', label: 'Fælles', labelEn: 'Shared', img: '/assets/img/grafik/billeder/Bygninger og campus/_2WB3689.jpg', color: 'var(--color-primary)' },
]

function Courses() {
  const { t, lang } = useStore()
  const { courses, toggleFavorite, isFavorite } = useStore()
  const [activeTab, setActiveTab] = useState<'current' | 'finished' | 'upcoming'>('current')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [sortBy, setSortBy] = useState<'alpha' | 'status'>('status')
  const [showCourses, setShowCourses] = useState<boolean>(true)
  const [showForums, setShowForums] = useState<boolean>(true)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const handleToggleFavorite = useCallback((type: 'course' | 'forum', id: number) => {
    toggleFavorite(type, id)
  }, [toggleFavorite])

  const labelFilters = useMemo(() => {
    const labels = new Set<string>()
    courses.forEach(c => {
      const label = t(`course_${c.id}_label`)
      if (label) labels.add(label)
    })
    return Array.from(labels).sort()
  }, [courses, t])

  const filteredCourses = useMemo(() => {
    const tabMap = {
      current: 'active',
      finished: 'inactive',
      upcoming: 'upcoming'
    }
    return courses.filter(c => {
      const matchesTab = c.status === tabMap[activeTab]
      const matchesSearch = searchQuery.trim() === '' || 
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

  return (
    <Stack className="courses-page">
      <PageHeader
        pageKey="courses"
        title={t('courses')}
        subtitle={t('courses_page_subtitle')}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('courses') },
        ]}
      />

      <div className="container container--courses pb-[var(--space-2xl)] mx-auto">
        <div className="courses-toolbar-wrapper w-full mb-[var(--space-lg)]">
          <Stack className="courses-toolbar bg-slate-50 dark:bg-slate-800/30 p-[var(--space-sm)] rounded-[var(--radius-lg)] border border-[var(--border-color)] flex-col md:flex-row md:justify-between md:items-center gap-sm">
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
          <Badge variant="warning" className="absolute right-[var(--space-lg)] top-[var(--space-lg)]">
            {t('enrollment_open')}
          </Badge>
          <div className="courses__promo-bg absolute right-0 top-0 bottom-0 w-[40%] opacity-30 pointer-events-none bg-cover bg-center [mask-image:linear-gradient(to_left,black,transparent)] [-webkit-mask-image:linear-gradient(to_left,black,transparent)]" style={{ backgroundImage: `url('${ASSETS.promo.student}')` }} />
          <Card.Body className="courses__promo-body p-[var(--space-3xl)_var(--space-xl)]">
            <Stack className="courses__promo-content relative z-[1] max-w-[var(--container-max-width)]">
              <Stack direction="row" gap="sm" align="center" className="courses__promo-badge-tag mb-[var(--space-sm)]">
                <Badge variant="warning" className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-[var(--radius-pill)] bg-warning animate-pulse" />
                  {t('enrollment_deadline_approaching')}
                </Badge>
              </Stack>
              <Heading level={2} className="courses__promo-title mb-[var(--space-md)] text-[2rem]">
                {t('ready_for_next_semester')}
              </Heading>
              <Text className="courses__promo-text opacity-85 text-[1.1rem] leading-[1.6] block">
                {t('upcoming_modules_stads_desc')}
              </Text>
              <div className="courses__promo-action mt-[var(--space-xl)]">
                <Button variant="ghost">
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
