import React, { useState, useRef, useEffect, useMemo, type KeyboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '@/store';
import { mockDashboardDeadlines, defaultEvents, messagesData } from '@/lib/data';
import { PATHS } from '@/routes';

export interface RecentSearch {
  id: string;
  text: string;
  link: string;
  type: 'course' | 'assignment' | 'message' | 'query';
}

export function useTopbarSearch() {
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

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
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
  };
}
