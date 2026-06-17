import { Fragment, useState, useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, AlignJustify, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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

