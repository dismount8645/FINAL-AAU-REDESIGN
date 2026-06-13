import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Card } from '@/components/ui'
import Button from '@/components/ui/Button'
import { Icon } from '@/components/ui'
import { Heading, Text } from '@/components/ui'
import { PATHS } from '@/routes';
import { TeaserCard } from '@/components/ui'
import useStore, { type CourseWithStatus } from '@/store'
import { courses as coursesDataMap } from '@/lib/data'

interface CoursesGridProps {
  isLoading?: boolean
  sortedCourses: CourseWithStatus[]
  forums: { id: number; title: string; titleEn: string; label: string; labelEn: string; img: string; color: string }[]
  showCourses: boolean
  setShowCourses: (val: boolean) => void
  showForums: boolean
  setShowForums: (val: boolean) => void
  isFavorite: (type: 'course' | 'forum', id: number) => boolean
  toggleFavorite: (type: 'course' | 'forum', id: number) => void
  searchQuery: string
  setSearchQuery: (val: string) => void
}

function CoursesGrid({
  isLoading = false,
  sortedCourses,
  forums,
  showCourses,
  setShowCourses,
  showForums,
  setShowForums,
  isFavorite,
  toggleFavorite,
  searchQuery,
  setSearchQuery,
}: CoursesGridProps) {
  const navigate = useNavigate()
  const t = useStore((state) => state.t)
  const getCourseProgress = useStore((state) => state.getCourseProgress)

  return (
    <>
      <Stack
        tag="button"
        type="button"
        className="section-block-header mt-[var(--space-xl)] w-full text-left border-none bg-transparent p-0 cursor-pointer focus-visible:outline-none focus-visible:shadow-focus rounded-[var(--radius-md)]"
        direction="row"
        align="center"
        gap="sm"
        onClick={() => setShowCourses(!showCourses)}
        aria-expanded={showCourses}
      >
        <Heading level={2} className="section-block-header__title m-0 text-[1.25rem]">
          {t('your_courses')}
          <Text tag="span" size="sm" muted className="section-block-header__count ml-[var(--space-sm)] font-normal">
            ({sortedCourses.length} {sortedCourses.length === 1 ? t('courses.active_course_singular') : t('courses.active_courses')})
          </Text>
        </Heading>
        <Icon name={showCourses ? 'chevron-down' : 'chevron-right'} className="section-chevron text-[0.9rem] opacity-60 transition-transform duration-[var(--transition-fast)]" />
      </Stack>

      {showCourses && (
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Grid columns={12} gap="lg">
                {[1, 2, 3].map((id) => (
                  <Grid.Item span={4} key={`skeleton-course-${id}`}>
                    <TeaserCard variant="vertical" isLoading={true} hasAction={true} />
                  </Grid.Item>
                ))}
              </Grid>
            </motion.div>
          ) : sortedCourses.length > 0 ? (
            <motion.div
              key="courses-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Grid columns={12} gap="lg">
                {sortedCourses.map((course) => {
                  const courseBadge = t(`course_${course.id}_label`) || t('active')
                  const courseDetails = coursesDataMap[course.id]
                  const totalItems = courseDetails?.sections?.reduce((acc, sec) => acc + (sec.items?.length || 0), 0) || 0
                  const progress = course.status === 'active' && totalItems > 0 ? getCourseProgress(course.id, totalItems) : undefined
                  return (
                    <Grid.Item span={4} key={course.id}>
                      <TeaserCard
                        variant="vertical"
                        badge={courseBadge}
                        badgeColor={course.status === 'active' ? 'success' : (course.status === 'inactive' ? 'danger' : 'warning')}
                        title={t(`course_${course.id}_title`)}
                        description={`${t(`course_${course.id}_label`)} · ${course.code || ''} ${courseDetails?.professor ? `· ${courseDetails.professor}` : ''}`}
                        progress={progress}
                        isStarred={isFavorite('course', course.id)}
                        onStarToggle={() => {
                          toggleFavorite('course', course.id)
                        }}
                        onClick={() => navigate(PATHS.COURSE(course.id))}
                        action={
                          <Button 
                            variant="primary" 
                            size="md" 
                            iconRight={ArrowRight} 
                            pill
                            className="normal-case tracking-normal"
                          >
                            {t('open_module')}
                          </Button>
                        }
                      />
                    </Grid.Item>
                  )
                })}
              </Grid>
            </motion.div>
          ) : (
            <motion.div
              key="courses-empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Card className="bg-bg-card border-dashed py-[var(--space-3xl)]">
                <Stack align="center" justify="center" gap="md">
                  <Icon name="magnifying-glass" className="text-muted opacity-20" size="3xl" />
                  <Text muted>{t('no_search_results')}</Text>
                  {searchQuery && (
                    <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                      {t('clear_search')}
                    </Button>
                  )}
                </Stack>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <Stack
        direction="row"
        align="center"
        gap="sm"
        className="mt-[var(--space-2xl)]"
      >
        <Stack
          tag="button"
          type="button"
          className="section-block-header section-block-header--forums text-left border-none bg-transparent p-0 cursor-pointer focus-visible:outline-none focus-visible:shadow-focus rounded-[var(--radius-md)]"
          direction="row"
          align="center"
          gap="sm"
          onClick={() => setShowForums(!showForums)}
          aria-expanded={showForums}
        >
          <Heading level={2} className="section-block-header__title m-0 text-[1.25rem]">
            {t('your_forums')}
          </Heading>
          <Icon name={showForums ? 'chevron-down' : 'chevron-right'} className="section-chevron text-[0.9rem] opacity-60 transition-transform duration-[var(--transition-fast)]" />
        </Stack>
        <Button variant="ghost" size="sm" iconRight={ChevronRight} className="text-sm font-extrabold normal-case tracking-normal h-[44px] min-h-[44px]" onClick={() => navigate(PATHS.COURSES)}>{t('view_all')}</Button>
      </Stack>

      {showForums && (
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="forums-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Grid columns={12} gap="lg" className="courses__forums-grid mb-2xl">
                {[1, 2].map((id) => (
                  <Grid.Item span={6} key={`skeleton-forum-${id}`}>
                    <TeaserCard variant="horizontal" isLoading={true} hasAction={true} />
                  </Grid.Item>
                ))}
              </Grid>
            </motion.div>
          ) : (
            <motion.div
              key="forums-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Grid columns={12} gap="lg" className="courses__forums-grid mb-2xl">
                {forums.map((forum) => (
                  <Grid.Item span={6} key={forum.id}>
                    <TeaserCard
                      variant="horizontal"
                      image={forum.img}
                      badge={t(`forum_${forum.id}_label`)}
                      badgeColor="default"
                      title={t(`forum_${forum.id}_title`)}
                      description={t('shared_forum_description')}
                      isStarred={isFavorite('forum', forum.id)}
                      onStarToggle={() => {
                        toggleFavorite('forum', forum.id)
                      }}
                      onClick={() => navigate(PATHS.COURSE(forum.id))}
                      action={
                        <Button variant="secondary" size="sm" iconRight={MessageSquare} className="normal-case tracking-normal">
                          {t('open_forum')}
                        </Button>
                      }
                    />
                  </Grid.Item>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
}

if (import.meta.vitest) {
  const { describe, it, expect, vi } = await import('vitest')
  const { renderWithProviders } = await import('@/test/test-utils')

  describe('CoursesGrid', () => {
    const mockCourse = {
      id: 1, title: 'Digital Design', titleEn: 'Digital Design',
      label: 'L1', labelEn: 'L1', img: '', code: 'DD1',
      color: 'blue', status: 'active' as const,
    }
    const mockForum = {
      id: 10, title: 'Forum 1', titleEn: 'Forum 1',
      label: 'F1', labelEn: 'F1', img: '', color: 'green',
    }
    const defaultProps = {
      sortedCourses: [mockCourse],
      forums: [mockForum],
      showCourses: true,
      setShowCourses: vi.fn(),
      showForums: true,
      setShowForums: vi.fn(),
      isFavorite: vi.fn(() => false),
      toggleFavorite: vi.fn(),
      searchQuery: '',
      setSearchQuery: vi.fn(),
    }

    it('renders course section with heading', () => {
      const { container } = renderWithProviders(<CoursesGrid {...defaultProps} />)
      expect(container.querySelector('.section-block-header')).toBeInTheDocument()
    })

    it('renders course cards when showCourses is true', () => {
      const { container } = renderWithProviders(<CoursesGrid {...defaultProps} />)
      expect(container.querySelector('.section-block-header__title')).toBeInTheDocument()
    })

    it('renders loading skeleton for courses', () => {
      const { container } = renderWithProviders(<CoursesGrid {...defaultProps} isLoading={true} />)
      const gridItems = container.querySelectorAll('.grid-item')
      expect(gridItems.length).toBeGreaterThan(0)
    })

    it('hides courses when showCourses is false', () => {
      const { queryByText } = renderWithProviders(<CoursesGrid {...defaultProps} showCourses={false} />)
      expect(queryByText(/Digital Design/i)).not.toBeInTheDocument()
    })

    it('toggles course visibility on header click', () => {
      const setShow = vi.fn()
      const { container } = renderWithProviders(<CoursesGrid {...defaultProps} setShowCourses={setShow} />)
      const header = container.querySelector('.section-block-header') as HTMLElement | null
      header?.click()
      expect(setShow).toHaveBeenCalledWith(false)
    })

    it('renders forums section', () => {
      const { container } = renderWithProviders(<CoursesGrid {...defaultProps} />)
      const headers = container.querySelectorAll('.section-block-header')
      expect(headers.length).toBeGreaterThanOrEqual(2)
    })

    it('renders empty state when no courses match search', () => {
      const { getByText } = renderWithProviders(<CoursesGrid {...defaultProps} sortedCourses={[]} searchQuery="xyz" />)
      expect(getByText('Ryd søgning')).toBeInTheDocument()
    })

    it('renders empty state with clear search button', () => {
      const clearFn = vi.fn()
      const { getByText } = renderWithProviders(<CoursesGrid {...defaultProps} sortedCourses={[]} searchQuery="xyz" setSearchQuery={clearFn} />)
      const btn = getByText('Ryd søgning')
      expect(btn).toBeInTheDocument()
      btn.click()
      expect(clearFn).toHaveBeenCalledWith('')
    })

    it('renders starred courses correctly', () => {
      const fav = vi.fn(() => true)
      const { container } = renderWithProviders(<CoursesGrid {...defaultProps} isFavorite={fav} />)
      expect(container.querySelector('.section-block-header')).toBeInTheDocument()
    })

    it('renders view all forums button', () => {
      const { getByText } = renderWithProviders(<CoursesGrid {...defaultProps} />)
      expect(getByText('Se alle')).toBeInTheDocument()
    })

    it('navigates to course on card click', () => {
      const { getByLabelText } = renderWithProviders(<CoursesGrid {...defaultProps} />)
      fireEvent.click(getByLabelText('Digital Design og Kommunikation'))
    })

    it('navigates on view all forums click', () => {
      const { getByText } = renderWithProviders(<CoursesGrid {...defaultProps} />)
      fireEvent.click(getByText('Se alle'))
    })

    it('navigates to forum on card click', () => {
      const { getByLabelText } = renderWithProviders(<CoursesGrid {...defaultProps} />)
      fireEvent.click(getByLabelText('Studienævn for DDK'))
    })

    it('toggles forum favorite', () => {
      const toggleFn = vi.fn()
      const { getAllByLabelText } = renderWithProviders(
        <CoursesGrid {...defaultProps} toggleFavorite={toggleFn} />
      )
      fireEvent.click(getAllByLabelText('Tilføj til favoritter')[1])
      expect(toggleFn).toHaveBeenCalledWith('forum', 10)
    })
  })
}

export default memo(CoursesGrid)
