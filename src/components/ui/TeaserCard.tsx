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
    'bg-bg-card border border-border rounded-xl',
    'shadow-sm hover:shadow-xl hover:border-primary',
    'transition-all duration-150 ease-[var(--transition-ease)] hover:-translate-y-1',
    'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
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
  /** Hint for skeleton rendering to reserve space for action */
  hasAction?: boolean
  /** Hint for skeleton rendering to reserve space for progress */
  hasProgress?: boolean
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
  hasAction = false,
  hasProgress = false,
}: TeaserCardProps) {
  const t = useStore(state => state.t)

  const progressData = useMemo(() => {
    if (progress === undefined || isLoading) return null
    const rounded = Math.round(Math.max(0, Math.min(100, progress)))
    return {
      value: rounded,
      label: rounded > 0 ? `${rounded}% ${t('completed_short')}` : null
    }
  }, [progress, t, isLoading])

  const isHorizontal = variant === 'horizontal'

  if (isLoading) {
    return (
      <TeaserCardSkeleton 
        variant={variant} 
        className={className} 
        hasAction={hasAction || !!action}
        hasProgress={hasProgress || progress !== undefined}
      />
    )
  }

  return (
    <motion.div
      layoutId={layoutId}
      className={cn(teaserCardVariants({ variant, isLoading }), className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onClick={(e) => onClick?.(e)}
    >
      {/* Primary Semantic Action - Stretched Link Pattern */}
      <Button
        variant="ghost"
        className="absolute inset-0 z-[1] w-full h-full p-0 rounded-none opacity-0 focus-visible:outline-none"
        aria-label={typeof title === 'string' ? title : 'View details'}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.(e)
        }}
      />

      {/* Media Layer */}
      {image && (
        <div 
          className={cn(
            'relative shrink-0 overflow-hidden transition-transform duration-500 ease-[var(--transition-ease)] group-hover:scale-105',
            isHorizontal 
              ? 'w-full lg:w-[260px] aspect-video lg:aspect-auto lg:h-full' 
              : 'w-full aspect-video'
          )}
        >
          {badge && (
            <div className="absolute top-sm left-sm z-10">
              <Badge 
                variant={badgeColor} 
                className="shadow-xl backdrop-blur-md font-bold px-2 py-0.5 border-none"
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
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-[2] flex flex-col flex-1 p-md gap-xs min-w-0">
        <div className="flex items-start justify-between gap-md">
          <div className="flex-1 min-w-0">
            {!image && badge && (
              <Badge variant={badgeColor} className="mb-xs font-bold">
                {badge}
              </Badge>
            )}
            <Heading 
              level={3} 
              className="m-0 text-[1.125rem] font-bold leading-tight text-main transition-colors group-hover:text-primary line-clamp-2"
            >
              {title}
            </Heading>
          </div>

          {/* Favorite Toggle */}
          <Button
            size="icon-sm"
            variant="ghost"
            pill
            className={cn(
              'relative z-30 transition-all duration-300',
              isStarred 
                ? 'bg-bg-highlight text-warning shadow-sm' 
                : 'text-disabled hover:text-main'
            )}
            onClick={(e) => {
              e.stopPropagation()
              onStarToggle?.(!isStarred)
            }}
            aria-label={isStarred ? t('remove_favorite') : t('add_favorite')}
            aria-pressed={isStarred}
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
                  size={18} 
                  strokeWidth={2} 
                  fill={isStarred ? 'currentColor' : 'none'} 
                />
              </motion.div>
            </AnimatePresence>
          </Button>
        </div>

        {description && (
          <Text 
            size="sm" 
            className="line-clamp-2 leading-relaxed text-muted"
          >
            {description}
          </Text>
        )}

        {/* Progress Section */}
        {progressData && (
          <div className="mt-auto pt-xs space-y-2xs">
            <ProgressBar 
              value={progressData.value} 
              color={progressColor || 'var(--color-primary)'} 
              height={6} 
              className="rounded-full"
            />
            {progressData.label && (
              <Text size="xs" weight="bold" className="text-muted flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                {progressData.label}
              </Text>
            )}
          </div>
        )}

        {action && (
          <div className="relative z-30 pt-md mt-auto">
            {action}
          </div>
        )}

        {/* Interactive Cue */}
        <div className="absolute bottom-md right-md opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[var(--transition-ease)] pointer-events-none">
          <ChevronRight size={20} strokeWidth={2.5} className="text-primary" />
        </div>
      </div>
    </motion.div>
  )
})

/**
 * Dedicated Skeleton for Layout Stability (CLS Prevention)
 */
function TeaserCardSkeleton({ 
  variant, 
  className,
  hasAction = false,
  hasProgress = false,
}: { 
  variant?: 'vertical' | 'horizontal' | null
  className?: string
  hasAction?: boolean
  hasProgress?: boolean
}) {
  const isHorizontal = variant === 'horizontal'
  return (
    <div className={cn(teaserCardVariants({ variant, isLoading: true }), className)}>
      <div className={cn(
        'relative shrink-0 overflow-hidden bg-bg-card',
        isHorizontal ? 'w-full lg:w-[260px] aspect-video lg:h-full' : 'w-full aspect-video'
      )}>
        <Skeleton variant="rectangular" className="w-full h-full" />
      </div>
      <div className="flex flex-col flex-1 p-md gap-sm min-w-0">
        <div className="flex items-start justify-between gap-md">
          <div className="flex-1 space-y-xs min-w-0">
            <Skeleton variant="text" width="30%" height="0.75rem" />
            <Skeleton variant="text" width="85%" height="1.5rem" />
          </div>
          <Skeleton variant="circle" size={44} className="shrink-0" />
        </div>
        <div className="space-y-2xs">
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="95%" />
        </div>
        {hasProgress && (
          <div className="mt-auto pt-md">
            <Skeleton variant="rectangular" height={8} className="w-full rounded-full" />
          </div>
        )}
        {hasAction && (
          <div className="mt-auto pt-md">
            <Skeleton variant="rectangular" height={40} className="w-full rounded-[var(--radius-md)]" />
          </div>
        )}
      </div>
    </div>
  )
}

export default TeaserCard
