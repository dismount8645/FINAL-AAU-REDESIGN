import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import Resources from '@/pages/Resources'
import { MemoryRouter } from 'react-router-dom'
import useStore from '@/store/useStore';

const mockOpen = vi.fn()

beforeEach(() => {
  mockOpen.mockClear()
  vi.spyOn(window, 'open').mockImplementation(mockOpen)
})

const renderWithLang = (lang: 'da' | 'en') => {
  useStore.setState({ lang, favorites: [] })
  return render(
    <MemoryRouter>
      <Resources />
    </MemoryRouter>
  )
}

describe('Resources', () => {
  it('renders correctly in Danish', () => {
    renderWithLang('da')
    expect(screen.getAllByText(/Værktøjskasse/i).length).toBeGreaterThan(0)
    expect(screen.getByText('Digital Eksamen')).toBeInTheDocument()
    expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
    expect(screen.getByText(/AAU IT Services står klar/i)).toBeInTheDocument()
  })

  it('renders correctly in English', () => {
    renderWithLang('en')
    expect(screen.getAllByText(/Toolbox/i).length).toBeGreaterThan(0)
    expect(screen.getByText('Digital Exam')).toBeInTheDocument()
    expect(screen.getByText('Outlook Mail')).toBeInTheDocument()
    expect(screen.getByText(/AAU IT Services is ready/i)).toBeInTheDocument()
  })

  it('tool button opens URL on click', () => {
    renderWithLang('da')
    const card = screen.getByText('Digital Eksamen').closest('.info-card')
    expect(card).not.toBeNull()
    fireEvent.click(card!)
    expect(mockOpen).toHaveBeenCalledWith('https://digitalservices.aau.dk/dse/exam', '_blank', 'noopener,noreferrer')
  })

  it('digital essentials button opens URL on click', () => {
    renderWithLang('da')
    const card = screen.getByText('Outlook Mail').closest('.info-card')
    expect(card).not.toBeNull()
    fireEvent.click(card!)
    expect(mockOpen).toHaveBeenCalledWith(expect.any(String), '_blank', 'noopener,noreferrer')
  })

  it('footer help portal button opens URL', () => {
    renderWithLang('da')
    const btn = screen.getByText('Besøg help-portalen')
    fireEvent.click(btn)
    expect(mockOpen).toHaveBeenCalledWith('https://support.its.aau.dk/', '_blank', 'noopener,noreferrer')
  })

  it('renders quick access section when tools are favorited', () => {
    useStore.setState({ 
      lang: 'en',
      favorites: [{ id: 'fav1', type: 'tool', entityId: 1, order: 0, addedAt: Date.now() }] 
    })
    render(
      <MemoryRouter>
        <Resources />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Quick Access')).toBeInTheDocument()
    expect(screen.getAllByText('Digital Exam').length).toBe(2) // One in Quick Access, one in main list
  })

  it('toggles favorite status when star is clicked', () => {
    renderWithLang('en')
    const starButton = screen.getAllByLabelText('Add to favorites')[0]
    fireEvent.click(starButton)
    
    const favorites = useStore.getState().favorites
    expect(favorites.some(f => f.entityId === 1 && f.type === 'tool')).toBe(true)
    
    fireEvent.click(screen.getAllByLabelText('Remove from favorites')[0])
    expect(useStore.getState().favorites.length).toBe(0)
  })

  it('shows help text when help icon is clicked', () => {
    renderWithLang('en')
    const helpButton = screen.getAllByLabelText('Help')[0]
    fireEvent.click(helpButton)
    
    expect(screen.getByText(/Digital Exam is AAU's platform/i)).toBeInTheDocument()
  })

  it('contact support button is present', () => {
    renderWithLang('da')
    const btn = screen.getByRole('button', { name: 'Kontakt support' })
    expect(btn).toBeInTheDocument()
  })

  it('opens tool url in new window when clicked', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderWithLang('da')
    const tool = screen.getByText('Digital Eksamen')
    fireEvent.click(tool)
    expect(windowOpenSpy).toHaveBeenCalled()
    windowOpenSpy.mockRestore()
  })

  it('toggles tool favorite star', () => {
    renderWithLang('da')
    const star = screen.getAllByLabelText(/favorite|stjerne/i)[0]
    fireEvent.click(star)
  })

  it('renders essential tool in quick access when favorited', () => {
    useStore.setState({
      lang: 'en',
      favorites: [{ id: 'fav1', type: 'tool', entityId: 5, order: 0, addedAt: Date.now() }]
    })
    render(
      <MemoryRouter>
        <Resources />
      </MemoryRouter>
    )
    expect(screen.getByText('Quick Access')).toBeInTheDocument()
    const outlookElements = screen.getAllByText('Outlook Mail')
    expect(outlookElements.length).toBe(2) // One in Quick Access, one in Essentials
  })
})
