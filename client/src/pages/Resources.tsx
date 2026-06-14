import { useMemo, useState } from 'react';
import { Headphones, Search } from 'lucide-react';
import { ResourcesSection } from '@/components/Resources';
import { Button, Input } from '@/components/ui';
import { Card } from '@/components/ui';
import SplitLayout from '@/components/Layout/SplitLayout';
import PageLayout from '@/components/Layout/PageLayout';
import { Text } from '@/components/ui';
import { env } from '@/lib/env';
import useStore from '@/store';
import { allToolsList, cn } from '@/lib/utils';

function Resources() {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const favorites = useStore(state => state.favorites)
  const toggleFavorite = useStore(state => state.toggleFavorite)

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | 'tools' | 'comm' | 'files' | 'eval'>('all')

  const categoriesList = useMemo(() => [
    { id: 'all', label: lang === 'da' ? 'Alle' : 'All' },
    { id: 'tools', label: lang === 'da' ? 'Studieadministrative' : 'Administrative' },
    { id: 'comm', label: lang === 'da' ? 'Kommunikation' : 'Communication' },
    { id: 'files', label: lang === 'da' ? 'Filer & Dokumenter' : 'Files & Documents' },
    { id: 'eval', label: lang === 'da' ? 'Undervisning & Evaluering' : 'Teaching & Evaluation' },
  ], [lang]);

  const pinnedTools = useMemo(() => {
    const toolFavIds = new Set(favorites.filter(f => f.type === 'tool').map(f => f.entityId))
    return allToolsList.filter(tool => toolFavIds.has(tool.id))
  }, [favorites])

  // Filter tools based on query
  const filteredToolsList = useMemo(() => {
    if (!searchQuery) return allToolsList
    const q = searchQuery.toLowerCase()
    return allToolsList.filter(tool => {
      const name = (tool.titleKey ? t(tool.titleKey) : (lang === 'da' ? tool.titleDa || '' : tool.titleEn || '')).toLowerCase()
      const desc = (lang === 'da' ? tool.descDa : tool.descEn || '').toLowerCase()
      const cat = (tool.category || '').toLowerCase()
      return name.includes(q) || desc.includes(q) || cat.includes(q)
    })
  }, [searchQuery, t, lang])

  // Split into categories
  const filteredTools = useMemo(() => {
    return filteredToolsList.filter(t => t.category === 'tools')
  }, [filteredToolsList])

  // Group essentials
  const essentialsCommunication = useMemo(() => {
    return filteredToolsList.filter(t => t.category === 'essentials' && [5, 6, 12].includes(t.id))
  }, [filteredToolsList])

  const essentialsFiles = useMemo(() => {
    return filteredToolsList.filter(t => t.category === 'essentials' && [7, 8, 9].includes(t.id))
  }, [filteredToolsList])

  const essentialsTeaching = useMemo(() => {
    return filteredToolsList.filter(t => t.category === 'essentials' && [10, 11].includes(t.id))
  }, [filteredToolsList])

  const showEmptyState = useMemo(() => {
    if (filteredToolsList.length === 0) return true
    if (activeCategory === 'tools' && filteredTools.length === 0) return true
    if (activeCategory === 'comm' && essentialsCommunication.length === 0) return true
    if (activeCategory === 'files' && essentialsFiles.length === 0) return true
    if (activeCategory === 'eval' && essentialsTeaching.length === 0) return true
    return false
  }, [filteredToolsList, activeCategory, filteredTools, essentialsCommunication, essentialsFiles, essentialsTeaching])

  return (
    <PageLayout
      tag="main"
      className="resources-page container"
      pageKey="toolbox"
      title={t('toolbox')}
      subtitle={t('toolbox_subtitle')}
      breadcrumbs={[
        { label: t('dashboard'), href: '/' },
        { label: t('toolbox') },
      ]}
      flat
    >
      <div className="pb-xl">
        {/* Top search bar and category filter chips */}
        <div className="mb-lg max-w-4xl w-full flex flex-col gap-sm">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder={lang === 'da' ? 'Søg i værktøjer...' : 'Search tools...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-sm rounded-lg"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary opacity-85" />
          </div>
          
          <div className="flex flex-wrap gap-xs mt-1" role="tablist" aria-label={lang === 'da' ? 'Kategorifiltrering' : 'Category filtering'}>
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.id as 'all' | 'tools' | 'comm' | 'files' | 'eval')}
                  className={cn(
                    "px-md py-2 rounded-full text-xs font-bold transition-all border outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isActive
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-bg-card text-text-secondary border-border/80 hover:bg-bg-hover hover:text-main"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <SplitLayout
          fullHeight={false}
          mainSpan={8}
          sidebarSpan={4}
          main={
            <div className="flex flex-col gap-xl">
              {/* Starred tools section */}
              {pinnedTools.length > 0 && !searchQuery && activeCategory === 'all' && (
                <div className="bg-primary/5 p-md rounded-2xl border border-primary/10">
                  <ResourcesSection
                    title={lang === 'da' ? 'Dine fastgjorte værktøjer' : 'Your pinned tools'}
                    subtitle={lang === 'da' ? 'Hurtig genvej til dine foretrukne systemer' : 'Quick shortcut to your favorite tools'}
                    tools={pinnedTools}
                    isStarredOnly
                    showSsoWarning={false}
                    onToggleFavorite={(id) => toggleFavorite('tool', id)}
                  />
                </div>
              )}

              {/* Administrative systems */}
              {(activeCategory === 'all' || activeCategory === 'tools') && filteredTools.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Studieadministrative systemer' : 'Administrative systems'}
                  subtitle={t('administrative_systems_desc')}
                  tools={filteredTools}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {/* Essentials Communication */}
              {(activeCategory === 'all' || activeCategory === 'comm') && essentialsCommunication.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'AAU Basispakke - Kommunikation' : 'AAU Essentials - Communication'}
                  subtitle={lang === 'da' ? 'Outlook Mail, Microsoft Teams og Zoom' : 'Outlook Mail, Microsoft Teams, and Zoom'}
                  tools={essentialsCommunication}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {/* Essentials Files */}
              {(activeCategory === 'all' || activeCategory === 'files') && essentialsFiles.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'AAU Basispakke - Filer & Dokumenter' : 'AAU Essentials - Files & Documents'}
                  subtitle={lang === 'da' ? 'OneDrive lagring, Word & Office, OneNote' : 'OneDrive storage, Word & Office, OneNote'}
                  tools={essentialsFiles}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {/* Essentials Teaching */}
              {(activeCategory === 'all' || activeCategory === 'eval') && essentialsTeaching.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'AAU Basispakke - Undervisning & Evaluering' : 'AAU Essentials - Teaching & Evaluation'}
                  subtitle={lang === 'da' ? 'Forms undersøgelser og Panopto video' : 'Forms surveys and Panopto video'}
                  tools={essentialsTeaching}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {showEmptyState && (
                <div className="py-xl text-center">
                  <Text muted>{lang === 'da' ? 'Ingen værktøjer matcher din søgning' : 'No tools match your search'}</Text>
                </div>
              )}
            </div>
          }
          sidebar={
            <aside className="flex flex-col gap-lg">
              <Card variant="elevated" className="border-primary/20">
                <Card.Header padding="compact" className="flex items-center gap-xs">
                  <Headphones size={18} className="text-primary" />
                  <Text weight="bold" size="md">{t('need_help')}</Text>
                </Card.Header>
                <Card.Body padding="compact" className="flex flex-col gap-sm">
                  <Text size="sm" className="text-text-muted leading-[1.6]">
                    {t('about_aau_essentials_desc')}
                  </Text>
                  <Text size="sm" className="italic text-text-muted leading-[1.6]">
                    {t('its_help_desc')}
                  </Text>
                  <div className="flex flex-col gap-xs mt-xs">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => env.open('https://support.its.aau.dk/')}
                      className="normal-case tracking-normal font-bold"
                    >
                      {t('contact_support')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => env.open('https://support.its.aau.dk/')}
                      className="text-primary normal-case tracking-normal font-bold"
                    >
                      {t('visit_help_portal')}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </aside>
          }
        />
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
      expect(screen.getAllByText(/Systemer/i).length).toBeGreaterThan(0)
      expect(screen.getByText('Digital Eksamen')).toBeInTheDocument()
      expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
      expect(screen.getByText(/AAU IT Services står klar/i)).toBeInTheDocument()
    })
  
    it('renders correctly in English', () => {
      renderWithLang('en')
      expect(screen.getAllByText(/Systems/i).length).toBeGreaterThan(0)
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
      
      expect(screen.getByText('Your pinned tools')).toBeInTheDocument()
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
      const star = screen.getAllByLabelText(/favorit|favorite|stjerne/i)[0]
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
      expect(screen.getByText('Your pinned tools')).toBeInTheDocument()
      const outlookElements = screen.getAllByText('Outlook Mail')
      expect(outlookElements.length).toBe(2) // One in Quick Access, one in Essentials
    })

    it('filters tools by search query input', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText('Søg i værktøjer...')
      fireEvent.change(searchInput, { target: { value: 'outlook' } })
      
      expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
      expect(screen.queryByText('Digital Eksamen')).not.toBeInTheDocument()
    })

    it('filters tools by category chips click', () => {
      renderWithLang('da')
      const commChip = screen.getByRole('tab', { name: 'Kommunikation' })
      fireEvent.click(commChip)
      
      expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
      expect(screen.queryByText('Digital Eksamen')).not.toBeInTheDocument()
    })
  })
}
