import { useNavigate } from 'react-router-dom'
import { Star, ExternalLink, Wifi, Mail, PenSquare, FileText, Users, Cloud, ChevronRight, LayoutGrid, ArrowUpRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import { Text, Heading } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import type { WidgetProps } from '@/types'
import { env } from '@/utils/env'
import { useMemo, memo, useCallback } from 'react'
import { cn } from '@/lib/utils'

const toolIcons: Record<string, typeof PenSquare> = {
  Mail, PenSquare, FileText, Users, Cloud, Wifi,
}

const quickToolsData = [
  { id: 1, nameKey: 'digital_exam', icon: 'PenSquare', url: 'https://digitalservices.aau.dk/dse/exam' },
  { id: 2, nameKey: 'stads', icon: 'FileText', url: 'https://stads.aau.dk' },
  { id: 5, nameKey: 'student_mail', icon: 'Mail', url: 'https://outlook.com/aau.dk' },
  { id: 6, nameKey: 'teams', icon: 'Users', url: 'https://teams.microsoft.com' },
  { id: 7, nameKey: 'onedrive', icon: 'Cloud', url: 'https://aau-my.sharepoint.com' },
  { id: 4, nameKey: 'it_software', icon: 'Wifi', url: 'https://www.its.aau.dk' },
]

const ToolItem = memo(({ 
  tool, 
  isEditing, 
  isFav, 
  onToggleFavorite, 
  onOpen 
}: { 
  tool: typeof quickToolsData[0], 
  isEditing: boolean, 
  isFav: boolean, 
  onToggleFavorite: (id: number) => void,
  onOpen: (url: string) => void
}) => {
  const { t } = useStore()
  const Icon = toolIcons[tool.icon] || ExternalLink

  return (
    <div className="relative group h-full">
      <button
        type="button"
        className={cn(
          "w-full h-full flex flex-col gap-3 p-4 rounded-2xl border border-border/50 bg-card transition-all duration-300 text-left outline-none",
          "hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 cursor-pointer",
          "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset"
        )}
        onClick={() => !isEditing && onOpen(tool.url)}
      >
        <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
          <Icon size={20} strokeWidth={2.5} />
        </div>
        
        <Stack gap="2xs" className="mt-auto">
          <Text weight="bold" size="sm" className="truncate text-text-main group-hover:text-primary transition-colors">
            {t(tool.nameKey)}
          </Text>
          <div className="flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300">
            <Text size="2xs" className="font-bold uppercase tracking-widest">{t('open')}</Text>
            <ArrowUpRight size={10} />
          </div>
        </Stack>
      </button>

      <button
        type="button"
        className={cn(
          "absolute top-4 right-4 p-1.5 rounded-full transition-all duration-200 outline-none z-10",
          "hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary",
          isFav ? "text-aau-light-gold opacity-100" : "text-text-muted/30 opacity-0 group-hover:opacity-100"
        )}
        onClick={(e) => { 
          e.stopPropagation()
          onToggleFavorite(tool.id) 
        }}
        aria-label={isFav ? t('remove_favorite') : t('add_favorite')}
      >
        <Star size={16} strokeWidth={2.5} fill={isFav ? "currentColor" : "none"} />
      </button>
    </div>
  )
})

const QuickToolsWidget = ({ isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const { t, isFavorite, toggleFavorite } = useStore()

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
    <Card className={cn(
      "quick-tools-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-sm hover:shadow-md transition-all duration-300 border-border/60"
    )}>
      <Card.Header spacing="compact" className="border-b border-border/40 bg-bg-card/30 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-primary/5 rounded-lg text-primary">
            <LayoutGrid size={18} strokeWidth={2.5} />
          </div>
          <Text weight="black" size="lg" className="tracking-tight uppercase text-xs sm:text-sm">
            {t('quick_access')}
          </Text>
        </Stack>
        
        <button
          type="button"
          className="group/link text-[0.7rem] font-black uppercase tracking-[0.1em] text-primary hover:text-aau-blue inline-flex items-center gap-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
          onClick={handleViewAll}
        >
          {t('toolbox')}
          <ChevronRight size={14} className="transition-transform group-hover/link:translate-x-1" />
        </button>
      </Card.Header>

      <Card.Body className="p-4 flex-1">
        <div className="grid grid-cols-2 gap-4 h-full">
          {displayTools.map((tool) => (
            <ToolItem
              key={tool.id}
              tool={tool}
              isEditing={isEditing}
              isFav={isFavorite('tool', tool.id)}
              onToggleFavorite={handleToggleFavorite}
              onOpen={handleOpenTool}
            />
          ))}
        </div>
      </Card.Body>

      {/* Aesthetic Footer */}
      <div className="px-6 py-3 bg-muted/5 border-t border-border/20 text-[0.65rem] text-text-muted flex items-center justify-between">
        <span className="font-medium">{t('administrative_systems')}</span>
        <span className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-opacity">
          {t('external_link')} <ExternalLink size={10} />
        </span>
      </div>
    </Card>
  )
}

export default memo(QuickToolsWidget)

