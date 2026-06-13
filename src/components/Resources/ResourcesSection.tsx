import { Lock, ExternalLink } from 'lucide-react'
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { SectionHeader, Badge, Text } from '@/components/ui'
import { InfoCard } from '@/components/ui'
import useStore from '@/store'
import { env } from '@/lib/env'
import type { ResourceTool } from '@/lib/types'

interface ResourcesSectionProps {
  title: string
  subtitle: string
  tools: ResourceTool[]
  isStarredOnly?: boolean
  showSsoWarning?: boolean
  className?: string
  onToggleFavorite?: (id: number) => void
}

export default function ResourcesSection({
  title,
  subtitle,
  tools,
  isStarredOnly = false,
  showSsoWarning = true,
  className,
  onToggleFavorite,
}: ResourcesSectionProps) {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const localize = useStore(state => state.localize)
  const isFavorite = useStore(state => state.isFavorite)
  const toggleFavorite = useStore(state => state.toggleFavorite)

  const getToolCategoryLabel = (category: string, id: number) => {
    if (category === 'tools') return lang === 'da' ? 'Studieadministrativ' : 'Administrative'
    if (id === 5 || id === 6 || id === 12) return lang === 'da' ? 'Kommunikation' : 'Communication'
    if (id === 7 || id === 8 || id === 9) return lang === 'da' ? 'Filer & Dokumenter' : 'Files & Documents'
    if (id === 10 || id === 11) return lang === 'da' ? 'Undervisning & Evaluering' : 'Teaching & Evaluation'
    return ''
  }

  return (
    <>
      <SectionHeader title={title} subtitle={subtitle} />
      {isStarredOnly && (
        <Text size="sm" muted className="mb-md block">
          {lang === 'da' 
            ? 'Stjernemarkér dine yndlingsværktøjer for at fastgøre dem her på din startside.' 
            : 'Star your favorite tools to pin them here on your dashboard.'}
        </Text>
      )}
      <Grid columns={12} gap="md" className={className}>
        {tools.map((tool) => {
          const titleText = tool.titleKey 
            ? t(tool.titleKey) 
            : localize(tool, 'title')

          const handleStar = () => {
            if (onToggleFavorite) {
              onToggleFavorite(tool.id)
            } else {
              toggleFavorite('tool', tool.id)
            }
          }

          return (
            <Grid.Item span={6} key={tool.id} className="resources-grid-item">
              <InfoCard
                subtitle={getToolCategoryLabel(tool.category || '', tool.id)}
                icon={tool.icon}
                iconBg={tool.bg}
                iconColor={tool.color}
                iconSize={32}
                title={titleText}
                description={localize(tool, 'desc')}
                elevated
                isStarred={isStarredOnly ? true : isFavorite('tool', tool.id)}
                onStarToggle={handleStar}
                helpText={isStarredOnly ? undefined : localize(tool, 'help')}
                onClick={() => env.open(tool.url)}
              >
                <div className="flex flex-wrap gap-xs items-center justify-between mt-sm">
                  <div>
                    {showSsoWarning && !tool.sso && (
                      <Badge variant="warning" pill className="gap-2xs px-xs py-0.5 text-xs font-bold shadow-sm h-auto">
                        <Lock size={12} strokeWidth={2.5} />
                        {lang === 'da' ? 'Kræver login' : 'Requires login'}
                      </Badge>
                    )}
                  </div>
                  <div className="bg-primary text-white font-extrabold text-sm flex items-center gap-xs px-md py-2 rounded-md transition-all hover:bg-accent hover:-translate-y-0.5 border border-primary shadow-sm cursor-pointer">
                    <span>{lang === 'da' ? 'Åbn værktøj' : 'Open tool'}</span>
                    <ExternalLink size={16} strokeWidth={2.5} aria-hidden="true" />
                    <span className="sr-only"> ({lang === 'da' ? 'åbner i et nyt vindue' : 'opens in a new window'})</span>
                  </div>
                </div>
              </InfoCard>
            </Grid.Item>
          )
        })}
      </Grid>
    </>
  )
}
