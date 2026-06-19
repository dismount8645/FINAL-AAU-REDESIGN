import React from 'react';
import { PATHS } from '@/routes';
import { Clock, X, GraduationCap, ClipboardList, MessageSquare, Calendar, ChevronRight, Search } from 'lucide-react';
import { Text, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { RecentSearch } from './useTopbarSearch';

// --- Shared Constants & Helpers ---
const DEST_ICONS: Record<string, React.ComponentType<any>> = {
  course: GraduationCap,
  assignment: ClipboardList,
  message: MessageSquare,
  calendar: Calendar,
};

const TYPE_ICONS: Record<string, { icon: React.ComponentType<any>; bg: string; color: string }> = {
  course: { icon: GraduationCap, bg: 'bg-primary/10', color: 'text-primary' },
  assignment: { icon: ClipboardList, bg: 'bg-success/10', color: 'text-success' },
  message: { icon: MessageSquare, bg: 'bg-info/10', color: 'text-info' },
  calendar: { icon: Calendar, bg: 'bg-warning/10', color: 'text-warning' },
};

// --- Subcomponents ---

interface SearchLoadingProps {
  lang: string;
}

function SearchLoading({ lang }: SearchLoadingProps) {
  return (
    <div className="search-dropdown-loading p-md flex items-center justify-center gap-xs">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent shrink-0" />
      <Text size="xs" muted>{lang === 'da' ? 'Søger...' : 'Searching...'}</Text>
    </div>
  );
}

interface SearchNoQueryProps {
  searchQuery: string;
  recentSearches: RecentSearch[];
  suggestedDestinations: Array<{ label: string; link: string; type: 'course' | 'assignment' | 'message' | 'calendar' }>;
  onRecentClick: (recent: RecentSearch) => void;
  onSuggestedClick: (dest: any) => void;
  onRemoveRecent: (id: string) => void;
  onClearAllRecent: () => void;
  lang: string;
}

function SearchNoQuery({ searchQuery, recentSearches, suggestedDestinations, onRecentClick, onSuggestedClick, onRemoveRecent, onClearAllRecent, lang }: SearchNoQueryProps) {
  return (
    <div className="flex flex-col overflow-y-auto">
      {searchQuery.trim().length > 0 && (
        <div className="p-xs px-md bg-warning/10 text-warning text-xs font-semibold">
          {lang === 'da' ? 'Skriv mindst 3 tegn for en dybdegående søgning' : 'Type at least 3 characters for deep search'}
        </div>
      )}

      {recentSearches.length > 0 && (
        <div className="recent-searches-section border-b border-border/40 p-sm px-md flex flex-col gap-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {lang === 'da' ? 'Seneste søgninger' : 'Recent Searches'}
            </span>
            <button
              type="button"
              className="text-[10px] font-bold text-danger hover:underline border-none bg-transparent cursor-pointer"
              onClick={onClearAllRecent}
            >
              {lang === 'da' ? 'Ryd alle' : 'Clear all'}
            </button>
          </div>
          <div className="flex flex-col gap-2xs mt-xs">
            {recentSearches.map((recent) => (
              <div
                key={recent.id}
                className="flex items-center justify-between p-xs hover:bg-bg-hover rounded cursor-pointer group/recent"
                onClick={() => onRecentClick(recent)}
              >
                <div className="flex items-center gap-xs text-xs text-main min-w-0 flex-1">
                  <Clock size={12} className="text-muted opacity-60 shrink-0" />
                  <span className="truncate">{recent.text}</span>
                </div>
                <button
                  type="button"
                  className="text-muted hover:text-danger p-[2px] rounded hover:bg-danger/10 opacity-0 group-hover/recent:opacity-100 transition-opacity shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecent(recent.id);
                  }}
                  aria-label={lang === 'da' ? 'Fjern søgning' : 'Remove search'}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="suggested-destinations p-sm px-md flex flex-col gap-2xs">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
          {lang === 'da' ? 'Foreslåede genveje' : 'Suggested shortcuts'}
        </span>
        <div className="grid grid-cols-2 gap-xs mt-xs">
          {suggestedDestinations.map((dest) => {
            const Icon = DEST_ICONS[dest.type];
            return (
              <div
                key={dest.type}
                className="flex items-center gap-xs p-xs border border-border/40 hover:border-primary/40 rounded-[var(--radius-md)] bg-bg-highlight/10 hover:bg-bg-hover cursor-pointer transition-colors"
                onClick={() => onSuggestedClick(dest)}
              >
                {Icon && <Icon size={14} className="text-primary shrink-0" />}
                <span className="text-xs font-semibold text-main truncate">{dest.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SearchResultItemProps {
  type: string;
  id: string | number;
  index: number;
  activeSearchIndex: number;
  title: string;
  subtitle?: string;
  onClick: () => void;
  onHover: () => void;
}

function SearchResultItem({ type, id, index, activeSearchIndex, title, subtitle, onClick, onHover }: SearchResultItemProps) {
  const config = TYPE_ICONS[type];
  const Icon = config?.icon || GraduationCap;
  const iconBg = config?.bg || 'bg-primary/10';
  const iconColor = config?.color || 'text-primary';

  return (
    <div
      id={`search-item-${id}`}
      className={cn(
        "search-dropdown-item flex items-center justify-between p-xs px-md cursor-pointer transition-colors group/row",
        index === activeSearchIndex ? "bg-bg-hover" : "hover:bg-bg-hover"
      )}
      onClick={onClick}
      onMouseEnter={onHover}
      role="option"
      aria-selected={index === activeSearchIndex}
    >
      <div className="flex items-center gap-md min-w-0 flex-1">
        <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-main truncate">{title}</span>
          {subtitle && <span className="text-xs text-text-muted font-medium truncate">{subtitle}</span>}
        </div>
      </div>
      <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 shrink-0 ml-xs" />
    </div>
  );
}

interface SearchCategoryGroupProps {
  label: string;
  items: any[];
  type: string;
  flattenedResults: any[];
  activeSearchIndex: number;
  onItemSelect: (item: any) => void;
  onHover: (index: number) => void;
}

function SearchCategoryGroup({ label, items, type, flattenedResults, activeSearchIndex, onItemSelect, onHover }: SearchCategoryGroupProps) {
  return (
    <div className="category-group border-b border-border/30 pb-2xs">
      <div className="category-header p-xs px-md bg-bg-highlight/40 text-xs font-bold text-text-muted uppercase tracking-wider">
        {label}
      </div>
      {items.map((item) => {
        const index = flattenedResults.findIndex((x: any) => x.type === type && x.raw.id === item.id);
        return (
          <SearchResultItem
            key={item.id}
            type={type}
            id={item.id}
            index={index}
            activeSearchIndex={activeSearchIndex}
            title={item.title || item.titleDa || item.titleEn || item.name}
            subtitle={item.code || item.time}
            onClick={() => onItemSelect(flattenedResults[index])}
            onHover={() => onHover(index)}
          />
        );
      })}
    </div>
  );
}

interface SearchResultsViewProps {
  groupedResults: {
    courses: any[];
    assignments: any[];
    messages: any[];
    calendar: any[];
  };
  totalResultCount: number;
  flattenedResults: any[];
  activeSearchIndex: number;
  onItemSelect: (item: any) => void;
  onHover: (index: number) => void;
  lang: string;
  t: (key: string) => string;
}

function SearchResultsView({ groupedResults, totalResultCount, flattenedResults, activeSearchIndex, onItemSelect, onHover, lang, t }: SearchResultsViewProps) {
  return (
    <>
      <div className="search-dropdown-header p-sm px-md bg-bg-hover border-b border-border/40">
        <Text size="xs" weight="bold" muted>
          {totalResultCount === 1
            ? `1 ${t('search_results_singular')}`
            : `${totalResultCount} ${t('search_results_plural')}`}
        </Text>
      </div>
      {totalResultCount > 0 ? (
        <div className="flex flex-col overflow-y-auto max-h-[360px]">
          {groupedResults.courses.length > 0 && (
            <SearchCategoryGroup
              label={lang === 'da' ? 'Kurser' : 'Courses'}
              items={groupedResults.courses}
              type="course"
              flattenedResults={flattenedResults}
              activeSearchIndex={activeSearchIndex}
              onItemSelect={onItemSelect}
              onHover={onHover}
            />
          )}
          {groupedResults.assignments.length > 0 && (
            <SearchCategoryGroup
              label={lang === 'da' ? 'Afleveringer' : 'Assignments'}
              items={groupedResults.assignments}
              type="assignment"
              flattenedResults={flattenedResults}
              activeSearchIndex={activeSearchIndex}
              onItemSelect={onItemSelect}
              onHover={onHover}
            />
          )}
          {groupedResults.messages.length > 0 && (
            <SearchCategoryGroup
              label={lang === 'da' ? 'Beskeder' : 'Messages'}
              items={groupedResults.messages}
              type="message"
              flattenedResults={flattenedResults}
              activeSearchIndex={activeSearchIndex}
              onItemSelect={onItemSelect}
              onHover={onHover}
            />
          )}
          {groupedResults.calendar.length > 0 && (
            <SearchCategoryGroup
              label={lang === 'da' ? 'Kalender' : 'Calendar'}
              items={groupedResults.calendar}
              type="calendar"
              flattenedResults={flattenedResults}
              activeSearchIndex={activeSearchIndex}
              onItemSelect={onItemSelect}
              onHover={onHover}
            />
          )}
        </div>
      ) : (
        <div className="search-dropdown-empty py-md">
          <EmptyState icon={Search} title={t('no_search_results')} />
        </div>
      )}
    </>
  );
}

interface SearchFooterProps {
  searchQuery: string;
  onAddRecentAndNavigate: (query: string) => void;
  t: (key: string) => string;
}

function SearchFooter({ searchQuery, onAddRecentAndNavigate, t }: SearchFooterProps) {
  if (!searchQuery.trim()) return null;

  return (
    <button
      type="button"
      className="w-full border-none cursor-pointer focus-visible:outline-none focus-visible:shadow-focus search-dropdown-footer p-sm px-md text-center border-t border-border bg-card hover:bg-bg-hover font-medium block relative before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"
      onClick={() => onAddRecentAndNavigate(searchQuery.trim())}
    >
      <span className="text-sm font-medium topbar__all-results">{t('all_results')} &ldquo;{searchQuery}&rdquo;</span>
    </button>
  );
}

// --- Main Component ---
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
      type: 'query',
    });
    navigate(`${PATHS.SEARCH}?q=` + encodeURIComponent(query));
    setIsDropdownVisible(false);
  };

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
