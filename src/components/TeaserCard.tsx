import { memo, useMemo, type ReactNode, type MouseEvent } from 'react'
import { Star, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import useStore from '@/lib/store'
import ProgressBar from '@/components/ProgressBar'
import Badge from '@/components/Badge'
import { Heading, Text } from '@/components/Typography'
import { Skeleton } from '@/components/Skeleton'
import Button from '@/components/Button'
import Card from '@/components/Card'

export interface TeaserCardProps {
  layoutId?: string
  isLoading?: boolean
  variant?: 'vertical' | 'horizontal'
  image?: string
  badge?: ReactNode
  badgeColor?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'
  title?: ReactNode
  description?: string
  progress?: number
  progressColor?: string
  onClick?: (e: MouseEvent) => void
  onStarToggle?: (starred: boolean) => void
  action?: ReactNode
  isStarred?: boolean
  className?: string
  hasAction?: boolean
  hasProgress?: boolean
}

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
  const isHorizontal = variant === 'horizontal'

  const progressData = useMemo(() => {
    if (progress === undefined || isLoading) return null
    const rounded = Math.round(Math.max(0, Math.min(100, progress)))
    return {
      value: rounded,
      label: rounded > 0 ? `${rounded}% ${t('completed_short')}` : null
    }
  }, [progress, t, isLoading])

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
    <Card
      layoutId={layoutId}
      className={cn(
        'group cursor-pointer shadow-sm hover:shadow-xl hover:border-primary hover:-translate-y-1 @container/teaser',
        isHorizontal ? 'flex-col lg:flex-row min-h-[180px]' : 'flex-col',
        className
      )}
      onClick={(e) => onClick?.(e as any)}
    >
      <Button
        variant="ghost"
        className="absolute inset-0 z-[1] w-full h-full p-0 rounded-none opacity-0 focus-visible:outline-none"
        aria-label={typeof title === 'string' ? title : 'View details'}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.(e)
        }}
      />

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

      <div className="relative z-[2] flex flex-col flex-1 p-md gap-xs min-w-0">
        <div className="flex items-start justify-between gap-md shrink-0">
          <div className="flex-1 min-w-0">
            {!image && badge && (
              <Badge variant={badgeColor} className="mb-xs font-bold">
                {badge}
              </Badge>
            )}
            <Heading 
              level={3} 
              className="m-0 text-[1.125rem] font-bold leading-tight text-main transition-colors group-hover:text-primary line-clamp-2 md:text-[1.125rem]"
            >
              {title}
            </Heading>
          </div>

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
            className="line-clamp-2 leading-relaxed text-muted shrink-0"
          >
            {description}
          </Text>
        )}

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

        <div className="absolute bottom-md right-md opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[var(--transition-ease)] pointer-events-none">
          <ChevronRight size={20} strokeWidth={2.5} className="text-primary" />
        </div>
      </div>
    </Card>
  )
})

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
    <Card className={cn(
      isHorizontal ? 'flex-col lg:flex-row min-h-[180px]' : 'flex-col',
      'pointer-events-none',
      className
    )}>
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
    </Card>
  )
}

export default TeaserCard
