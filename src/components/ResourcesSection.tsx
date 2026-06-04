import { Lock } from 'lucide-react'
import { Grid } from '@/components/LayoutPrimitives'
import { Stack } from '@/components/LayoutPrimitives'
import { Text } from '@/components/Typography'
import SectionHeader from '@/components/SectionHeader'
import InfoCard from '@/components/InfoCard'
import useStore from '@/lib/store'
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
            <Grid.Item span={4} tabletSpan={6} mobileSpan={1} key={tool.id}>
              <InfoCard
                icon={tool.icon}
                iconBg={tool.bg}
                iconColor={tool.color}
                iconSize={isStarredOnly ? 'sm' : 'md'}
                title={titleText}
                description={localize(tool, 'desc')}
                elevated
                isStarred={isStarredOnly ? true : isFavorite('tool', tool.id)}
                onStarToggle={() => toggleFavorite('tool', tool.id)}
                helpText={isStarredOnly ? undefined : localize(tool, 'help')}
                onClick={() => env.open(tool.url)}
              >
                {showSsoWarning && !tool.sso && (
                  <Stack direction="row" gap="xs" className="mt-xs">
                    <Lock size={14} strokeWidth={2} className="text-[var(--aau-dark-orange)] dark:text-amber-400/80" />
                    <Text size="2xs" className="text-[var(--aau-dark-orange)] dark:text-amber-400 font-bold">
                      {t('requires_aau_login')}
                    </Text>
                  </Stack>
                )}
              </InfoCard>
            </Grid.Item>
          )
        })}
      </Grid>
    </>
  )
}
