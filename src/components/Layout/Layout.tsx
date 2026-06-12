import { useEffect, Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '@/components/Layout/Footer';
import { PageSkeleton } from '@/components/ui';
import Sidebar from '@/components/Layout/Sidebar';
import Topbar from '@/components/Layout/Topbar';
import useStore from '@/store';

function Layout() {
  const t = useStore((state) => state.t);
  const isCollapsed = useStore((state) => state.isCollapsed);
  const location = useLocation();
  const isMessages = location.pathname.startsWith('/messages');

  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1280 : true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const marginLeft = isDesktop ? (isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)') : '0px';

  return (
    <div className="flex min-h-screen w-full relative">
      <a href="#main-content" className="skip-link">
        {t('skip_to_content')}
      </a>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 relative">
        <Topbar />
        <main
          id="main-content"
          className="layout-main transition-all duration-300 ease-in-out flex-1 min-w-0"
          style={{ marginLeft }}
        >
          <div data-testid="page-content" className="page-content relative z-10 w-full max-w-full min-w-0 flex-1">
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
        {!isMessages && <Footer />}
      </div>
    </div>
  );
}

export default Layout;
