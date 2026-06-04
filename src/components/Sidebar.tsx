import { useEffect, useRef } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { type LucideIcon, House, CalendarDays, Library, Wrench, Star, CircleHelp, Settings, X, Globe } from 'lucide-react';
import { NavLink, useLocation, MemoryRouter } from 'react-router-dom';
import Button from '@/components/ui/Button';
import SegmentedControl from '@/components/SegmentedControl';
import { Stack } from '@/components/LayoutPrimitives';
import useStore from '@/lib/store';

export default function Sidebar() {
  const t = useStore(state => state.t);
  const lang = useStore(state => state.lang);
  const setLang = useStore(state => state.setLang);
  const isCollapsed = useStore(state => state.isCollapsed);
  const isMobile = useStore(state => state.isMobile);
  const isMobileOpen = useStore(state => state.isMobileOpen);
  const closeSidebar = useStore(state => state.closeSidebar);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (isMobileOpen) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 300);
    }
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobile || !isMobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSidebar();
        e.preventDefault();
        return;
      }

      if (e.key !== 'Tab') return;
      if (!sidebarRef.current) return;

      const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (!sidebarRef.current.contains(document.activeElement)) {
        first.focus();
        e.preventDefault();
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isMobileOpen, closeSidebar]);

  const logoSrc = (isCollapsed && !isMobileOpen)
    ? t('aau_logo_center_src')
    : t('aau_logo_left_src');

  const isCourseActive = location.pathname.startsWith('/courses') || location.pathname.startsWith('/course/') || location.pathname.startsWith('/submission/') || location.pathname.startsWith('/forum/');

  return (
    <>
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[var(--z-overlay)] backdrop-blur-sm animate-fade-in cursor-default"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        ref={sidebarRef}
        id="sidebar"
        role={isMobileOpen ? "dialog" : undefined}
        aria-modal={isMobileOpen ? true : undefined}
        aria-label={t('navigation_menu')}
        className={`bg-bg-sidebar h-screen flex flex-col p-0 transition-all duration-300 ease-[var(--transition-ease)] border-r border-white/10 fixed top-0 left-0 z-[var(--z-mobile-sidebar)] md:translate-x-0 ${isMobileOpen ? 'translate-x-0 shadow-xl w-[300px]' : 'translate-x-[-100%] overflow-hidden'} ${isCollapsed && !isMobileOpen ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'}`}
        style={{ maxWidth: '100dvw' }}
        data-collapsed={isCollapsed && !isMobileOpen}
      >

        <div className={`h-[var(--topbar-height)] flex items-center p-0 shrink-0 ${isMobileOpen ? 'justify-between pl-md pr-sm' : (isCollapsed ? 'justify-center' : 'justify-start pl-md')}`}>
          <NavLink to="/" className={`flex items-center ${isMobileOpen ? 'justify-start' : (isCollapsed ? 'justify-center' : 'justify-start')} no-underline p-xs sm:p-sm rounded-md transition-colors duration-150 hover:bg-white/5`}>
            <img
              src={logoSrc}
              alt={t('aau_logo_alt')}
               className={`object-contain transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${(isCollapsed && !isMobileOpen) ? 'h-[var(--space-3xl)] w-[var(--space-3xl)]' : 'h-[var(--space-4xl)] w-auto aspect-[4/1]'}`}
            />
          </NavLink>
          {isMobileOpen && (
            <Button
              ref={closeButtonRef}
              onClick={closeSidebar}
              variant="outline"
              size="icon"
              className="shrink-0 z-10 text-white rounded-lg border-white/30 bg-white/40 hover:bg-white/50 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:shadow-focus"
              aria-label={t('close')}
            >
              <X size={24} strokeWidth={2} />
            </Button>
          )}
        </div>

        <nav className="flex flex-col p-0 flex-1 overflow-hidden">
          <div className="flex flex-col p-sm gap-2xs flex-1 overflow-hidden">
            <NavItem to="/" icon={House} label={t('dashboard')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
            <NavItem to="/calendar" icon={CalendarDays} label={t('calendar')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
            <NavItem to="/favorites" icon={Star} label={t('favorites')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
            <NavItem to="/courses" icon={Library} label={t('courses')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} isActiveOverride={isCourseActive} />
            <NavItem to="/resources" icon={Wrench} label={t('resources')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
          </div>

          <div className={`flex flex-col p-sm pt-0 gap-2xs border-t border-white/10 pb-xl ${isCollapsed && !isMobileOpen ? 'items-center' : ''}`}>
            <NavItem to="/support" icon={CircleHelp} label={t('support')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
            <NavItem to="/settings" icon={Settings} label={t('settings')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
            <div className="h-px bg-white/10 my-xs w-full" />

            <div className={`flex flex-col gap-md pt-xs ${isCollapsed && !isMobileOpen ? 'w-full px-2xs' : ''}`}>
              {!isCollapsed || isMobileOpen ? (
                <Stack gap="xs">
                  <Stack direction="row" align="center" gap="xs" className="px-sm text-white/60">
                    <Globe size={14} strokeWidth={2} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('cat_select_language')}</span>
                  </Stack>
                  <SegmentedControl
                    options={[
                      { value: 'da', label: 'DA' },
                      { value: 'en', label: 'EN' }
                    ]}
                    value={lang}
                    onChange={(val) => setLang(val as 'da' | 'en')}
                  />
                </Stack>
              ) : (
                <Stack align="center" gap="md" className="py-sm">
                  <Button
                    onClick={() => setLang(lang === 'da' ? 'en' : 'da')}
                    size="icon"
                    className="bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5 text-xs font-bold font-sans tracking-normal uppercase shadow-sm"
                    title={`${t('cat_select_language')}: ${lang.toUpperCase()}`}
                    aria-label={`${t('cat_select_language')}: ${lang.toUpperCase()}`}
                  >
                    {lang.toUpperCase()}
                  </Button>
                </Stack>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  collapsed?: boolean;
  isActiveOverride?: boolean;
}

function NavItem({ to, icon: Icon, label, onClick, collapsed, isActiveOverride }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) => {
        const active = isActiveOverride !== undefined ? isActiveOverride : isActive;
        return `group relative flex items-center gap-[6px] p-md h-[var(--space-3xl)] min-h-[var(--space-3xl)] text-white/85 no-underline rounded-md transition-all duration-150 ease-[var(--transition-ease)] font-bold cursor-pointer text-left w-full focus-visible:outline-none focus-visible:shadow-focus ${active ? 'active bg-white/15 text-white shadow-lg shadow-black/20' : 'hover:bg-white/10 hover:text-white'} ${collapsed ? 'justify-center !px-0' : ''}`;
      }}
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => {
        const active = isActiveOverride !== undefined ? isActiveOverride : isActive;
        return (
          <>
            {active && (
              <div className="absolute left-0 top-sm bottom-sm w-[4px] bg-white rounded-r-pill shadow-[0_0_15px_rgba(255,255,255,0.6)] z-10" />
            )}
            <Icon size={20} strokeWidth={2.5} className={`shrink-0 transition-transform duration-150 ease-[var(--transition-ease)] ${active ? 'scale-110 translate-x-1' : 'group-hover:scale-110'}`} />
            {!collapsed && <span className="whitespace-nowrap transition-opacity duration-150 tracking-tight text-sm font-bold">{label}</span>}
          </>
        );
      }}
    </NavLink>
  );
}

if (import.meta.vitest) {
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
              ? '/images/logos/aau-center-white.webp'
              : '/images/logos/aau-center-white-uk.webp'
          }
          if (key === 'aau_logo_left_src') {
            return useStore.getState().lang === 'da'
              ? '/images/logos/aau-left-white.webp'
              : '/images/logos/aau-left-white-uk.webp'
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
      expect(aside?.getAttribute('data-collapsed')).toBe('true')
    })
  
    it('changes logo based on language', () => {
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      )
      const logo = screen.getByAltText('aau_logo_alt')
      expect(logo.getAttribute('src')).toContain('aau-left-white.webp')
    })
  
    it('renders collapsed logo (symbol)', () => {
      useStore.setState({ isCollapsed: true, lang: 'da' })
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      )
      const logo = screen.getByAltText('aau_logo_alt')
      expect(logo.getAttribute('src')).toContain('aau-center-white.webp')
    })
  
    it('renders collapsed EN logo', () => {
      useStore.setState({ isCollapsed: true, lang: 'en' })
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      )
      const logo = screen.getByAltText('aau_logo_alt')
      expect(logo.getAttribute('src')).toContain('aau-center-white-uk.webp')
    })
  
    it('renders expanded EN logo', () => {
      useStore.setState({ isCollapsed: false, lang: 'en' })
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      )
      const logo = screen.getByAltText('aau_logo_alt')
      expect(logo.getAttribute('src')).toContain('aau-left-white-uk.webp')
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
}
