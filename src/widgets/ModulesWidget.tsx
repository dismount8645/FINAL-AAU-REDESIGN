import { useNavigate } from 'react-router-dom'
import { ChevronRight, Star, ArrowRight, LayoutGrid } from 'lucide-react'
import Stack from '@/components/ui/Stack'
import { Text, Heading } from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import TeaserCard from '@/components/ui/TeaserCard'
import Card from '@/components/ui/Card'
import type { WidgetProps, CourseListItem } from '@/types'
import useStore from '@/store/useStore'
import { courses as allCourses } from '@/data/mockData'
import { cn } from '@/lib/utils'

import { useMemo, memo, useCallback } from 'react'

// --- Sub-components ---

const EmptyState = memo(({ onAction }: { onAction: () => void }) => {
  const { t } = useStore()
  return (
    <Stack align="center" justify="center" gap="lg" className="h-full w-full py-10 px-6 bg-muted/20 rounded-[2rem] border-4 border-dashed border-border/40 group/empty hover:border-primary/20 transition-colors">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl scale-150 group-hover/empty:scale-175 transition-transform" />
        <div className="relative p-6 bg-card rounded-full shadow-lg border border-border/50">
          <Star size={32} strokeWidth={2.5} className="text-aau-light-gold animate-pulse" fill="currentColor" />
        </div>
      </div>
      
      <Stack align="center" gap="xs">
        <Heading level={3} className="text-2xl font-black tracking-tight text-center">
          {t('no_favorites_yet')}
        </Heading>
        <Text muted className="text-center max-w-[280px] leading-relaxed italic opacity-80">
          {t('no_favorites_hint')}
        </Text>
      </Stack>
      
      <Button 
        variant="primary" 
        onClick={onAction} 
        icon={LayoutGrid}
        className="shadow-md hover:shadow-xl transition-all active:scale-95"
      >
        {t('find_modules')}
      </Button>
    </Stack>
  )
})

const ModuleListItem = memo(({ 
  course, 
  isEditing, 
  onToggleFavorite, 
  getCourseProgress 
}: { 
  course: CourseListItem, 
  isEditing: boolean,
  onToggleFavorite: (id: number) => void,
  getCourseProgress: (id: number, total: number) => number
}) => {
  const { t } = useStore()
  const navigate = useNavigate()

  const progress = useMemo(() => {
    const courseData = allCourses[course.id]
    const totalItems = courseData?.sections.reduce((sum, s) => sum + s.items.length, 0) || 0
    return totalItems > 0 ? getCourseProgress(course.id, totalItems) : (course.status === 'inactive' ? 100 : 0)
  }, [course, getCourseProgress])

  const statusBadge = useMemo(() => {
    const config = {
      active: { label: t('active'), color: 'success' as const },
      inactive: { label: t('completed_short'), color: 'info' as const },
      upcoming: { label: t('upcoming'), color: 'warning' as const }
    }
    return config[course.status as keyof typeof config] || config.upcoming
  }, [course.status, t])

  return (
    <div className="min-w-[240px] sm:min-w-[280px] snap-start shrink-0 h-full py-2">
      <TeaserCard
        image={course.img}
        variant="vertical"
        badge={statusBadge.label}
        badgeColor={statusBadge.color}
        title={course.title}
        progress={progress}
        progressColor={course.status === 'active' ? 'var(--color-primary)' : 'var(--color-success)'}
        isStarred={true}
        onStarToggle={() => onToggleFavorite(course.id)}
        onClick={() => !isEditing && navigate(`/course/${course.id}`)}
        className="favorite-card h-full ring-1 ring-border/40 hover:ring-primary/40 transition-shadow"
      />
    </div>
  )
})

// --- Main Component ---

const ModulesWidget = ({ span, isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const { t, courses, isFavorite, toggleFavorite, getCourseProgress } = useStore()

  const starredCourses = useMemo(() => 
    courses.filter(c => isFavorite('course', c.id)),
    [courses, isFavorite]
  )

  const handleToggleFavorite = useCallback((id: number) => {
    toggleFavorite('course', id)
  }, [toggleFavorite])

  const handleFindModules = useCallback(() => {
    if (!isEditing) navigate('/courses')
  }, [isEditing, navigate])

  return (
    <Card className={cn(
      "h-full w-full flex flex-col modules-widget @container/widget group/widget overflow-hidden",
      "shadow-sm hover:shadow-md transition-shadow duration-300 border-border/60"
    )}>
      <Card.Header spacing="compact" className="border-b border-border/40 bg-bg-card/30 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-primary/5 rounded-lg text-primary">
            <Star size={18} fill="currentColor" className="text-aau-light-gold" />
          </div>
          <Text weight="black" size="lg" className="tracking-tight uppercase text-xs sm:text-sm">
            {t('my_favorites')}
          </Text>
        </Stack>
        
        {starredCourses.length > 0 && (
          <button
            type="button"
            className="group/link text-[0.7rem] font-black uppercase tracking-[0.1em] text-primary hover:text-aau-blue inline-flex items-center gap-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
            onClick={handleFindModules}
            aria-label={t('see_all')}
          >
            {t('see_all')}
            <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
          </button>
        )}
      </Card.Header>

      <Card.Body className="p-0 flex-1 relative min-h-[300px]">
        {starredCourses.length > 0 ? (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-4 sm:px-6 custom-scrollbar scroll-smooth">
              <div className="flex gap-4 h-full items-stretch">
                {starredCourses.map((mod) => (
                  <ModuleListItem 
                    key={mod.id} 
                    course={mod} 
                    isEditing={isEditing}
                    onToggleFavorite={handleToggleFavorite}
                    getCourseProgress={getCourseProgress}
                  />
                ))}
                {/* Visual Spacer at end */}
                <div className="w-4 sm:w-6 shrink-0" aria-hidden="true" />
              </div>
            </div>
            
            {/* Aesthetic scroll indicators or subtle glow */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent pointer-events-none opacity-0 group-hover/widget:opacity-100 transition-opacity" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none opacity-0 group-hover/widget:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="h-full w-full p-4 sm:p-8">
            <EmptyState onAction={handleFindModules} />
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default memo(ModulesWidget)

