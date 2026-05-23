import { memo, useState, type ReactNode, type MouseEvent, useCallback } from 'react'
import { type LucideIcon, Star, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import IconCircle from '@/components/common/IconCircle'
import { Text } from '@/components/ui/Typography'
import Stack from '@/components/ui/Stack'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

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
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
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

  const handleStarClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    onStarToggle?.()
  }, [onStarToggle])

  const handleHelpClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    setShowHelp(v => !v)
  }, [])

  const isClickable = !!onClick

  return (
    <Card 
      elevated={elevated} 
      className={cn(
        'info-card transition-all duration-300',
        isClickable && 'hover:shadow-md hover:-translate-y-1 cursor-pointer',
        className
      )} 
      hasHeader={false} 
      onClick={onClick}
    >
      <Card.Body className="p-md md:p-lg">
        <Stack direction={direction} gap={direction === 'row' ? 'lg' : 'md'} align="start">
          <IconCircle icon={icon} bg={iconBg} color={iconColor} size={iconSize} className="shrink-0" />
          
          <Stack gap="xs" className="flex-1 min-w-0">
            <Stack direction="row" gap="xs" align="center" className="w-full">
              <Text weight="bold" size="lg" className="truncate leading-tight">{title}</Text>
              
              {helpText && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    'text-disabled hover:text-primary transition-colors',
                    showHelp && 'text-primary bg-bg-hover'
                  )}
                  onClick={handleHelpClick}
                  aria-label="Help"
                  pill
                >
                  <Info size={16} strokeWidth={2.5} />
                </Button>
              )}
              
              {onStarToggle && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    'ml-auto transition-all',
                    isStarred 
                      ? 'text-warning bg-[var(--aau-light-gold)]/10 hover:bg-[var(--aau-light-gold)]/20' 
                      : 'text-disabled hover:text-primary'
                  )}
                  onClick={handleStarClick}
                  aria-label={isStarred ? 'Remove from favorites' : 'Add to favorites'}
                  pill
                >
                  <Star 
                    size={16} 
                    strokeWidth={2.5} 
                    fill={isStarred ? 'currentColor' : 'none'} 
                  />
                </Button>
              )}
            </Stack>

            <AnimatePresence initial={false}>
              {showHelp && helpText && (
                <motion.div
                  key="help-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Text 
                    size="xs" 
                    className="italic font-medium leading-relaxed bg-bg-highlight p-sm rounded-md border border-primary/10 mt-xs"
                  >
                    {helpText}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>

            {description && (
              <Text size="sm" muted className="leading-relaxed line-clamp-2">
                {description}
              </Text>
            )}
            
            {children && <div className="mt-xs w-full">{children}</div>}
          </Stack>

          {action && (
            <div className="shrink-0 self-center lg:self-start pt-xs lg:pt-0">
              {action}
            </div>
          )}
        </Stack>
      </Card.Body>
    </Card>
  )
})

export default InfoCard
