import { PATHS } from '@/routes';
import type { RecentSearch } from '../hooks/useTopbarSearch';
import SearchLoading from './SearchLoading';
import SearchNoQuery from './SearchNoQuery';
import SearchResultsView from './SearchResultsView';
import SearchFooter from './SearchFooter';

interface SearchResultsProps {
  searchQuery: string;
  isLoading: boolean;
  activeSearchIndex: number;
  recentSearches: RecentSearch[];
  suggestedDestinations: Array<{ label: string; link: string; type: 'course' | 'assignment' | 'message' | 'calendar' }>;
  groupedResults: {
    courses: any[];
    assignments: any[];
    messages: any[];
    calendar: any[];
  };
  totalResultCount: number;
  flattenedResults: Array<{
    type: string;
    id: string | number;
    title: string;
    subtitle: string;
    link: string;
    raw: any;
  }>;
  handleItemSelect: (item: any) => void;
  handleRecentClick: (recent: RecentSearch) => void;
  handleSuggestedClick: (dest: any) => void;
  removeRecentSearch: (id: string) => void;
  clearAllRecent: () => void;
  addRecentSearch: (item: RecentSearch) => void;
  setActiveSearchIndex: (index: number) => void;
  navigate: (path: string) => void;
  lang: string;
  t: (key: string) => string;
  setIsDropdownVisible: (visible: boolean) => void;
}

export default function SearchResults({
  searchQuery,
  isLoading,
  activeSearchIndex,
  recentSearches,
  suggestedDestinations,
  groupedResults,
  totalResultCount,
  flattenedResults,
  handleItemSelect,
  handleRecentClick,
  handleSuggestedClick,
  removeRecentSearch,
  clearAllRecent,
  addRecentSearch,
  setActiveSearchIndex,
  navigate,
  lang,
  t,
  setIsDropdownVisible,
}: SearchResultsProps) {
  const handleFooterClick = (query: string) => {
    addRecentSearch({
      id: `query-${query}`,
      text: lang === 'da' ? `Søgning: "${query}"` : `Search: "${query}"`,
      link: `${PATHS.SEARCH}?q=` + encodeURIComponent(query),
      type: 'query'
    });
    navigate(`${PATHS.SEARCH}?q=` + encodeURIComponent(query));
    setIsDropdownVisible(false);
  }

  return (
    <div 
      id="search-results-listbox"
      role="listbox"
      aria-label={t('search_results_plural')}
      className="topbar__search-dropdown topbar-panel topbar-panel--search flex flex-col max-h-[480px] overflow-hidden"
    >
      {isLoading ? (
        <SearchLoading lang={lang} />
      ) : searchQuery.trim().length < 3 ? (
        <SearchNoQuery
          searchQuery={searchQuery}
          recentSearches={recentSearches}
          suggestedDestinations={suggestedDestinations}
          onRecentClick={handleRecentClick}
          onSuggestedClick={handleSuggestedClick}
          onRemoveRecent={removeRecentSearch}
          onClearAllRecent={clearAllRecent}
          lang={lang}
        />
      ) : (
        <>
          <SearchResultsView
            groupedResults={groupedResults}
            totalResultCount={totalResultCount}
            flattenedResults={flattenedResults}
            activeSearchIndex={activeSearchIndex}
            onItemSelect={handleItemSelect}
            onHover={setActiveSearchIndex}
            lang={lang}
            t={t}
          />
          <SearchFooter
            searchQuery={searchQuery}
            onAddRecentAndNavigate={handleFooterClick}
            t={t}
          />
        </>
      )}
    </div>
  );
}
