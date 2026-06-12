


import { useState, useEffect, useRef } from 'react';
import { type LucideIcon, House, CalendarDays, Library, Wrench, Star, CircleHelp, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import useStore from '@/store';

export default function Sidebar() {
  const t = useStore(state => state.t);
  const isCollapsed = useStore(state => state.isCollapsed);
  const setCollapsed = useStore(state => state.setCollapsed);
  const location = useLocation();

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1280 : true);

  const sidebarRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Escape to collapse / close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isDesktop && !isCollapsed) {
          setCollapsed(true);
          // Return focus to hamburger
          setTimeout(() => {
            const btn = document.querySelector('button[aria-label*="sidebar"], button[aria-label*="menu"]');
            (btn as HTMLElement)?.focus();
          }, 50);
        } else if (isDesktop && (isHovered || isFocused)) {
          setIsFocused(false);
          setIsHovered(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDesktop, isCollapsed, isHovered, isFocused, setCollapsed]);

  // Scroll locking for drawer
  useEffect(() => {
    if (!isDesktop && !isCollapsed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDesktop, isCollapsed]);

  // Focus trap for drawer
  useEffect(() => {
    if (isDesktop || isCollapsed) return;

    // Move focus inside drawer
    const focusables = sidebarRef.current?.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables && focusables.length > 0) {
      (focusables[0] as HTMLElement).focus();
    }

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!sidebarRef.current) return;

      const items = sidebarRef.current.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!items || items.length === 0) return;

      const first = items[0] as HTMLElement;
      const last = items[items.length - 1] as HTMLElement;

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

    window.addEventListener('keydown', handleTabTrap);
    return () => window.removeEventListener('keydown', handleTabTrap);
  }, [isDesktop, isCollapsed]);

  // Focus return to hamburger button when drawer closes
  useEffect(() => {
    if (!isDesktop) {
      if (!isCollapsed) {
        wasOpen.current = true;
      } else if (isCollapsed && wasOpen.current) {
        wasOpen.current = false;
        setTimeout(() => {
          const btn = document.querySelector('button[aria-label*="sidebar"], button[aria-label*="menu"]');
          (btn as HTMLElement)?.focus();
        }, 50);
      }
    }
  }, [isCollapsed, isDesktop]);

  const handleNavItemClick = () => {
    if (!isDesktop) {
      setCollapsed(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
    }
  };

  const isHoveredOrFocused = isHovered || isFocused;
  const isExpanded = !isCollapsed || (isDesktop && isHoveredOrFocused);

  const logoSrc = !isExpanded
    ? t('aau_logo_center_src')
    : t('aau_logo_left_src');

  const isCourseActive = location.pathname.startsWith('/courses') || location.pathname.startsWith('/course/') || location.pathname.startsWith('/submission/') || location.pathname.startsWith('/forum/');

  return (
    <>
      {!isDesktop && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setCollapsed(true)}
          data-testid="sidebar-backdrop"
        />
      )}
      <aside
        ref={sidebarRef}
        id="sidebar"
        aria-label={t('navigation_menu')}
        className={`bg-bg-sidebar h-screen flex flex-col p-0 transition-all duration-200 ease-[var(--transition-ease)] border-r border-white/10 fixed top-0 left-0 z-50 ${isDesktop ? (isExpanded ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-collapsed-width)]') : 'w-[var(--sidebar-width)]'}`}
        style={{
          maxWidth: '100dvw',
          transform: !isDesktop && isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
          boxShadow: isDesktop && isExpanded && isCollapsed ? 'var(--shadow-lg)' : 'none',
        }}
        data-collapsed={isCollapsed}
        onMouseEnter={() => isDesktop && setIsHovered(true)}
        onMouseLeave={() => isDesktop && setIsHovered(false)}
        onFocus={() => isDesktop && setIsFocused(true)}
        onBlur={handleBlur}
      >

        <div className={`h-[var(--topbar-height)] flex items-center p-0 shrink-0 ${!isExpanded ? 'justify-center' : 'justify-start pl-md'}`}>
          <NavLink to="/" onClick={handleNavItemClick} className={`flex items-center ${!isExpanded ? 'justify-center' : 'justify-start'} no-underline p-xs sm:p-sm rounded-md transition-colors duration-150 hover:bg-white/5`}>
            <img
              src={logoSrc}
              alt={t('aau_logo_alt')}
              className={`object-contain transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${!isExpanded ? 'h-[var(--space-3xl)] w-[var(--space-3xl)]' : 'h-[var(--space-4xl)] w-auto aspect-[4/1]'}`}
            />
          </NavLink>
        </div>

        <nav className="flex flex-col p-0 flex-1 overflow-hidden">
          <div className="flex flex-col p-sm gap-2xs flex-1 overflow-hidden">
            <NavItem to="/" icon={House} label={t('dashboard')} collapsed={!isExpanded} onClick={handleNavItemClick} />
            <NavItem to="/calendar" icon={CalendarDays} label={t('calendar')} collapsed={!isExpanded} onClick={handleNavItemClick} />
            <NavItem to="/favorites" icon={Star} label={t('favorites')} collapsed={!isExpanded} onClick={handleNavItemClick} />
            <NavItem to="/courses" icon={Library} label={t('courses')} collapsed={!isExpanded} isActiveOverride={isCourseActive} onClick={handleNavItemClick} />
            <NavItem to="/resources" icon={Wrench} label={t('resources')} collapsed={!isExpanded} onClick={handleNavItemClick} />
          </div>

          <div className={`flex flex-col p-sm pt-0 gap-2xs border-t border-white/10 pb-xl ${!isExpanded ? 'items-center' : ''}`}>
            <NavItem to="/support" icon={CircleHelp} label={t('support')} collapsed={!isExpanded} dimmed onClick={handleNavItemClick} />
            <NavItem to="/settings" icon={Settings} label={t('settings')} collapsed={!isExpanded} dimmed onClick={handleNavItemClick} />
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
  dimmed?: boolean;
}

function NavItem({ to, icon: Icon, label, onClick, collapsed, isActiveOverride, dimmed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) => {
        const active = isActiveOverride !== undefined ? isActiveOverride : isActive;
        const opacityClass = dimmed ? 'opacity-70' : '';
        return `nav-item group relative flex items-center gap-[6px] p-sm h-[var(--space-3xl)] min-h-[var(--space-3xl)] no-underline rounded-md cursor-pointer text-left w-full focus-visible:outline-none ${active ? 'active' : ''} ${collapsed ? 'justify-center !px-0' : ''} ${opacityClass}`;
      }}
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => {
        const active = isActiveOverride !== undefined ? isActiveOverride : isActive;
        return (
          <>
            <Icon size={20} strokeWidth={2.5} className={`shrink-0 transition-transform duration-150 ease-[var(--transition-ease)] ${active ? 'scale-110 translate-x-1' : 'group-hover:scale-110'}`} />
            {!collapsed && <span className="whitespace-nowrap transition-opacity duration-150 tracking-tight text-sm">{label}</span>}
          </>
        );
      }}
    </NavLink>
  );
}

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach, afterEach } = await import('vitest')
  const { MemoryRouter } = await import('react-router-dom')

  describe('Sidebar', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      useStore.setState({
        isCollapsed: false,
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
  
    // Language switcher relocated to Topbar
  })
}
