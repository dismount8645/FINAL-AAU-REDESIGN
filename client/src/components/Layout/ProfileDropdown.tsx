import { User, Settings, LogOut, Globe, Sun, Moon, Monitor, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Text, Dropdown, MasterItem } from '@/components/ui';
import useStore from '@/store';
import { cn } from '@/lib/utils';
import { PATHS } from '@/routes';

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const t = useStore((state) => state.t);
  const firstName = useStore((state) => state.firstName);
  const lastName = useStore((state) => state.lastName);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const lang = useStore((state) => state.lang);
  const setLang = useStore((state) => state.setLang);

  return (
    <Dropdown className="ml-2">
      <Dropdown.Trigger>
        {({ ref, onKeyDown, onClick }, { isOpen }) => (
          <button
            ref={ref as any}
            onKeyDown={onKeyDown}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:shadow-focus"
            aria-label={t('user_menu')}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            type="button"
          >
            <div className={cn(
              "absolute inset-0 rounded-full transition-colors duration-150",
              isOpen
                ? "bg-primary/10 border-primary dark:bg-white/15 dark:border-white"
                : "bg-bg-highlight border-border group-hover:border-primary"
            )} />
            <User
              size={22}
              strokeWidth={2.5}
              className={cn(
                "relative z-10 transition-colors duration-150",
                isOpen ? "text-primary dark:text-white" : "text-main group-hover:text-primary"
              )}
            />
          </button>
        )}
      </Dropdown.Trigger>
      <Dropdown.Menu className="min-w-[240px] max-w-[calc(100dvw-1rem)] overflow-hidden">
        <div className="p-4 bg-bg-highlight/50 border-b border-border">
          <Text size="sm" weight="bold" className="text-main leading-none">
            {`${firstName} ${lastName}`}
          </Text>
          <Text size="xs" muted className="mt-1 font-bold opacity-60 italic">
            {t('common.user_role') || 'Studerende'}
          </Text>
        </div>

        <div role="none" className="py-2">
          <Dropdown.Item onClick={() => navigate(`${PATHS.SETTINGS}?tab=profil`)}>
            <MasterItem
              leading={User}
              leadingClassName="text-primary"
              title={t('profile')}
            />
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate(PATHS.SETTINGS)}>
            <MasterItem
              leading={Settings}
              leadingClassName="text-primary"
              title={t('settings')}
            />
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate(PATHS.MESSAGES)}>
            <MasterItem
              leading={Mail}
              leadingClassName="text-primary"
              title={t('nav.messages')}
            />
          </Dropdown.Item>
        </div>

        <div role="none" className="py-2 border-t border-border">
          <Dropdown.Item onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}>
            <MasterItem
              leading={theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor}
              leadingClassName="text-primary"
              title={`${t('appearance')}: ${t('theme.' + theme)}`}
            />
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setLang(lang === 'da' ? 'en' : 'da')}>
            <MasterItem
              leading={Globe}
              leadingClassName="text-primary"
              title={`${t('cat_select_language')}: ${lang.toUpperCase()}`}
            />
          </Dropdown.Item>
        </div>

        <div role="none" className="border-t border-border bg-danger/[0.02] py-2">
          <Dropdown.Item onClick={() => {}}>
            <MasterItem
              leading={LogOut}
              leadingClassName="text-danger"
              title={t('logout')}
            />
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

