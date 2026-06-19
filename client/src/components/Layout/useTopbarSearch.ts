import React, { useState, useRef, useEffect, useMemo, type KeyboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '@/store';
import { PATHS } from '@/routes';
import { useRecentSearches } from './useRecentSearches';
import { useSearchFiltering } from './useSearchFiltering';

export type { RecentSearch } from './useRecentSearches';

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

  const searchRef = useRef<HTMLDivElement>(null);

  const shouldShowSearchInput = !isMobile || isMobileExpanded;

  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearAllRecent
  } = useRecentSearches();

  const {
    groupedResults,
    totalResultCount,
    flattenedResults
  } = useSearchFiltering(debouncedQuery, courses, lang);

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

  const handleItemSelect = (item: any) => {
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

  const handleRecentClick = (recent: any) => {
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
