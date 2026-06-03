import { useMemo } from 'react'
import { Headphones, ExternalLink } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

import Grid from '@/components/ui/Grid'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import { allTools, allEssentials, allToolsList } from '@/lib/tools'
import { env } from '@/lib/env'
import { ResourcesSection } from './resources/index'

function Resources() {
  const t = useStore(state => state.t)
  const isFavorite = useStore(state => state.isFavorite)
  const favorites = useStore(state => state.favorites)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pinnedTools = useMemo(() => allToolsList.filter(t => isFavorite('tool', t.id)), [favorites, isFavorite])

  return (
    <Stack tag="main" className="resources-page">
      <PageHeader
        pageKey="toolbox"
        title={t('toolbox')}
        subtitle={t('toolbox_subtitle')}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('toolbox') },
        ]}
      />

      <div className="container pb-2xl">

      {pinnedTools.length > 0 && (
        <ResourcesSection
          title={t('quick_access')}
          subtitle={t('pinned_tools')}
          tools={pinnedTools}
          isStarredOnly
          showSsoWarning={false}
          className="mb-2xl"
        />
      )}

      <ResourcesSection
        title={t('administrative_systems')}
        subtitle={t('administrative_systems_desc')}
        tools={allTools}
        className="mb-2xl"
      />

      <ResourcesSection
        title={t('aau_essentials')}
        subtitle={t('aau_essentials_desc')}
        tools={allEssentials}
      />

      <Grid columns={12} gap="lg" className="mt-2xl">
        <Grid.Item span={6} tabletSpan={6} mobileSpan={1}>
          <Card variant="elevated">
            <Card.Header>
              <Text weight="bold" size="lg">{t('about_aau_essentials')}</Text>
            </Card.Header>
            <Card.Body>
              <Text size="md" className="text-text-muted mb-lg leading-[1.7] block">
                {t('about_aau_essentials_desc')}
              </Text>
            </Card.Body>
            <Card.Footer>
              <Button variant="ghost" size="sm" full iconRight={ExternalLink} onClick={() => env.open('https://support.its.aau.dk/')} className="normal-case tracking-normal font-bold text-sm">
                {t('visit_help_portal')}
              </Button>
            </Card.Footer>
          </Card>
        </Grid.Item>

        <Grid.Item span={6} tabletSpan={6} mobileSpan={1}>
          <Card variant="brand" className="card--decorative">
            <Card.Decoration icon={Headphones} />

            <Card.Body className="h-full flex flex-col justify-center min-h-[200px]">
              <div className="relative z-[1] w-full text-white">
                <Text weight="bold" size="xl" className="text-white card__title mb-sm block">
                  {t('need_help')}
                </Text>
                <Text size="md" className="text-white/85 mb-lg block max-w-[85%] font-medium">
                  {t('its_help_desc')}
                </Text>
                <Button 
                  variant="secondary" 
                  full 
                  onClick={() => env.open('https://support.its.aau.dk/')}
                  className="bg-white text-primary border-none hover:bg-white/90 normal-case tracking-normal font-bold text-sm"
                >
                  {t('contact_support')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Grid.Item>
      </Grid>
      </div>
    </Stack>
  )
}

export default Resources

