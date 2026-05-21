import { memo, useMemo, type ReactNode, type MouseEvent } from 'react'
import { Star, ChevronRight } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'

import { cn } from '@/lib/utils'
import useStore from '@/store/useStore'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { Heading, Text } from '@/components/ui/Typography'
import { Skeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'

/**
 * TeaserCard Variants - Senior UI/UX Architect refinement.
 * Enforces the 8pt grid, AAU design tokens, and smooth physics.
 */
const teaserCardVariants = cva(
  [
    'group relative flex flex-col overflow-hidden h-full min-w-0 max-w-full isolate',
    'bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-xl)]',
    'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-xl)] hover:border-[var(--aau-blue)]',
    'transition-all duration-300 ease-[var(--transition-ease)] hover:-translate-y-1',
    'focus-within:ring-2 focus-within:ring-[var(--aau-blue)] focus-within:ring-offset-2',
    '@container/teaser cursor-pointer'
  ],
  {
    variants: {
      variant: {
        vertical: 'flex-col',
        horizontal: 'flex-col lg:flex-row min-h-[180px]',
      },
      isLoading: {
        true: 'cursor-default pointer-events-none hover:transform-none hover:shadow-[var(--shadow-sm)]',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'vertical',
      isLoading: false,
    },
  }
)

export interface TeaserCardProps
  extends VariantProps<typeof teaserCardVariants> {
  /** Unique ID for shared element transitions */
  layoutId?: string
  /** Loading state for skeleton rendering */
  isLoading?: boolean
  /** Optional image URL */
  image?: string
  /** Content for the badge */
  badge?: ReactNode
  /** Color variant for the badge */
  badgeColor?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'
  /** Primary title of the card */
  title?: ReactNode
  /** Descriptive text below the title */
  description?: string
  /** Progress percentage (0-100) */
  progress?: number
  /** Color of the progress bar */
  progressColor?: string
  /** Click handler for the main card action */
  onClick?: (e: MouseEvent) => void
  /** Callback for toggling the star state */
  onStarToggle?: (starred: boolean) => void
  /** Optional additional action node */
  action?: ReactNode
  /** Starred state */
  isStarred?: boolean
  /** Custom CSS classes */
  className?: string
}

/**
 * TeaserCard - High-performance UI component for course modules and content previews.
 * 
 * Architectural Refinements:
 * 1. Modularize: Extract sub-components for better maintainability.
 * 2. Accessibility: Ensure 44x44px targets and proper semantic buttons.
 * 3. Tokens: Strict usage of --aau-* brand variables and 8pt grid steps.
 * 4. Motion: 150ms hover responses and spring-based micro-interactions.
 * 5. Performance: Memoized sub-renders and optimized state selection.
 */
const TeaserCard = memo(function TeaserCard({
  layoutId,
  isLoading = false,
  variant = 'vertical',
  image,
  badge,
  badgeColor = 'default',
  title,
  description,
  progress,
  progressColor,
  onClick,
  onStarToggle,
  action,
  isStarred = false,
  className,
}: TeaserCardProps) {
  const { t } = useStore()

  const progressData = useMemo(() => {
    if (progress === undefined || isLoading) return null
    const rounded = Math.round(Math.max(0, Math.min(100, progress)))
    return {
      value: rounded,
      label: rounded > 0 ? `${rounded}% ${t('completed_short')}` : null
    }
  }, [progress, t, isLoading])

  const isHorizontal = variant === 'horizontal'

  if (isLoading) return <TeaserCardSkeleton variant={variant} className={className} />

  return (
    <motion.div
      layoutId={layoutId}
      className={cn(teaserCardVariants({ variant, isLoading }), className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Primary Semantic Action - Stretched Link Pattern */}
      <Button
        variant="ghost"
        className="absolute inset-0 z-[1] w-full h-full p-0 rounded-none opacity-0 focus:opacity-0 focus-visible:opacity-0"
        aria-label={typeof title === 'string' ? title : 'View details'}
        onClick={(e) => onClick?.(e)}
      />

      {/* Media Layer */}
      {image && (
        <div 
          className={cn(
            'relative shrink-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.05]',
            isHorizontal 
              ? 'w-full lg:w-[260px] aspect-video lg:aspect-auto lg:h-full' 
              : 'w-full aspect-video'
          )}
        >
          {badge && (
            <div className="absolute top-[var(--space-sm)] left-[var(--space-sm)] z-10">
              <Badge 
                variant={badgeColor} 
                className="shadow-xl backdrop-blur-md bg-black/40 text-white border-none font-bold px-2 py-0.5"
              >
                {badge}
              </Badge>
            </div>
          )}
          <img
            src={image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-[2] flex flex-col flex-1 p-[var(--space-md)] gap-[var(--space-xs)] min-w-0">
        <div className="flex items-start justify-between gap-[var(--space-md)]">
          <div className="flex-1 min-w-0">
            {!image && badge && (
              <Badge variant={badgeColor} className="mb-[var(--space-xs)] font-bold">
                {badge}
              </Badge>
            )}
            <Heading 
              level={3} 
              className="m-0 text-[1.125rem] font-bold leading-[1.3] text-[var(--text-main)] transition-colors group-hover:text-[var(--aau-blue)] line-clamp-2"
            >
              {title}
            </Heading>
          </div>

          {/* Favorite Toggle - Uses refactored Button for 44px safety and consistency */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'relative z-30 transition-all duration-300',
              isStarred 
                ? 'bg-[var(--aau-light-gold)] text-[var(--aau-light-orange)] shadow-md hover:bg-[var(--aau-dark-gold)] hover:text-white' 
                : 'bg-[var(--bg-hover)] text-[var(--text-disabled)] hover:text-[var(--text-main)] shadow-sm'
            )}
            onClick={(e) => {
              e.stopPropagation()
              onStarToggle?.(!isStarred)
            }}
            aria-label={isStarred ? t('remove_favorite') : t('add_favorite')}
            aria-pressed={isStarred}
            pill
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isStarred ? 'starred' : 'unstarred'}
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Star 
                  size={20} 
                  strokeWidth={2.5} 
                  fill={isStarred ? 'currentColor' : 'none'} 
                />
              </motion.div>
            </AnimatePresence>
          </Button>
        </div>

        {description && (
          <Text 
            size="sm" 
            className="line-clamp-2 leading-[1.6] text-[var(--text-muted)] min-h-[3.2rem]"
          >
            {description}
          </Text>
        )}

        {/* Progress Section */}
        {progressData && (
          <div className="mt-auto pt-[var(--space-xs)] space-y-[var(--space-xs)]">
            <ProgressBar 
              value={progressData.value} 
              color={progressColor || 'var(--aau-blue)'} 
              height={8} 
              className="rounded-full overflow-hidden"
            />
            {progressData.label && (
              <Text size="xs" weight="bold" className="text-[var(--text-muted)] flex items-center gap-[var(--space-xs)]">
                <span className="size-2 rounded-full bg-[var(--aau-blue)] animate-pulse" />
                {progressData.label}
              </Text>
            )}
          </div>
        )}

        {action && (
          <div className="relative z-30 pt-[var(--space-md)] mt-auto">
            {action}
          </div>
        )}

        {/* Interactive Cue */}
        <div className="absolute bottom-[var(--space-md)] right-[var(--space-md)] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none">
          <ChevronRight size={22} strokeWidth={3} className="text-[var(--aau-blue)]" />
        </div>
      </div>
    </motion.div>
  )
})

/**
 * Dedicated Skeleton for Layout Stability (CLS Prevention)
 */
function TeaserCardSkeleton({ variant, className }: { variant: 'vertical' | 'horizontal', className?: string }) {
  const isHorizontal = variant === 'horizontal'
  return (
    <div className={cn(teaserCardVariants({ variant, isLoading: true }), className)}>
      <div className={cn(
        'relative shrink-0 overflow-hidden bg-[var(--bg-placeholder)]',
        isHorizontal ? 'w-full lg:w-[260px] aspect-video lg:h-full' : 'w-full aspect-video'
      )}>
        <Skeleton variant="rectangular" className="w-full h-full" />
      </div>
      <div className="flex flex-col flex-1 p-[var(--space-md)] gap-[var(--space-sm)]">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-[var(--space-xs)]">
            <Skeleton variant="text" width="30%" height="0.75rem" />
            <Skeleton variant="text" width="85%" height="1.5rem" />
          </div>
          <Skeleton variant="circle" size={44} className="shrink-0" />
        </div>
        <div className="space-y-[var(--space-2xs)]">
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="95%" />
        </div>
        <div className="mt-auto pt-[var(--space-md)]">
          <Skeleton variant="rectangular" height={8} className="w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default TeaserCard
