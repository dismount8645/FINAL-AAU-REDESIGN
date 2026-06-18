

import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchResultCard, SearchResultFilters } from '@/components/Search';
import { EmptyState, Button } from '@/components/ui';
import { Grid } from '@/components/Layout/LayoutPrimitives';
import PageHeader from '@/components/Layout/PageHeader';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store';
import { useSearch } from '@/hooks';

function SearchResults() {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
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
              className="flex justify-center"
            >
              <div className="w-full max-w-md">
                <EmptyState
                  icon={Search}
                  title={t('no_search_results')}
                  description={t('search_no_results_desc')}
                  className="w-full text-center border border-border shadow-md bg-bg-card p-xl rounded-2xl"
                  action={
                    <div className="flex flex-col gap-md text-left w-full mt-sm">
                      <div className="border-t border-border/60 pt-sm">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-xs">
                          {lang === 'da' ? 'Søgetip:' : 'Search Tips:'}
                        </span>
                        <ul className="list-disc pl-sm text-xs text-text-muted space-y-1">
                          <li>{lang === 'da' ? 'Tjek for stavefejl' : 'Check for spelling errors'}</li>
                          <li>{lang === 'da' ? 'Prøv mere generelle søgeord' : 'Try more general keywords'}</li>
                          <li>{lang === 'da' ? 'Prøv at bruge færre søgeord' : 'Try using fewer keywords'}</li>
                        </ul>
                      </div>

                      <div className="border-t border-border/60 pt-sm">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-xs">
                          {lang === 'da' ? 'Søgningen dækkede:' : 'Search Scope:'}
                        </span>
                        <div className="flex flex-wrap gap-2xs">
                          {categories.map((cat) => (
                            <span
                              key={cat}
                              className="px-2 py-0.5 rounded bg-bg-highlight/50 text-[10px] font-bold text-text-secondary border border-border/40"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-xs mt-sm w-full">
                        <Button
                          variant="outline"
                          full
                          onClick={() => {
                            navigate('/search?q=')
                          }}
                          className="font-bold border-border/80 hover:border-primary"
                        >
                          {lang === 'da' ? 'Ryd søgning' : 'Clear search'}
                        </Button>
                        <Button
                          variant="primary"
                          full
                          onClick={() => navigate('/')}
                          className="font-bold shadow-md hover:shadow-primary/20"
                        >
                          {lang === 'da' ? 'Gå til dashboard' : 'Go to dashboard'}
                        </Button>
                      </div>
                    </div>
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Stack>
  )
}

export default SearchResults



