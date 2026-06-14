



import { useMemo, useState } from 'react';
import { Trash2, Wrench, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FavoritesFilter, FavoritesList } from '@/components/Favorites';

import Button from '@/components/ui/Button';
import { PATHS } from '@/routes';
import PageHeader from '@/components/Layout/PageHeader';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import {
  Text,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui';
import { DASHBOARD_CONFIG } from '@/lib/dashboard';
import { env } from '@/lib/env';
import * as favUtils from '@/lib/favorites';
import type { ResolvedFavorite } from '@/lib/favorites';
import useStore from '@/store';
import { useFilteredCollection } from '@/hooks';
import type { FavoriteType } from '@/lib/types';
import { allToolsList } from '@/lib/utils';

function Favorites() {
  const navigate = useNavigate()
  const t = useStore((state) => state.t)
  const lang = useStore((state) => state.lang)
  const toggleFavorite = useStore((state) => state.toggleFavorite)
  const clearFavorites = useStore((state) => state.clearFavorites)
  const reorderFavorites = useStore((state) => state.reorderFavorites)
  const favorites = useStore(state => state.favorites)
  const courses = useStore(state => state.courses)
  const [confirmingRemoveAll, setConfirmingRemoveAll] = useState(false)

  const recommendedTools = useMemo(() => {
    const favToolIds = new Set(
      favorites.filter((fav) => fav.type === 'tool').map((fav) => fav.entityId)
    );
    return allToolsList
      .filter((tool) => !favToolIds.has(tool.id))
      .slice(0, 4);
  }, [favorites]);

  const resolved = useMemo(() => {
    const sorted = favUtils.sortFavorites(favorites)
    return sorted
      .map(fav => favUtils.resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as ResolvedFavorite[]
  }, [favorites, lang, courses, t])

  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    items: filtered,
  } = useFilteredCollection(resolved, {
    searchKeys: (item) => [item.title],
    filterKey: (item) => item.type,
    filterDefault: 'all',
  })

  const typeFilter = activeFilter as FavoriteType | 'all'
  const setTypeFilter = (val: FavoriteType | 'all') => setActiveFilter(val)

  return (
    <Stack className="favorites-page">
      <PageHeader
        pageKey="favorites"
        title={t('favorites_page_title')}
        subtitle={t('favorites_page_subtitle')}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('favorites') },
        ]}
        flat
      />

      <div className="container pb-[var(--space-lg)]">
        <div className="flex flex-col gap-sm mb-[var(--space-md)] bg-bg-highlight/30 dark:bg-white/5 p-sm rounded-[var(--radius-lg)] border border-border/40">
          <div className="flex items-center justify-between pb-sm border-b border-border/40">
            <Text size="sm" muted className="font-semibold text-text-muted">
              {resolved.length}/{DASHBOARD_CONFIG.FAVORITES_LIMIT} {t('favorites_limit')} ({filtered.length} {lang === 'da' ? 'fundet' : 'found'})
            </Text>
            {resolved.length > 0 && (
              <Dialog open={confirmingRemoveAll} onOpenChange={setConfirmingRemoveAll}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmingRemoveAll(true)}
                  className="text-xs font-semibold px-[var(--space-xs)] h-[2rem] rounded-[var(--radius-md)] flex items-center gap-[var(--space-xs)] text-danger hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                  {t('remove_all')}
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {lang === 'da' ? 'Fjern alle favoritter?' : 'Remove all favorites?'}
                    </DialogTitle>
                    <DialogDescription>
                      {lang === 'da'
                        ? 'Er du sikker på, at du vil fjerne alle favoritter? Denne handling kan ikke fortrydes.'
                        : 'Are you sure you want to remove all favorites? This action cannot be undone.'}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose nativeButton={false} render={<Button variant="ghost" render={<span />} />}>
                      {t('common.cancel')}
                    </DialogClose>
                    <Button
                      variant="danger"
                      onClick={() => {
                        clearFavorites()
                        setConfirmingRemoveAll(false)
                      }}
                    >
                      {t('confirm_remove_all')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <FavoritesFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            lang={lang}
            t={t}
            totalCount={filtered.length}
            compact={resolved.length <= 3}
          />
        </div>

        {resolved.length > 0 && resolved.length <= 3 && filtered.length > 0 && (
          <Text size="xs" muted className="text-center mb-[var(--space-md)]">
            {t('favorites_empty_hint')}
          </Text>
        )}

        <FavoritesList
          filtered={filtered}
          lang={lang}
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          t={t}
          onRemove={(type, entityId) => toggleFavorite(type, entityId)}
          onReorder={reorderFavorites}
          onNavigate={(link, external) => {
            if (external) {
              env.open(link)
            } else {
              navigate(link)
            }
          }}
          onGoToDashboard={() => navigate(PATHS.DASHBOARD)}
        />

        {favorites.length <= 3 && recommendedTools.length > 0 && (
          <div className="mt-xl border-t border-border/40 pt-lg animate-fade-in w-full">
            <h3 className="text-sm font-bold text-main mb-sm uppercase tracking-wider">
              {lang === 'da' ? 'Anbefalede genveje' : 'Recommended Shortcuts'}
            </h3>
            <div className="grid gap-[var(--space-xs)] grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full">
              {recommendedTools.map((tool) => {
                const Icon = tool.icon || Wrench;
                const description = lang === 'da' ? (tool as any).descDa : (tool as any).descEn;
                return (
                  <div
                    key={tool.id}
                    onClick={() => toggleFavorite('tool', tool.id)}
                    className="group flex items-center justify-between p-xs rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-bg-card hover:border-primary/30 hover:shadow-md transition-all cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-xs min-w-0 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] bg-primary/10 text-primary shrink-0">
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0 pr-2xs">
                        <div className="text-sm font-semibold truncate text-main">
                          {tool.titleKey
                            ? t(tool.titleKey)
                            : (lang === 'da'
                                ? ((tool as any).nameDa || (tool as any).nameEn)
                                : ((tool as any).nameEn || (tool as any).nameDa))}
                        </div>
                        {description && (
                          <div className="text-xs text-muted line-clamp-1 mt-2xs">
                            {description}
                          </div>
                        )}
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-3xs block">
                          {lang === 'da' ? 'Anbefalet genvej' : 'Recommended'}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-muted group-hover:text-primary transition-all shrink-0 h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center p-0 rounded-full"
                      aria-label={lang === 'da' ? 'Føj til favoritter' : 'Add to favorites'}
                    >
                      <Star size={18} strokeWidth={2.5} />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Stack>
  )
}

export default Favorites

/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  const FavoritesPage = Favorites
  vi.mock('@/store', () => {
    let currentState: any = {}
    const mockFn = vi.fn((selector) => {
      return selector ? selector(currentState) : currentState
    })
    ;(mockFn as any).mockReturnValue = (val: any) => {
      currentState = val
      return mockFn
    }
    return {
      default: mockFn,
    }
  })
  vi.mock('@/lib/favorites', async () => {
    const actual = await vi.importActual('@/lib/favorites')
    return {
      ...actual,
      resolveFavorite: vi.fn(),
      sortFavorites: vi.fn((f) => f),
    }
  })
  
  const mockNavigate = vi.hoisted(() => vi.fn())
  vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>()
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    }
  })
  describe('Favorites Page', () => {
    const mockT = vi.fn((key) => key)
    const mockToggleFavorite = vi.fn()
    const mockClearFavorites = vi.fn()
    const mockReorderFavorites = vi.fn()
    const mockSetBreadcrumbs = vi.fn()
  
    const mockCourses = [
      { id: 1, title: 'Danish Course', titleEn: 'English Course', sections: [] },
    ]
  
    const mockFavorites = [
      { id: 'fav1', type: 'course', entityId: 1, order: 0 },
    ]
  
    const mockResolvedCourse = {
      id: 'fav1',
      type: 'course' as const,
      entityId: 1,
      title: 'English Course',
      icon: Wrench,
      iconBg: 'blue',
      iconColor: 'white',
      link: '/course/1',
    }
  
    const baseStoreMock = {
      t: mockT,
      lang: 'en',
      favorites: mockFavorites,
      toggleFavorite: mockToggleFavorite,
      clearFavorites: mockClearFavorites,
      reorderFavorites: mockReorderFavorites,
      courses: mockCourses,
      setBreadcrumbs: mockSetBreadcrumbs,
    }
  
    beforeEach(() => {
      vi.clearAllMocks()
      const mockStore = useStore as any
      mockStore.mockReturnValue(baseStoreMock)
      const mockResolve = favUtils.resolveFavorite as any
      mockResolve.mockImplementation((fav: any) => ({
        ...mockResolvedCourse,
        id: fav?.id || 'fav1',
      }))
    })
  
    it('renders favorites correctly', () => {
      renderWithProviders(<FavoritesPage />)
  
      expect(screen.getByText('English Course')).toBeInTheDocument()
      expect(screen.getByText(new RegExp(`1/${DASHBOARD_CONFIG.FAVORITES_LIMIT} favorites_limit`))).toBeInTheDocument()
    })
  
    it('filters favorites by search query', () => {
      renderWithProviders(<FavoritesPage />)
  
      const searchInput = screen.getByPlaceholderText('search_favorites_placeholder')
      fireEvent.change(searchInput, { target: { value: 'Non-existent' } })
  
      expect(screen.queryByText('English Course')).not.toBeInTheDocument()
      expect(screen.getByText('no_favorites_match')).toBeInTheDocument()
    })
  
    it('clears search via SearchInput X button', () => {
      renderWithProviders(<FavoritesPage />)
  
      const searchInput = screen.getByPlaceholderText('search_favorites_placeholder')
      fireEvent.change(searchInput, { target: { value: 'test' } })
      const clearBtn = screen.getByRole('button', { name: 'Clear search' })
      fireEvent.click(clearBtn)
      expect(searchInput).toHaveValue('')
    })
  
    it('filters favorites by type', () => {
      renderWithProviders(<FavoritesPage />)
  
      const toolsFilter = screen.getByText('Tools')
      fireEvent.click(toolsFilter)
  
      expect(screen.queryByText('English Course')).not.toBeInTheDocument()
    })
  
    it('removes a favorite when clicking remove button', () => {
      renderWithProviders(<FavoritesPage />)
  
      const removeButton = screen.getByLabelText('Remove from favorites')
      fireEvent.click(removeButton)
  
      expect(mockToggleFavorite).toHaveBeenCalledWith('course', 1)
    })
  
    it('removes all favorites when clicking remove all button twice', () => {
      renderWithProviders(<FavoritesPage />)

      const removeAllButton = screen.getByText('remove_all')
      fireEvent.click(removeAllButton)

      expect(mockClearFavorites).not.toHaveBeenCalled()
      expect(screen.getByText('confirm_remove_all')).toBeInTheDocument()

      fireEvent.click(screen.getByText('confirm_remove_all'))
      expect(mockClearFavorites).toHaveBeenCalled()
    })
  
    it('navigates to favorite link when clicked', () => {
      renderWithProviders(<FavoritesPage />)
  
      fireEvent.click(screen.getByText('English Course'))
      expect(mockNavigate).toHaveBeenCalledWith('/course/1')
    })
  
    it('renders empty state when no favorites', () => {
      const mockStore = useStore as any
      mockStore.mockReturnValue({ ...baseStoreMock, favorites: [] })
      renderWithProviders(<FavoritesPage />)
  
      expect(screen.getByText('favorites_empty')).toBeInTheDocument()
  
      fireEvent.click(screen.getByText('go_to_dashboard'))
      expect(mockNavigate).toHaveBeenCalledWith('/')
      })
  
    it('handles drag end', () => {
      renderWithProviders(<FavoritesPage />)
      const item = screen.getByText('English Course').closest('div[draggable="true"]')
      if (item && item.parentElement) {
        fireEvent.dragStart(item.parentElement)
        fireEvent.dragEnd(item.parentElement)
      }
    })
  
    it('handles dragLeave on favorite item', () => {
      const multiFavorites = [
        { id: 'fav1', type: 'course', entityId: 1, order: 0 },
        { id: 'fav2', type: 'course', entityId: 2, order: 1 },
      ]
      const mockStore = useStore as any
      mockStore.mockReturnValue({ ...baseStoreMock, favorites: multiFavorites })
      const mockResolve = favUtils.resolveFavorite as any
      mockResolve.mockImplementation((fav: any) => ({
        ...mockResolvedCourse,
        id: fav?.id || 'fav1',
        title: fav?.id === 'fav1' ? 'Course 1' : 'Course 2',
      }))
      renderWithProviders(<FavoritesPage />)

      const item1 = screen.getByText('Course 1').closest('div[draggable="true"]')
      const item2 = screen.getByText('Course 2').closest('div[draggable="true"]')

      if (!item1 || !item2) throw new Error('Items not found')

      const outer1 = item1.parentElement
      const outer2 = item2.parentElement

      if (!outer1 || !outer2) throw new Error('Outer items not found')

      fireEvent.dragStart(outer1)
      fireEvent.dragOver(outer2)
      fireEvent.dragLeave(outer2)
      // No crash confirms onDragLeave handler executes
    })

    it('handles drag and drop to reorder', () => {
      const multiFavorites = [
        { id: 'fav1', type: 'course', entityId: 1, order: 0 },
        { id: 'fav2', type: 'course', entityId: 2, order: 1 },
      ]
      const mockStore = useStore as any
      mockStore.mockReturnValue({ ...baseStoreMock, favorites: multiFavorites })
      const mockResolve = favUtils.resolveFavorite as any
      mockResolve.mockImplementation((fav: any) => ({
        ...mockResolvedCourse,
        id: fav?.id || 'fav1',
        title: fav?.id === 'fav1' ? 'Course 1' : 'Course 2',
      }))
      renderWithProviders(<FavoritesPage />)

      const item1 = screen.getByText('Course 1').closest('div[draggable="true"]')
      const item2 = screen.getByText('Course 2').closest('div[draggable="true"]')
  
      if (!item1 || !item2) throw new Error('Items not found')
  
      // The outer div has the onDragStart/onDragOver
      // FavoriteItem also has a draggable div. We want the outer one.
      const outer1 = item1.parentElement
      const outer2 = item2.parentElement
  
      if (!outer1 || !outer2) throw new Error('Outer items not found')
  
      fireEvent.dragStart(outer1)
      fireEvent.dragOver(outer2)
  
      expect(mockReorderFavorites).toHaveBeenCalledWith(0, 1)
    })
  
    it('opens external link in new tab', () => {
      const windowSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

      const mockExternalFav = {
        id: 'fav-tool',
        type: 'tool' as const,
        entityId: 1,
        title: 'External Tool',
        icon: Wrench,
        iconBg: 'green',
        iconColor: 'white',
        link: 'https://example.com',
        external: true,
      }

      ;(favUtils.resolveFavorite as any).mockReturnValue(mockExternalFav)

      renderWithProviders(<FavoritesPage />)

      fireEvent.click(screen.getByText('External Tool'))
      expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
    })
  })
}
