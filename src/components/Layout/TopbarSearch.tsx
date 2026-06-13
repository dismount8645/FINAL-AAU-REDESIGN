import React, { useState, useRef, useEffect, useMemo, type KeyboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, GraduationCap, Calendar, MessageSquare, ClipboardList, Clock, X, ChevronRight } from 'lucide-react';
import { Text } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import useStore from '@/store';
import { SearchInput } from '@/components/ui';
import Button from '@/components/ui/Button';
import { PATHS } from '@/routes';
import { cn } from '@/lib/utils';
import { mockDashboardDeadlines, defaultEvents, messagesData, courseList } from '@/lib/data';

interface TopbarSearchProps {
  children: React.ReactNode;
}

interface RecentSearch {
  id: string;
  text: string;
  link: string;
  type: 'course' | 'assignment' | 'message' | 'calendar' | 'query';
}

export default function TopbarSearch({ children }: TopbarSearchProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useStore(state => state.t);
  const lang = useStore(state => state.lang);
  const courses = useStore(state => state.courses);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);

  const isCollapsedPage = useMemo(() => {
    return ['/courses', '/resources', '/messages', '/notifications'].some(path =>
      location.pathname.startsWith(path)
    );
  }, [location.pathname]);

  const shouldShowSearchInput = !isMobile || isMobileExpanded;

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileExpanded(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsDropdownVisible(false);
        if (isMobile) {
          setIsMobileExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  // Path change reset
  useEffect(() => {
    if (!location.pathname.startsWith('/search')) {
      setSearchQuery('');
      setDebouncedQuery('');
    }
    setIsDropdownVisible(false);
    setIsMobileExpanded(false);
  }, [location.pathname]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Loading state delay to prevent flicker
  useEffect(() => {
    if (searchQuery.trim().length >= 3 && searchQuery !== debouncedQuery) {
      const loadingHandler = setTimeout(() => {
        setIsLoading(true);
      }, 150);
      return () => clearTimeout(loadingHandler);
    } else {
      setIsLoading(false);
    }
  }, [searchQuery, debouncedQuery]);

  // Load recent searches from localStorage
  useEffect(() => {
    const loaded = localStorage.getItem('aau_recent_searches');
    if (loaded) {
      try {
        setRecentSearches(JSON.parse(loaded).slice(0, 5));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  const saveRecentSearches = (items: RecentSearch[]) => {
    setRecentSearches(items);
    localStorage.setItem('aau_recent_searches', JSON.stringify(items));
  };

  const addRecentSearch = (item: RecentSearch) => {
    const filtered = recentSearches.filter(x => x.link !== item.link && x.text !== item.text);
    const updated = [item, ...filtered].slice(0, 5);
    saveRecentSearches(updated);
  };

  const removeRecentSearch = (id: string) => {
    const updated = recentSearches.filter(x => x.id !== id);
    saveRecentSearches(updated);
  };

  const clearAllRecent = () => {
    saveRecentSearches([]);
    localStorage.removeItem('aau_recent_searches');
  };

  // Grouped search results
  const groupedResults = useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();
    if (query.length < 3) return { courses: [], assignments: [], messages: [], calendar: [] };

    // 1. Courses
    const filteredCourses = courses.filter(c => 
      c.title.toLowerCase().includes(query) ||
      (c.titleEn && c.titleEn.toLowerCase().includes(query)) ||
      (c.code && c.code.toLowerCase().includes(query))
    );

    // 2. Assignments
    const filteredAssignments = mockDashboardDeadlines.filter(d =>
      d.titleDa.toLowerCase().includes(query) ||
      d.titleEn.toLowerCase().includes(query)
    );

    // 3. Messages (filter thread sender names or subject snippets)
    const filteredMessages = messagesData.filter(m =>
      (m.name && m.name.toLowerCase().includes(query)) ||
      (m.nameDa && m.nameDa.toLowerCase().includes(query)) ||
      (m.nameEn && m.nameEn.toLowerCase().includes(query)) ||
      (m.msgDa && m.msgDa.toLowerCase().includes(query)) ||
      (m.msgEn && m.msgEn.toLowerCase().includes(query))
    );

    // 4. Calendar events
    const filteredCalendar = Object.values(defaultEvents).filter(e =>
      (e.title && e.title.toLowerCase().includes(query)) ||
      (e.titleDa && e.titleDa.toLowerCase().includes(query)) ||
      (e.titleEn && e.titleEn.toLowerCase().includes(query)) ||
      (e.location && e.location.toLowerCase().includes(query))
    );

    return {
      courses: filteredCourses,
      assignments: filteredAssignments,
      messages: filteredMessages,
      calendar: filteredCalendar
    };
  }, [courses, debouncedQuery]);

  const totalResultCount = useMemo(() => {
    return (
      groupedResults.courses.length +
      groupedResults.assignments.length +
      groupedResults.messages.length +
      groupedResults.calendar.length
    );
  }, [groupedResults]);

  // Flattened results for keyboard navigation
  const flattenedResults = useMemo(() => {
    const list: {
      type: 'course' | 'assignment' | 'message' | 'calendar';
      id: string | number;
      title: string;
      subtitle: string;
      link: string;
      raw: any;
    }[] = [];

    groupedResults.courses.forEach(c => {
      list.push({
        type: 'course',
        id: `course-${c.id}`,
        title: lang === 'da' ? c.title : c.titleEn,
        subtitle: c.code ?? '',
        link: PATHS.COURSE(c.id),
        raw: c
      });
    });

    groupedResults.assignments.forEach(a => {
      list.push({
        type: 'assignment',
        id: `assignment-${a.id}`,
        title: lang === 'da' ? a.titleDa : a.titleEn,
        subtitle: lang === 'da' ? 'Afleveringsopgave' : 'Assignment',
        link: PATHS.SUBMISSION(a.courseId, a.id),
        raw: a
      });
    });

    groupedResults.messages.forEach(m => {
      list.push({
        type: 'message',
        id: `message-${m.id}`,
        title: lang === 'da' ? (m.nameDa || m.name || '') : (m.nameEn || m.name || ''),
        subtitle: lang === 'da' ? m.msgDa : m.msgEn,
        link: PATHS.MESSAGES,
        raw: m
      });
    });

    groupedResults.calendar.forEach(e => {
      list.push({
        type: 'calendar',
        id: `calendar-${e.id}`,
        title: lang === 'da' ? (e.titleDa || e.title || '') : (e.titleEn || e.title || ''),
        subtitle: `${e.time} · ${e.location}`,
        link: PATHS.CALENDAR,
        raw: e
      });
    });

    return list;
  }, [groupedResults, lang]);

  const handleItemSelect = (item: typeof flattenedResults[0]) => {
    navigate(item.link);
    setSearchQuery('');
    setIsDropdownVisible(false);

    // Save to recent searches (excluding sensitive message text)
    const recentLabel = item.type === 'message'
      ? (lang === 'da' ? `Besked fra: ${item.title}` : `Message from: ${item.title}`)
      : item.title;

    addRecentSearch({
      id: `${item.type}-${item.raw.id}`,
      text: recentLabel,
      link: item.link,
      type: item.type
    });
  };

  const handleRecentClick = (recent: RecentSearch) => {
    navigate(recent.link);
    setIsDropdownVisible(false);
  };

  const suggestedDestinations = useMemo(() => [
    { label: lang === 'da' ? 'Kurser' : 'Courses', link: PATHS.COURSES, type: 'course' as const },
    { label: lang === 'da' ? 'Afleveringer' : 'Assignments', link: PATHS.CALENDAR, type: 'assignment' as const },
    { label: lang === 'da' ? 'Beskeder' : 'Messages', link: PATHS.MESSAGES, type: 'message' as const },
    { label: lang === 'da' ? 'Kalender' : 'Calendar', link: PATHS.CALENDAR, type: 'calendar' as const },
  ], [lang]);

  const handleSuggestedClick = (dest: typeof suggestedDestinations[0]) => {
    navigate(dest.link);
    setIsDropdownVisible(false);
  };

  const handleSearchEnter = (e: KeyboardEvent<HTMLInputElement> | { key: string }) => {
    if ('preventDefault' in e && e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSearchIndex(prev => (prev < flattenedResults.length - 1 ? prev + 1 : prev));
      return;
    }
    if ('preventDefault' in e && e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSearchIndex(prev => (prev > -1 ? prev - 1 : prev));
      return;
    }
    if ('preventDefault' in e && e.key === 'Escape') {
      if (isDropdownVisible) {
        setIsDropdownVisible(false);
        setActiveSearchIndex(-1);
      } else {
        setSearchQuery('');
      }
      return;
    }

    if (e.key === 'Enter') {
      if (activeSearchIndex >= 0 && activeSearchIndex < flattenedResults.length) {
        handleItemSelect(flattenedResults[activeSearchIndex]);
      } else if (searchQuery.trim()) {
        const query = searchQuery.trim();
        addRecentSearch({
          id: `query-${query}`,
          text: lang === 'da' ? `Søgning: "${query}"` : `Search: "${query}"`,
          link: `${PATHS.SEARCH}?q=` + encodeURIComponent(query),
          type: 'query'
        });
        navigate(`${PATHS.SEARCH}?q=` + encodeURIComponent(query));
        setIsDropdownVisible(false);
      }
    }
  };

  const handleContainerBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDropdownVisible(false);
    }
  };

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
              <div 
                id="search-results-listbox"
                role="listbox"
                aria-label={t('search_results_plural')}
                className="topbar__search-dropdown topbar-panel topbar-panel--search flex flex-col max-h-[480px] overflow-hidden"
              >
                {isLoading ? (
                  <div className="search-dropdown-loading p-md flex items-center justify-center gap-xs">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent shrink-0" />
                    <Text size="xs" muted>{lang === 'da' ? 'Søger...' : 'Searching...'}</Text>
                  </div>
                ) : searchQuery.trim().length < 3 ? (
                  <div className="flex flex-col overflow-y-auto">
                    {searchQuery.trim().length > 0 && (
                      <div className="p-xs px-md bg-warning/10 text-warning text-xs font-semibold">
                        {lang === 'da' ? 'Skriv mindst 3 tegn for en dybdegående søgning' : 'Type at least 3 characters for deep search'}
                      </div>
                    )}
                    
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="recent-searches-section border-b border-border/40 p-sm px-md flex flex-col gap-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                            {lang === 'da' ? 'Seneste søgninger' : 'Recent Searches'}
                          </span>
                          <button
                            type="button"
                            className="text-[10px] font-bold text-danger hover:underline border-none bg-transparent cursor-pointer"
                            onClick={clearAllRecent}
                          >
                            {lang === 'da' ? 'Ryd alle' : 'Clear all'}
                          </button>
                        </div>
                        <div className="flex flex-col gap-2xs mt-xs">
                          {recentSearches.map((recent) => (
                            <div
                              key={recent.id}
                              className="flex items-center justify-between p-xs hover:bg-bg-hover rounded cursor-pointer group/recent"
                              onClick={() => handleRecentClick(recent)}
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
                                  removeRecentSearch(recent.id);
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

                    {/* Suggested shortcuts */}
                    <div className="suggested-destinations p-sm px-md flex flex-col gap-2xs">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        {lang === 'da' ? 'Foreslåede genveje' : 'Suggested shortcuts'}
                      </span>
                      <div className="grid grid-cols-2 gap-xs mt-xs">
                        {suggestedDestinations.map((dest) => (
                          <div
                            key={dest.type}
                            className="flex items-center gap-xs p-xs border border-border/40 hover:border-primary/40 rounded-[var(--radius-md)] bg-bg-highlight/10 hover:bg-bg-hover cursor-pointer transition-colors"
                            onClick={() => handleSuggestedClick(dest)}
                          >
                            {dest.type === 'course' && <GraduationCap size={14} className="text-primary shrink-0" />}
                            {dest.type === 'assignment' && <ClipboardList size={14} className="text-success shrink-0" />}
                            {dest.type === 'message' && <MessageSquare size={14} className="text-info shrink-0" />}
                            {dest.type === 'calendar' && <Calendar size={14} className="text-warning shrink-0" />}
                            <span className="text-xs font-semibold text-main truncate">{dest.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
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
                        {/* Courses */}
                        {groupedResults.courses.length > 0 && (
                          <div className="category-group border-b border-border/30 pb-2xs">
                            <div className="category-header p-xs px-md bg-bg-highlight/40 text-xs font-bold text-text-muted uppercase tracking-wider">
                              {lang === 'da' ? 'Kurser' : 'Courses'}
                            </div>
                            {groupedResults.courses.map((course) => {
                              const index = flattenedResults.findIndex(x => x.type === 'course' && x.raw.id === course.id);
                              return (
                                <div
                                  key={course.id}
                                  id={`search-item-${course.id}`}
                                  className={cn(
                                    "search-dropdown-item flex items-center justify-between p-xs px-md cursor-pointer transition-colors group/row",
                                    index === activeSearchIndex ? "bg-bg-hover" : "hover:bg-bg-hover"
                                  )}
                                  onClick={() => handleItemSelect(flattenedResults[index])}
                                  onMouseEnter={() => setActiveSearchIndex(index)}
                                  role="option"
                                  aria-selected={index === activeSearchIndex}
                                >
                                  <div className="flex items-center gap-md min-w-0 flex-1">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                      <GraduationCap size={16} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-semibold text-main truncate">{lang === 'da' ? course.title : course.titleEn}</span>
                                      <span className="text-xs text-text-muted font-medium">{course.code}</span>
                                    </div>
                                  </div>
                                  <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 shrink-0 ml-xs" />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Assignments */}
                        {groupedResults.assignments.length > 0 && (
                          <div className="category-group border-b border-border/30 pb-2xs">
                            <div className="category-header p-xs px-md bg-bg-highlight/40 text-xs font-bold text-text-muted uppercase tracking-wider">
                              {lang === 'da' ? 'Afleveringer' : 'Assignments'}
                            </div>
                            {groupedResults.assignments.map((assignment) => {
                              const index = flattenedResults.findIndex(x => x.type === 'assignment' && x.raw.id === assignment.id);
                              return (
                                <div
                                  key={assignment.id}
                                  id={`search-item-${assignment.id}`}
                                  className={cn(
                                    "search-dropdown-item flex items-center justify-between p-xs px-md cursor-pointer transition-colors group/row",
                                    index === activeSearchIndex ? "bg-bg-hover" : "hover:bg-bg-hover"
                                  )}
                                  onClick={() => handleItemSelect(flattenedResults[index])}
                                  onMouseEnter={() => setActiveSearchIndex(index)}
                                  role="option"
                                  aria-selected={index === activeSearchIndex}
                                >
                                  <div className="flex items-center gap-md min-w-0 flex-1">
                                    <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
                                      <ClipboardList size={16} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-semibold text-main truncate">{lang === 'da' ? assignment.titleDa : assignment.titleEn}</span>
                                      <span className="text-xs text-text-muted font-medium">{lang === 'da' ? 'Afleveringsopgave' : 'Assignment'}</span>
                                    </div>
                                  </div>
                                  <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 shrink-0 ml-xs" />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Messages */}
                        {groupedResults.messages.length > 0 && (
                          <div className="category-group border-b border-border/30 pb-2xs">
                            <div className="category-header p-xs px-md bg-bg-highlight/40 text-xs font-bold text-text-muted uppercase tracking-wider">
                              {lang === 'da' ? 'Beskeder' : 'Messages'}
                            </div>
                            {groupedResults.messages.map((thread) => {
                              const index = flattenedResults.findIndex(x => x.type === 'message' && x.raw.id === thread.id);
                              return (
                                <div
                                  key={thread.id}
                                  id={`search-item-${thread.id}`}
                                  className={cn(
                                    "search-dropdown-item flex items-center justify-between p-xs px-md cursor-pointer transition-colors group/row",
                                    index === activeSearchIndex ? "bg-bg-hover" : "hover:bg-bg-hover"
                                  )}
                                  onClick={() => handleItemSelect(flattenedResults[index])}
                                  onMouseEnter={() => setActiveSearchIndex(index)}
                                  role="option"
                                  aria-selected={index === activeSearchIndex}
                                >
                                  <div className="flex items-center gap-md min-w-0 flex-1">
                                    <div className="w-8 h-8 rounded-lg bg-info/10 text-info flex items-center justify-center shrink-0">
                                      <MessageSquare size={16} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-semibold text-main truncate">{lang === 'da' ? (thread.nameDa || thread.name) : (thread.nameEn || thread.name)}</span>
                                      <span className="text-xs text-text-muted font-medium truncate">{lang === 'da' ? thread.msgDa : thread.msgEn}</span>
                                    </div>
                                  </div>
                                  <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 shrink-0 ml-xs" />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Calendar */}
                        {groupedResults.calendar.length > 0 && (
                          <div className="category-group border-b border-border/30 pb-2xs">
                            <div className="category-header p-xs px-md bg-bg-highlight/40 text-xs font-bold text-text-muted uppercase tracking-wider">
                              {lang === 'da' ? 'Kalender' : 'Calendar'}
                            </div>
                            {groupedResults.calendar.map((evt) => {
                              const index = flattenedResults.findIndex(x => x.type === 'calendar' && x.raw.id === evt.id);
                              return (
                                <div
                                  key={evt.id}
                                  id={`search-item-${evt.id}`}
                                  className={cn(
                                    "search-dropdown-item flex items-center justify-between p-xs px-md cursor-pointer transition-colors group/row",
                                    index === activeSearchIndex ? "bg-bg-hover" : "hover:bg-bg-hover"
                                  )}
                                  onClick={() => handleItemSelect(flattenedResults[index])}
                                  onMouseEnter={() => setActiveSearchIndex(index)}
                                  role="option"
                                  aria-selected={index === activeSearchIndex}
                                >
                                  <div className="flex items-center gap-md min-w-0 flex-1">
                                    <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
                                      <Calendar size={16} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-semibold text-main truncate">{lang === 'da' ? (evt.titleDa || evt.title) : (evt.titleEn || evt.title)}</span>
                                      <span className="text-xs text-text-muted font-medium truncate">{evt.time} · {evt.location}</span>
                                    </div>
                                  </div>
                                  <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 shrink-0 ml-xs" />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="search-dropdown-empty py-md">
                        <EmptyState icon={Search} title={t('no_search_results')} />
                      </div>
                    )}
                    
                    {searchQuery.trim() && (
                      <button
                        type="button"
                        className="w-full border-none cursor-pointer focus-visible:outline-none focus-visible:shadow-focus search-dropdown-footer p-sm px-md text-center border-t border-border bg-card hover:bg-bg-hover font-medium block relative before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"
                        onClick={() => {
                          const query = searchQuery.trim();
                          addRecentSearch({
                            id: `query-${query}`,
                            text: lang === 'da' ? `Søgning: "${query}"` : `Search: "${query}"`,
                            link: `${PATHS.SEARCH}?q=` + encodeURIComponent(query),
                            type: 'query'
                          });
                          navigate(`${PATHS.SEARCH}?q=` + encodeURIComponent(query));
                          setIsDropdownVisible(false);
                        }}
                      >
                        <span className="text-sm font-medium topbar__all-results">{t('all_results')} &ldquo;{searchQuery}&rdquo;</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          {(isMobile || isCollapsedPage) && (
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

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach, afterEach } = await import('vitest')
  const { renderWithProviders } = await import('@/test/test-utils')
  const { act } = await import('@testing-library/react')

  describe('TopbarSearch', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      // Reset store to defaults to prevent test pollution
      const coursesWithStatus = courseList.map((course: any) => ({
        ...course,
        status: course.tab === 'finished' ? 'inactive' : (course.tab === 'upcoming' ? 'upcoming' : 'active'),
      }))
      useStore.setState({
        courses: coursesWithStatus,
        lang: 'da',
        favorites: [],
      })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('renders desktop search input', () => {
      const { container } = renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const wrapper = container.querySelector('.topbar__search-wrapper')
      expect(wrapper).toBeInTheDocument()
    })

    it('renders children', () => {
      renderWithProviders(<TopbarSearch><span data-testid="child">Child</span></TopbarSearch>)
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('shows dropdown on input change', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Algoritmer' } })
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('shows results matching search query', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Digital' } })
      act(() => {
        vi.runAllTimers()
      })
      const items = screen.getAllByRole('option')
      expect(items.length).toBeGreaterThan(0)
    })

    it('shows empty state when no results match', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'zzzznotfoundxxxx' } })
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.getByText('Ingen resultater')).toBeInTheDocument()
    })

    it('shows result count in dropdown header', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Digital' } })
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.getByText(/1 resultat/i)).toBeInTheDocument()
    })

    it('closes dropdown on Escape', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Algoritmer' } })
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      await fireEvent.keyDown(input, { key: 'Escape' })
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('navigates with ArrowDown and ArrowUp', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'dig' } })
      act(() => {
        vi.runAllTimers()
      })
      const options = () => screen.getAllByRole('option')
      const count = options().length
      expect(count).toBeGreaterThan(0)

      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      expect(options()[0]).toHaveAttribute('aria-selected', 'true')

      await fireEvent.keyDown(input, { key: 'ArrowUp' })
      expect(options()[0]).toHaveAttribute('aria-selected', 'false')
    })

    it('closes dropdown on outside click', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Algoritmer' } })
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      await fireEvent.mouseDown(document.body)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('renders all results button in dropdown', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Digital' } })
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.getByText(/Alle resultater/i)).toBeInTheDocument()
    })

    it('navigates on Enter with active index', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Digital' } })
      act(() => {
        vi.runAllTimers()
      })
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('highlights result on hover', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Digital' } })
      act(() => {
        vi.runAllTimers()
      })
      const option = screen.getByRole('option', { name: /Digital Design og Kommunikation/i })
      fireEvent.mouseEnter(option)
      expect(option).toHaveAttribute('aria-selected', 'true')
    })

    it('does not move ArrowDown past last result', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'dig' } })
      act(() => {
        vi.runAllTimers()
      })
      const options = () => screen.getAllByRole('option')
      const count = options().length

      for (let i = 0; i < count + 5; i++) {
        await fireEvent.keyDown(input, { key: 'ArrowDown' })
      }
      expect(options()[count - 1]).toHaveAttribute('aria-selected', 'true')
    })

    it('does not move ArrowUp past -1', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'dig' } })
      act(() => {
        vi.runAllTimers()
      })
      await fireEvent.keyDown(input, { key: 'ArrowUp' })
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await fireEvent.keyDown(input, { key: 'ArrowUp' })
      const options = screen.getAllByRole('option')
      expect(options[0]).toHaveAttribute('aria-selected', 'false')
    })

    it('sets aria-activedescendant to undefined when no active index', () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      expect(input).not.toHaveAttribute('aria-activedescendant')
    })

    it('collapses search into trigger button on mobile', () => {
      const originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      window.dispatchEvent(new Event('resize'));

      renderWithProviders(<TopbarSearch>Child</TopbarSearch>);
      expect(screen.getByLabelText('search')).toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();

      fireEvent.click(screen.getByLabelText('search'));
      expect(screen.getByRole('combobox')).toBeInTheDocument();

      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalInnerWidth });
    })
  })
}
