import { useState, useMemo } from 'react';
import { Search, X, Star, ExternalLink } from 'lucide-react';
import { Input, Text, EmptyState, Button, Card } from '@/components/ui';
import SplitLayout from '@/components/Layout/SplitLayout';
import PageLayout from '@/components/Layout/PageLayout';
import useStore from '@/store';
import { allToolsList, cn, env } from '@/lib/utils';
import ResourcesSection from '@/components/Resources/ResourcesSection';

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

  const filteredPopularTools = useMemo(() => {
    return filteredToolsList.filter(t => t.popular)
  }, [filteredToolsList])

  const filteredTools = useMemo(() => {
    return filteredToolsList.filter(t => t.category === 'tools')
  }, [filteredToolsList])

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

              {activeCategory === 'popular' && filteredPopularTools.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Populære systemer' : 'Popular systems'}
                  subtitle={lang === 'da' ? 'Mest brugte systemer' : 'Most used systems'}
                  tools={filteredPopularTools}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {(activeCategory === 'all' || activeCategory === 'tools') && filteredTools.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Studieadministrative' : 'Administrative'}
                  subtitle={t('administrative_systems_desc')}
                  tools={filteredTools}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {(activeCategory === 'all' || activeCategory === 'comm') && essentialsCommunication.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Kommunikation' : 'Communication'}
                  subtitle={lang === 'da' ? 'Outlook Mail, Microsoft Teams og Zoom' : 'Outlook Mail, Microsoft Teams, and Zoom'}
                  tools={essentialsCommunication}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {(activeCategory === 'all' || activeCategory === 'files') && essentialsFiles.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Filer & dokumenter' : 'Files & Documents'}
                  subtitle={lang === 'da' ? 'OneDrive lagring, Word & Office, OneNote' : 'OneDrive storage, Word & Office, OneNote'}
                  tools={essentialsFiles}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {(activeCategory === 'all' || activeCategory === 'eval') && essentialsTeaching.length > 0 && (
                <ResourcesSection
                  title={lang === 'da' ? 'Undervisning & evaluering' : 'Teaching & Evaluation'}
                  subtitle={lang === 'da' ? 'Forms undersøgelser og Panopto video' : 'Forms surveys and Panopto video'}
                  tools={essentialsTeaching}
                  onToggleFavorite={(id) => toggleFavorite('tool', id)}
                />
              )}

              {showEmptyState && (
                <EmptyState
                  title={
                    lang === 'da'
                      ? `Ingen systemer fundet${searchQuery ? ` for "${searchQuery}"` : ''}`
                      : `No systems found${searchQuery ? ` for "${searchQuery}"` : ''}`
                  }
                  description={
                    lang === 'da'
                      ? 'Prøv at søge efter fx "eksamen", "mail", "software" eller "STADS".'
                      : 'Try searching for "exam", "mail", "software" or "STADS".'
                  }
                  action={
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
                  }
                />
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
