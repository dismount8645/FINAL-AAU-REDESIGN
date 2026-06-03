import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import Grid from '@/components/Grid'
import Stack from '@/components/Stack'
import EmptyState from '@/components/EmptyState'
import useStore from '@/store/useStore'
import { useSearch } from '@/lib/useSearch'
import {
  SearchResultCard,
  SearchResultFilters,
} from '@/components'

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
