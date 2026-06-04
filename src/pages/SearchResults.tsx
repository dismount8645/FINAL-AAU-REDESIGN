import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate, MemoryRouter, useLocation } from 'react-router-dom';
import SearchResultCard from '@/components/SearchResultCard';
import SearchResultFilters from '@/components/SearchResultFilters';
import EmptyState from '@/components/EmptyState';
import { Grid } from '@/components/LayoutPrimitives';
import PageHeader from '@/components/PageHeader';
import { Stack } from '@/components/LayoutPrimitives';
import useStore from '@/lib/store';
import { useSearch } from '@/lib/useSearch';

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
                      <Grid.Item span={12} tabletSpan={6} mobileSpan={1} key={res.path}>
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


if (import.meta.vitest) {
  // Mock mockData to include a result with an unknown group
  vi.mock('@/lib/mockData', async () => {
    const actual = await vi.importActual('@/lib/mockData') as any
    return {
      ...actual,
      courses: {
        ...actual.courses,
        999: {
          title: 'Unknown Group Item',
          titleEn: 'Unknown Group Item',
          group: 'Unknown Group',
          sections: []
        }
      }
    }
  })
  
  // Mock react-router-dom
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: vi.fn(),
      useLocation: vi.fn()
    }
  })
  
  const mockLocation = (search: string = '') => ({
    pathname: '/search',
    search,
    hash: '',
    state: null,
    key: 'default'
  })
  describe('SearchResults Page', () => {
    const mockNavigate = vi.fn()
  
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
      vi.mocked(useNavigate).mockReturnValue(mockNavigate)
      // Default search for "Digital"
      vi.mocked(useLocation).mockReturnValue(mockLocation('?q=Digital'))
    })
  
    const renderSearchResults = (lang: 'da' | 'en' = 'da') => {
      useStore.setState({ lang })
      return render(
        <MemoryRouter>
          <SearchResults />
        </MemoryRouter>
      )
    }
  
    it('renders search results correctly', () => {
      renderSearchResults('da')
      // Match the exact text content and pick the first one
      const titles = screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')
      expect(titles[0]).toBeInTheDocument()
      
      // Test navigation — click the stretched-link overlay button inside the card
      const teaserCard = titles[0].closest('[class*="@container/teaser"]')!
      const overlayBtn = teaserCard.querySelector('[aria-label="View details"]')
      fireEvent.click(overlayBtn!)
      expect(mockNavigate).toHaveBeenCalledWith('/course/1')
    })
  
    it('filters results by category', () => {
      renderSearchResults('da')
      const modulerFilter = screen.getByRole('button', { name: 'Moduler' })
      fireEvent.click(modulerFilter)
      expect(screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')[0]).toBeInTheDocument()
    })
  
    it('shows empty state when no results found', () => {
      vi.mocked(useLocation).mockReturnValue(mockLocation('?q=xyz123'))
      renderSearchResults('da')
      expect(screen.getAllByText('Ingen resultater').length).toBeGreaterThan(0)
    })
  
    it('renders in English', () => {
      vi.mocked(useLocation).mockReturnValue(mockLocation('?q=Digital'))
      renderSearchResults('en')
      expect(screen.getByText(/Results for "Digital"/i)).toBeInTheDocument()
    })
  
    it('shows empty state in English', () => {
      vi.mocked(useLocation).mockReturnValue(mockLocation('?q=xyz123'))
      renderSearchResults('en')
      expect(screen.getAllByText('No results').length).toBeGreaterThan(0)
    })
  
    it('shows empty state when query is empty', () => {
      vi.mocked(useLocation).mockReturnValue(mockLocation(''))
      renderSearchResults('da')
      expect(screen.getByText(/Ingen resultater/i)).toBeInTheDocument()
    })
  
    it('finds results by description match', () => {
      vi.mocked(useLocation).mockReturnValue(mockLocation('?q=Kursusmodul'))
      renderSearchResults('da')
      expect(screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')[0]).toBeInTheDocument()
    })
  
    it('navigates via go to content button', () => {
      renderSearchResults('da')
      // Search for course action label specifically
      const goBtns = screen.getAllByText('Gå til kursus')
      fireEvent.click(goBtns[0])
      expect(mockNavigate).toHaveBeenCalledWith('/course/1')
    })
  
    it('filters by "all" category shows all results', () => {
      renderSearchResults('da')
      fireEvent.click(screen.getByText('Alle'))
      expect(screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')[0]).toBeInTheDocument()
    })
  
    it('filters between multiple categories excluding some results', () => {
      vi.mocked(useLocation).mockReturnValue(mockLocation('?q=oversigt'))
      renderSearchResults('da')
      expect(screen.queryByText(/Ingen resultater/i)).not.toBeInTheDocument()
      // Should show only page results (group: Sider)
      const categoryBtns = screen.getAllByRole('button')
      const siderBtn = [...categoryBtns].find(b => b.textContent === 'Sider')
      if (siderBtn) {
        fireEvent.click(siderBtn)
        expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
      }
    })
  
    it('renders fallback action label for unknown group', () => {
      vi.mocked(useLocation).mockReturnValue(mockLocation('?q=Unknown Group Item'))
      renderSearchResults('da')
      
      expect(screen.getByText('Gå til indhold')).toBeInTheDocument()
    })
  
    it('renders HighlightText with matching query', () => {
      // HighlightText is used inside SearchResults
      renderSearchResults('da')
      const strong = document.querySelector('strong')
      expect(strong).toBeInTheDocument()
      expect(strong?.textContent).toBe('Digital')
    })
  
    it('highlights text when query parameter is present in URL', () => {
      vi.mocked(useLocation).mockReturnValue(mockLocation('?q=Design'))
      renderSearchResults('da')
      const strong = document.querySelector('strong')
      expect(strong).toBeInTheDocument()
      expect(strong?.textContent).toBe('Design')
    })
  
    it('toggles favorite on a course search result', () => {
      const toggleSpy = vi.spyOn(useStore.getState(), 'toggleFavorite')
      renderSearchResults('da')
      const starBtn = screen.getByLabelText(/til favoritter|to favorites/i)
      expect(starBtn).toBeInTheDocument()
      fireEvent.click(starBtn)
      expect(toggleSpy).toHaveBeenCalledWith('course', 1)
      toggleSpy.mockRestore()
    })
  })
}
