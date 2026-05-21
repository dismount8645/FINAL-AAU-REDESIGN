import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PageGuide from '@/components/common/PageGuide'
import { MemoryRouter, useLocation } from 'react-router-dom'
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
    return render(
      <MemoryRouter>
        <PageGuide />
      </MemoryRouter>
    )
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
    expect(trigger.className).not.toContain('active')
    fireEvent.click(trigger)
    expect(trigger.className).toContain('active')
  })

  it('shows "Got it" button text in English', () => {
    useStore.setState({ lang: 'en' })
    vi.mocked(useLocation).mockReturnValue(mockLocation('/'))
    render(
      <MemoryRouter>
        <PageGuide />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByTitle('Page Guidance'))
    expect(screen.getByText('Got it')).toBeInTheDocument()
  })
})
