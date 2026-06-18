import { Search } from 'lucide-react';
import { Text, EmptyState } from '@/components/ui';
import SearchCategoryGroup from './SearchCategoryGroup';

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
  )
}

export default SearchResultsView
