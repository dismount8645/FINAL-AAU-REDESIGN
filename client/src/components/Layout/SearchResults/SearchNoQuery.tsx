import { Clock, X, GraduationCap, ClipboardList, MessageSquare, Calendar } from 'lucide-react';
import type { RecentSearch } from '../hooks/useTopbarSearch';

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

const DEST_ICONS: Record<string, React.ComponentType<any>> = {
  course: GraduationCap,
  assignment: ClipboardList,
  message: MessageSquare,
  calendar: Calendar,
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
            const Icon = DEST_ICONS[dest.type]
            return (
              <div
                key={dest.type}
                className="flex items-center gap-xs p-xs border border-border/40 hover:border-primary/40 rounded-[var(--radius-md)] bg-bg-highlight/10 hover:bg-bg-hover cursor-pointer transition-colors"
                onClick={() => onSuggestedClick(dest)}
              >
                {Icon && <Icon size={14} className="text-primary shrink-0" />}
                <span className="text-xs font-semibold text-main truncate">{dest.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SearchNoQuery
