import React from 'react';
import { Search } from 'lucide-react';
import { SearchInput } from '@/components/ui';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useTopbarSearch } from './hooks/useTopbarSearch';
import SearchResults from './SearchResults';

interface TopbarSearchProps {
  children: React.ReactNode;
}

export default function TopbarSearch({ children }: TopbarSearchProps) {
  const {
    searchQuery,
    setSearchQuery,
    isDropdownVisible,
    setIsDropdownVisible,
    activeSearchIndex,
    setActiveSearchIndex,
    isMobile,
    isMobileExpanded,
    setIsMobileExpanded,
    isLoading,
    searchRef,
    shouldShowSearchInput,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearAllRecent,
    suggestedDestinations,
    groupedResults,
    totalResultCount,
    flattenedResults,
    handleItemSelect,
    handleRecentClick,
    handleSuggestedClick,
    handleSearchEnter,
    handleContainerBlur,
    lang,
    t,
    navigate,
  } = useTopbarSearch();

  return (
    <>
      {shouldShowSearchInput && (
        <div 
          className={cn(
            "topbar__search-wrapper flex flex-1 justify-center px-xl z-[var(--z-topbar-search,1002)] min-w-0 transition-all duration-150",
            isMobile && "absolute left-0 right-0 top-0 bottom-0 bg-bg-topbar backdrop-blur-md px-md py-xs flex items-center justify-between z-[1003] border-b border-border"
          )}
          onBlur={handleContainerBlur}
        >
          <div className="search-container-relative relative w-full max-w-[clamp(300px,30vw,480px)]" ref={searchRef}>
            <SearchInput
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setIsDropdownVisible(true);
              }}
              onFocus={() => setIsDropdownVisible(true)}
              onKeyDown={handleSearchEnter}
              placeholder={isMobile ? (lang === 'da' ? 'Søg...' : 'Search...') : (lang === 'da' ? 'Søg i fag, afleveringer og beskeder...' : 'Search courses, assignments and messages...')}
              className="topbar__search-input-wrapper w-full"
              role="combobox"
              aria-expanded={isDropdownVisible}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-controls="search-results-listbox"
              aria-activedescendant={activeSearchIndex >= 0 && activeSearchIndex < flattenedResults.length ? `search-item-${flattenedResults[activeSearchIndex].id}` : undefined}
            />
            {isDropdownVisible && (
              <SearchResults
                searchQuery={searchQuery}
                isLoading={isLoading}
                activeSearchIndex={activeSearchIndex}
                recentSearches={recentSearches}
                suggestedDestinations={suggestedDestinations}
                groupedResults={groupedResults}
                totalResultCount={totalResultCount}
                flattenedResults={flattenedResults}
                handleItemSelect={handleItemSelect}
                handleRecentClick={handleRecentClick}
                handleSuggestedClick={handleSuggestedClick}
                removeRecentSearch={removeRecentSearch}
                clearAllRecent={clearAllRecent}
                addRecentSearch={addRecentSearch}
                setActiveSearchIndex={setActiveSearchIndex}
                navigate={navigate}
                lang={lang}
                t={t}
                setIsDropdownVisible={setIsDropdownVisible}
              />
            )}
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileExpanded(false)}
              className="ml-xs text-text-muted hover:text-main shrink-0"
            >
              {lang === 'da' ? 'Annuller' : 'Cancel'}
            </Button>
          )}
        </div>
      )}

      {(!isMobile || !isMobileExpanded) && (
        <div className="topbar__right-section flex items-center justify-end gap-sm sm:gap-md shrink-0 ml-auto">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileExpanded(true)}
              aria-label={t('search')}
              className="h-11 w-11 text-text-main hover:bg-bg-highlight rounded-lg flex items-center justify-center border-none"
            >
              <Search size={20} strokeWidth={2} />
            </Button>
          )}
          {children}
        </div>
      )}
    </>
  );
}
