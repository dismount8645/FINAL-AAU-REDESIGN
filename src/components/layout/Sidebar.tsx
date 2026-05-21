import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { type LucideIcon, House, CalendarDays, Library, Wrench, Star, CircleHelp, Settings, X, Globe } from 'lucide-react';
import { Text } from '@/components/ui/Typography';
import SegmentedControl from '@/components/ui/SegmentedControl';
import useStore from '@/store/useStore'
import Stack from '@/components/ui/Stack';

export default function Sidebar() {
  const { t, lang, setLang, isCollapsed, isMobile, isMobileOpen, closeSidebar } = useStore();
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
        <button
          className="fixed inset-0 bg-black/60 z-[var(--z-overlay)] backdrop-blur-sm animate-fade-in border-none outline-none focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-2 cursor-default"
          onClick={closeSidebar}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
      <aside
        ref={sidebarRef}
        id="sidebar"
        role={isMobileOpen ? "dialog" : undefined}
        aria-modal={isMobileOpen ? true : undefined}
        aria-label={t('navigation_menu')}
        className={`on-dark ${(isCollapsed && !isMobileOpen) ? 'collapsed' : ''} bg-[var(--bg-sidebar)] h-screen flex flex-col p-0 transition-all duration-300 ease-[var(--transition-ease)] border-r border-white/10 fixed top-0 left-0 z-[var(--z-fixed)] z-[var(--z-mobile-sidebar)] md:translate-x-0 ${isMobileOpen ? 'translate-x-0 shadow-[var(--shadow-xl)] w-[300px]' : 'translate-x-[-100%] overflow-hidden'} ${isCollapsed && !isMobileOpen ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'}`}
        style={{ maxWidth: 'calc(100vw - var(--sidebar-width))' }}
        data-collapsed={isCollapsed && !isMobileOpen}
      >

        <div className={`sidebar__header h-[var(--topbar-height)] flex items-center p-0 shrink-0 ${isMobileOpen ? 'justify-between pl-md pr-sm' : (isCollapsed ? 'justify-center' : 'justify-start pl-md')}`}>
          <NavLink to="/" className={`sidebar__branding flex items-center ${isMobileOpen ? 'justify-start' : (isCollapsed ? 'justify-center' : 'justify-start')} no-underline p-xs sm:p-sm rounded-[var(--radius-md)] transition-colors duration-150 hover:bg-white/5`}>
            <img
              src={logoSrc}
              alt={t('aau_logo_alt')}
              className={`sidebar__logo object-contain transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${(isCollapsed && !isMobileOpen) ? 'h-[var(--space-3xl)] w-[var(--space-3xl)]' : 'h-[var(--space-4xl)] w-auto'}`}
            />
          </NavLink>
          {isMobileOpen && (
            <button
              ref={closeButtonRef}
              onClick={closeSidebar}
              className="shrink-0 z-10 w-12 h-12 flex items-center justify-center text-white rounded-[var(--radius-lg)] transition-all active:scale-95 bg-white/40 hover:bg-white/50 border border-white/30 ring-1 ring-white/20 focus:bg-white/60 focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label={t('close')}
            >
              <X size={24} strokeWidth={2} />
            </button>
          )}
        </div>

        <nav className="sidebar__nav flex flex-col p-0 flex-1 overflow-hidden">
          <div className="sidebar__nav-main flex flex-col p-sm gap-2xs flex-1 overflow-hidden">
            <NavItem to="/" icon={House} label={t('dashboard')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
            <NavItem to="/calendar" icon={CalendarDays} label={t('calendar')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
            <NavItem to="/favorites" icon={Star} label={t('favorites')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
            <NavItem to="/courses" icon={Library} label={t('courses')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} isActiveOverride={isCourseActive} />
            <NavItem to="/resources" icon={Wrench} label={t('resources')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
          </div>

          <div className={`sidebar__nav-bottom flex flex-col p-sm pt-0 gap-2xs border-t border-white/10 pb-xl ${isCollapsed && !isMobileOpen ? 'items-center' : ''}`}>
            <NavItem to="/support" icon={CircleHelp} label={t('support')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
            <NavItem to="/settings" icon={Settings} label={t('settings')} onClick={closeSidebar} collapsed={isCollapsed && !isMobileOpen} />
            <div className="sidebar__divider h-px bg-white/10 my-xs w-full" />

            <div className={`sidebar__nav-controls flex flex-col gap-md pt-xs ${isCollapsed && !isMobileOpen ? 'w-full px-2xs' : ''}`}>
              {!isCollapsed || isMobileOpen ? (
                <Stack gap="xs">
                  <Stack direction="row" align="center" gap="xs" className="px-sm text-white/40">
                    <Globe size={14} strokeWidth={2} />
                    <Text size="2xs" weight="bold" className="uppercase tracking-wider">{t('cat_select_language')}</Text>
                  </Stack>
                  <SegmentedControl
                    options={[
                      { value: 'da', label: 'DA' },
                      { value: 'en', label: 'EN' }
                    ]}
                    value={lang}
                    onChange={(val) => setLang(val as 'da' | 'en')}
                    className="sidebar__segmented"
                  />
                </Stack>
              ) : (
                <Stack align="center" gap="md" className="py-sm">
                  <button
                    onClick={() => setLang(lang === 'da' ? 'en' : 'da')}
                    className="w-12 h-12 flex items-center justify-center rounded-[var(--radius-lg)] bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all font-bold text-xs shadow-[var(--shadow-sm)] active:scale-95 border border-white/5"
                    title={`${t('cat_select_language')}: ${lang.toUpperCase()}`}
                    aria-label={`${t('cat_select_language')}: ${lang.toUpperCase()}`}
                  >
                    {lang.toUpperCase()}
                  </button>
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
        return `sidebar__nav-item group relative flex items-center gap-[var(--space-md)] p-[var(--space-md)] h-[var(--space-3xl)] min-h-[var(--space-3xl)] text-white/60 no-underline rounded-[var(--radius-md)] transition-all duration-200 font-medium cursor-pointer text-left w-full focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none ${active ? 'active bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'} ${collapsed ? 'justify-center !px-0' : ''}`;
      }}
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => {
        const active = isActiveOverride !== undefined ? isActiveOverride : isActive;
        return (
          <>
            {active && (
              <div className="absolute left-[2px] top-[var(--space-sm)] bottom-[var(--space-sm)] w-[3px] bg-white rounded-[var(--radius-pill)] shadow-[0_0_10px_rgba(255,255,255,0.4)] z-10" />
            )}
            <Icon size={18} strokeWidth={2} className={`shrink-0 transition-transform duration-200 ${active ? 'scale-110 ml-[2px]' : 'group-hover:scale-110'}`} />
            {!collapsed && <span className="sidebar__nav-text whitespace-nowrap transition-opacity duration-150"><Text>{label}</Text></span>}
          </>
        );
      }}
    </NavLink>
  );
}
