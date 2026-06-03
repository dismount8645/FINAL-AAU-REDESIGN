import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Layout from '@/components/Layout'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import useStore from '@/lib/store'

vi.mock('./Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}))

vi.mock('./Topbar', () => ({
  default: () => <div data-testid="topbar">Topbar</div>,
}))

vi.mock('./Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}))

vi.mock('./DynamicWaveBackground', () => ({
  default: () => <div data-testid="wave-bg">Wave</div>,
}))

function renderLayout(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page content</div>} />
          <Route path="/messages" element={<div>Messages page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('Layout', () => {
  beforeEach(() => {
    useStore.setState({
      isCollapsed: false,
      isMobile: false,
      isMobileOpen: false,
      lang: 'da',
    })
  })

  afterEach(() => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  })

  it('renders correctly', () => {
    renderLayout('/')
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('topbar')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('does not modify body overflow on desktop', () => {
    useStore.setState({ isMobile: false, isMobileOpen: true })
    renderLayout('/')
    expect(document.body.style.overflow).toBe('')
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('sets body overflow hidden on mobile when sidebar opens', () => {
    useStore.setState({ isMobile: true, isMobileOpen: false })
    renderLayout('/')
    act(() => {
      useStore.setState({ isMobileOpen: true })
    })
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.documentElement.style.overflow).toBe('hidden')
  })

  it('restores body overflow on mobile when sidebar closes', () => {
    useStore.setState({ isMobile: true, isMobileOpen: true })
    renderLayout('/')
    act(() => {
      useStore.setState({ isMobileOpen: false })
    })
    expect(document.body.style.overflow).toBe('')
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('hides footer on messages page', () => {
    renderLayout('/messages')
    expect(screen.getByText('Messages page')).toBeInTheDocument()
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument()
  })

  it('cleanup restores body overflow on unmount', () => {
    useStore.setState({ isMobile: true, isMobileOpen: true })
    const { unmount } = renderLayout('/')
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
