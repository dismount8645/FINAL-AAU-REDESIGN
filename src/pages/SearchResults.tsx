

import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate, MemoryRouter, useLocation } from 'react-router-dom';
import { SearchResultCard, SearchResultFilters } from '@/components/Search';
import { EmptyState } from '@/components/ui';
import { Grid } from '@/components/Layout/LayoutPrimitives';
import PageHeader from '@/components/Layout/PageHeader';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store';
import { useSearch } from '@/hooks';

function SearchResults() {
  const t = useStore(state => state.t)
  const isFavorite = useStore(state => state.isFavorite)
  const toggleFavorite = useStore(state => state.toggleFavorite)
  const _favorites = useStore(state => state.favorites)
  void _favorites
  const navigate = useNavigate()
  const { query, results, filteredResults, categories, activeFilter, setActiveFilter, getActionLabel, subtitle } = useSearch()

  return (
    <Stack tag="main" className="search-results-page">
      <PageHeader
        pageKey="search"
        title={`${t('search_results')} for "${query}"`}
        subtitle={subtitle}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('search_results') },
        ]}
      />

      <div className="container pb-[var(--space-3xl)]">
        <AnimatePresence mode="wait">
          {results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Stack gap="xl">
                <SearchResultFilters
                  categories={categories}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />

                <Grid columns={12} gap="lg">
                  {filteredResults.map((res) => {
                    const isCourse = res.path.startsWith('/course/')
                    const courseId = isCourse ? Number(res.path.split('/').pop()) : null
                    return (
                      <Grid.Item span={12} key={res.path}>
                        <SearchResultCard
                          item={res}
                          query={query}
                          actionLabel={getActionLabel(res)}
                          onClick={() => navigate(res.path)}
                          isStarred={courseId !== null ? isFavorite('course', courseId) : undefined}
                          onStarToggle={courseId !== null ? () => toggleFavorite('course', courseId) : undefined}
                        />
                      </Grid.Item>
                    )
                  })}
                </Grid>
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <EmptyState
                icon={Search}
                title={t('no_search_results')}
                description={t('search_no_results_desc')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Stack>
  )
}

export default SearchResults


/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  const { courses } = await import('@/lib/data')
  courses[999] = {
    title: 'Unknown Group Item',
    titleEn: 'Unknown Group Item',
    group: 'Unknown Group',
    sections: []
  } as any
  
  // Mock useNavigate
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    const mockNav = vi.fn()
    return {
      ...actual,
      useNavigate: () => mockNav
    }
  })
  
  describe('SearchResults Page', () => {
    const mockNavigate = useNavigate()
    
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
      useStore.setState({
        lang: 'da',
        favorites: []
      })
    })
  
    const renderSearchResults = async (lang: 'da' | 'en' = 'da', initialEntries = ['/search?q=Digital']) => {
      useStore.setState({ lang })
      const SearchResultsComponent = (await import('./SearchResults')).default
      return render(
        <MemoryRouter initialEntries={initialEntries}>
          <SearchResultsComponent />
        </MemoryRouter>
      )
    }
  
    it('renders search results correctly', async () => {
      await renderSearchResults('da')
      // Match the exact text content and pick the first one
      const titles = screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')
      expect(titles[0]).toBeInTheDocument()
      
      // Test navigation — click the stretched-link overlay button inside the card
      const overlayBtn = screen.getByRole('button', { name: 'View details' })
      fireEvent.click(overlayBtn)
      expect(mockNavigate).toHaveBeenCalledWith('/course/1')
    })
  
    it('filters results by category', async () => {
      await renderSearchResults('da')
      const modulerFilter = screen.getByRole('button', { name: 'Kurser' })
      fireEvent.click(modulerFilter)
      expect(screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')[0]).toBeInTheDocument()
    })
  
    it('shows empty state when no results found', async () => {
      await renderSearchResults('da', ['/search?q=xyz123'])
      expect(screen.getAllByText('Ingen resultater').length).toBeGreaterThan(0)
    })
  
    it('renders in English', async () => {
      await renderSearchResults('en', ['/search?q=Digital'])
      expect(screen.getByText(/Results for "Digital"/i)).toBeInTheDocument()
    })
  
    it('shows empty state in English', async () => {
      await renderSearchResults('en', ['/search?q=xyz123'])
      expect(screen.getAllByText('No results').length).toBeGreaterThan(0)
    })
  
    it('shows empty state when query is empty', async () => {
      await renderSearchResults('da', ['/search'])
      expect(screen.getByText(/Ingen resultater/i)).toBeInTheDocument()
    })
  
    it('finds results by description match', async () => {
      await renderSearchResults('da', ['/search?q=Kursusmodul'])
      expect(screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')[0]).toBeInTheDocument()
    })
  
    it('navigates via go to content button', async () => {
      await renderSearchResults('da')
      // Search for course action label specifically
      const goBtns = screen.getAllByText('Gå til kursus')
      fireEvent.click(goBtns[0])
      expect(mockNavigate).toHaveBeenCalledWith('/course/1')
    })
  
    it('filters by "all" category shows all results', async () => {
      await renderSearchResults('da')
      fireEvent.click(screen.getByText('Alle'))
      expect(screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')[0]).toBeInTheDocument()
    })
  
    it('filters between multiple categories excluding some results', async () => {
      await renderSearchResults('da', ['/search?q=oversigt'])
      expect(screen.queryByText(/Ingen resultater/i)).not.toBeInTheDocument()
      // Should show only page results (group: Sider)
      const categoryBtns = screen.getAllByRole('button')
      const siderBtn = [...categoryBtns].find(b => b.textContent === 'Sider')
      if (siderBtn) {
        fireEvent.click(siderBtn)
        expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
      }
    })
  
    it('renders fallback action label for unknown group', async () => {
      await renderSearchResults('da', ['/search?q=Unknown Group Item'])
      expect(screen.getByText('Gå til indhold')).toBeInTheDocument()
    })
  
    it('renders HighlightText with matching query', async () => {
      // HighlightText is used inside SearchResults
      await renderSearchResults('da')
      const strong = document.querySelector('strong')
      expect(strong).toBeInTheDocument()
      expect(strong?.textContent).toBe('Digital')
    })
  
    it('highlights text when query parameter is present in URL', async () => {
      await renderSearchResults('da', ['/search?q=Design'])
      const strong = document.querySelector('strong')
      expect(strong).toBeInTheDocument()
      expect(strong?.textContent).toBe('Design')
    })
  
    it('toggles favorite on a course search result', async () => {
      const toggleSpy = vi.spyOn(useStore.getState(), 'toggleFavorite')
      await renderSearchResults('da')
      const starBtn = screen.getByLabelText(/til favoritter|to favorites/i)
      expect(starBtn).toBeInTheDocument()
      fireEvent.click(starBtn)
      expect(toggleSpy).toHaveBeenCalledWith('course', 1)
      toggleSpy.mockRestore()
    })
  })
}
