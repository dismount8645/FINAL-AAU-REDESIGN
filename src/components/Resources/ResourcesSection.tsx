import { Lock } from 'lucide-react'
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
}

export default function ResourcesSection({
  title,
  subtitle,
  tools,
  isStarredOnly = false,
  showSsoWarning = true,
  className,
}: ResourcesSectionProps) {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  const isFavorite = useStore(state => state.isFavorite)
  const toggleFavorite = useStore(state => state.toggleFavorite)
  const _favorites = useStore(state => state.favorites)
  void _favorites

  return (
    <>
      <SectionHeader title={title} subtitle={subtitle} />
      <Grid columns={12} gap="lg" className={className}>
        {tools.map((tool) => {
          const titleText = tool.titleKey 
            ? t(tool.titleKey) 
            : localize(tool, 'title')

          return (
            <Grid.Item span={4} key={tool.id}>
              <InfoCard
                icon={tool.icon}
                iconBg={tool.bg}
                iconColor={tool.color}
                iconSize={isStarredOnly ? 32 : 40}
                title={titleText}
                description={localize(tool, 'desc')}
                elevated
                isStarred={isStarredOnly ? true : isFavorite('tool', tool.id)}
                onStarToggle={() => toggleFavorite('tool', tool.id)}
                helpText={isStarredOnly ? undefined : localize(tool, 'help')}
                onClick={() => env.open(tool.url)}
              >
                {showSsoWarning && !tool.sso && (
                  <Badge variant="outlined" className="mt-xs gap-2xs border-amber-400/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                    <Lock size={12} strokeWidth={2.5} />
                    {t('requires_aau_login')}
                  </Badge>
                )}
              </InfoCard>
            </Grid.Item>
          )
        })}
      </Grid>
    </>
  )
}
