import { Lock, ExternalLink } from 'lucide-react'
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { SectionHeader, Badge, Text } from '@/components/ui'
import { InfoCard } from '@/components/ui'
import useStore from '@/store'
import { env } from '@/lib/utils'
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

          const addFavoriteLabel = lang === 'da'
            ? `Føj ${titleText} til favoritter`
            : `Add ${titleText} to favorites`

          const removeFavoriteLabel = lang === 'da'
            ? `Fjern ${titleText} fra favoritter`
            : `Remove ${titleText} from favorites`

          const shortTitle = lang === 'da'
              ? (tool.shortTitleDa ?? titleText)
              : (tool.shortTitleEn ?? titleText)

          const ctaLabel = lang === 'da'
              ? `Åbn ${shortTitle}`
              : `Open ${shortTitle}`

          const ctaAriaLabel = lang === 'da'
              ? `Åbn ${shortTitle} - åbner i nyt vindue`
              : `Open ${shortTitle} - opens in a new window`

          return (
            <Grid.Item span={6} key={tool.id} className="resources-grid-item">
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
                addFavoriteLabel={addFavoriteLabel}
                removeFavoriteLabel={removeFavoriteLabel}
                helpText={isStarredOnly ? undefined : localize(tool, 'help')}
              >
                <div className="flex flex-wrap gap-xs items-center justify-between mt-sm">
                  <div>
                    {showSsoWarning && !tool.sso && (
                      <Badge variant="default" pill className="gap-2xs px-xs py-0.5 text-xs font-bold h-auto">
                        <Lock size={12} strokeWidth={2.5} />
                        {lang === 'da' ? 'AAU-login' : 'AAU login'}
                      </Badge>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      env.open(tool.url)
                    }}
                    aria-label={ctaAriaLabel}
                    className="text-primary font-bold text-sm flex items-center gap-xs px-md py-2 rounded-md transition-all hover:bg-primary/15 hover:-translate-y-0.5 border border-primary/60 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <span>{ctaLabel}</span>
                    <ExternalLink size={16} strokeWidth={2.5} aria-hidden="true" />
                    <span className="sr-only"> ({lang === 'da' ? 'åbner i nyt vindue' : 'opens in a new window'})</span>
                  </button>
                </div>
              </InfoCard>
            </Grid.Item>
          )
        })}
      </Grid>
    </>
  )
}
