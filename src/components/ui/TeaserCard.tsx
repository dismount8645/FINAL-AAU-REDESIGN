import { memo, type ReactNode, MouseEventHandler, MouseEvent } from 'react'
import { Star, ChevronRight } from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { Heading, Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

export interface TeaserCardProps {
  variant?: 'vertical' | 'horizontal'
  image?: string
  badge?: ReactNode
  badgeColor?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  title?: ReactNode
  description?: string
  progress?: number
  progressColor?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  onStarToggle?: (starred: boolean) => void
  action?: ReactNode
  isStarred?: boolean
  className?: string
}

const TeaserCard = memo(function TeaserCard({
  variant = 'vertical',
  image,
  badge,
  badgeColor,
  title,
  description,
  progress,
  progressColor,
  onClick,
  action,
  isStarred = false,
  onStarToggle,
  className = '',
}: TeaserCardProps) {
  const { t } = useStore()
  const isHorizontal = variant === 'horizontal'
  const wrapperClass = isHorizontal ? 'teaser-card teaser-card--horizontal' : 'teaser-card'

  const handleStarClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (onStarToggle) onStarToggle(!isStarred)
  }

  const horizontalClasses = isHorizontal
    ? 'flex-col lg:flex-row min-h-[160px] h-auto'
    : ''

  const imageHorizontalClasses = isHorizontal
    ? 'w-full h-[180px] lg:w-[240px] lg:min-h-full lg:h-auto'
    : ''

  /* istanbul ignore next */
  const badgeVariant = badgeColor || 'default'

  return (
    <div
      className={`${wrapperClass} group border border-border rounded-[var(--radius-xl)] bg-card flex flex-col cursor-pointer overflow-hidden relative h-full transition-all duration-200 @container/teaser shadow-[var(--shadow-sm)] hover:-translate-y-1 hover:shadow-[var(--shadow-xl)] hover:border-primary hover:bg-gray-50 dark:hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none max-w-full min-w-0 ${horizontalClasses} ${className}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
        }
      }}
    >
      {image ? (
        <div className={`teaser-card__image w-full aspect-video overflow-hidden relative shrink-0 ${imageHorizontalClasses}`}>
          {badge ? (
            <Badge variant={badgeVariant} className="absolute top-[8px] left-[8px] z-[6] shadow-[var(--shadow-lg)] bg-black/60 text-white border-none backdrop-blur-xs">{badge}</Badge>
          ) : null}
          <img
            src={image}
            alt={typeof title === 'string' ? title : ''}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="teaser-card__content flex flex-col gap-sm p-md flex-1 z-[1] min-w-0">
        <div className="flex items-start justify-between gap-md">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-sm mb-3xs">
              {!image && badge ? (
                <Badge variant={badgeVariant} className="shadow-[var(--shadow-sm)]">{badge}</Badge>
              ) : null}
            </div>
            <Heading level={3} className="teaser-card__title m-0 font-bold text-xl leading-tight text-main transition-colors duration-150 group-hover:text-primary">{title}</Heading>
          </div>
          <button
            className={`teaser-card__star-inline shrink-0 w-9 h-9 relative rounded-[var(--radius-pill)] flex items-center justify-center transition-all duration-150 border-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none after:absolute after:inset-[-4px] after:content-[''] ${isStarred ? 'bg-aau-light-gold text-[var(--aau-light-orange)]' : 'bg-muted text-disabled hover:text-foreground'}`}
            onClick={handleStarClick}
            aria-label={isStarred ? t('remove_favorite') : t('add_favorite')}
            type="button"
          >
            <Star size={18} strokeWidth={2} fill={isStarred ? 'var(--aau-light-orange)' : 'none'} color={isStarred ? 'var(--aau-light-orange)' : 'currentColor'} />
          </button>
        </div>
        {description ? <Text size="sm" muted className="teaser-card__description leading-normal">{description}</Text> : null}
        {progress !== undefined ? (
          <div className="teaser-card__progress pr-[var(--space-md)]">
            <div className="flex justify-between items-center mb-3xs">
              <ProgressBar value={progress} color={progressColor} />
              <Text size="xs" weight="bold" className="ml-xs shrink-0 whitespace-nowrap text-slate-600">
                {progress > 0 && `${Math.round(progress)}% ${t('completed_short')}`}
              </Text>
            </div>
          </div>
        ) : null}
        {action ? <div className="teaser-card__action mt-auto pt-md flex justify-start">{action}</div> : null}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ChevronRight size={18} strokeWidth={2} className="text-primary" />
        </div>
      </div>
    </div>
  )
})

export default TeaserCard
