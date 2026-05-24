import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import Grid from '@/components/ui/Grid'
import Stack from '@/components/ui/Stack'
import EmptyState from '@/components/ui/EmptyState'
import useStore from '@/store/useStore'
import { useSearch } from '@/hooks/useSearch'
import {
  SearchResultCard,
  SearchResultFilters,
} from './searchResults/index'

function SearchResults() {
  const t = useStore(state => state.t)
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

      <div className="container pb-3xl">
        {results.length > 0 ? (
          <Stack gap="xl">
            <SearchResultFilters
              categories={categories}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <Grid columns={12} gap="lg">
              {filteredResults.map((res) => (
                <Grid.Item span={12} tabletSpan={6} mobileSpan={1} key={res.path}>
                  <SearchResultCard
                    item={res}
                    query={query}
                    actionLabel={getActionLabel(res)}
                    onClick={() => navigate(res.path)}
                  />
                </Grid.Item>
              ))}
            </Grid>
          </Stack>
        ) : (
          <EmptyState
            icon={Search}
            title={t('no_search_results')}
            description={t('search_no_results_desc')}
          />
        )}
      </div>
    </Stack>
  )
}

export default SearchResults
