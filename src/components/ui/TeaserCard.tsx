import { memo, useMemo, type ReactNode, type MouseEvent, type KeyboardEvent } from 'react'
import { Star, ChevronRight } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'

import { cn } from '@/lib/utils'
import useStore from '@/store/useStore'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { Heading, Text } from '@/components/ui/Typography'

/**
 * TeaserCard Variants using CVA for clean architectural separation of concerns.
 * Enforces the 8pt grid and AAU design tokens.
 */
const teaserCardVariants = cva(
  [
    'group relative flex flex-col overflow-hidden h-full min-w-0 max-w-full transition-all duration-300 ease-[var(--transition-ease)]',
    'bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[var(--radius-xl)]',
    'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-xl)] hover:border-[var(--aau-blue)] hover:-translate-y-1',
    'focus-within:ring-2 focus-within:ring-[var(--aau-blue)] focus-within:ring-offset-2',
    'cursor-pointer @container/teaser isolate'
  ],
  {
    variants: {
      variant: {
        vertical: 'flex-col',
        horizontal: 'flex-col lg:flex-row min-h-[160px] lg:min-h-[180px]',
      },
    },
    defaultVariants: {
      variant: 'vertical',
    },
  }
)

export interface TeaserCardProps
  extends VariantProps<typeof teaserCardVariants> {
  /** Optional unique ID for layout transitions */
  layoutId?: string
  /** Optional image URL */
  image?: string
  /** Content for the badge */
  badge?: ReactNode
  /** Color variant for the badge */
  badgeColor?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'
  /** Primary title of the card */
  title: ReactNode
  /** Descriptive text below the title */
  description?: string
  /** Progress percentage (0-100) */
  progress?: number
  /** Color of the progress bar */
  progressColor?: string
  /** Click handler for the main card action */
  onClick?: (e: MouseEvent | KeyboardEvent) => void
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
 * TeaserCard - A core UI component for displaying course modules or content teasers.
 * Optimized for layout stability, micro-interactions, and visual harmony.
 */
const TeaserCard = memo(function TeaserCard({
  layoutId,
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
    if (progress === undefined) return null
    const rounded = Math.round(Math.max(0, Math.min(100, progress)))
    return {
      value: rounded,
      label: rounded > 0 ? `${rounded}% ${t('completed_short')}` : null
    }
  }, [progress, t])

  const handleStarClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    onStarToggle?.(!isStarred)
  }

  const isHorizontal = variant === 'horizontal'

  return (
    <motion.div
      layoutId={layoutId}
      className={cn(teaserCardVariants({ variant }), className)}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Primary Action Overlay */}
      <button
        type="button"
        className="absolute inset-0 z-[1] w-full h-full opacity-0 cursor-pointer focus:outline-none"
        aria-label={typeof title === 'string' ? title : 'View details'}
        onClick={(e) => onClick?.(e)}
      />

      {/* Media Section */}
      {image && (
        <div 
          className={cn(
            'relative shrink-0 overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]',
            isHorizontal 
              ? 'w-full lg:w-[240px] aspect-video lg:aspect-auto lg:h-full' 
              : 'w-full aspect-video'
          )}
        >
          {badge && (
            <div className="absolute top-[var(--space-sm)] left-[var(--space-sm)] z-10 flex gap-[var(--space-2xs)]">
              <Badge 
                variant={badgeColor} 
                className="shadow-[var(--shadow-md)] backdrop-blur-md bg-black/30 text-white border-none font-bold"
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
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {/* Subtle gradient overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content Section */}
      <div className="relative z-[2] flex flex-col flex-1 p-[var(--space-md)] gap-[var(--space-xs)] min-w-0">
        <div className="flex items-start justify-between gap-[var(--space-md)]">
          <div className="flex-1 min-w-0">
            {!image && badge && (
              <Badge variant={badgeColor} className="mb-[var(--space-2xs)] font-bold">
                {badge}
              </Badge>
            )}
            <Heading 
              level={3} 
              className="m-0 text-[1.125rem] font-bold leading-[1.2] text-[var(--text-main)] transition-colors group-hover:text-[var(--aau-blue)] line-clamp-2"
            >
              {title}
            </Heading>
          </div>

          {/* Interaction: Star Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'var(--bg-hover-active)' }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'relative z-30 shrink-0 w-10 h-10 flex items-center justify-center rounded-pill border-0 transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-[var(--aau-blue)] focus-visible:outline-none',
              isStarred 
                ? 'bg-[var(--aau-light-gold)] text-[var(--aau-light-orange)] shadow-[var(--shadow-sm)]' 
                : 'bg-[var(--bg-hover)] text-[var(--text-disabled)] hover:text-[var(--text-main)]'
            )}
            onClick={handleStarClick}
            aria-label={isStarred ? t('remove_favorite') : t('add_favorite')}
            type="button"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isStarred ? 'starred' : 'unstarred'}
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Star 
                  size={20} 
                  strokeWidth={2.5} 
                  fill={isStarred ? 'currentColor' : 'none'} 
                />
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {description && (
          <Text 
            size="sm" 
            className="line-clamp-2 leading-[1.5] text-[var(--text-muted)] min-h-[3rem]"
          >
            {description}
          </Text>
        )}

        {/* Progress Implementation */}
        {progressData && (
          <div className="mt-auto pt-[var(--space-2xs)] space-y-[var(--space-2xs)]">
            <ProgressBar 
              value={progressData.value} 
              color={progressColor || 'var(--aau-blue)'} 
              height={6} 
            />
            {progressData.label && (
              <Text size="xs" weight="semibold" className="text-[var(--text-muted)] flex items-center gap-[var(--space-2xs)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--aau-blue)] animate-pulse" />
                {progressData.label}
              </Text>
            )}
          </div>
        )}

        {action && (
          <div className="relative z-30 pt-[var(--space-sm)] mt-auto">
            {action}
          </div>
        )}

        {/* Visual Cue: Chevron Right */}
        <div className="absolute bottom-[var(--space-md)] right-[var(--space-md)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out pointer-events-none">
          <ChevronRight size={20} strokeWidth={2.5} className="text-[var(--aau-blue)]" />
        </div>
      </div>
    </motion.div>
  )
})

export default TeaserCard
