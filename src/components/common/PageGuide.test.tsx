import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PageGuide from '@/components/common/PageGuide'
import { useLocation } from 'react-router-dom'
import useStore from '@/store/useStore';

// Mock react-router-dom to control location
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: vi.fn(),
  }
})

const mockLocation = (pathname: string) => ({
  pathname,
  search: '',
  hash: '',
  state: null,
  key: 'default'
})

describe('PageGuide Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useLocation).mockReturnValue(mockLocation('/'))
  })

  const renderPageGuide = () => {
    return renderWithProviders(<PageGuide />)
  }

  it('renders trigger button', () => {
    renderPageGuide()
    const trigger = screen.getByTitle('Sidevejledning')
    expect(trigger).toBeInTheDocument()
  })

  it('opens and closes the guide panel', async () => {
    renderPageGuide()
    const trigger = screen.getByTitle('Sidevejledning')
    
    // Open
    fireEvent.click(trigger)
    expect(screen.getByText('Velkommen til dit Dashboard')).toBeInTheDocument()
    
    // Close via trigger
    fireEvent.click(trigger)
    await waitFor(() => {
      expect(screen.queryByText('Velkommen til dit Dashboard')).not.toBeInTheDocument()
    })
  })

  it('closes via "Got it" button', async () => {
    renderPageGuide()
    fireEvent.click(screen.getByTitle('Sidevejledning'))
    
    const gotItBtn = screen.getByText('Forstået')
    fireEvent.click(gotItBtn)
    
    await waitFor(() => {
      expect(screen.queryByText('Velkommen til dit Dashboard')).not.toBeInTheDocument()
    })
  })

  it('shows different content for different routes', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('/calendar'))
    renderPageGuide()
    
    fireEvent.click(screen.getByTitle('Sidevejledning'))
    expect(screen.getByText('Sådan bruger du Kalenderen')).toBeInTheDocument()
  })

  it('handles dynamic routes using regex', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('/course/123'))
    renderPageGuide()
    
    fireEvent.click(screen.getByTitle('Sidevejledning'))
    expect(screen.getByText('Oversigt over dit kursus')).toBeInTheDocument()
  })

  it('falls back to dashboard guide for unknown routes', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('/unknown-route'))
    renderPageGuide()
    fireEvent.click(screen.getByTitle('Sidevejledning'))
    expect(screen.getByText('Velkommen til dit Dashboard')).toBeInTheDocument()
  })

  it('adds active class to trigger when guide is open', () => {
    renderPageGuide()
    const trigger = screen.getByTitle('Sidevejledning')
    expect(trigger.classList.contains('active')).toBe(false)
    fireEvent.click(trigger)
    expect(screen.getByTitle('Sidevejledning').classList.contains('active')).toBe(true)
  })

  it('shows "Got it" button text in English', () => {
    useStore.setState({ lang: 'en' })
    vi.mocked(useLocation).mockReturnValue(mockLocation('/'))
    renderWithProviders(<PageGuide />)
    fireEvent.click(screen.getByTitle('Page Guidance'))
    expect(screen.getByText('Got it')).toBeInTheDocument()
  })
})
