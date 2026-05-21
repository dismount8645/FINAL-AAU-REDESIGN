import { useNavigate } from 'react-router-dom'
import { ChevronRight, Star } from 'lucide-react'
import Stack from '@/components/ui/Stack'
import { Text, Heading } from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import TeaserCard from '@/components/ui/TeaserCard'
import Card from '@/components/ui/Card'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'
import { courses as allCourses } from '@/data/mockData'

import { useMemo } from 'react'

export default function ModulesWidget({ span, isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const { t, courses, isFavorite, toggleFavorite, getCourseProgress } = useStore()

  const starredCourses = useMemo(() => courses.filter(c => isFavorite('course', c.id)), [courses, isFavorite])

  return (
    <Card className="h-full w-full flex flex-col modules-widget @container/widget">
      <Card.Header className="py-[var(--space-xs)] px-[var(--space-sm)]">
        <Text weight="bold" size="lg" className="card__title">
          {t('my_favorites')}
        </Text>
        {starredCourses.length > 0 && (
          <button
            type="button"
            className="text-sm text-primary dark:text-slate-200 font-semibold hover:underline cursor-pointer inline-flex items-center gap-[var(--space-2xs)] whitespace-nowrap transition-all hover:opacity-80 bg-transparent border-none p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm"
            onClick={() => !isEditing && navigate('/courses')}
          >
            {t('see_all')}<ChevronRight size={14} strokeWidth={2} />
          </button>
        )}
      </Card.Header>

      <Card.Body className="h-full w-full flex-1 p-[var(--space-xs)]">
        {starredCourses.length > 0 ? (
          <div className="h-full w-full flex gap-[var(--space-xs)] overflow-x-auto pb-[var(--space-2xs)] snap-x hide-scrollbar">
            {starredCourses.map((mod) => (
              <div key={mod.id} className="min-w-[180px] w-[200px] snap-start shrink-0 h-full">
                <TeaserCard
                  image={mod.img}
                  variant={span <= 4 ? 'horizontal' : 'vertical'}
                  badge={mod.status === 'active' ? t('active') : (mod.status === 'inactive' ? t('completed_short') : t('upcoming'))}
                  badgeColor={mod.status === 'active' ? 'success' : (mod.status === 'inactive' ? 'danger' : 'warning')}
                  title={mod.title}
                  progress={(() => {
                    const courseData = allCourses[mod.id]
                    const totalItems = courseData?.sections.reduce((sum, s) => sum + s.items.length, 0) || 0
                    return totalItems > 0 ? getCourseProgress(mod.id, totalItems) : (mod.status === 'inactive' ? 100 : 0)
                  })()}
                  progressColor={mod.status === 'active' ? 'var(--color-primary)' : (mod.status === 'inactive' ? 'var(--color-success)' : 'var(--text-muted)')}
                  isStarred={true}
                  onStarToggle={() => toggleFavorite('course', mod.id)}
                  onClick={() => !isEditing && navigate(`/course/${mod.id}`)}
                  className="favorite-card h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <Stack align="center" justify="center" gap="xs" className="h-full w-full modules-widget__empty p-[var(--space-xs)] bg-[var(--bg-body)] rounded-[var(--radius-lg)] border border-dashed border-[var(--border-color)]">
            <div className="modules-widget__empty-icon-wrapper p-[var(--space-sm)] bg-white rounded-[var(--radius-pill)] dark:bg-white/5">
              <Star size={24} strokeWidth={2} className="text-[var(--aau-light-orange)]" fill="var(--aau-light-orange)" aria-hidden="true" />
            </div>
            <Stack align="center" gap="2xs">
              <Heading level={3} className="modules-widget__empty-title text-center">
                {t('no_favorites_yet')}
              </Heading>
              <Text muted className="modules-widget__empty-text text-center max-w-[280px]">
                {t('no_favorites_hint')}
              </Text>
            </Stack>
            <Button variant="primary" onClick={() => navigate('/courses')} className="modules-widget__empty-action">
              {t('find_modules')}
            </Button>
          </Stack>
        )}
      </Card.Body>
    </Card>
  )
}
