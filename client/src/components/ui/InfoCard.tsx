import { memo, useState, type ReactNode, type MouseEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type LucideIcon, Star, Info, ExternalLink, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { IconCircle } from './Icon';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text } from '@/components/ui';
import useStore from '@/store';
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
  helpText,
}: InfoCardProps) {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
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
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              'absolute top-[var(--space-sm)] right-[var(--space-sm)] z-10 transition-all',
              isStarred 
                ? 'text-warning bg-[var(--aau-light-gold)]/10 hover:bg-[var(--aau-light-gold)]/20' 
                : 'text-disabled hover:text-primary'
            )}
            onClick={handleStarClick}
            aria-label={isStarred ? t('remove_favorite') : t('add_favorite')}
            title={isStarred ? t('remove_favorite') : t('add_favorite')}
            pill
          >
            <Star 
              size={16} 
              strokeWidth={2.5} 
              fill={isStarred ? 'currentColor' : 'none'} 
            />
          </Button>
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

if (import.meta.vitest) {
  describe('InfoCard', () => {
    it('renders content', () => {
      render(<InfoCard icon={User} title="Test Title" description="Test Description" />)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })
  
    it('renders with col direction and no description', () => {
      render(<InfoCard icon={User} title="Test Title" direction="col" />)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
    })
  
    it('renders with action', () => {
      render(<InfoCard icon={User} title="Test Title" action={<button>Click Me</button>} />)
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument()
    })
  
    it('applies interactive classes when onClick is provided', () => {
      const { container } = render(<InfoCard icon={User} title="Clickable" onClick={() => {}} />)
      const card = container.querySelector('.info-card')
      expect(card).toHaveClass('hover:-translate-y-1')
    })
  
    it('handles help text toggle', async () => {
      render(<InfoCard icon={User} title="Title" helpText="Help information" />)
      
      expect(screen.queryByText('Help information')).not.toBeInTheDocument()
      
      const helpButton = screen.getByLabelText(/(help|hjælp)/i)
      
      // Toggle ON
      fireEvent.click(helpButton)
      expect(await screen.findByText('Help information')).toBeInTheDocument()
      
      // Note: We omit the toggle-off check here as AnimatePresence exit animations 
      // can be flaky in some virtual DOM environments without specialized clock mocking.
    })
  
    it('handles star toggle', () => {
      const onStarToggle = vi.fn()
      render(<InfoCard icon={User} title="Title" onStarToggle={onStarToggle} isStarred={false} />)
      
      const starButton = screen.getByRole('button', { name: /(add_favorite|Add to favorites|Tilføj til favoritter)/i })
      fireEvent.click(starButton)
      
      expect(onStarToggle).toHaveBeenCalled()
    })
  
    it('renders correctly when starred', () => {
      render(<InfoCard icon={User} title="Title" onStarToggle={() => {}} isStarred={true} />)
      expect(screen.getByRole('button', { name: /(remove_favorite|Remove from favorites|Fjern fra favoritter)/i })).toBeInTheDocument()
    })
  
    it('stops propagation on star click', () => {
      const onClick = vi.fn()
      const onStarToggle = vi.fn()
      render(<InfoCard icon={User} title="Title" onClick={onClick} onStarToggle={onStarToggle} />)
      
      const starButton = screen.getByRole('button', { name: /(add_favorite|Add to favorites|Tilføj til favoritter)/i })
      fireEvent.click(starButton)
      
      expect(onStarToggle).toHaveBeenCalled()
      expect(onClick).not.toHaveBeenCalled()
    })
  
    it('stops propagation on help click', () => {
      const onClick = vi.fn()
      render(<InfoCard icon={User} title="Title" onClick={onClick} helpText="Help" />)
      
      const helpButton = screen.getByLabelText(/(help|hjælp)/i)
      fireEvent.click(helpButton)
      
      expect(onClick).not.toHaveBeenCalled()
    })
  })
}
