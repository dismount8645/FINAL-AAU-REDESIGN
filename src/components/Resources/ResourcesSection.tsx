import { Lock, ExternalLink } from 'lucide-react'
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { SectionHeader, Badge } from '@/components/ui'
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

  return (
    <>
      <SectionHeader title={title} subtitle={subtitle} />
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
            <Grid.Item span={6} key={tool.id}>
              <InfoCard
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
                      <Badge variant="outline" className="gap-2xs border-amber-400/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold py-0 h-fit">
                        <Lock size={10} strokeWidth={2.5} />
                        {lang === 'da' ? 'Kræver login' : 'Requires login'}
                      </Badge>
                    )}
                  </div>
                  <div className="text-primary font-bold text-xs flex items-center gap-xs">
                    <span>{lang === 'da' ? 'Åbn værktøj' : 'Open tool'}</span>
                    <ExternalLink size={12} strokeWidth={2.5} />
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
