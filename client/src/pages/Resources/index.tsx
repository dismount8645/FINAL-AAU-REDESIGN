import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui';
import { Text } from '@/components/ui';
import SplitLayout from '@/components/Layout/SplitLayout';
import PageLayout from '@/components/Layout/PageLayout';
import useStore from '@/store';
import { allToolsList, cn } from '@/lib/utils';
import PinnedTools from './PinnedTools';
import PopularSystems from './PopularSystems';
import AdminSystems from './AdminSystems';
import Essentials from './Essentials';
import EmptyState from './EmptyState';
import ResourcesSidebar from './ResourcesSidebar';

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

              <PinnedTools
                pinnedTools={pinnedTools}
                searchQuery={searchQuery}
                activeCategory={activeCategory}
                lang={lang}
                onToggleFavorite={(id: number) => toggleFavorite('tool', id)}
              />

              <PopularSystems
                popularTools={popularTools}
                filteredPopularTools={filteredPopularTools}
                searchQuery={searchQuery}
                activeCategory={activeCategory}
                lang={lang}
                onToggleFavorite={(id: number) => toggleFavorite('tool', id)}
              />

              <AdminSystems
                filteredTools={filteredTools}
                activeCategory={activeCategory}
                lang={lang}
                t={t}
                onToggleFavorite={(id: number) => toggleFavorite('tool', id)}
              />

              <Essentials
                essentialsCommunication={essentialsCommunication}
                essentialsFiles={essentialsFiles}
                essentialsTeaching={essentialsTeaching}
                activeCategory={activeCategory}
                lang={lang}
                onToggleFavorite={(id: number) => toggleFavorite('tool', id)}
              />

              <EmptyState
                showEmptyState={showEmptyState}
                searchQuery={searchQuery}
                lang={lang}
                onClearSearch={() => setSearchQuery('')}
              />
            </div>
          }
          sidebar={
            <ResourcesSidebar lang={lang} />
          }
        />
      </div>
    </PageLayout>
  )
}

export default Resources
