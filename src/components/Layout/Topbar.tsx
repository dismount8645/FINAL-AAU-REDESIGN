import { Fragment } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, AlignJustify, ChevronRight, Sun, Moon, Monitor } from 'lucide-react';
import { Link, useLocation, MemoryRouter } from 'react-router-dom';
import { MessagesDropdown } from '../Messages';
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
  const isMobile = useStore(state => state.isMobile);
  const isMobileOpen = useStore(state => state.isMobileOpen);
  const toggleSidebar = useStore(state => state.toggleSidebar);
  const t = useStore(state => state.t);
  const lang = useStore(state => state.lang);
  const courses = useStore(state => state.courses);
  const breadcrumbs = useStore(state => state.breadcrumbs);
  const theme = useStore(state => state.theme);
  const setTheme = useStore(state => state.setTheme);

  const activeBreadcrumbs = (breadcrumbs && breadcrumbs.length > 0)
    ? breadcrumbs
    : getAutomaticBreadcrumbs(location.pathname, lang, courses, t);

  /* istanbul ignore next */
  const sidebarIcon = (isCollapsed || (isMobile && !isMobileOpen)) ? <Menu size={20} strokeWidth={2} /> : isMobileOpen ? <X size={20} strokeWidth={2} /> : <AlignJustify size={20} strokeWidth={2} />;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-[var(--topbar-height)] bg-bg-topbar backdrop-blur-[12px] saturate-[180%] flex items-center z-[var(--z-sticky)] border-b border-border transition-all duration-300 ease-in-out w-full pr-[var(--space-md)] ${
        isMobile
          ? 'pl-[var(--space-md)]'
          : isCollapsed
          ? 'pl-[calc(var(--sidebar-collapsed-width)+var(--space-md))]'
          : 'pl-[calc(var(--sidebar-width)+var(--space-md))]'
      }`}
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
          {activeBreadcrumbs && activeBreadcrumbs.length > 0 && !isMobile && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="hidden md:flex flex-row items-center flex-wrap gap-2xs ml-sm"
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
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
          className="group w-11 h-11 text-text-main bg-transparent hover:bg-bg-highlight dark:hover:bg-white/10 hover:text-primary active:scale-[0.95] rounded-lg border-none focus-visible:outline-none focus-visible:shadow-focus"
          title={`${t('appearance')}: ${t('theme.' + theme)}`}
          aria-label={`${t('appearance')}: ${t('theme.' + theme)}`}
          type="button"
        >
          <span className="transition-transform duration-300 group-hover:rotate-[15deg]">
            {theme === 'dark' ? <Moon size={20} strokeWidth={2} /> : theme === 'light' ? <Sun size={20} strokeWidth={2} /> : <div title={t('theme.system')}><Monitor size={20} strokeWidth={2} /></div>}
          </span>
        </Button>

        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* Messages Dropdown */}
        <MessagesDropdown />

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </TopbarSearch>
    </nav>
  );
}

let mockNavigate: ReturnType<typeof vi.fn>
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
      vi.clearAllMocks()
      useStore.setState({
        theme: 'system',
        isDarkMode: false,
        lang: 'da',
        t: (key: string) => key,
        isCollapsed: false,
        isMobile: false,
        isMobileOpen: false,
        courses: [
          { id: 1, title: 'Digital Design og Kommunikation', code: 'DDK1' }
        ] as any,
        notificationCount: 2,
      })
    })
  
    it('renders search input and trigger buttons', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      expect(screen.getByPlaceholderText('search_placeholder')).toBeInTheDocument()
      expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0)
    })
  
    it('toggles sidebar when hamburger is clicked', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const hamburger = screen.getByLabelText('toggle_sidebar')
      fireEvent.click(hamburger)
      expect(useStore.getState().isCollapsed).toBe(true)
    })
  
    it('updates search query and shows dropdown', async () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const input = document.querySelector('.topbar__search-wrapper input')
      fireEvent.change(input!, { target: { value: 'Digital' } })
      
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
  
    it('toggles mobile search overlay', () => {
      useStore.setState({ isMobile: true })
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const trigger = document.querySelector('.topbar__mobile-search-trigger')
      fireEvent.click(trigger!)
      
      const overlay = document.querySelector('.topbar__mobile-search-overlay')
      expect(overlay).toBeInTheDocument()
      
      const closeBtn = overlay!.querySelector('button[aria-label="close"]')
      fireEvent.click(closeBtn!)
      expect(document.querySelector('.topbar__mobile-search-overlay')).not.toBeInTheDocument()
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
  
    it('opens messages dropdown when mail is clicked', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      
      const mailBtn = screen.getByLabelText('messages')
      fireEvent.click(mailBtn)
      
      expect(screen.getByText(/view_all/i)).toBeInTheDocument()
      expect(screen.getByText('Mette Jensen')).toBeInTheDocument()
    })
  
    it('navigates to messages when a message is clicked', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      
      const mailBtn = screen.getByLabelText('messages')
      fireEvent.click(mailBtn)
      
      const messageItem = screen.getByText('Mette Jensen')
      fireEvent.click(messageItem)
      
      expect(mockNavigate).toHaveBeenCalledWith('/messages')
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
      expect(profileItem.closest('a')).toHaveAttribute('href', '/settings?tab=profil')
      fireEvent.click(profileItem)
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
      expect(screen.getByText('no_search_results')).toBeInTheDocument()
    })
  
    it('handles mobile search overlay input change', () => {
      useStore.setState({ isMobile: true })
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const trigger = document.querySelector('.topbar__mobile-search-trigger')
      fireEvent.click(trigger!)
      
      const overlayInput = document.querySelector('.topbar__mobile-search-overlay input') as HTMLInputElement
      fireEvent.change(overlayInput, { target: { value: 'Mobile' } })
      expect(overlayInput.value).toBe('Mobile')
    })
  
    it('closes dropdown when clicking outside', async () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const input = document.querySelector('.topbar__search-wrapper input')
      fireEvent.change(input!, { target: { value: 'Digital' } })
      expect(screen.getByText(/1 search_results_singular/i)).toBeInTheDocument()
      
      fireEvent.mouseDown(document.body)
      await waitFor(() => {
        expect(screen.queryByText(/1 search_results_singular/i)).not.toBeInTheDocument()
      })
    })
  
    it('closes mobile search overlay when clicking outside', () => {
      useStore.setState({ isMobile: true })
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const trigger = document.querySelector('.topbar__mobile-search-trigger')
      fireEvent.click(trigger!)
      const overlay = document.querySelector('.topbar__mobile-search-overlay')
      expect(overlay).toBeInTheDocument()
      fireEvent.mouseDown(document.body)
      expect(document.querySelector('.topbar__mobile-search-overlay')).not.toBeInTheDocument()
    })
  
    it('renders with mobile layout styles when isMobile is true', () => {
      useStore.setState({ isMobile: true, isMobileOpen: false })
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const nav = screen.getAllByRole('navigation')[0]
      expect(nav.className).toContain('pl-[var(--space-md)]')
    })
  
    it('renders with collapsed sidebar padding', () => {
      useStore.setState({ isCollapsed: true, isMobile: false })
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const nav = screen.getAllByRole('navigation')[0]
      expect(nav.className).toContain('pl-[calc(var(--sidebar-collapsed-width)+var(--space-md))]')
    })
  
    it('cycles theme when theme toggle is clicked', () => {
      useStore.setState({ theme: 'light' })
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const themeBtn = screen.getByLabelText(/appearance:/i)
      expect(themeBtn).toBeInTheDocument()
  
      fireEvent.click(themeBtn)
      expect(useStore.getState().theme).toBe('system')
  
      fireEvent.click(themeBtn)
      expect(useStore.getState().theme).toBe('dark')
  
      fireEvent.click(themeBtn)
      expect(useStore.getState().theme).toBe('light')
    })
  
    it('toggles sidebar in mobile mode via hamburger', () => {
      const toggleSidebar = vi.fn()
      useStore.setState({ isMobile: true, isMobileOpen: false, toggleSidebar })
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const hamburger = screen.getByLabelText('toggle_sidebar')
      fireEvent.click(hamburger)
      expect(toggleSidebar).toHaveBeenCalled()
    })
  
    it('does not close dropdown when clicking inside search', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const input = document.querySelector('.topbar__search-wrapper input')
      fireEvent.change(input!, { target: { value: 'Digital' } })
      expect(screen.getByText(/1 search_results_singular/i)).toBeInTheDocument()
  
      fireEvent.mouseDown(input!)
      expect(screen.getByText(/1 search_results_singular/i)).toBeInTheDocument()
    })
  
    it('closes mobile search overlay on ESC', () => {
      useStore.setState({ isMobile: true })
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      const trigger = document.querySelector('.topbar__mobile-search-trigger')
      fireEvent.click(trigger!)
      const overlay = document.querySelector('.topbar__mobile-search-overlay')
      expect(overlay).toBeInTheDocument()
  
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(document.querySelector('.topbar__mobile-search-overlay')).not.toBeInTheDocument()
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
        { path: '/grades', label: 'my_grades' },
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
  
      it('hides breadcrumbs on mobile when too many', () => {
        useStore.setState({ isMobile: true, breadcrumbs: [] })
        render(
          <MemoryRouter initialEntries={['/random/very/long/path/with/many/segments']}>
            <Topbar />
          </MemoryRouter>
        )
        expect(screen.queryByText('dashboard')).not.toBeInTheDocument()
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
      expect(settingsItem.closest('a')).toHaveAttribute('href', '/settings')
      fireEvent.click(settingsItem)
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
  
    it('navigates to messages when view_all is clicked in messages dropdown', () => {
      render(
        <MemoryRouter>
          <Topbar />
        </MemoryRouter>
      )
      
      const mailBtn = screen.getByLabelText('messages')
      fireEvent.click(mailBtn)
      
      const viewAllBtn = screen.getByText('view_all')
      fireEvent.click(viewAllBtn)
      expect(mockNavigate).toHaveBeenCalledWith('/messages')
    })
  })
}
