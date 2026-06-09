


import { type LucideIcon, House, CalendarDays, Library, Wrench, Star, CircleHelp, Settings, Globe } from 'lucide-react';
import { NavLink, useLocation, MemoryRouter } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store';

export default function Sidebar() {
  const t = useStore(state => state.t);
  const lang = useStore(state => state.lang);
  const setLang = useStore(state => state.setLang);
  const isCollapsed = useStore(state => state.isCollapsed);
  const location = useLocation();

  const logoSrc = isCollapsed
    ? t('aau_logo_center_src')
    : t('aau_logo_left_src');

  const isCourseActive = location.pathname.startsWith('/courses') || location.pathname.startsWith('/course/') || location.pathname.startsWith('/submission/') || location.pathname.startsWith('/forum/');

  return (
    <>
      <aside
        id="sidebar"
        aria-label={t('navigation_menu')}
        className={`bg-bg-sidebar h-screen flex flex-col p-0 transition-all duration-300 ease-[var(--transition-ease)] border-r border-white/10 fixed top-0 left-0 z-50 ${isCollapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'}`}
        style={{ maxWidth: '100dvw' }}
        data-collapsed={isCollapsed}
      >

        <div className={`h-[var(--topbar-height)] flex items-center p-0 shrink-0 ${isCollapsed ? 'justify-center' : 'justify-start pl-md'}`}>
          <NavLink to="/" className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} no-underline p-xs sm:p-sm rounded-md transition-colors duration-150 hover:bg-white/5`}>
            <img
              src={logoSrc}
              alt={t('aau_logo_alt')}
               className={`object-contain transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${isCollapsed ? 'h-[var(--space-3xl)] w-[var(--space-3xl)]' : 'h-[var(--space-4xl)] w-auto aspect-[4/1]'}`}
            />
          </NavLink>
        </div>

        <nav className="flex flex-col p-0 flex-1 overflow-hidden">
          <div className="flex flex-col p-sm gap-2xs flex-1 overflow-hidden">
            <NavItem to="/" icon={House} label={t('dashboard')} collapsed={isCollapsed} />
            <NavItem to="/calendar" icon={CalendarDays} label={t('calendar')} collapsed={isCollapsed} />
            <NavItem to="/favorites" icon={Star} label={t('favorites')} collapsed={isCollapsed} />
            <NavItem to="/courses" icon={Library} label={t('courses')} collapsed={isCollapsed} isActiveOverride={isCourseActive} />
            <NavItem to="/resources" icon={Wrench} label={t('resources')} collapsed={isCollapsed} />
          </div>

          <div className={`flex flex-col p-sm pt-0 gap-2xs border-t border-white/10 pb-xl ${isCollapsed ? 'items-center' : ''}`}>
            <NavItem to="/support" icon={CircleHelp} label={t('support')} collapsed={isCollapsed} />
            <NavItem to="/settings" icon={Settings} label={t('settings')} collapsed={isCollapsed} />
            <div className="h-px bg-white/10 my-xs w-full" />

            <div className={`flex flex-col gap-md pt-xs ${isCollapsed ? 'w-full px-2xs' : ''}`}>
              {!isCollapsed ? (
                <Stack gap="xs">
                  <Stack direction="row" align="center" gap="xs" className="px-sm text-white/60">
                    <Globe size={14} strokeWidth={2} />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('cat_select_language')}</span>
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
        return `group relative flex items-center gap-[6px] p-sm h-[var(--space-3xl)] min-h-[var(--space-3xl)] text-white/85 no-underline rounded-md transition-all duration-150 ease-[var(--transition-ease)] font-bold cursor-pointer text-left w-full focus-visible:outline-none focus-visible:shadow-focus ${active ? 'active bg-white/10 text-white' : 'hover:bg-white/10 hover:text-white'} ${collapsed ? 'justify-center !px-0' : ''}`;
      }}
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => {
        const active = isActiveOverride !== undefined ? isActiveOverride : isActive;
        return (
          <>
            {active && (
              <div className="absolute left-0 top-xs bottom-xs w-[3px] bg-white rounded-r-pill shadow-[0_0_15px_rgba(255,255,255,0.6)] z-10" />
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
