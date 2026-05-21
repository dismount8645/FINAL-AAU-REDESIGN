import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, MessageSquare } from 'lucide-react'
import Grid from '@/components/ui/Grid'
import Stack from '@/components/ui/Stack'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { Heading, Text } from '@/components/ui/Typography'
import TeaserCard from '@/components/ui/TeaserCard'
import useStore, { type CourseWithStatus } from '@/store/useStore'

interface CoursesGridProps {
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
  const { t } = useStore()

  return (
    <>
      <Stack
        tag="button"
        className="section-block-header mt-[var(--space-xl)] w-full text-left border-none bg-transparent p-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-[var(--radius-md)]"
        direction="row"
        align="center"
        gap="sm"
        onClick={() => setShowCourses(!showCourses)}
        aria-expanded={showCourses}
      >
        <Heading level={2} className="section-block-header__title m-0 text-[1.25rem]">
          {t('your_courses')}
          <Text tag="span" size="sm" muted className="section-block-header__count ml-[var(--space-sm)] font-normal">
            ({sortedCourses.length} {sortedCourses.length === 1 ? t('active_course_singular') : t('active_courses')})
          </Text>
        </Heading>
        <Icon name={showCourses ? 'chevron-down' : 'chevron-right'} className="section-chevron text-[0.9rem] opacity-60 transition-transform duration-[var(--transition-fast)]" />
      </Stack>

      {showCourses && (
        <>
          {sortedCourses.length > 0 ? (
            <Grid columns={12} gap="lg">
              {sortedCourses.map((course) => {
                const courseBadge = t(`course_${course.id}_label`) || t('active')
                return (
                  <Grid.Item span={4} tabletSpan={6} mobileSpan={12} key={course.id}>
                    <div className="h-full cursor-pointer" onClick={() => navigate(`/course/${course.id}`)}>
                      <TeaserCard
                        variant="vertical"
                        image={course.img}
                        badge={courseBadge}
                        badgeColor={course.status === 'active' ? 'success' : (course.status === 'inactive' ? 'danger' : 'warning')}
                        title={t(`course_${course.id}_title`)}
                        description={`${t(`course_${course.id}_label`)} · ${course.code || ''}`}
                        isStarred={isFavorite('course', course.id)}
                        onStarToggle={() => {
                          toggleFavorite('course', course.id)
                        }}
                        action={
                          <Button 
                            variant="primary" 
                            size="md" 
                            iconRight={ArrowRight} 
                            pill
                          >
                            {t('open_module')}
                          </Button>
                        }
                      />
                    </div>
                  </Grid.Item>
                )
              })}
            </Grid>
          ) : (
            <Card className="bg-[var(--bg-card)] border-dashed py-[var(--space-3xl)]">
              <Stack align="center" justify="center" gap="md">
                <Icon name="magnifying-glass" className="text-[var(--text-muted)] opacity-20" size="3xl" />
                <Text muted>{t('no_search_results')}</Text>
                {searchQuery && (
                  <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                    {t('clear_search')}
                  </Button>
                )}
              </Stack>
            </Card>
          )}
        </>
      )}

      <Stack
        direction="row"
        align="center"
        justify="between"
        className="mt-[var(--space-2xl)]"
      >
        <Stack
          tag="button"
          className="section-block-header section-block-header--forums text-left border-none bg-transparent p-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-[var(--radius-md)]"
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
        <Button variant="ghost" size="xs" icon={ChevronRight} onClick={() => navigate('/courses')}>{t('view_all')}</Button>
      </Stack>

      {showForums && (
        <Grid columns={12} gap="lg" className="courses__forums-grid mb-2xl">
          {forums.map((forum) => (
            <Grid.Item span={6} tabletSpan={6} mobileSpan={12} key={forum.id}>
              <div className="h-full cursor-pointer" onClick={() => navigate(`/course/${forum.id}`)}>
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
                  action={
                    <Button variant="secondary" size="sm" iconRight={MessageSquare}>
                      {t('open_forum')}
                    </Button>
                  }
                />
              </div>
            </Grid.Item>
          ))}
        </Grid>
      )}
    </>
  )
}

export default memo(CoursesGrid)
