import { Fragment, useState, useEffect } from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, AlignJustify, ChevronRight } from 'lucide-react';
import { Link, useLocation, MemoryRouter } from 'react-router-dom';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';
import TopbarSearch from './TopbarSearch';
import Button from '@/components/ui/Button';
import { Text } from '@/components/ui';
import { getAutomaticBreadcrumbs } from '@/lib/breadcrumbs';
import useStore from '@/store';

export default function Topbar() {
  const location = useLocation();
  const isCollapsed = useStore(state => state.isCollapsed);
  const toggleSidebar = useStore(state => state.toggleSidebar);
  const t = useStore(state => state.t);
  const lang = useStore(state => state.lang);
  const breadcrumbs = useStore(state => state.breadcrumbs);

  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1280 : true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeBreadcrumbs = (breadcrumbs && breadcrumbs.length > 0)
    ? breadcrumbs
    : getAutomaticBreadcrumbs(location.pathname, lang, t);

  const sidebarIcon = isCollapsed ? <Menu size={20} strokeWidth={2} /> : <AlignJustify size={20} strokeWidth={2} />;

  const left = isDesktop ? (isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)') : '0px';

  return (
    <nav
      className="fixed top-0 right-0 h-[var(--topbar-height)] bg-bg-topbar backdrop-blur-[12px] saturate-[180%] flex items-center z-40 border-b border-border transition-all duration-300 ease-in-out pr-[var(--space-md)]"
      style={{
        left,
        width: 'auto'
      }}
    >
      <div className="flex items-center shrink-0 gap-sm">
        <Button
          variant="ghost"
          size="icon"
          className="w-11 h-11 text-text-main bg-transparent hover:bg-bg-highlight dark:hover:bg-white/10 active:scale-[0.95] rounded-lg border-none focus-visible:outline-none focus-visible:shadow-focus"
          onClick={toggleSidebar}
          aria-label={t('toggle_sidebar')}
          type="button"
        >
          {sidebarIcon}
        </Button>

        <AnimatePresence mode="popLayout">
          {activeBreadcrumbs && activeBreadcrumbs.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-row items-center flex-wrap gap-2xs ml-sm"
            >
              {activeBreadcrumbs.map((crumb, idx) => (
                <Fragment key={idx}>
                  {idx > 0 && <ChevronRight size={14} strokeWidth={2.5} className="shrink-0 opacity-40 text-muted" />}
                  {crumb.href ? (
                    <Link to={crumb.href} className="text-muted hover:text-primary transition-colors font-bold focus-visible:outline-none focus-visible:shadow-focus rounded-sm px-2xs">
                      <Text tag="span" size="sm" weight="semibold">{crumb.label}</Text>
                    </Link>
                  ) : (
                    <Text tag="span" weight="black" size="md" className="text-text-main tracking-tight">{crumb.label}</Text>
                  )}
                </Fragment>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <TopbarSearch>
        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </TopbarSearch>
    </nav>
  );
}

let mockNavigate: ReturnType<typeof vi.fn>
/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  // Mock useNavigate
  mockNavigate = vi.fn()
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: () => mockNavigate
    }
  })
  describe('Topbar', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      vi.clearAllMocks()
      useStore.setState({
        theme: 'system',
        isDarkMode: false,
        lang: 'da',
        t: (key: string) => key,
        isCollapsed: false,
        courses: [
          { id: 1, title: 'Digital Design og Kommunikation', code: 'DDK1' }
        ] as any,
        notificationCount: 2,
      })
    })

    afterEach(() => {
      vi.useRealTimers()
    })
  
    it('renders search input and trigger buttons', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      expect(screen.getByPlaceholderText('Søg i fag, afleveringer og beskeder...')).toBeInTheDocument()
      expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0)
    })
  

  
    it('updates search query and shows dropdown', async () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const input = document.querySelector('.topbar__search-wrapper input')
      fireEvent.change(input!, { target: { value: 'Digital' } })
      act(() => {
        vi.runAllTimers()
      })
      
      expect(screen.getByText('Digital Design og Kommunikation')).toBeInTheDocument()
      expect(screen.getByText(/1 search_results_singular/i)).toBeInTheDocument()
    })
  
    it('navigates when a search result is clicked', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const input = document.querySelector('.topbar__search-wrapper input')
      fireEvent.change(input!, { target: { value: 'Digital' } })
      act(() => {
        vi.runAllTimers()
      })
      
      const result = screen.getByText('Digital Design og Kommunikation')
      fireEvent.click(result)
      
      expect(mockNavigate).toHaveBeenCalledWith('/course/1')
    })
  
    it('navigates when Enter is pressed in search input', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const input = document.querySelector('.topbar__search-wrapper input')
      fireEvent.change(input!, { target: { value: 'Test' } })
      fireEvent.keyDown(input!, { key: 'Enter' })
      
      expect(mockNavigate).toHaveBeenCalledWith('/search?q=Test')
    })
  
    it('opens notifications dropdown when bell is clicked', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      
      const bellBtn = screen.getByLabelText('notifications')
      fireEvent.click(bellBtn)
      
      expect(screen.getByText(/view_all/i)).toBeInTheDocument()
      expect(screen.getByText(/Modul 4: Projektrapport/i)).toBeInTheDocument()
    })
  
    it('navigates to notifications when a notification is clicked', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      
      const bellBtn = screen.getByLabelText('notifications')
      fireEvent.click(bellBtn)
      
      const notifItem = screen.getByText(/Modul 4: Projektrapport/i)
      fireEvent.click(notifItem)
      
      expect(mockNavigate).toHaveBeenCalledWith('/notifications')
    })
  
  
    it('navigates to profile when profile link is clicked', async () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      
      const profile = screen.getByLabelText('user_menu')
      fireEvent.click(profile)
      
      const profileItem = screen.getByText('profile')
      fireEvent.click(profileItem)
      expect(mockNavigate).toHaveBeenCalledWith('/settings?tab=profil')
      await waitFor(() => expect(screen.queryByText('logout')).not.toBeInTheDocument())
    })
  
    it('closes profile menu when logout is clicked', async () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      
      const profile = screen.getByLabelText('user_menu')
      fireEvent.click(profile)
      
      const logoutItem = screen.getByText('logout')
      fireEvent.click(logoutItem)
      await waitFor(() => expect(screen.queryByText('logout')).not.toBeInTheDocument())
    })
  
    it('renders default icon for unknown notification type', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      
      const bellBtn = screen.getByLabelText('notifications')
      fireEvent.click(bellBtn)
      
      // 'SYSTEM' type in notificationsData hits the default case
      expect(screen.getByText(/Moodle vedligeholdelse/i)).toBeInTheDocument()
    })
  
    it('navigates via search dropdown footer', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const input = document.querySelector('.topbar__search-wrapper input')
      fireEvent.change(input!, { target: { value: 'Digital' } })
      
      const footer = document.querySelector('.search-dropdown-footer')
      fireEvent.click(footer!)
      expect(mockNavigate).toHaveBeenCalledWith('/search?q=Digital')
    })
  
    it('shows no results message', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const input = document.querySelector('.topbar__search-wrapper input')
      fireEvent.change(input!, { target: { value: 'NonExistent' } })
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.getByText('no_search_results')).toBeInTheDocument()
    })
  
    it('closes dropdown when clicking outside', async () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const input = document.querySelector('.topbar__search-wrapper input')
      fireEvent.change(input!, { target: { value: 'Digital' } })
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.getByText(/1 search_results_singular/i)).toBeInTheDocument()
      
      fireEvent.mouseDown(document.body)
      act(() => {
        vi.runAllTimers()
      })
      await waitFor(() => {
        expect(screen.queryByText(/1 search_results_singular/i)).not.toBeInTheDocument()
      })
    })
  
    it('renders with collapsed sidebar padding', () => {
      const originalWidth = window.innerWidth
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1280 })
      useStore.setState({ isCollapsed: true })
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const nav = screen.getAllByRole('navigation')[0] as HTMLElement
      expect(nav.style.left).toBe('var(--sidebar-collapsed-width)')
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    })
  
  
    it('does not close dropdown when clicking inside search', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const input = document.querySelector('.topbar__search-wrapper input')
      fireEvent.change(input!, { target: { value: 'Digital' } })
      act(() => {
        vi.runAllTimers()
      })
      expect(screen.getByText(/1 search_results_singular/i)).toBeInTheDocument()
  
      fireEvent.mouseDown(input!)
      expect(screen.getByText(/1 search_results_singular/i)).toBeInTheDocument()
    })
  
    describe('Automatic Breadcrumbs Fallback', () => {
      it('renders dashboard crumb when pathname is / or /dashboard', () => {
        useStore.setState({ breadcrumbs: [] })
        render(
          <MemoryRouter initialEntries={['/']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.getByText('dashboard')).toBeInTheDocument()
      })
  
      it('renders dashboard > calendar when pathname is /calendar', () => {
        useStore.setState({ breadcrumbs: [] })
        render(
          <MemoryRouter initialEntries={['/calendar']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.getByText('dashboard')).toBeInTheDocument()
        expect(screen.getByText('calendar')).toBeInTheDocument()
      })
  
      it('renders dashboard > courses > course title when pathname is /course/1', () => {
        useStore.setState({ breadcrumbs: [] })
        render(
          <MemoryRouter initialEntries={['/course/1']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.getByText('dashboard')).toBeInTheDocument()
        expect(screen.getByText('courses')).toBeInTheDocument()
        expect(screen.getByText('Digital Design og Kommunikation')).toBeInTheDocument()
      })
  
      it('renders dashboard > courses > course title > submission when pathname is /submission/1/10', () => {
        useStore.setState({ breadcrumbs: [] })
        render(
          <MemoryRouter initialEntries={['/submission/1/10']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.getByText('dashboard')).toBeInTheDocument()
        expect(screen.getByText('courses')).toBeInTheDocument()
        expect(screen.getByText('Digital Design og Kommunikation')).toBeInTheDocument()
        expect(screen.getByText('submission')).toBeInTheDocument()
      })
  
      it('renders forum thread breadcrumbs', () => {
        useStore.setState({ breadcrumbs: [], lang: 'en' })
        render(
          <MemoryRouter initialEntries={['/forum/1']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.getByText('courses')).toBeInTheDocument()
        expect(screen.getByText('forum_thread')).toBeInTheDocument()
      })
  
      it('renders Danish forum thread breadcrumbs', () => {
        useStore.setState({ breadcrumbs: [], lang: 'da' })
        render(
          <MemoryRouter initialEntries={['/forum/1']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.getByText('forum_thread')).toBeInTheDocument()
      })
  
      it('renders breadcrumbs for /courses', () => {
        useStore.setState({ breadcrumbs: [] })
        render(
          <MemoryRouter initialEntries={['/courses']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.getByText('dashboard')).toBeInTheDocument()
        expect(screen.getByText('courses')).toBeInTheDocument()
      })
  
      const routes = [
        { path: '/settings', label: 'settings' },
        { path: '/messages', label: 'messages' },
        { path: '/support', label: 'support' },
        { path: '/notifications', label: 'notifications' },
        { path: '/resources', label: 'resources' },
        { path: '/search', label: 'search_results' },
      ]
  
      routes.forEach(({ path, label }) => {
        it(`renders breadcrumbs for ${path}`, () => {
          useStore.setState({ breadcrumbs: [] })
          render(
            <MemoryRouter initialEntries={[path]}>
              <Topbar />
            </MemoryRouter>
          )
          expect(screen.getByText(label)).toBeInTheDocument()
        })
      })
  
      it('renders dynamic fallback for unknown paths', () => {
        useStore.setState({ breadcrumbs: [] })
        render(
          <MemoryRouter initialEntries={['/unknown/path']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.getByText('unknown')).toBeInTheDocument()
        expect(screen.getByText('path')).toBeInTheDocument()
      })
  
      it('prefers explicit store breadcrumbs over automatic fallback', () => {
        useStore.setState({
          breadcrumbs: [
            { label: 'Explicit Custom Crumb', href: '/custom' }
          ]
        })
        render(
          <MemoryRouter initialEntries={['/calendar']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.getByText('Explicit Custom Crumb')).toBeInTheDocument()
        expect(screen.queryByText('calendar')).not.toBeInTheDocument()
      })
  
      it('renders breadcrumbs when the pathname is exactly /courses', () => {
        useStore.setState({ breadcrumbs: [] })
        render(
          <MemoryRouter initialEntries={['/courses']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.getByText('dashboard')).toBeInTheDocument()
        expect(screen.getByText('courses')).toBeInTheDocument()
      })
    })
  
    it('navigates to settings when settings item is clicked in user menu', async () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      
      const profile = screen.getByLabelText('user_menu')
      fireEvent.click(profile)
      
      const settingsItem = screen.getByText('settings')
      fireEvent.click(settingsItem)
      expect(mockNavigate).toHaveBeenCalledWith('/settings')
      await waitFor(() => expect(screen.queryByText('logout')).not.toBeInTheDocument())
    })
  
    it('navigates to notifications when view_all is clicked in notifications dropdown', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      
      const bellBtn = screen.getByLabelText('notifications')
      fireEvent.click(bellBtn)
      
      const viewAllBtn = screen.getByText('view_all')
      fireEvent.click(viewAllBtn)
      expect(mockNavigate).toHaveBeenCalledWith('/notifications')
    })
  
  })
}
