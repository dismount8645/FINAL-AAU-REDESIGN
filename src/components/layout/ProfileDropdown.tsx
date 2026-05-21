import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { Text } from '@/components/ui/Typography';
import useStore from '@/store/useStore';

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const { t } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="topbar__profile-wrapper relative ml-xs" ref={dropdownRef}>
      <button
        className="topbar__profile-trigger group focus-visible:outline-none focus-visible:shadow-focus"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label={t('user_menu')}
        type="button"
      >
        <div className="topbar__profile-avatar w-11 h-11 rounded-[var(--radius-pill)] bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-200 border border-border group-hover:border-primary transition-all duration-150">
          <User size={24} strokeWidth={2} />
        </div>
      </button>
      {isOpen && (
        <div className="topbar-panel min-w-[240px]">
          <div className="p-md bg-[var(--bg-hover)] border-b border-border">
            <Text size="sm" weight="bold" className="text-main leading-none">
              Jacob Krarup Madsen
            </Text>
            <Text size="xs" muted className="mt-[var(--space-2xs)]">
              Studerende
            </Text>
          </div>
          <div className="py-xs">
            <div
              className="flex items-center gap-xs px-md py-2.5 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors focus-visible:bg-[var(--bg-hover)] outline-none focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-2"
              onClick={() => {
                navigate('/settings?tab=profil');
                setIsOpen(false);
              }}
              tabIndex={0}
              role="menuitem"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/settings?tab=profil');
                  setIsOpen(false);
                }
              }}
            >
              <User size={16} strokeWidth={2} className="text-muted shrink-0" />
              <Text size="sm" className="leading-none">
                {t('profile')}
              </Text>
            </div>
            <div
              className="flex items-center gap-xs px-md py-2.5 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors focus-visible:bg-[var(--bg-hover)] outline-none focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-2"
              onClick={() => {
                navigate('/settings');
                setIsOpen(false);
              }}
              tabIndex={0}
              role="menuitem"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/settings');
                  setIsOpen(false);
                }
              }}
            >
              <Settings size={16} strokeWidth={2} className="text-muted shrink-0" />
              <Text size="sm" className="leading-none">
                {t('settings')}
              </Text>
            </div>
          </div>
          <div className="border-t border-border py-xs">
            <div
              className="flex items-center gap-xs px-md py-2.5 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors text-danger focus-visible:bg-[var(--bg-hover)] outline-none focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-2"
              onClick={() => {
                setIsOpen(false);
              }}
              tabIndex={0}
              role="menuitem"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsOpen(false);
                }
              }}
            >
              <LogOut size={16} strokeWidth={2} className="text-danger shrink-0" />
              <Text size="sm" className="leading-none font-semibold">
                {t('logout')}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
