import { useMemo, useCallback } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Star, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import FavoriteItem from '@/components/FavoriteItem';
import Stack from '@/components/Stack';
import { Text, Heading } from '@/components/Typography';
import { DASHBOARD_CONFIG } from '@/lib/dashboard';
import { env } from '@/lib/env';
import * as favUtils from '@/lib/favorites';
import { sortFavorites, resolveFavorite } from '@/lib/favorites';
import useStore from '@/lib/store';
import type { WidgetProps } from '@/lib/types';

export default function FavoritesWidget({ span, isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const favorites = useStore(state => state.favorites)
  const toggleFavorite = useStore(state => state.toggleFavorite)
  const courses = useStore(state => state.courses)

  const limit = DASHBOARD_CONFIG.FAVORITES_LIMIT

  const { overflow, resolved } = useMemo(() => {
    const sorted = sortFavorites(favorites)
    const display = sorted.slice(0, limit)
    const overflow = sorted.length - limit
    const resolved = display
      .map(fav => resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as NonNullable<ReturnType<typeof resolveFavorite>>[]
    return { overflow, resolved }
  }, [favorites, limit, lang, courses, t])

  const handleSeeAll = useCallback(() => {
    if (!isEditing) navigate('/favorites')
  }, [isEditing, navigate])

  return (
    <Card className="widget-card h-full w-full favorites-widget @container/widget shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
      <Card.Header padding="compact" className="bg-bg-highlight/50 border-b border-[var(--border-color)]">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Star size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('favorites')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size={span && span > 4 ? "xs" : "icon-xs"}
          className="text-[0.65rem] font-black uppercase tracking-widest text-primary"
          onClick={handleSeeAll}
          iconRight={ChevronRight}
          aria-label={t('see_all')}
        >
          {span && span > 4 ? t('see_all') : ''}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="overflow-visible">
        {resolved.length > 0 ? (
          <div className="grid gap-[var(--space-sm)] p-[var(--space-xs)]"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            }}
          >
            {resolved.map((item) => (
              <FavoriteItem
                key={item.id}
                item={item}
                lang={lang}
                onRemove={(type, entityId) => toggleFavorite(type, entityId)}
                onClick={() => {
                  if (!isEditing) {
                    if (item.external) {
                      env.open(item.link)
                    } else {
                      navigate(item.link)
                    }
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center py-lg gap-[var(--space-md)]">
            <div className="p-[var(--space-md)] bg-bg-highlight rounded-[var(--radius-pill)]">
              <Star size={32} strokeWidth={2} className="text-[var(--aau-light-orange)]" fill="currentColor" />
            </div>
            <Text muted size="sm" className="text-center max-w-[240px] italic">
              {t('no_favorites_hint')}
            </Text>
          </div>
        )}

        {overflow > 0 && (
          <div className="mt-[var(--space-sm)] text-center pb-[var(--space-sm)]">
            <Text size="xs" weight="bold" className="text-primary uppercase tracking-widest opacity-60">
              {`+${overflow} ${t('more_favorites')}`}
            </Text>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

vi.mock('@/lib/favorites', async () => {
  const actual = await vi.importActual('@/lib/favorites')
  return {
    ...actual,
    resolveFavorite: vi.fn(),
    sortFavorites: vi.fn((f) => f),
  }
})

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

if (import.meta.vitest) {
  describe('FavoritesWidget', () => {
    const mockCourses = [
      { id: 1, title: 'Course 1', titleEn: 'Course 1', sections: [] },
    ]
  
    const mockFavorites = [
      { id: 'fav1', type: 'course', entityId: 1, order: 0 },
    ]
  
    const mockResolvedCourse = {
      id: 'fav1',
      type: 'course' as const,
      entityId: 1,
      title: 'Course 1',
      icon: BookOpen,
      iconBg: 'blue',
      iconColor: 'white',
      link: '/course/1',
    }
  
    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({
        lang: 'da',
        favorites: mockFavorites,
        courses: mockCourses,
      })
      const mockResolve = favUtils.resolveFavorite as any
      mockResolve.mockImplementation((fav: any) => ({
        ...mockResolvedCourse,
        id: fav?.id || 'fav1',
      }))
    })
  
    it('renders favorites correctly', () => {
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={false} />
        </MemoryRouter>
      )
  
      expect(screen.getByText('Course 1')).toBeInTheDocument()
    })
  
    it('navigates to favorites page when "see_all" is clicked', () => {
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={false} />
        </MemoryRouter>
      )
  
      fireEvent.click(screen.getByText('Se alle'))
      expect(mockNavigate).toHaveBeenCalledWith('/favorites')
    })
  
    it('does not navigate when "see_all" is clicked and isEditing is true', () => {
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={true} />
        </MemoryRouter>
      )
  
      fireEvent.click(screen.getByText('Se alle'))
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  
    it('renders empty state when no favorites', () => {
      useStore.setState({ favorites: [] })
      const mockResolve = favUtils.resolveFavorite as any
      mockResolve.mockReturnValue(null)
  
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={false} />
        </MemoryRouter>
      )
  
      expect(screen.getByText(/Klik p/i)).toBeInTheDocument()
    })
  
    it('renders empty state in Danish', () => {
      useStore.setState({ lang: 'da', favorites: [], courses: mockCourses })
      const mockResolve = favUtils.resolveFavorite as any
      mockResolve.mockReturnValue(null)
  
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={false} />
        </MemoryRouter>
      )
  
      expect(screen.getByText(/Klik p/i)).toBeInTheDocument()
    })
  
    it('shows overflow message when more than 12 favorites', () => {
      const manyFavorites = Array.from({ length: 15 }, (_, i) => ({
        id: `fav${i}`,
        type: 'course',
        entityId: i,
        order: i,
      }))
      useStore.setState({ favorites: manyFavorites, courses: mockCourses })
  
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={false} />
        </MemoryRouter>
      )
  
      expect(screen.getByText(/flere favoritter/i)).toBeInTheDocument()
    })
  
    it('shows overflow message in Danish', () => {
      const manyFavorites = Array.from({ length: 15 }, (_, i) => ({
        id: `fav${i}`,
        type: 'course',
        entityId: i,
        order: i,
      }))
      useStore.setState({ lang: 'da', favorites: manyFavorites, courses: mockCourses })
  
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={false} />
        </MemoryRouter>
      )
  
      expect(screen.getByText(/flere favoritter/i)).toBeInTheDocument()
    })
  
    it('does not navigate when isEditing is true', () => {
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={true} />
        </MemoryRouter>
      )
  
      fireEvent.click(screen.getByText('Course 1'))
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  
    it('handles external links in new tab', () => {
      const windowSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      
      const mockExternalFav = {
        ...mockResolvedCourse,
        title: 'External Tool',
        link: 'https://example.com',
        external: true,
      }
      const mockResolve = favUtils.resolveFavorite as any
      mockResolve.mockReturnValue(mockExternalFav)
  
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={false} />
        </MemoryRouter>
      )
  
      fireEvent.click(screen.getByText('External Tool'))
      expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
    })
  
    it('navigates to internal favorite link when clicked', () => {
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={false} />
        </MemoryRouter>
      )
  
      fireEvent.click(screen.getByText('Course 1'))
      expect(mockNavigate).toHaveBeenCalledWith('/course/1')
    })
  
    it('renders remove button for each favorite', () => {
      render(
        <MemoryRouter>
          <FavoritesWidget span={6} isEditing={false} />
        </MemoryRouter>
      )
  
      const removeBtns = document.querySelectorAll('.lucide-x')
      expect(removeBtns.length).toBe(1)
    })
  })
}
