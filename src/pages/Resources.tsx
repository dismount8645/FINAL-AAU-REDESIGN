import { useMemo } from 'react';
import { Headphones, ExternalLink } from 'lucide-react';
import { ResourcesSection } from '@/components/Resources';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Grid } from '@/components/Layout/LayoutPrimitives';
import PageLayout from '@/components/Layout/PageLayout';
import { Text } from '@/components/ui';
import { env } from '@/lib/env';
import useStore from '@/store';
import { allTools, allEssentials, allToolsList } from '@/lib/utils';

function Resources() {
  const t = useStore(state => state.t)
  const favorites = useStore(state => state.favorites)
  const pinnedTools = useMemo(() => {
    const toolFavIds = new Set(favorites.filter(f => f.type === 'tool').map(f => f.entityId))
    return allToolsList.filter(tool => toolFavIds.has(tool.id))
  }, [favorites])

  return (
    <PageLayout
      tag="main"
      className="resources-page"
      pageKey="toolbox"
      title={t('toolbox')}
      subtitle={t('toolbox_subtitle')}
      breadcrumbs={[
        { label: t('dashboard'), href: '/' },
        { label: t('toolbox') },
      ]}
      flat
    >

      <div className="container pb-xl">

      {pinnedTools.length > 0 && (
        <ResourcesSection
          title={t('quick_access')}
          subtitle={t('pinned_tools')}
          tools={pinnedTools}
          isStarredOnly
          showSsoWarning={false}
          className="mb-lg"
        />
      )}

      <ResourcesSection
        title={t('administrative_systems')}
        subtitle={t('administrative_systems_desc')}
        tools={allTools}
        className="mb-lg"
      />

      <ResourcesSection
        title={t('aau_essentials')}
        subtitle={t('aau_essentials_desc')}
        tools={allEssentials}
      />

      <Grid columns={12} gap="lg" className="mt-lg">
        <Grid.Item span={6}>
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

        <Grid.Item span={6}>
          <Card variant="brand" className="card--decorative">
            <Card.Decoration icon={Headphones} />

            <Card.Body className="h-full flex flex-col justify-center min-h-[140px]">
              <div className="relative z-[1] w-full text-white">
                <Text weight="bold" size="lg" className="text-white card__title mb-xs block">
                  {t('need_help')}
                </Text>
                <Text size="sm" className="text-white/85 mb-md block max-w-[85%] font-medium">
                  {t('its_help_desc')}
                </Text>
                <Button 
                  variant="secondary" 
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
    </PageLayout>
  )
}

export default Resources

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest as unknown as typeof import('vitest')
  const { render, screen, fireEvent } = await import('@testing-library/react')
  const { MemoryRouter } = await import('react-router-dom')

  const mockOpen = vi.fn()

  beforeEach(() => {
    mockOpen.mockClear()
    vi.spyOn(window, 'open').mockImplementation(mockOpen)
  })

  const renderWithLang = (lang: 'da' | 'en') => {
    useStore.setState({ lang, favorites: [] })
    return render(
      <MemoryRouter>
        <Resources />
      </MemoryRouter>
    )
  }

  describe('Resources', () => {
    it('renders correctly in Danish', () => {
      renderWithLang('da')
      expect(screen.getAllByText(/Værktøjskasse/i).length).toBeGreaterThan(0)
      expect(screen.getByText('Digital Eksamen')).toBeInTheDocument()
      expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
      expect(screen.getByText(/AAU IT Services står klar/i)).toBeInTheDocument()
    })
  
    it('renders correctly in English', () => {
      renderWithLang('en')
      expect(screen.getAllByText(/Toolbox/i).length).toBeGreaterThan(0)
      expect(screen.getByText('Digital Exam')).toBeInTheDocument()
      expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
      expect(screen.getByText(/AAU IT Services is ready/i)).toBeInTheDocument()
    })
  
    it('tool button opens URL on click', () => {
      renderWithLang('da')
      const card = screen.getByText('Digital Eksamen').closest('.info-card')
      expect(card).not.toBeNull()
      fireEvent.click(card!)
      expect(mockOpen).toHaveBeenCalledWith('https://digitalservices.aau.dk/dse/exam', '_blank', 'noopener,noreferrer')
    })
  
    it('digital essentials button opens URL on click', () => {
      renderWithLang('da')
      const card = screen.getByText('Outlook Mail').closest('.info-card')
      expect(card).not.toBeNull()
      fireEvent.click(card!)
      expect(mockOpen).toHaveBeenCalledWith(expect.any(String), '_blank', 'noopener,noreferrer')
    })
  
    it('footer help portal button opens URL', () => {
      renderWithLang('da')
      const btn = screen.getByText('Besøg help-portalen')
      fireEvent.click(btn)
      expect(mockOpen).toHaveBeenCalledWith('https://support.its.aau.dk/', '_blank', 'noopener,noreferrer')
    })
  
    it('renders quick access section when tools are favorited', () => {
      useStore.setState({ 
        lang: 'en',
        favorites: [{ id: 'fav1', type: 'tool', entityId: 1, order: 0, addedAt: Date.now() }] 
      })
      render(
        <MemoryRouter>
          <Resources />
        </MemoryRouter>
      )
      
      expect(screen.getByText('Quick Access')).toBeInTheDocument()
      expect(screen.getAllByText('Digital Exam').length).toBe(2) // One in Quick Access, one in main list
    })
  
    it('toggles favorite status when star is clicked', () => {
      renderWithLang('en')
      const starButton = screen.getAllByLabelText('Add to favorites')[0]
      fireEvent.click(starButton)
      
      const favorites = useStore.getState().favorites
      expect(favorites.some(f => f.entityId === 1 && f.type === 'tool')).toBe(true)
      
      fireEvent.click(screen.getAllByLabelText('Remove from favorites')[0])
      expect(useStore.getState().favorites.length).toBe(0)
    })
  
    it('shows help text when help icon is clicked', () => {
      renderWithLang('en')
      const helpButton = screen.getAllByLabelText('Help')[0]
      fireEvent.click(helpButton)
      
      expect(screen.getByText(/Digital Exam is AAU's platform/i)).toBeInTheDocument()
    })
  
    it('contact support button is present', () => {
      renderWithLang('da')
      const btn = screen.getByRole('button', { name: 'Kontakt support' })
      expect(btn).toBeInTheDocument()
    })
  
    it('opens tool url in new window when clicked', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      renderWithLang('da')
      const tool = screen.getByText('Digital Eksamen')
      fireEvent.click(tool)
      expect(windowOpenSpy).toHaveBeenCalled()
      windowOpenSpy.mockRestore()
    })
  
    it('toggles tool favorite star', () => {
      renderWithLang('da')
      const star = screen.getAllByLabelText(/favorite|stjerne/i)[0]
      fireEvent.click(star)
    })

    it('opens support link when contact support is clicked', () => {
      renderWithLang('da')
      const btn = screen.getByRole('button', { name: 'Kontakt support' })
      fireEvent.click(btn)
      expect(mockOpen).toHaveBeenCalledWith('https://support.its.aau.dk/', '_blank', 'noopener,noreferrer')
    })
  
    it('renders essential tool in quick access when favorited', () => {
      useStore.setState({
        lang: 'en',
        favorites: [{ id: 'fav1', type: 'tool', entityId: 5, order: 0, addedAt: Date.now() }]
      })
      render(
        <MemoryRouter>
          <Resources />
        </MemoryRouter>
      )
      expect(screen.getByText('Quick Access')).toBeInTheDocument()
      const outlookElements = screen.getAllByText('Outlook Mail')
      expect(outlookElements.length).toBe(2) // One in Quick Access, one in Essentials
    })
  })
}
