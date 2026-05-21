import { memo, useState, type ReactNode, type MouseEventHandler, type MouseEvent } from 'react'
import { type LucideIcon, Star, Info } from 'lucide-react'
import IconCircle from '@/components/common/IconCircle'
import { Text } from '@/components/ui/Typography'
import Stack from '@/components/ui/Stack'
import Card from '@/components/ui/Card'

export interface InfoCardProps {
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  title: string
  description?: string
  action?: ReactNode
  direction?: 'row' | 'col'
  elevated?: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  children?: ReactNode
  isStarred?: boolean
  onStarToggle?: () => void
  helpText?: string
}

const InfoCard = memo(function InfoCard({
  icon,
  iconBg,
  iconColor,
  iconSize = 'md',
  title,
  description,
  action,
  direction = 'row',
  elevated,
  className = '',
  onClick,
  children,
  isStarred = false,
  onStarToggle,
  helpText,
}: InfoCardProps) {
  const [showHelp, setShowHelp] = useState(false)

  const handleStarClick = (e: MouseEvent) => {
    e.stopPropagation()
    /* istanbul ignore next */
    if (onStarToggle) onStarToggle()
  }

  const handleHelpClick = (e: MouseEvent) => {
    e.stopPropagation()
    setShowHelp(!showHelp)
  }

  return (
    <Card elevated={elevated} className={`info-card ${onClick ? 'hover-lift cursor-pointer' : ''} ${className}`} hasHeader={false} onClick={onClick}>
      <Card.Body className="p-lg">
        <Stack direction={direction} gap={direction === 'row' ? 'xl' : 'md'} align="start">
          <IconCircle icon={icon} bg={iconBg} color={iconColor} size={iconSize} />
          <Stack gap="xs" className="flex-1">
            <Stack direction="row" gap="xs" align="center">
              <Text weight="bold" size="lg" className="info-card__title">{title}</Text>
              {helpText && (
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center w-5 h-5 rounded-[var(--radius-pill)] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer after:absolute after:inset-[-12px]"
                  onClick={handleHelpClick}
                  aria-label="Help"
                >
                  <Info size={14} strokeWidth={2} />
                </button>
              )}
              {onStarToggle && (
                <button
                  type="button"
                  className={`relative inline-flex items-center justify-center w-6 h-6 rounded-[var(--radius-pill)] transition-all cursor-pointer ml-auto after:absolute after:inset-[-12px] ${isStarred ? 'text-[var(--aau-light-orange)]' : 'text-slate-300 hover:text-slate-400'}`}
                  onClick={handleStarClick}
                  aria-label={isStarred ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star size={14} strokeWidth={2} fill={isStarred ? 'var(--aau-light-orange)' : 'none'} />
                </button>
              )}
            </Stack>
            {showHelp && helpText ? (
              <Text size="xs" className="text-primary dark:text-primary-foreground italic font-medium leading-relaxed block bg-primary/5 dark:bg-primary/20 p-sm rounded-[var(--radius-md)] border border-primary/10 mt-xs animate-in fade-in slide-in-from-top-1">{helpText}</Text>
            ) : null}
            {description ? <Text size="sm" muted className="info-card__description text-slate-400 dark:text-slate-300 leading-relaxed">{description}</Text> : null}
            {children}
          </Stack>
          {action ? <div className="info-card__action shrink-0">{action}</div> : null}
        </Stack>
      </Card.Body>
    </Card>
  )
})

export default InfoCard
