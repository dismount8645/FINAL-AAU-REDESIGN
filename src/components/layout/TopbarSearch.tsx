import React, { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, GraduationCap, X } from 'lucide-react';
import { Text } from '@/components/ui/Typography';
import EmptyState from '@/components/ui/EmptyState';
import useStore from '@/store/useStore';
import SearchInput from '@/components/ui/SearchInput';

interface TopbarSearchProps {
  children: React.ReactNode;
}

export default function TopbarSearch({ children }: TopbarSearchProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, courses } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchExpanded) return;
    mobileInputRef.current?.focus();
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      /* istanbul ignore next */
      if (e.key === 'Escape') setIsSearchExpanded(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchExpanded]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) setIsDropdownVisible(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target) && isSearchExpanded) setIsSearchExpanded(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchExpanded]);

  useEffect(() => {
    if (!location.pathname.startsWith('/search')) {
      setSearchQuery('');
    }
    setIsDropdownVisible(false);
  }, [location.pathname]);

  const filteredResults = searchQuery.trim()
    ? courses.filter(c => {
      const q = searchQuery.toLowerCase();
      /* istanbul ignore next */
      return c.title.toLowerCase().includes(q) ||
        /* istanbul ignore next */
        (c.titleEn && c.titleEn.toLowerCase().includes(q)) ||
        /* istanbul ignore next */
        (c.code && c.code.toLowerCase().includes(q));
    })
    : [];

  const handleSearchEnter = (e: KeyboardEvent<HTMLInputElement> | { key: string }) => {
    if ('preventDefault' in e && e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSearchIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : prev));
      return;
    }
    if ('preventDefault' in e && e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSearchIndex(prev => (prev > -1 ? prev - 1 : prev));
      return;
    }
    if ('preventDefault' in e && e.key === 'Escape') {
      setIsDropdownVisible(false);
      setActiveSearchIndex(-1);
      return;
    }

    if (e.key === 'Enter') {
      if (activeSearchIndex >= 0 && activeSearchIndex < filteredResults.length) {
        handleResultClick(filteredResults[activeSearchIndex]);
      } else if (searchQuery.trim()) {
        navigate('/search?q=' + encodeURIComponent(searchQuery));
        setIsSearchExpanded(false);
        setIsDropdownVisible(false);
      }
    }
  };

  const handleResultClick = (result: (typeof filteredResults)[0]) => {
    navigate(`/course/${result.id}`);
    setSearchQuery('');
    setIsDropdownVisible(false);
    setIsSearchExpanded(false);
  };

  return (
    <>
      <div className="topbar__search-wrapper hidden lg:flex flex-1 justify-center px-xl z-[var(--z-topbar-search,1002)] min-w-0">
        <div className="search-container-relative relative w-full max-w-[400px]" ref={searchRef}>
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownVisible(true);
            }}
            onKeyDown={handleSearchEnter}
            placeholder={t('search_placeholder')}
            className="topbar__search-input-wrapper w-full max-w-[400px]"
          />
          {isDropdownVisible && (
            <div className="topbar__search-dropdown topbar-panel topbar-panel--search">
              <div className="search-dropdown-header p-sm px-md bg-[var(--bg-hover)] border-b border-border">
                <Text size="xs" weight="bold" muted>
                  {filteredResults.length === 1
                    ? `1 ${t('search_results_singular')}`
                    : `${filteredResults.length} ${t('search_results_plural')}`}
                </Text>
              </div>
              {filteredResults.length > 0 ? filteredResults.map((course, index) => (
                <div
                  key={course.id}
                  className={`search-dropdown-item flex items-center gap-md p-sm px-md cursor-pointer transition-colors duration-150 ${index === activeSearchIndex ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'}`}
                  onClick={() => handleResultClick(course)}
                  onMouseEnter={() => setActiveSearchIndex(index)}
                  role="option"
                  aria-selected={index === activeSearchIndex}
                >
                  <GraduationCap size={14} strokeWidth={2} className="search-item-icon w-8 h-8 flex items-center justify-center bg-[rgba(var(--aau-blue-rgb),0.1)] text-aau-blue rounded-[var(--radius-md)]" />
                  <div className="search-item-info flex flex-col">
                    <span className="search-item-title text-sm font-medium text-main">{course.title}</span>
                    <span className="search-item-meta text-xs text-slate-500 dark:text-slate-400 font-medium">{course.code}</span>
                  </div>
                </div>
              )) : (
                <div className="search-dropdown-empty py-sm">
                  <EmptyState icon={Search} title={t('no_search_results')} />
                </div>
              )}
              <div className="search-dropdown-footer p-sm px-md text-center border-t border-border cursor-pointer bg-card hover:bg-[var(--bg-hover)]" onClick={() => handleSearchEnter({ key: 'Enter' })}>
                <Text size="sm" className="topbar__all-results">{t('all_results')} &ldquo;{searchQuery}&rdquo;</Text>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="topbar__right-section flex items-center justify-end gap-sm sm:gap-md shrink-0 ml-auto">
        <button
          className="topbar__mobile-search-trigger lg:hidden w-11 h-11 flex items-center justify-center rounded-[var(--radius-lg)] text-slate-600 dark:text-slate-200 transition-all duration-150 hover:bg-bg-hover dark:hover:bg-white/10 hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:shadow-focus"
          onClick={() => setIsSearchExpanded(true)}
          aria-label={t('search_placeholder')}
          type="button"
        >
          <Search size={20} strokeWidth={2} />
        </button>

        {children}
      </div>

      {isSearchExpanded && (
        <div className="topbar__mobile-search-overlay fixed inset-0 bg-white/90 backdrop-blur-[20px] z-[var(--z-mobile-search,4001)] flex flex-col dark:bg-slate-900/90" ref={mobileSearchRef} role="dialog" aria-modal="true">
          <div className="search-overlay-content flex flex-col p-md gap-md bg-card w-full max-w-[calc(100dvw-2rem)] mx-auto box-border border border-border rounded-2xl shadow-[var(--shadow-xl)] mt-[var(--space-md)]">
            <div className="flex items-center p-sm gap-sm w-full">
              <div className="flex-1 w-full">
                <SearchInput
                  ref={mobileInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchEnter}
                  placeholder={t('search_placeholder')}
                  className="w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsSearchExpanded(false)}
                className="shrink-0 w-11 h-11 flex items-center justify-center text-muted hover:text-main bg-slate-100 dark:bg-white/10 rounded-[var(--radius-pill)] transition-colors"
                aria-label={t('close')}
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
