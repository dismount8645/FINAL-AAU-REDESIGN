import { Link, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { Menu, X, AlignJustify, ChevronRight, Sun, Moon, Monitor } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Text } from '@/components/ui/Typography';
import useStore from '@/store/useStore';
import NotificationsDropdown from './NotificationsDropdown';
import MessagesDropdown from './MessagesDropdown';
import ProfileDropdown from './ProfileDropdown';
import TopbarSearch from './TopbarSearch';

import { getAutomaticBreadcrumbs } from '@/utils/breadcrumbs';

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
      className={`fixed top-0 left-0 right-0 h-[var(--topbar-height)] bg-[var(--bg-topbar)] backdrop-blur-[12px] saturate-[180%] flex items-center z-[var(--z-sticky)] border-b border-border transition-all duration-300 ease-in-out w-full pr-[var(--space-md)] ${
        isMobile
          ? 'pl-[var(--space-md)]'
          : isCollapsed
          ? 'pl-[calc(var(--sidebar-collapsed-width)+var(--space-md))]'
          : 'pl-[calc(var(--sidebar-width)+var(--space-md))]'
      }`}
    >
      <div className="flex items-center shrink-0 gap-sm">
        <button
          className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-lg)] text-[var(--text-main)] dark:text-white transition-all duration-200 hover:bg-[var(--bg-highlight)] dark:hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:shadow-focus"
          onClick={toggleSidebar}
          aria-label={t('toggle_sidebar')}
          type="button"
        >
          {sidebarIcon}
        </button>

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
                  {idx > 0 && <ChevronRight size={14} strokeWidth={2.5} className="shrink-0 opacity-40 text-[var(--text-muted)]" />}
                  {crumb.href ? (
                    <Link to={crumb.href} className="text-[var(--text-muted)] hover:text-[var(--aau-blue)] transition-colors font-bold uppercase tracking-tighter">
                      <Text size="xs">{crumb.label}</Text>
                    </Link>
                  ) : (
                    <Text weight="black" size="xs" className="text-[var(--text-main)] uppercase tracking-tight">{crumb.label}</Text>
                  )}
                </Fragment>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <TopbarSearch>
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
          className="group w-11 h-11 flex items-center justify-center rounded-[var(--radius-lg)] text-[var(--text-main)] hover:bg-[var(--bg-highlight)] dark:hover:bg-white/10 hover:text-[var(--aau-blue)] transition-all active:scale-95 focus-visible:outline-none focus-visible:shadow-focus"
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
