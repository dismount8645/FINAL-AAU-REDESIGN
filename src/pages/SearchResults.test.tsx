import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SearchResults from '@/pages/SearchResults'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom'
import useStore from '@/store/useStore';


// Mock mockData to include a result with an unknown group
vi.mock('@/data/mockData', async () => {
  const actual = await vi.importActual('@/data/mockData') as any
  return {
    ...actual,
    courses: {
      ...actual.courses,
      999: {
        title: 'Unknown Group Item',
        titleEn: 'Unknown Group Item',
        group: 'Unknown Group',
        sections: []
      }
    }
  }
})

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn()
  }
})

const mockLocation = (search: string = '') => ({
  pathname: '/search',
  search,
  hash: '',
  state: null,
  key: 'default'
})

describe('SearchResults Page', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    // Default search for "Digital"
    vi.mocked(useLocation).mockReturnValue(mockLocation('?q=Digital'))
  })

  const renderSearchResults = (lang: 'da' | 'en' = 'da') => {
    useStore.setState({ lang })
    return render(
      <MemoryRouter>
        <SearchResults />
      </MemoryRouter>
    )
  }

  it('renders search results correctly', () => {
    renderSearchResults('da')
    // Match the exact text content and pick the first one
    const titles = screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')
    expect(titles[0]).toBeInTheDocument()
    
    // Test navigation — click the stretched-link overlay button inside the card
    const teaserCard = titles[0].closest('[class*="@container/teaser"]')!
    const overlayBtn = teaserCard.querySelector('[aria-label="View details"]')
    fireEvent.click(overlayBtn!)
    expect(mockNavigate).toHaveBeenCalledWith('/course/1')
  })

  it('filters results by category', () => {
    renderSearchResults('da')
    const modulerFilter = screen.getByRole('button', { name: 'Moduler' })
    fireEvent.click(modulerFilter)
    expect(screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')[0]).toBeInTheDocument()
  })

  it('shows empty state when no results found', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('?q=xyz123'))
    renderSearchResults('da')
    expect(screen.getAllByText('Ingen resultater').length).toBeGreaterThan(0)
  })

  it('renders in English', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('?q=Digital'))
    renderSearchResults('en')
    expect(screen.getByText(/Results for "Digital"/i)).toBeInTheDocument()
  })

  it('shows empty state in English', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('?q=xyz123'))
    renderSearchResults('en')
    expect(screen.getAllByText('No results').length).toBeGreaterThan(0)
  })

  it('shows empty state when query is empty', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation(''))
    renderSearchResults('da')
    expect(screen.getByText(/Ingen resultater/i)).toBeInTheDocument()
  })

  it('finds results by description match', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('?q=Kursusmodul'))
    renderSearchResults('da')
    expect(screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')[0]).toBeInTheDocument()
  })

  it('navigates via go to content button', () => {
    renderSearchResults('da')
    // Search for course action label specifically
    const goBtns = screen.getAllByText('Gå til kursus')
    fireEvent.click(goBtns[0])
    expect(mockNavigate).toHaveBeenCalledWith('/course/1')
  })

  it('filters by "all" category shows all results', () => {
    renderSearchResults('da')
    fireEvent.click(screen.getByText('Alle'))
    expect(screen.getAllByText((_content, element) => element?.textContent === 'Digital Design og Kommunikation')[0]).toBeInTheDocument()
  })

  it('filters between multiple categories excluding some results', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('?q=oversigt'))
    renderSearchResults('da')
    expect(screen.queryByText(/Ingen resultater/i)).not.toBeInTheDocument()
    // Should show only page results (group: Sider)
    const categoryBtns = screen.getAllByRole('button')
    const siderBtn = [...categoryBtns].find(b => b.textContent === 'Sider')
    if (siderBtn) {
      fireEvent.click(siderBtn)
      expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
    }
  })

  it('renders fallback action label for unknown group', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('?q=Unknown Group Item'))
    renderSearchResults('da')
    
    expect(screen.getByText('Gå til indhold')).toBeInTheDocument()
  })

  it('renders HighlightText with matching query', () => {
    // HighlightText is used inside SearchResults
    renderSearchResults('da')
    const strong = document.querySelector('strong')
    expect(strong).toBeInTheDocument()
    expect(strong?.textContent).toBe('Digital')
  })

  it('highlights text when query parameter is present in URL', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('?q=Design'))
    renderSearchResults('da')
    const strong = document.querySelector('strong')
    expect(strong).toBeInTheDocument()
    expect(strong?.textContent).toBe('Design')
  })

  it('toggles favorite on a course search result', () => {
    const toggleSpy = vi.spyOn(useStore.getState(), 'toggleFavorite')
    renderSearchResults('da')
    const starBtn = screen.getByLabelText(/til favoritter|to favorites/i)
    expect(starBtn).toBeInTheDocument()
    fireEvent.click(starBtn)
    expect(toggleSpy).toHaveBeenCalledWith('course', 1)
    toggleSpy.mockRestore()
  })
})
