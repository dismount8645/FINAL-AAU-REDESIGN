import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Sidebar from '@/components/layout/Sidebar'
import { MemoryRouter } from 'react-router-dom'
import useStore from '@/store/useStore'

describe('Sidebar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useStore.setState({
      isCollapsed: false,
      isMobile: false,
      isMobileOpen: false,
      lang: 'da',
      theme: 'light',
      isDarkMode: false,
      t: (key: string) => {
        if (key === 'aau_logo_center_src') {
          return useStore.getState().lang === 'da'
            ? '/assets/img/grafik/logoer/__AAU_CENTER_WHITE.png'
            : '/assets/img/grafik/logoer/__AAU_CENTER_WHITE_UK.png'
        }
        if (key === 'aau_logo_left_src') {
          return useStore.getState().lang === 'da'
            ? '/assets/img/grafik/logoer/__AAU_LEFT_WHITE.png'
            : '/assets/img/grafik/logoer/__AAU_LEFT_WHITE_UK.png'
        }
        return key
      },
      closeSidebar: vi.fn(),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders navigation items', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    expect(screen.getByText('dashboard')).toBeDefined()
    expect(screen.getByText('calendar')).toBeDefined()
    expect(screen.getByText('courses')).toBeDefined()
    expect(screen.getByText('resources')).toBeDefined()
  })

  it('applies collapsed class when isCollapsed is true', () => {
    useStore.setState({ isCollapsed: true })
    const { container } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const aside = container.querySelector('aside')
    expect(aside?.classList.contains('collapsed')).toBe(true)
  })

  it('changes logo based on language', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const logo = screen.getByAltText('aau_logo_alt')
    expect(logo.getAttribute('src')).toContain('__AAU_LEFT_WHITE.png')
  })

  it('renders collapsed logo (symbol)', () => {
    useStore.setState({ isCollapsed: true, lang: 'da' })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const logo = screen.getByAltText('aau_logo_alt')
    expect(logo.getAttribute('src')).toContain('__AAU_CENTER_WHITE.png')
  })

  it('renders collapsed EN logo', () => {
    useStore.setState({ isCollapsed: true, lang: 'en' })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const logo = screen.getByAltText('aau_logo_alt')
    expect(logo.getAttribute('src')).toContain('__AAU_CENTER_WHITE_UK.png')
  })

  it('renders expanded EN logo', () => {
    useStore.setState({ isCollapsed: false, lang: 'en' })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const logo = screen.getByAltText('aau_logo_alt')
    expect(logo.getAttribute('src')).toContain('__AAU_LEFT_WHITE_UK.png')
  })

  it('calls setLang when language option is clicked', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    // Lang is the second segmented control or the single toggle in collapsed mode
    const enBtn = screen.getByText('EN')
    fireEvent.click(enBtn)
    expect(useStore.getState().lang).toBe('en')
  })

  it('hides sidebar on mobile', () => {
    useStore.setState({ isMobile: true })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const aside = document.querySelector('aside')
    expect(aside?.className).toContain('translate-x-[-100%]')
  })

  it('does not collapse sidebar on mobile when isMobileOpen is true', () => {
    useStore.setState({ isCollapsed: true, isMobile: true, isMobileOpen: true })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const aside = document.querySelector('aside')
    expect(aside?.getAttribute('data-collapsed')).toBe('false')
  })

  it('renders mobile backdrop when isMobileOpen is true', () => {
    useStore.setState({ isMobile: true, isMobileOpen: true })
    const { container } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument()
  })

  it('calls closeSidebar when backdrop is clicked', () => {
    const closeSidebar = vi.fn()
    useStore.setState({ isMobile: true, isMobileOpen: true, closeSidebar })
    const { container } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const backdrop = container.querySelector('.fixed.inset-0')
    if (backdrop) fireEvent.click(backdrop)
    expect(closeSidebar).toHaveBeenCalled()
  })

  it('renders close button and calls closeSidebar on mobile', () => {
    const closeSidebar = vi.fn()
    useStore.setState({ isMobile: true, isMobileOpen: true, closeSidebar, t: (k: string) => k === 'close' ? 'close' : k })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const closeBtn = screen.getByLabelText('close')
    fireEvent.click(closeBtn)
    expect(closeSidebar).toHaveBeenCalled()
  })

  it('has role=dialog when mobile open', () => {
    useStore.setState({ isMobile: true, isMobileOpen: true })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const aside = document.querySelector('aside')
    expect(aside?.getAttribute('role')).toBe('dialog')
    expect(aside?.getAttribute('aria-modal')).toBe('true')
  })

  it('does not have role=dialog when not open on desktop', () => {
    useStore.setState({ isMobile: false, isMobileOpen: false })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const aside = document.querySelector('aside')
    expect(aside?.getAttribute('role')).toBeFalsy()
  })

  it('close button exists when sidebar is open on mobile', () => {
    useStore.setState({ isMobile: true, isMobileOpen: true, t: (k: string) => k === 'close' ? 'close' : k })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    expect(screen.getByLabelText('close')).toBeInTheDocument()
  })

  it('closes sidebar on ESC key', () => {
    const closeSidebar = vi.fn()
    useStore.setState({ isMobile: true, isMobileOpen: true, closeSidebar })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(closeSidebar).toHaveBeenCalled()
  })

  it('does not trap focus on desktop', () => {
    const closeSidebar = vi.fn()
    useStore.setState({ isMobile: false, isMobileOpen: true, closeSidebar })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(closeSidebar).not.toHaveBeenCalled()
  })

  it('traps Tab focus within sidebar on mobile', () => {
    useStore.setState({ isMobile: true, isMobileOpen: true })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const focusable = document.querySelectorAll<HTMLElement>(
      'aside button, aside [href], aside input, aside select, aside textarea, aside [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (first) {
      first.focus()
      fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
      expect(document.activeElement).toBe(last)
    }
  })

  it('traps Shift+Tab focus backwards within sidebar', () => {
    useStore.setState({ isMobile: true, isMobileOpen: true })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const focusable = document.querySelectorAll<HTMLElement>(
      'aside button, aside [href], aside input, aside select, aside textarea, aside [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (last) {
      last.focus()
      fireEvent.keyDown(window, { key: 'Tab', shiftKey: false })
      expect(document.activeElement).toBe(first)
    }
  })

  it('restores focus to first element when focus is lost to outside', () => {
    useStore.setState({ isMobile: true, isMobileOpen: true })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const focusable = document.querySelectorAll<HTMLElement>(
      'aside button, aside [href], aside input, aside select, aside textarea, aside [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    
    document.body.focus()
    expect(document.activeElement).toBe(document.body)
    
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: false })
    expect(document.activeElement).toBe(first)
  })

  it('does not close or trap on non-Tab non-Escape keys', () => {
    const closeSidebar = vi.fn()
    useStore.setState({ isMobile: true, isMobileOpen: true, closeSidebar })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    fireEvent.keyDown(window, { key: 'a' })
    expect(closeSidebar).not.toHaveBeenCalled()
  })

  it('does not wrap focus when middle element is focused with Shift+Tab', () => {
    useStore.setState({ isMobile: true, isMobileOpen: true })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const focusable = document.querySelectorAll<HTMLElement>(
      'aside button, aside [href], aside input, aside select, aside textarea, aside [tabindex]:not([tabindex="-1"])'
    )
    const middle = focusable[Math.floor(focusable.length / 2)]
    if (middle) {
      middle.focus()
      const activeBefore = document.activeElement
      fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
      expect(document.activeElement).toBe(activeBefore)
    }
  })

  it('does not wrap focus when middle element is focused with Tab', () => {
    useStore.setState({ isMobile: true, isMobileOpen: true })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const focusable = document.querySelectorAll<HTMLElement>(
      'aside button, aside [href], aside input, aside select, aside textarea, aside [tabindex]:not([tabindex="-1"])'
    )
    const middle = focusable[Math.floor(focusable.length / 2)]
    if (middle) {
      middle.focus()
      const activeBefore = document.activeElement
      fireEvent.keyDown(window, { key: 'Tab', shiftKey: false })
      expect(document.activeElement).toBe(activeBefore)
    }
  })

  it('toggles language when collapsed toggle is clicked', () => {
    useStore.setState({ isCollapsed: true, lang: 'da' })
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const toggle = screen.getByText('DA')
    fireEvent.click(toggle)
    expect(useStore.getState().lang).toBe('en')
    
    expect(screen.getByText('EN')).toBeInTheDocument()
    fireEvent.click(screen.getByText('EN'))
    expect(useStore.getState().lang).toBe('da')
  })
})
