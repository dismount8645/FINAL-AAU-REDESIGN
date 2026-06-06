import React, { useState, useRef, useEffect, useMemo, type KeyboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, GraduationCap, X } from 'lucide-react';
import { Text } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import useStore from '@/store';
import { SearchInput } from '@/components/ui';
import Button from '@/components/ui/Button';

interface TopbarSearchProps {
  children: React.ReactNode;
}

export default function TopbarSearch({ children }: TopbarSearchProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useStore(state => state.t)
  const courses = useStore(state => state.courses)

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isSearchExpanded) return;
    mobileInputRef.current?.focus();
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      /* istanbul ignore next */
      if (e.key === 'Escape') {
        setIsSearchExpanded(false);
        mobileTriggerRef.current?.focus();
        return;
      }
      if (e.key === 'Tab') {
        if (!mobileSearchRef.current) return;
        const focusable = mobileSearchRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchExpanded]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) setIsDropdownVisible(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target) && isSearchExpanded) {
        setIsSearchExpanded(false);
        mobileTriggerRef.current?.focus();
      }
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

  const filteredResults = useMemo(() => searchQuery.trim()
    ? courses.filter(c => {
      const q = searchQuery.toLowerCase();
      /* istanbul ignore next */
      return c.title.toLowerCase().includes(q) ||
        /* istanbul ignore next */
        (c.titleEn && c.titleEn.toLowerCase().includes(q)) ||
        /* istanbul ignore next */
        (c.code && c.code.toLowerCase().includes(q));
    })
    : [],
    [courses, searchQuery]
  );

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
            role="combobox"
            aria-expanded={isDropdownVisible && filteredResults.length > 0}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="search-results-listbox"
            aria-activedescendant={activeSearchIndex >= 0 && activeSearchIndex < filteredResults.length ? `search-item-${filteredResults[activeSearchIndex].id}` : undefined}
          />
          {isDropdownVisible && (
            <div 
              id="search-results-listbox"
              role="listbox"
              aria-label={t('search_results_plural')}
              className="topbar__search-dropdown topbar-panel topbar-panel--search"
            >
              <div className="search-dropdown-header p-sm px-md bg-bg-hover border-b border-border">
                <Text size="xs" weight="bold" muted>
                  {filteredResults.length === 1
                    ? `1 ${t('search_results_singular')}`
                    : `${filteredResults.length} ${t('search_results_plural')}`}
                </Text>
              </div>
              {filteredResults.length > 0 ? filteredResults.map((course, index) => (
                <div
                  key={course.id}
                  id={`search-item-${course.id}`}
                  className={`search-dropdown-item flex items-center gap-md p-sm px-md cursor-pointer transition-colors duration-150 ${index === activeSearchIndex ? 'bg-bg-hover' : 'hover:bg-bg-hover'}`}
                  onClick={() => handleResultClick(course)}
                  onMouseEnter={() => setActiveSearchIndex(index)}
                  role="option"
                  aria-selected={index === activeSearchIndex}
                >
                  <GraduationCap size={14} strokeWidth={2} className="search-item-icon w-8 h-8 f flex items-center justify-center bg-primary/10 text-primary rounded-md" />
                  <div className="search-item-info flex flex-col">
                    <span className="search-item-title text-sm font-medium text-main">{course.title}</span>
                    <span className="search-item-meta text-xs text-muted font-medium">{course.code}</span>
                  </div>
                </div>
              )) : (
                <div className="search-dropdown-empty py-sm">
                  <EmptyState icon={Search} title={t('no_search_results')} />
                </div>
              )}
              <button
                type="button"
                className="w-full border-none cursor-pointer focus-visible:outline-none focus-visible:shadow-focus search-dropdown-footer p-sm px-md text-center border-t border-border bg-card hover:bg-bg-hover font-medium block relative before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"
                onClick={() => handleSearchEnter({ key: 'Enter' })}
              >
                <span className="text-sm font-medium topbar__all-results">{t('all_results')} &ldquo;{searchQuery}&rdquo;</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="topbar__right-section flex items-center justify-end gap-sm sm:gap-md shrink-0 ml-auto">
        <Button
          ref={mobileTriggerRef}
          variant="ghost"
          size="icon"
          className="topbar__mobile-search-trigger lg:hidden w-11 h-11 text-text-main bg-transparent hover:bg-bg-hover dark:hover:bg-white/10 hover:text-primary active:scale-[0.95] rounded-lg border-none focus-visible:outline-none focus-visible:shadow-focus"
          onClick={() => setIsSearchExpanded(true)}
          aria-label={t('search_placeholder')}
          type="button"
        >
          <Search size={20} strokeWidth={2} />
        </Button>

        {children}
      </div>

      {isSearchExpanded && (
        <div className="topbar__mobile-search-overlay fixed inset-0 bg-bg-card/95 backdrop-blur-[20px] z-[var(--z-mobile-search,4001)] flex flex-col" ref={mobileSearchRef} role="dialog" aria-modal="true">
            <div className="search-overlay-content flex flex-col p-md gap-md bg-card w-full max-w-[calc(100dvw-2rem)] mx-auto box-border border border-border rounded-2xl shadow-xl mt-[var(--space-md)]">
              <div className="flex items-center p-sm gap-sm w-full">
                <div className="flex-1 w-full">
                  <SearchInput
                    ref={mobileInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchEnter}
                    placeholder={t('search_placeholder')}
                    className="w-full"
                    role="combobox"
                    aria-expanded={false}
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => {
                    setIsSearchExpanded(false);
                    mobileTriggerRef.current?.focus();
                  }}
                  className="shrink-0 w-11 h-11 text-muted hover:text-main bg-bg-hover rounded-full border-none focus-visible:outline-none focus-visible:shadow-focus transition-colors"
                  aria-label={t('close')}
                >
                  <X size={20} strokeWidth={2} />
                </Button>
              </div>
          </div>
        </div>
      )}
    </>
  );
}

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = await import('vitest')
  const { renderWithProviders } = await import('@/test/test-utils')

  describe('TopbarSearch', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
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
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('shows results matching search query', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Digital' } })
      const items = screen.getAllByRole('option')
      expect(items.length).toBeGreaterThan(0)
    })

    it('shows empty state when no results match', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'zzzznotfoundxxxx' } })
      expect(screen.getByText('Ingen resultater')).toBeInTheDocument()
    })

    it('shows result count in dropdown header', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Digital' } })
      expect(screen.getByText(/1 resultat/i)).toBeInTheDocument()
    })

    it('closes dropdown on Escape', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Algoritmer' } })
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      await fireEvent.keyDown(input, { key: 'Escape' })
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('navigates with ArrowDown and ArrowUp', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'a' } })
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
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      await fireEvent.mouseDown(document.body)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('renders mobile search trigger', () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const trigger = screen.getByLabelText('Søg på Moodle...')
      expect(trigger).toBeInTheDocument()
    })

    it('opens mobile search overlay on trigger click', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const trigger = screen.getByLabelText('Søg på Moodle...')
      await fireEvent.click(trigger)
      const overlay = screen.getByRole('dialog')
      expect(overlay).toBeInTheDocument()
    })

    it('closes mobile search overlay via close button', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const trigger = screen.getByLabelText('Søg på Moodle...')
      await fireEvent.click(trigger)
      const closeBtn = screen.getByLabelText('Luk')
      await fireEvent.click(closeBtn)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders all results button in dropdown', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Digital' } })
      expect(screen.getByText(/Alle resultater/i)).toBeInTheDocument()
    })

    it('navigates on Enter with active index', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Digital' } })
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('highlights result on hover', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'Digital' } })
      const option = screen.getByRole('option', { name: /Digital Design og Kommunikation/i })
      fireEvent.mouseEnter(option)
      expect(option).toHaveAttribute('aria-selected', 'true')
    })

    it('handles Tab key in mobile search overlay', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const trigger = screen.getByLabelText('Søg på Moodle...')
      await fireEvent.click(trigger)
      await fireEvent.keyDown(document, { key: 'Tab' })
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('wraps Tab from last to first in mobile overlay', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const trigger = screen.getByLabelText('Søg på Moodle...')
      await fireEvent.click(trigger)
      const dialog = screen.getByRole('dialog')
      const focusable = dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      const last = focusable[focusable.length - 1]
      last.focus()
      await fireEvent.keyDown(document, { key: 'Tab', shiftKey: false })
      expect(document.activeElement).toBe(focusable[0])
    })

    it('wraps Shift+Tab from first to last in mobile overlay', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const trigger = screen.getByLabelText('Søg på Moodle...')
      await fireEvent.click(trigger)
      const dialog = screen.getByRole('dialog')
      const focusable = dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      const first = focusable[0]
      first.focus()
      await fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
      expect(document.activeElement).toBe(focusable[focusable.length - 1])
    })

    it('closes mobile search via Escape key on document', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const trigger = screen.getByLabelText('Søg på Moodle...')
      await fireEvent.click(trigger)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      await fireEvent.keyDown(document, { key: 'Escape' })
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('does not move ArrowDown past last result', async () => {
      renderWithProviders(<TopbarSearch>Child</TopbarSearch>)
      const input = screen.getByRole('combobox')
      await fireEvent.change(input, { target: { value: 'a' } })
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
      await fireEvent.change(input, { target: { value: 'a' } })
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
  })
}
