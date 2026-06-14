import { useMemo, useState } from 'react';
import { ExternalLink, Search, X, Star } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'popular' | 'tools' | 'comm' | 'files' | 'eval'>('all')

  const categoriesList = useMemo(() => [
    { id: 'all', label: lang === 'da' ? 'Alle' : 'All' },
    { id: 'popular', label: lang === 'da' ? 'Populære' : 'Popular' },
    { id: 'tools', label: lang === 'da' ? 'Studieadministrative' : 'Administrative' },
    { id: 'comm', label: lang === 'da' ? 'Kommunikation' : 'Communication' },
    { id: 'files', label: lang === 'da' ? 'Filer & dokumenter' : 'Files & Documents' },
    { id: 'eval', label: lang === 'da' ? 'Undervisning & evaluering' : 'Teaching & Evaluation' },
  ], [lang]);

  const pinnedTools = useMemo(() => {
    const toolFavIds = new Set(favorites.filter(f => f.type === 'tool').map(f => f.entityId))
    return allToolsList.filter(tool => toolFavIds.has(tool.id))
  }, [favorites])

  const popularTools = useMemo(() => {
    return allToolsList.filter(tool => tool.popular)
  }, [])

  // Filter tools based on query
  const filteredToolsList = useMemo(() => {
    if (!searchQuery) return allToolsList
    const q = searchQuery.toLowerCase()
    return allToolsList.filter(tool => {
      const name = (tool.titleKey ? t(tool.titleKey) : (lang === 'da' ? tool.titleDa || '' : tool.titleEn || '')).toLowerCase()
      const shortTitle = lang === 'da'
        ? (tool.shortTitleDa ?? '')
        : (tool.shortTitleEn ?? '')
      const desc = (lang === 'da' ? tool.descDa : tool.descEn || '').toLowerCase()
      const cat = (tool.category || '').toLowerCase()
      const keywords = (tool.keywords || []).join(' ').toLowerCase()
      const searchable = [name, shortTitle.toLowerCase(), desc, cat, keywords].join(' ')
      return searchable.includes(q)
    })
  }, [searchQuery, t, lang])

  // Filtered popular tools
  const filteredPopularTools = useMemo(() => {
    return filteredToolsList.filter(t => t.popular)
  }, [filteredToolsList])

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
    if (activeCategory === 'popular' && filteredPopularTools.length === 0) return true
    if (activeCategory === 'tools' && filteredTools.length === 0) return true
    if (activeCategory === 'comm' && essentialsCommunication.length === 0) return true
    if (activeCategory === 'files' && essentialsFiles.length === 0) return true
    if (activeCategory === 'eval' && essentialsTeaching.length === 0) return true
    return false
  }, [filteredToolsList, activeCategory, filteredPopularTools, filteredTools, essentialsCommunication, essentialsFiles, essentialsTeaching])

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
        <SplitLayout
          fullHeight={false}
          mainSpan={8}
          sidebarSpan={4}
          main={
            <div className="flex flex-col gap-xl">
              {/* Search area — inside main column = correct width */}
              <div className="flex flex-col gap-0">
                <Text weight="bold" size="lg" className="mb-xs">
                  {lang === 'da' ? 'Find system eller værktøj' : 'Find system or tool'}
                </Text>
                <div className="relative mb-2xs">
                  <Input
                    type="text"
                    placeholder={lang === 'da' ? 'Søg efter Moodle, eksamen, mail, STADS...' : 'Search for Moodle, exams, mail, STADS...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base rounded-lg"
                  />
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary opacity-85" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label={lang === 'da' ? 'Annuller søgning' : 'Cancel search'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-1.5 py-1"
                    >
                      <X size={16} strokeWidth={2.5} aria-hidden="true" />
                      <span className="hidden sm:inline">{lang === 'da' ? 'Annuller' : 'Cancel'}</span>
                    </button>
                  )}
                </div>
                <Text size="sm" muted className="mb-sm">
                  {lang === 'da'
                    ? 'Søg fx "eksamen", "mail", "software" eller "STADS"'
                    : 'Try "exam", "mail", "software" or "STADS"'}
                </Text>

                {/* Category filter chips — horizontal wrapping row */}
                <div className="flex flex-wrap gap-xs" role="tablist" aria-label={lang === 'da' ? 'Kategorifiltrering' : 'Category filtering'}>
                  {categoriesList.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveCategory(cat.id as 'all' | 'popular' | 'tools' | 'comm' | 'files' | 'eval')}
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
              {/* Starred tools section — compact chips if ≤3, else card grid */}
              {pinnedTools.length > 0 && !searchQuery && activeCategory === 'all' && (
                <div className="bg-primary/5 dark:bg-primary/10 p-md rounded-2xl border border-primary/10">
                  {pinnedTools.length <= 3 ? (
                    <>
                      <Text weight="bold" size="md" className="mb-sm">
                        {lang === 'da' ? 'Dine fastgjorte værktøjer' : 'Your pinned tools'}
                      </Text>
                      <div className="flex flex-wrap gap-sm">
                        {pinnedTools.map(tool => {
                          const shortTitle = lang === 'da'
                            ? (tool.shortTitleDa ?? tool.titleDa)
                            : (tool.shortTitleEn ?? tool.titleEn)
                          return (
                            <button
                              key={tool.id}
                              type="button"
                              onClick={() => env.open(tool.url)}
                              aria-label={lang === 'da' ? `Åbn ${shortTitle}` : `Open ${shortTitle}`}
                              className="flex items-center gap-sm bg-bg-card border border-border/60 hover:bg-bg-hover hover:border-primary/40 rounded-full px-lg py-2 text-sm font-bold transition-all cursor-pointer shadow-sm text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                              <Star size={14} strokeWidth={2} fill="currentColor" className="text-warning shrink-0" />
                              <span>{shortTitle}</span>
                              <ExternalLink size={14} strokeWidth={2.5} aria-hidden="true" />
                            </button>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    <ResourcesSection
                      title={lang === 'da' ? 'Dine fastgjorte værktøjer' : 'Your pinned tools'}
                      subtitle={lang === 'da' ? 'Hurtig genvej til dine foretrukne systemer' : 'Quick shortcut to your favorite tools'}
                      tools={pinnedTools}
                      isStarredOnly
                      showSsoWarning={false}
                      onToggleFavorite={(id) => toggleFavorite('tool', id)}
                    />
                  )}
                </div>
              )}

              {/* Popular systems */}
              {!searchQuery && activeCategory === 'all' && popularTools.length > 0 && (
                <div className="flex flex-col gap-sm">
                  <Text weight="bold" size="md">
                    {lang === 'da' ? 'Populære systemer' : 'Popular systems'}
                  </Text>
                  <div className="flex flex-wrap gap-sm">
                    {popularTools.map(tool => {
                      const shortTitle = lang === 'da'
                        ? (tool.shortTitleDa ?? tool.titleDa)
                        : (tool.shortTitleEn ?? tool.titleEn)
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => env.open(tool.url)}
                          className="flex items-center gap-xs bg-bg-card border border-border/80 hover:bg-bg-hover hover:border-primary/40 rounded-full px-md py-2 text-sm font-bold transition-all cursor-pointer"
                        >
                          <span>{shortTitle}</span>
                          <ExternalLink size={14} strokeWidth={2.5} aria-hidden="true" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Popular systems filter view */}
              {activeCategory === 'popular' && filteredPopularTools.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Populære systemer' : 'Popular systems'}
                  tools={filteredPopularTools}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {/* Administrative systems */}
              {(activeCategory === 'all' || activeCategory === 'tools') && filteredTools.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Studieadministrative' : 'Administrative'}
                  subtitle={t('administrative_systems_desc')}
                  tools={filteredTools}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {/* Essentials Communication */}
              {(activeCategory === 'all' || activeCategory === 'comm') && essentialsCommunication.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Kommunikation' : 'Communication'}
                  subtitle={lang === 'da' ? 'Outlook Mail, Microsoft Teams og Zoom' : 'Outlook Mail, Microsoft Teams, and Zoom'}
                  tools={essentialsCommunication}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {/* Essentials Files */}
              {(activeCategory === 'all' || activeCategory === 'files') && essentialsFiles.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Filer & dokumenter' : 'Files & Documents'}
                  subtitle={lang === 'da' ? 'OneDrive lagring, Word & Office, OneNote' : 'OneDrive storage, Word & Office, OneNote'}
                  tools={essentialsFiles}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {/* Essentials Teaching */}
              {(activeCategory === 'all' || activeCategory === 'eval') && essentialsTeaching.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Undervisning & evaluering' : 'Teaching & Evaluation'}
                  subtitle={lang === 'da' ? 'Forms undersøgelser og Panopto video' : 'Forms surveys and Panopto video'}
                  tools={essentialsTeaching}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {showEmptyState && (
                <div className="py-xl text-center flex flex-col items-center gap-md">
                  <div>
                    <Text weight="bold" size="lg">
                      {lang === 'da' ? 'Ingen systemer fundet' : 'No systems found'}
                      {searchQuery && (
                        <span className="text-text-muted">
                          {lang === 'da' ? ` for "${searchQuery}"` : ` for "${searchQuery}"`}
                        </span>
                      )}
                    </Text>
                    <Text muted className="mt-xs">
                      {lang === 'da'
                        ? 'Prøv at søge efter fx "eksamen", "mail", "software" eller "STADS".'
                        : 'Try searching for "exam", "mail", "software" or "STADS".'}
                    </Text>
                  </div>
                  <div className="flex items-center gap-sm">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="normal-case tracking-normal font-bold"
                    >
                      {lang === 'da' ? 'Ryd søgning' : 'Clear search'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => env.open('https://support.its.aau.dk/')}
                      className="text-primary normal-case tracking-normal font-bold"
                    >
                      {lang === 'da' ? 'Kontakt IT-support' : 'Contact IT support'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          }
          sidebar={
            <aside className="flex flex-col gap-lg">
              <Card variant="elevated" className="border-primary/20">
                <Card.Header padding="compact" className="flex items-center gap-xs">
                  <Search size={18} className="text-primary" />
                  <Text weight="bold" size="md">
                    {lang === 'da' ? 'Kan du ikke finde systemet?' : "Can't find the system?"}
                  </Text>
                </Card.Header>
                <Card.Body padding="compact" className="flex flex-col gap-sm">
                  <Text size="sm" className="text-text-muted leading-[1.6]">
                    {lang === 'da'
                      ? 'Søg efter system, opgave eller nøgleord — fx "eksamen", "mail" eller "software".'
                      : 'Search by system, task or keyword — e.g. "exam", "mail" or "software".'}
                  </Text>
                  <div className="flex flex-col gap-xs mt-xs">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => env.open('https://support.its.aau.dk/')}
                      className="normal-case tracking-normal font-bold"
                    >
                      {lang === 'da' ? 'Kontakt IT-support' : 'Contact IT support'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => env.open('https://support.its.aau.dk/')}
                      className="text-primary normal-case tracking-normal font-bold"
                    >
                      {lang === 'da' ? 'Besøg help-portalen' : 'Visit the help portal'}
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
      expect(screen.getAllByText('Digital Eksamen').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Outlook Mail').length).toBeGreaterThan(0)
      expect(screen.getByText('Kan du ikke finde systemet?')).toBeInTheDocument()
    })
  
    it('renders correctly in English', () => {
      renderWithLang('en')
      expect(screen.getAllByText(/Systems/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText('Digital Exam').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Outlook Mail').length).toBeGreaterThan(0)
      expect(screen.getByText("Can't find the system?")).toBeInTheDocument()
    })
  
    it('tool button opens URL on click', () => {
      renderWithLang('da')
      const ctaBtn = screen.getByRole('button', { name: /åbn digital eksamen/i })
      fireEvent.click(ctaBtn)
      expect(mockOpen).toHaveBeenCalledWith('https://digitalservices.aau.dk/dse/exam', '_blank', 'noopener,noreferrer')
    })
  
    it('digital essentials button opens URL on click', () => {
      renderWithLang('da')
      const ctaBtn = screen.getByRole('button', { name: /åbn outlook/i })
      fireEvent.click(ctaBtn)
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
      expect(screen.getAllByText('Digital Exam').length).toBe(3) // Popular chip + Quick Access + main list
    })
  
    it('toggles favorite status when star is clicked', () => {
      renderWithLang('en')
      const starButton = screen.getAllByLabelText(/Add .+ to favorites/i)[0]
      fireEvent.click(starButton)
      
      const favorites = useStore.getState().favorites
      expect(favorites.some(f => f.entityId === 1 && f.type === 'tool')).toBe(true)
      
      fireEvent.click(screen.getAllByLabelText(/Remove .+ from favorites/i)[0])
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
      const btn = screen.getByRole('button', { name: 'Kontakt IT-support' })
      expect(btn).toBeInTheDocument()
    })
  
    it('opens tool url in new window when clicked', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      renderWithLang('da')
      const ctaBtn = screen.getByRole('button', { name: /åbn digital eksamen/i })
      fireEvent.click(ctaBtn)
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
      const btn = screen.getByRole('button', { name: 'Kontakt IT-support' })
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
      // Compact pinned chip shows short title "Outlook"; Essentials section shows "Outlook Mail"
      const outlookShort = screen.getAllByText('Outlook')
      expect(outlookShort.length).toBe(2) // chip + partial in "Outlook Mail"
      expect(screen.getAllByText('Outlook Mail').length).toBe(1)
    })

    it('filters tools by search query input', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText(/Søg efter/i)
      fireEvent.change(searchInput, { target: { value: 'outlook' } })
      
      expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
      expect(screen.queryByText('Digital Eksamen')).not.toBeInTheDocument()
    })

    it('searches by keyword "mail" to find Outlook', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText(/Søg efter/i)
      fireEvent.change(searchInput, { target: { value: 'mail' } })

      expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
      expect(screen.queryByText('Digital Eksamen')).not.toBeInTheDocument()
    })

    it('searches partial "eks" to find Digital Eksamen', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText(/Søg efter/i)
      fireEvent.change(searchInput, { target: { value: 'eks' } })

      expect(screen.getByText('Digital Eksamen')).toBeInTheDocument()
    })

    it('handles case-insensitive search', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText(/Søg efter/i)
      fireEvent.change(searchInput, { target: { value: 'STADS' } })

      expect(screen.getByText('STADS')).toBeInTheDocument()
    })

    it('shows helpful empty state when no results match', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText(/Søg efter/i)
      fireEvent.change(searchInput, { target: { value: 'zzzzz' } })

      expect(screen.getByText(/Ingen systemer fundet/i)).toBeInTheDocument()
      expect(screen.getByText(/zzzzz/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Ryd søgning' })).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: 'Kontakt IT-support' }).length).toBeGreaterThan(0)
    })

    it('clearing search restores all tools', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText(/Søg efter/i)
      fireEvent.change(searchInput, { target: { value: 'mail' } })
      expect(screen.queryAllByText('Digital Eksamen').length).toBe(0)

      fireEvent.change(searchInput, { target: { value: '' } })
      expect(screen.getAllByText('Digital Eksamen').length).toBeGreaterThan(0)
    })

    it('filters tools by category chips click', () => {
      renderWithLang('da')
      const commChip = screen.getByRole('tab', { name: 'Kommunikation' })
      fireEvent.click(commChip)
      
      expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
      expect(screen.queryByText('Digital Eksamen')).not.toBeInTheDocument()
    })

    it('popular chip shows only popular tools', () => {
      renderWithLang('da')
      const popularChip = screen.getByRole('tab', { name: 'Populære' })
      fireEvent.click(popularChip)
      
      expect(screen.getByText('Digital Eksamen')).toBeInTheDocument()
      expect(screen.getByText('STADS')).toBeInTheDocument()
      expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
      expect(screen.queryByText('AAU Projektbibliotek')).not.toBeInTheDocument()
    })

    it('popular filter removes popular shortcut strip', () => {
      renderWithLang('da')
      expect(screen.getAllByText('Digital Eksamen').length).toBe(2) // chip + cat section

      const popularChip = screen.getByRole('tab', { name: 'Populære' })
      fireEvent.click(popularChip)
      
      const digitalExamEls = screen.getAllByText('Digital Eksamen')
      expect(digitalExamEls.length).toBe(1) // only in popular grid, not in strip
    })

    it('popular filter shows tools across categories', () => {
      renderWithLang('da')
      const popularChip = screen.getByRole('tab', { name: 'Populære' })
      fireEvent.click(popularChip)
      
      expect(screen.getByText('Digital Eksamen')).toBeInTheDocument() // tools category
      expect(screen.getByText('Outlook Mail')).toBeInTheDocument() // essentials category
    })

    it('popular filter shows empty state for no match', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText(/Søg efter/i)
      fireEvent.change(searchInput, { target: { value: 'zzzzz' } })
      
      const popularChip = screen.getByRole('tab', { name: 'Populære' })
      fireEvent.click(popularChip)
      
      expect(screen.getByText(/Ingen systemer fundet/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Ryd søgning' })).toBeInTheDocument()
    })

    it('clear search button restores tools', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText(/Søg efter/i)
      fireEvent.change(searchInput, { target: { value: 'zzzzz' } })
      expect(screen.getByText(/Ingen systemer fundet/i)).toBeInTheDocument()

      const clearBtn = screen.getByRole('button', { name: 'Ryd søgning' })
      fireEvent.click(clearBtn)
      expect(screen.queryByText(/Ingen systemer fundet/i)).not.toBeInTheDocument()
      expect(screen.getAllByText('Digital Eksamen').length).toBeGreaterThan(0)
    })

    it('renders contextual support card title', () => {
      renderWithLang('da')
      expect(screen.getByText('Kan du ikke finde systemet?')).toBeInTheDocument()
    })

    it('renders search guidance text', () => {
      renderWithLang('da')
      expect(screen.getByText(/Søg efter system, opgave eller nøgleord/i)).toBeInTheDocument()
    })

    it('renders example search terms', () => {
      renderWithLang('da')
      const card = screen.getByText(/Søg efter system, opgave eller nøgleord/i)
      expect(card.textContent).toContain('eksamen')
      expect(card.textContent).toContain('mail')
      expect(card.textContent).toContain('software')
    })

    it('renders Kontakt IT-support CTA', () => {
      renderWithLang('da')
      expect(screen.getByRole('button', { name: 'Kontakt IT-support' })).toBeInTheDocument()
    })

    it('renders Besøg help-portalen link', () => {
      renderWithLang('da')
      expect(screen.getByText('Besøg help-portalen')).toBeInTheDocument()
    })

    it('does not render old generic Brug for hjælp? copy', () => {
      renderWithLang('da')
      expect(screen.queryByText('Brug for hjælp?')).not.toBeInTheDocument()
      expect(screen.queryByText(/AAU IT Services står klar/i)).not.toBeInTheDocument()
    })

    it('cancel button is hidden when search is empty', () => {
      renderWithLang('da')
      expect(screen.queryByLabelText('Annuller søgning')).not.toBeInTheDocument()
    })

    it('cancel button appears when search has input', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText(/Søg efter/i)
      fireEvent.change(searchInput, { target: { value: 'outlook' } })
      expect(screen.getByLabelText('Annuller søgning')).toBeInTheDocument()
    })

    it('cancel button clears search and restores tools', () => {
      renderWithLang('da')
      const searchInput = screen.getByPlaceholderText(/Søg efter/i)
      fireEvent.change(searchInput, { target: { value: 'zzzzz' } })
      expect(screen.getByText(/Ingen systemer fundet/i)).toBeInTheDocument()

      const cancelBtn = screen.getByLabelText('Annuller søgning')
      fireEvent.click(cancelBtn)
      expect(screen.queryByText(/Ingen systemer fundet/i)).not.toBeInTheDocument()
      expect(screen.getAllByText('Digital Eksamen').length).toBeGreaterThan(0)
    })
  })
}
