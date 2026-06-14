import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import useStore from '@/store'

vi.mock('./Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}))

vi.mock('./Topbar', () => ({
  default: () => <div data-testid="topbar">Topbar</div>,
}))

vi.mock('./Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}))

const renderLayout = (path = '/') => {
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

  it('hides footer on messages page', () => {
    renderLayout('/messages')
    expect(screen.getByText('Messages page')).toBeInTheDocument()
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument()
  })
})
