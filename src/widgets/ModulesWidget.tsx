import { useNavigate } from 'react-router-dom'
import { ChevronRight, Star, ArrowRight, LayoutGrid } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Stack from '@/components/ui/Stack'
import { Text, Heading } from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import TeaserCard from '@/components/ui/TeaserCard'
import Card from '@/components/ui/Card'
import type { WidgetProps, CourseListItem } from '@/types'
import useStore from '@/store/useStore'
import { courses as allCourses } from '@/data/mockData'
import { cn } from '@/lib/utils'

import { useMemo, memo, useCallback, forwardRef } from 'react'

// --- Sub-components ---

const EmptyState = memo(({ onAction }: { onAction: () => void }) => {
  const t = useStore(state => state.t)
  return (
    <Stack align="center" justify="center" gap="lg" className="h-full w-full py-[var(--space-xl)] px-[var(--space-md)] bg-bg-highlight rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--border-color)]/40 group/empty hover:border-primary/20 transition-colors duration-150">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/5 rounded-[var(--radius-full)] blur-xl scale-150 group-hover/empty:scale-175 transition-transform duration-300" />
        <div className="relative p-[var(--space-md)] bg-bg-card rounded-[var(--radius-full)] shadow-md border border-[var(--border-color)]/50">
          <Star size={32} strokeWidth={2.5} className="text-[var(--aau-light-gold)] animate-pulse" fill="currentColor" />
        </div>
      </div>
      
      <Stack align="center" gap="xs">
        <Heading level={3} className="text-xl font-black tracking-tight text-center text-main">
          {t('no_favorites_yet')}
        </Heading>
        <Text size="sm" className="text-center max-w-[280px] text-muted italic leading-relaxed">
          {t('no_favorites_hint')}
        </Text>
      </Stack>
      
      <Button 
        variant="primary" 
        onClick={onAction} 
        icon={LayoutGrid}
        className="shadow-md hover:shadow-xl transition-all"
      >
        {t('find_modules')}
      </Button>
    </Stack>
  )
})

const ModuleListItem = memo(forwardRef<HTMLDivElement, { 
  course: CourseListItem, 
  isEditing: boolean,
  onToggleFavorite: (id: number) => void,
  getCourseProgress: (id: number, total: number) => number
}>(({ course, isEditing, onToggleFavorite, getCourseProgress }, ref) => {
  const t = useStore(state => state.t)
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
    <motion.div 
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="min-w-[240px] sm:min-w-[280px] snap-start shrink-0 h-full py-[var(--space-2xs)]"
    >
      <TeaserCard
        image={course.img}
        variant="vertical"
        badge={statusBadge.label}
        badgeColor={statusBadge.color}
        title={course.title}
        progress={progress}
        progressColor={course.status === 'active' ? 'var(--color-primary)' : 'var(--aau-dark-green)'}
        isStarred={true}
        onStarToggle={() => onToggleFavorite(course.id)}
        onClick={() => !isEditing && navigate(`/course/${course.id}`)}
        className="favorite-card h-full ring-1 ring-[var(--border-color)]/40 hover:ring-primary/40 transition-shadow duration-150"
      />
    </motion.div>
  )
}))

ModuleListItem.displayName = 'ModuleListItem'

// --- Main Component ---

const ModulesWidget = ({ span, isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const courses = useStore(state => state.courses)
  const isFavorite = useStore(state => state.isFavorite)
  const toggleFavorite = useStore(state => state.toggleFavorite)
  const getCourseProgress = useStore(state => state.getCourseProgress)

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
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Star size={18} fill="currentColor" className="text-[var(--aau-light-gold)]" />
          </div>
          <Heading level={4} className="m-0 text-xs font-black uppercase tracking-tight text-main">
            {t('my_favorites')}
          </Heading>
        </Stack>
        
        {starredCourses.length > 0 && (
          <Button
            variant="ghost"
            size="xs"
            className="font-black uppercase tracking-widest text-primary hover:bg-bg-card/50"
            onClick={handleFindModules}
            iconRight={ArrowRight}
          >
            {t('see_all')}
          </Button>
        )}
      </Card.Header>

      <Card.Body className="p-0 flex-1 relative min-h-[300px]">
        {starredCourses.length > 0 ? (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-[var(--space-md)] custom-scrollbar scroll-smooth">
              <div className="flex gap-[var(--space-md)] h-full items-stretch">
                <AnimatePresence mode="popLayout">
                  {starredCourses.map((mod) => (
                    <ModuleListItem 
                      key={mod.id} 
                      course={mod} 
                      isEditing={isEditing}
                      onToggleFavorite={handleToggleFavorite}
                      getCourseProgress={getCourseProgress}
                    />
                  ))}
                </AnimatePresence>
                {/* Visual Spacer at end */}
                <div className="w-[var(--space-md)] shrink-0" aria-hidden="true" />
              </div>
            </div>
            
            {/* Aesthetic scroll indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-card to-transparent pointer-events-none opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-card to-transparent pointer-events-none opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="h-full w-full p-[var(--space-md)]">
            <EmptyState onAction={handleFindModules} />
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default memo(ModulesWidget)

