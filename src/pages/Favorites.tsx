import { useState, useMemo } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Trash2, Wrench } from 'lucide-react';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import FavoritesFilter from '@/components/FavoritesFilter';
import FavoritesList from '@/components/FavoritesList';
import Button from '@/components/Button';
import PageHeader from '@/components/PageHeader';
import Stack from '@/components/Stack';
import { Text } from '@/components/Typography';
import { DASHBOARD_CONFIG } from '@/lib/dashboard';
import { env } from '@/lib/env';
import * as favUtils from '@/lib/favorites';
import { sortFavorites, resolveFavorite } from '@/lib/favorites';
import useStore from '@/lib/store';
import type { FavoriteType } from '@/lib/types';

function Favorites() {
  const navigate = useNavigate()
  const t = useStore((state) => state.t)
  const lang = useStore((state) => state.lang)
  const favorites = useStore((state) => state.favorites)
  const toggleFavorite = useStore((state) => state.toggleFavorite)
  const clearFavorites = useStore((state) => state.clearFavorites)
  const reorderFavorites = useStore((state) => state.reorderFavorites)
  const courses = useStore((state) => state.courses)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<FavoriteType | 'all'>('all')

  const sorted = useMemo(() => sortFavorites(favorites), [favorites])

  const resolved = useMemo(() => {
    return sorted
      .map(fav => resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as NonNullable<ReturnType<typeof resolveFavorite>>[]
  }, [sorted, lang, courses, t])

  const filtered = useMemo(() => {
    let items = resolved
    if (typeFilter !== 'all') {
      items = items.filter(item => item.type === typeFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(item => item.title.toLowerCase().includes(q))
    }
    return items
  }, [resolved, typeFilter, searchQuery])

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
      />

      <div className="container pb-[var(--space-2xl)]">
        <div className="flex flex-col gap-sm mb-[var(--space-xl)] bg-bg-highlight/30 dark:bg-white/5 p-md rounded-[var(--radius-lg)] border border-border/40">
          <div className="flex items-center justify-between pb-sm border-b border-border/40">
            <Text size="sm" muted className="font-semibold text-text-muted">
              {resolved.length}/{DASHBOARD_CONFIG.FAVORITES_LIMIT} {t('favorites_limit')}
            </Text>
            {resolved.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFavorites}
                className="text-xs font-semibold px-[var(--space-xs)] h-[2rem] rounded-[var(--radius-md)] flex items-center gap-[var(--space-xs)] hover:bg-bg-hover text-text-muted hover:text-text-main"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                {t('remove_all')}
              </Button>
            )}
          </div>

          <FavoritesFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            lang={lang}
            t={t}
          />
        </div>

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
          onGoToDashboard={() => navigate('/')}
        />
      </div>
    </Stack>
  )
}

export default Favorites

vi.mock('@/lib/store', () => {
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

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

if (import.meta.vitest) {
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
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
  
      expect(screen.getByText('English Course')).toBeInTheDocument()
      expect(screen.getByText(`1/${DASHBOARD_CONFIG.FAVORITES_LIMIT} favorites_limit`)).toBeInTheDocument()
    })
  
    it('filters favorites by search query', () => {
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
  
      const searchInput = screen.getByPlaceholderText('search_favorites_placeholder')
      fireEvent.change(searchInput, { target: { value: 'Non-existent' } })
  
      expect(screen.queryByText('English Course')).not.toBeInTheDocument()
      expect(screen.getByText('no_favorites_match')).toBeInTheDocument()
    })
  
    it('clears search via SearchInput X button', () => {
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
  
      const searchInput = screen.getByPlaceholderText('search_favorites_placeholder')
      fireEvent.change(searchInput, { target: { value: 'test' } })
      const clearBtn = screen.getByRole('button', { name: 'Clear search' })
      fireEvent.click(clearBtn)
      expect(searchInput).toHaveValue('')
    })
  
    it('filters favorites by type', () => {
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
  
      const toolsFilter = screen.getByText('Tools')
      fireEvent.click(toolsFilter)
  
      expect(screen.queryByText('English Course')).not.toBeInTheDocument()
    })
  
    it('removes a favorite when clicking remove button', () => {
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
  
      const removeButton = screen.getByLabelText('Remove from favorites')
      fireEvent.click(removeButton)
  
      expect(mockToggleFavorite).toHaveBeenCalledWith('course', 1)
    })
  
    it('removes all favorites when clicking remove all button', () => {
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
  
      const removeAllButton = screen.getByText('remove_all')
      fireEvent.click(removeAllButton)
  
      expect(mockClearFavorites).toHaveBeenCalled()
    })
  
    it('navigates to favorite link when clicked', () => {
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
  
      fireEvent.click(screen.getByText('English Course'))
      expect(mockNavigate).toHaveBeenCalledWith('/course/1')
    })
  
    it('renders empty state when no favorites', () => {
      (useStore as any).mockReturnValue({
        ...baseStoreMock,
        favorites: [],
      })
      ;(favUtils.resolveFavorite as any).mockReturnValue(null)
  
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
  
      expect(screen.getByText('favorites_empty')).toBeInTheDocument()
  
      fireEvent.click(screen.getByText('go_to_dashboard'))
      expect(mockNavigate).toHaveBeenCalledWith('/')
      })
  
      it('handles drag end', () => {
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
      const item = screen.getByText('English Course').closest('div[draggable="true"]')
      if (item && item.parentElement) {
        fireEvent.dragStart(item.parentElement)
        fireEvent.dragEnd(item.parentElement)
      }
    })
  
    it('handles drag and drop to reorder', () => {
      const favorites = [
        { id: 'fav1', type: 'course', entityId: 1, order: 0 },
        { id: 'fav2', type: 'course', entityId: 2, order: 1 },
      ]
      ;(useStore as any).mockReturnValue({
        ...baseStoreMock,
        favorites,
      })
      ;(favUtils.resolveFavorite as any)
        .mockReturnValueOnce({ ...mockResolvedCourse, id: 'fav1', title: 'Course 1' })
        .mockReturnValueOnce({ ...mockResolvedCourse, id: 'fav2', title: 'Course 2' })
  
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
  
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
  
      render(
        <MemoryRouter>
          <Favorites />
        </MemoryRouter>
      )
  
      fireEvent.click(screen.getByText('External Tool'))
      expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
    })
  })
}
