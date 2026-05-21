import { useNavigate } from 'react-router-dom'
import { Star, ExternalLink, Wifi, Mail, PenSquare, FileText, Users, Cloud, ChevronRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import type { WidgetProps } from '@/types'
import { env } from '@/utils/env'

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

function QuickToolsWidget({ isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const { t, isFavorite, toggleFavorite } = useStore()

  const displayTools = quickToolsData.slice(0, 4)
  /* istanbul ignore next */
  const emptyContent = displayTools.length === 0 ? (
    <div className="flex items-center justify-center py-lg">
      <Text size="sm" muted>{t('no_favorites_yet')}</Text>
    </div>
  ) : null

  return (
    <Card>
      <Card.Header>
        <Text weight="bold" size="lg" className="card__title">{t('quick_access')}</Text>
        <button
          type="button"
          className="text-sm text-primary dark:text-slate-200 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap transition-all hover:opacity-80 bg-transparent border-none p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm"
          onClick={() => !isEditing && navigate('/resources')}
        >
          {t('toolbox')}<ChevronRight size={14} strokeWidth={2} />
        </button>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-2 gap-[var(--space-sm)]">
          {displayTools.map((tool) => {
            /* istanbul ignore next */
            const Icon = toolIcons[tool.icon] || ExternalLink
            const isFav = isFavorite('tool', tool.id)
            return (
              <button
                key={tool.id}
                type="button"
                className="flex items-center gap-[var(--space-sm)] p-xs rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] hover:border-primary transition-all cursor-pointer text-left group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                onClick={() => !isEditing && env.open(tool.url)}
              >
                <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={18} strokeWidth={2} className="text-primary" />
                </div>
                <span className="text-sm font-medium truncate flex-1">{t(tool.nameKey)}</span>
                <button
                  type="button"
                  className={`relative w-5 h-5 flex items-center justify-center rounded-[var(--radius-pill)] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all after:absolute after:inset-[-12px] ${isFav ? 'opacity-100 text-[var(--aau-light-orange)]' : 'text-slate-300 hover:text-slate-400'}`}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite('tool', tool.id) }}
                  aria-label={isFav ? t('remove_favorite') : t('add_favorite')}
                >
                  <Star size={14} strokeWidth={2} fill={isFav ? 'var(--aau-light-orange)' : 'none'} />
                </button>
              </button>
            )
          })}
        </div>
        {emptyContent}
      </Card.Body>
    </Card>
  )
}

export default QuickToolsWidget
