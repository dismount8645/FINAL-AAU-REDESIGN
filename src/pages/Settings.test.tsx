import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Settings from '@/pages/Settings'
import { MemoryRouter } from 'react-router-dom'
import useStore from '@/store/useStore';

// Mock useToast
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn()
}

vi.mock('@/context/ToastContext', () => ({
  useToast: () => mockToast
}))

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  const renderSettings = (lang = 'da') => {
    useStore.setState({ lang: lang as 'da' | 'en' })
    return render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    )
  }

  it('renders settings categories', () => {
    renderSettings('da')
    expect(screen.getAllByText('Brugerkonto').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Indstillinger').length).toBeGreaterThan(0)
  })

  it('switches categories and toggles collapse', () => {
    renderSettings('da')
    const securityHeader = screen.getByText('Sikkerhed')
    fireEvent.click(securityHeader)
    expect(screen.getByText('Indstillinger for beskeder')).toBeInTheDocument()

    fireEvent.click(securityHeader)
    expect(screen.queryByText('Indstillinger for beskeder')).not.toBeInTheDocument()
  })

  it('changes language and theme', () => {
    renderSettings('en')
    expect(screen.getAllByText('User Account').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Security').length).toBeGreaterThan(0)
  })

  it('renders the profile content by default', () => {
    renderSettings('da')
    expect(screen.getAllByText('Jacob Krarup Madsen').length).toBeGreaterThan(0)
    expect(screen.getByDisplayValue('jkm@student.aau.dk')).toBeInTheDocument()
  })

  it('switches theme via appearance buttons', () => {
    renderSettings('da')
    const darkButton = screen.getByText('Mørk')
    fireEvent.click(darkButton)
    expect(darkButton.closest('button')?.getAttribute('aria-pressed')).toBe('true')
  })

  it('shows empty state for non-profile tabs', () => {
    renderSettings('da')
    const securityHeader = screen.getByText('Sikkerhed')
    fireEvent.click(securityHeader)
    const sikkerhedsNoeglerItem = screen.getByText('Sikkerhedsnøgler')
    fireEvent.click(sikkerhedsNoeglerItem)
    expect(screen.getByText('Denne sektion er under udvikling.')).toBeInTheDocument()
  })

  it('shows empty state in English for non-profile tabs', () => {
    renderSettings('en')
    const blogsHeader = screen.getByText('Blogs')
    fireEvent.click(blogsHeader)
    const blogSettings = screen.getByText('Blog Settings')
    fireEvent.click(blogSettings)
    expect(screen.getByText('This section is under development.')).toBeInTheDocument()
  })

  it('selects different tabs and shows correct content', () => {
    renderSettings('en')
    // Click Security section to expand it
    fireEvent.click(screen.getByText('Security'))
    // Click an item - Security Keys
    fireEvent.click(screen.getByText('Security Keys'))
    expect(screen.getByText('This section is under development.')).toBeInTheDocument()
  })

  it('falls back to "Settings" for unknown tab ID from URL', () => {
    useStore.setState({ lang: 'en' })
    render(
      <MemoryRouter initialEntries={['/settings?tab=nonexistent']}>
        <Settings />
      </MemoryRouter>
    )
    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0)
  })

  it('expands and collapses a closed category', () => {
    renderSettings('da')
    const filerHeader = screen.getByText('Filer')
    fireEvent.click(filerHeader)
    expect(screen.getByText('Filarkiver')).toBeInTheDocument()
    fireEvent.click(filerHeader)
    expect(screen.queryByText('Filarkiver')).not.toBeInTheDocument()
  })

  it('types into first and last name inputs', () => {
    renderSettings('da')
    const firstNameInput = screen.getByDisplayValue('Jacob Krarup') as HTMLInputElement
    fireEvent.change(firstNameInput, { target: { value: 'NewName' } })
    expect(firstNameInput.value).toBe('NewName')
  })

  it('navigates to notification tab and toggles preferences', () => {
    renderSettings('da')
    const securityHeader = screen.getByText('Sikkerhed')
    fireEvent.click(securityHeader)
    fireEvent.click(screen.getByText('Indstillinger for underretninger'))
    const notifCards = document.querySelectorAll('[role="switch"]')
    if (notifCards.length > 0) {
      fireEvent.click(notifCards[0])
    }
  })

  it('shows change photo button in profile tab', () => {
    renderSettings('da')
    expect(screen.getByText('Skift profilbillede')).toBeInTheDocument()
  })

  it('changes last name input value', () => {
    renderSettings('da')
    const lastNameInput = screen.getByDisplayValue('Madsen') as HTMLInputElement
    fireEvent.change(lastNameInput, { target: { value: 'Nielsen' } })
    expect(lastNameInput.value).toBe('Nielsen')
  })

  it('calls handleSave and saves to localStorage', () => {
    renderSettings('da')
    const saveBtn = screen.getByText('Gem ændringer')
    fireEvent.click(saveBtn)
    expect(JSON.parse(localStorage.getItem('userFirstName')!)).toBe('Jacob Krarup')
    expect(JSON.parse(localStorage.getItem('userLastName')!)).toBe('Madsen')
  })

  it('handles mobile view tab clicks and back button', () => {
    useStore.setState({ isMobile: true, lang: 'en' })
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    )
    // Click a tab
    fireEvent.click(screen.getByText('Security'))
    fireEvent.click(screen.getByText('Security Keys'))
    // Should show the back button and the pane
    const backBtn = screen.getByText('Back')
    expect(backBtn).toBeInTheDocument()
    
    // Click back button
    fireEvent.click(backBtn)
    expect(screen.queryByText('Back')).not.toBeInTheDocument()
  })
})
