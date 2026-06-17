import { memo, useState, useContext, type ReactNode, type MouseEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type LucideIcon, Star, Info, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { IconCircle } from './Icon';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text } from '@/components/ui';
import useStore from '@/store';
import { ToastContext } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export interface InfoCardProps {
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
  iconSize?: number
  title: string
  subtitle?: string
  description?: string
  action?: ReactNode
  direction?: 'row' | 'col'
  elevated?: boolean
  className?: string
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
  children?: ReactNode
  isStarred?: boolean
  onStarToggle?: () => void
  addFavoriteLabel?: string
  removeFavoriteLabel?: string
  helpText?: string
}

const InfoCard = memo(function InfoCard({
  icon,
  iconBg,
  iconColor,
  iconSize = 48,
  title,
  subtitle,
  description,
  action,
  direction = 'row',
  elevated,
  className = '',
  onClick,
  children,
  isStarred = false,
  onStarToggle,
  addFavoriteLabel,
  removeFavoriteLabel,
  helpText,
}: InfoCardProps) {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const toastCtx = useContext(ToastContext)
  const [showHelp, setShowHelp] = useState(false)

  const handleStarClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    const wasStarred = isStarred
    onStarToggle?.()
    if (toastCtx) {
      const msg = wasStarred
        ? (lang === 'da' ? 'Fjernet fra favoritter' : 'Removed from favorites')
        : (lang === 'da' ? 'Tilføjet til favoritter' : 'Added to favorites')
      toastCtx.success(msg, { duration: 2000 })
    }
  }, [onStarToggle, isStarred, toastCtx, lang])

  const handleHelpClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    setShowHelp(v => !v)
  }, [])


  const isClickable = !!onClick

  return (
    <Card 
      variant={elevated ? 'elevated' : 'default'} 
      className={cn(
        'info-card transition-all duration-300',
        isClickable && 'hover:shadow-md hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-primary',
        className
      )} 
      onClick={onClick}
    >
      <Card.Body className="p-md md:p-lg h-full w-full flex flex-col relative">
            {onStarToggle && (
          <button
            type="button"
            onClick={handleStarClick}
            aria-label={isStarred 
              ? (removeFavoriteLabel || t('remove_favorite')) 
              : (addFavoriteLabel || t('add_favorite'))}
            title={isStarred 
              ? (removeFavoriteLabel || t('remove_favorite')) 
              : (addFavoriteLabel || t('add_favorite'))}
            className={cn(
              'absolute top-[var(--space-sm)] right-[var(--space-sm)] z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              isStarred 
                ? 'text-warning bg-[var(--aau-light-gold)]/20 hover:bg-[var(--aau-light-gold)]/30' 
                : 'text-disabled hover:text-primary hover:bg-bg-hover'
            )}
          >
            <Star 
              size={20} 
              strokeWidth={2} 
              fill={isStarred ? 'currentColor' : 'none'} 
              className={isStarred ? 'drop-shadow-sm' : ''}
            />
          </button>
        )}
        <Stack direction={direction} gap={direction === 'row' ? 'lg' : 'md'} align="start" full>
          <IconCircle icon={icon} bg={iconBg} color={iconColor} size={iconSize} className="shrink-0" />
          
          <Stack gap="xs" className="flex-1 min-w-0 h-full flex flex-col pr-8">
            {subtitle && (
              <span className="text-[10px] font-black uppercase tracking-wider text-muted/80 leading-none mb-3xs">
                {subtitle}
              </span>
            )}
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
                  aria-label={lang === 'da' ? 'Hjælp' : 'Help'}
                  pill
                >
                  <Info size={16} strokeWidth={2.5} />
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
                  transition={{ duration: 0.15 }}
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
            
            {children && <div className="mt-auto pt-xs w-full">{children}</div>}
          </Stack>

          {action && (
            <div className="shrink-0 self-center lg:self-start pt-xs lg:pt-0">
              {action}
            </div>
          )}
        </Stack>

        {isClickable && !action && (
          <div className="absolute bottom-sm right-sm opacity-40 group-hover:opacity-100 transition-opacity duration-150">
            <ExternalLink size={16} strokeWidth={2.5} className="text-muted group-hover:text-primary" />
            <span className="sr-only"> ({lang === 'da' ? 'åbner i et nyt vindue' : 'opens in a new window'})</span>
          </div>
        )}
      </Card.Body>
    </Card>
  )
})

export default InfoCard
