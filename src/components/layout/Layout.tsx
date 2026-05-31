import { useRef, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import Footer from '@/components/layout/Footer';
import DynamicWaveBackground from '@/components/layout/DynamicWaveBackground';
import useStore from '@/store/useStore'
import PageSkeleton from '@/components/ui/PageSkeleton';

function Layout() {
  const isMobile = useStore((state) => state.isMobile);
  const isMobileOpen = useStore((state) => state.isMobileOpen);
  const t = useStore((state) => state.t);
  const _lang = useStore((state) => state.lang);
  void _lang;
  const location = useLocation();
  const isMessages = location.pathname.startsWith('/messages');
  const scrollPositionRef = useRef<number>(0);
  const prevMobileOpenRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isMobile) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      return;
    }
    
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      /* istanbul ignore next */
      if (!prevMobileOpenRef.current) {
        scrollPositionRef.current = window.scrollY;
      }
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (prevMobileOpenRef.current) {
        /* istanbul ignore next */
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
      }
    }
    prevMobileOpenRef.current = isMobileOpen;

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileOpen, isMobile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full relative">
      <a href="#main-content" className="skip-link">
        {t('skip_to_content')}
      </a>
      <DynamicWaveBackground />
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
