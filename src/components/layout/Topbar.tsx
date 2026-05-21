import { Link, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { Menu, X, AlignJustify, ChevronRight, Sun, Moon, Monitor } from 'lucide-react';
import useStore from '@/store/useStore';
import NotificationsDropdown from './NotificationsDropdown';
import MessagesDropdown from './MessagesDropdown';
import ProfileDropdown from './ProfileDropdown';
import TopbarSearch from './TopbarSearch';

import { getAutomaticBreadcrumbs } from '@/utils/breadcrumbs';


export default function Topbar() {
  const location = useLocation();
  const { isCollapsed, isMobile, isMobileOpen, toggleSidebar, t, lang, courses, breadcrumbs, theme, setTheme } = useStore();
  const activeBreadcrumbs = (breadcrumbs && breadcrumbs.length > 0)
    ? breadcrumbs
    : getAutomaticBreadcrumbs(location.pathname, lang, courses, t);

  /* istanbul ignore next */
  const sidebarIcon = (isCollapsed || (isMobile && !isMobileOpen)) ? <Menu size={20} strokeWidth={2} /> : isMobileOpen ? <X size={20} strokeWidth={2} /> : <AlignJustify size={20} strokeWidth={2} />;

  return (
    <nav
      className="topbar fixed top-0 left-0 right-0 h-[var(--topbar-height)] bg-[var(--bg-topbar)] backdrop-blur-[12px] saturate-[180%] backdrop-blur-sm saturate-100 flex items-center z-[var(--z-sticky)] border-b border-border transition-all duration-300 ease-in-out w-full"
      style={{ 
        paddingLeft: `calc(${isMobile ? 'var(--space-md)' : (isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)')} + var(--space-md))`, 
        paddingRight: 'var(--space-md)' 
      }}
    >
      <div className="topbar__left-section flex items-center shrink-0 gap-sm">
        <button
          className="topbar__hamburger w-11 h-11 flex items-center justify-center rounded-[var(--radius-lg)] text-main dark:text-white transition-all duration-200 hover:bg-bg-hover dark:hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:shadow-focus"
          onClick={toggleSidebar}
          aria-label={t('toggle_sidebar')}
          type="button"
        >
          {sidebarIcon}
        </button>

        {activeBreadcrumbs && activeBreadcrumbs.length > 0 && (
          <nav className={`flex flex-row items-center flex-wrap gap-[var(--space-2xs)] text-sm text-slate-500 dark:text-slate-400 ml-[var(--space-sm)] hidden md:flex animate-fade-in ${isMobile ? 'hidden' : ''}`}>

            {activeBreadcrumbs.map((crumb, idx) => (
              <Fragment key={idx}>
                {idx > 0 && <ChevronRight size={14} strokeWidth={2} className="shrink-0 opacity-60 text-slate-400 dark:text-slate-500" />}
                {crumb.href ? (
                  <Link to={crumb.href} className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors font-medium">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-800 dark:text-slate-100 font-semibold">{crumb.label}</span>
                )}
              </Fragment>
            ))}
          </nav>
        )}
      </div>

      <TopbarSearch>
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
          className="topbar__trigger-btn group w-11 h-11 flex items-center justify-center rounded-[var(--radius-lg)] text-slate-600 dark:text-slate-200 hover:bg-bg-hover dark:hover:bg-white/10 hover:text-primary transition-all active:scale-95 focus-visible:outline-none focus-visible:shadow-focus"
          title={`${t('appearance')}: ${theme}`}
          aria-label={`${t('appearance')}: ${theme}`}
          type="button"
        >
          <span className="transition-transform duration-300 group-hover:rotate-[15deg]">
            {theme === 'dark' ? <Moon size={20} strokeWidth={2} /> : theme === 'light' ? <Sun size={20} strokeWidth={2} /> : <Monitor size={20} strokeWidth={2} />}
          </span>
        </button>

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
