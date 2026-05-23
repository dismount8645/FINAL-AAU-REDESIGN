import { useNavigate } from 'react-router-dom'
import { 
  ExternalLink, 
  ChevronRight, 
  LayoutGrid, 
  ArrowUpRight,
  Star
} from 'lucide-react'
import { useMemo, memo, useCallback, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import { Text, Heading } from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import useStore from '@/store/useStore'
import type { WidgetProps } from '@/types'
import { env } from '@/utils/env'
import { cn } from '@/lib/utils'
import { quickToolsData, toolIcons, type QuickTool } from '@/constants/tools'

/**
 * ToolItem - Individual tool card with refactored A11y and Motion.
 */
const ToolItem = memo(forwardRef<HTMLDivElement, { 
  tool: QuickTool, 
  isEditing: boolean, 
  isFav: boolean, 
  onToggleFavorite: (id: number) => void,
  onOpen: (url: string) => void
}>(({ tool, isEditing, isFav, onToggleFavorite, onOpen }, ref) => {
  const t = useStore(state => state.t)
  const Icon = toolIcons[tool.icon] || ExternalLink

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={!isEditing ? { y: -4 } : {}}
      transition={{ duration: 0.15 }}
      className="relative group h-full"
    >
      <button
        type="button"
        className={cn(
          "w-full h-full flex flex-col items-start gap-[var(--space-sm)] p-[var(--space-md)] rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-[var(--bg-card)] transition-all duration-150 text-left outline-none isolate",
          "hover:shadow-[var(--shadow-lg)] hover:border-[var(--aau-blue)] cursor-pointer",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        )}
        onClick={() => !isEditing && onOpen(tool.url)}
        aria-label={`${t('open')} ${t(tool.nameKey)}`}
      >
        <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-bg-highlight text-primary flex items-center justify-center transition-all duration-150 group-hover:bg-primary group-hover:text-white group-hover:scale-110 shadow-sm">
          <Icon size={20} strokeWidth={2} />
        </div>
        
        <div className="mt-auto w-full space-y-[var(--space-2xs)]">
          <Text weight="bold" size="sm" className="truncate text-main group-hover:text-primary transition-colors leading-tight">
            {t(tool.nameKey)}
          </Text>
          <div className="flex items-center gap-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-[var(--transition-ease)]">
            <Text size="xs" weight="black" className="uppercase tracking-widest text-primary">{t('open')}</Text>
            <ArrowUpRight size={12} strokeWidth={2.5} className="text-primary" />
          </div>
        </div>
      </button>

      {/* Favorite Toggle - Positioned outside the main button to avoid nesting interactive elements */}
      <Button
        size="icon-sm"
        variant="ghost"
        pill
        className={cn(
          "absolute top-[var(--space-sm)] right-[var(--space-sm)] z-10 transition-all duration-150",
          isFav 
            ? "text-warning bg-bg-highlight shadow-sm" 
            : "text-disabled opacity-0 group-hover:opacity-100 hover:text-main"
        )}
        onClick={(e) => { 
          e.stopPropagation()
          onToggleFavorite(tool.id) 
        }}
        aria-label={isFav ? t('remove_favorite') : t('add_favorite')}
        aria-pressed={isFav}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFav ? 'fav' : 'not-fav'}
            initial={{ scale: 0.5, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 45 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Star size={16} strokeWidth={2} fill={isFav ? "currentColor" : "none"} />
          </motion.div>
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}))

/**
 * QuickToolsWidget - High-performance dashboard widget for administrative access.
 */
const QuickToolsWidget = ({ isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const favorites = useStore(state => state.favorites)
  const toggleFavorite = useStore(state => state.toggleFavorite)

  const isFavorite = useCallback((id: number) => {
    return favorites.some(f => f.type === 'tool' && f.entityId === id)
  }, [favorites])

  const displayTools = useMemo(() => quickToolsData.slice(0, 4), [])

  const handleToggleFavorite = useCallback((id: number) => {
    toggleFavorite('tool', id)
  }, [toggleFavorite])

  const handleOpenTool = useCallback((url: string) => {
    env.open(url)
  }, [])

  const handleViewAll = useCallback(() => {
    if (!isEditing) navigate('/resources')
  }, [isEditing, navigate])

  return (
    <Card className="h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300">
      <Card.Header padding="compact" className="bg-bg-highlight border-b border-[var(--border-color)]">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <LayoutGrid size={18} strokeWidth={2} />
          </div>
          <Heading level={4} className="m-0 text-xs font-black uppercase tracking-tight text-main">
            {t('quick_access')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size="xs"
          className="font-black uppercase tracking-widest text-primary hover:bg-bg-card/50"
          onClick={handleViewAll}
          iconRight={ChevronRight}
        >
          {t('toolbox')}
        </Button>
      </Card.Header>

      <Card.Body className="p-[var(--space-md)] flex-1">
        <div className="grid grid-cols-2 gap-[var(--space-md)] h-full min-h-0">
          <AnimatePresence mode="popLayout">
            {displayTools.map((tool) => (
              <ToolItem
                key={tool.id}
                tool={tool}
                isEditing={isEditing}
                isFav={isFavorite(tool.id)}
                onToggleFavorite={handleToggleFavorite}
                onOpen={handleOpenTool}
              />
            ))}
          </AnimatePresence>
        </div>
      </Card.Body>

      {/* Aesthetic Footer - Synchronized with AAU Brand Tokens */}
      <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="xs" weight="medium" className="text-muted italic">
          {t('administrative_systems')}
        </Text>
        <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
          <Text size="xs" weight="bold" className="text-primary uppercase tracking-tighter">{t('external_link')}</Text>
          <ExternalLink size={10} strokeWidth={2.5} className="text-primary" />
        </div>
      </Card.Footer>
    </Card>
  )
}

QuickToolsWidget.displayName = 'QuickToolsWidget'

export default memo(QuickToolsWidget)

