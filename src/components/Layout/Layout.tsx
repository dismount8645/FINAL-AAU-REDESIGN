import { useEffect, Suspense } from 'react';


import { Outlet, useLocation, MemoryRouter, Routes, Route } from 'react-router-dom';
import Footer from '@/components/Layout/Footer';
import { PageSkeleton } from '@/components/ui';
import Sidebar from '@/components/Layout/Sidebar';
import Topbar from '@/components/Layout/Topbar';
import useStore from '@/store';

function Layout() {
  const t = useStore((state) => state.t);
  const location = useLocation();
  const isMessages = location.pathname.startsWith('/messages');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full relative">
      <a href="#main-content" className="skip-link">
        {t('skip_to_content')}
      </a>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 relative w-full">
        <Topbar />
        <main
          id="main-content"
          className="layout-main transition-all duration-300 ease-in-out flex-1 w-full min-w-0"
        >
          <div data-testid="page-content" className="page-content relative z-10 w-full max-w-full min-w-0">
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        {!isMessages && <Footer />}
      </main>
      </div>
    </div>
  );
}

export default Layout;


if (import.meta.vitest) {
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
}
