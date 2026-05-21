import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Topbar from '@/components/layout/Topbar'
import Resources from '@/pages/Resources'
import Courses from '@/pages/Courses'
import SearchResults from '@/pages/SearchResults'
import { MemoryRouter, useLocation } from 'react-router-dom'
import useStore from '@/store/useStore'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(() => ({ pathname: '/', search: '', hash: '', state: null, key: 'default' }))
  }
})

describe('Final Coverage Sweep', () => {
  it('covers Topbar dropdowns in English', () => {
    useStore.setState({ lang: 'en', notificationCount: 1, messageCount: 1 })
    render(
      <MemoryRouter>
        <Topbar />
      </MemoryRouter>
    )

    // Open notifications
    const bellBtn = screen.getByLabelText(/notifications/i)
    fireEvent.click(bellBtn)
    const notifItem = screen.getByText(/Project Report/i)
    expect(notifItem).toBeInTheDocument()
    fireEvent.click(notifItem)
    expect(mockNavigate).toHaveBeenCalledWith('/notifications')

    // Open messages
    const mailBtn = screen.getByLabelText(/messages/i)
    fireEvent.click(mailBtn)
    const msgItem = screen.getByText(/Mette Jensen/i)
    expect(msgItem).toBeInTheDocument()
    fireEvent.click(msgItem)
    expect(mockNavigate).toHaveBeenCalledWith('/messages')
  })

  it('covers forum and course star toggle in Courses', () => {
    useStore.setState({ lang: 'da' })
    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    )
    const stars = screen.getAllByLabelText(/favorit/i)
    // Click first one (Course) and last one (Forum)
    fireEvent.click(stars[0])
    fireEvent.click(stars[stars.length - 1])
  })

  it('covers search in English in Courses', () => {
    useStore.setState({ lang: 'en' })
    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    )
    const searchInput = screen.getByPlaceholderText(/Search/i)
    fireEvent.change(searchInput, { target: { value: 'Digital' } })
  })

  it('covers tool click and star toggle in Resources', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    // Add a favorite tool to cover the Quick Access section
    useStore.setState({ 
      lang: 'da',
      favorites: [{ id: 'tool-1', type: 'tool', entityId: 1, addedAt: Date.now(), order: 0 }] 
    })
    
    render(
      <MemoryRouter>
        <Resources />
      </MemoryRouter>
    )

    // Click tool in Quick Access
    const quickTool = screen.getAllByText('Digital Eksamen')[0]
    fireEvent.click(quickTool.closest('.info-card')!)
    expect(windowOpenSpy).toHaveBeenCalled()

    // Click star in Essentials section
    const essentialStars = screen.getAllByLabelText(/favorit/i)
    fireEvent.click(essentialStars[essentialStars.length - 1])
    
    windowOpenSpy.mockRestore()
  })

  it('covers HighlightText with empty query', () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: '/search', search: '' } as any)
    render(
      <MemoryRouter initialEntries={['/search']}>
        <SearchResults />
      </MemoryRouter>
    )
    // This will trigger useSearch with empty query, which will use HighlightText with empty query
  })
})
