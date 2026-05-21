import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { Text } from '@/components/ui/Typography';
import useStore from '@/store/useStore';
import { cn } from '@/lib/utils';

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
        <div className={cn(
          "topbar__profile-avatar w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 border-2 active:scale-95 shadow-sm",
          isOpen
            ? "bg-[var(--aau-blue)] text-white border-[var(--aau-blue)]"
            : "bg-[var(--bg-highlight)] text-[var(--text-main)] border-[var(--border-color)] group-hover:border-[var(--aau-blue)] group-hover:text-[var(--aau-blue)]"
        )}>
          <User size={22} strokeWidth={2.5} />
        </div>
      </button>
      {isOpen && (
        <div className="topbar-panel min-w-[240px]">
          <div className="p-md bg-[var(--bg-highlight)]/50 border-b border-[var(--border-color)]">
            <Text size="sm" weight="black" className="text-[var(--text-main)] leading-none uppercase tracking-tight">
              Jacob Krarup Madsen
            </Text>
            <Text size="xs" muted className="mt-1 font-bold opacity-60 italic">
              Studerende
            </Text>
          </div>
          <div className="py-xs">
            <div
              className="flex items-center gap-[var(--space-sm)] px-md py-sm cursor-pointer hover:bg-[var(--bg-highlight)] transition-colors focus-visible:bg-[var(--bg-highlight)] outline-none focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-2"
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
              <User size={16} strokeWidth={2.5} className="text-[var(--aau-blue)] shrink-0" />
              <Text size="sm" weight="bold" className="leading-none text-[var(--text-main)]">
                {t('profile')}
              </Text>
            </div>
            <div
              className="flex items-center gap-[var(--space-sm)] px-md py-sm cursor-pointer hover:bg-[var(--bg-highlight)] transition-colors focus-visible:bg-[var(--bg-highlight)] outline-none focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-2"
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
              <Settings size={16} strokeWidth={2.5} className="text-[var(--aau-blue)] shrink-0" />
              <Text size="sm" weight="bold" className="leading-none text-[var(--text-main)]">
                {t('settings')}
              </Text>
            </div>
          </div>
          <div className="border-t border-[var(--border-color)]/40 py-xs bg-[var(--aau-dark-pink)]/[0.02]">
            <div
              className="flex items-center gap-[var(--space-sm)] px-md py-sm cursor-pointer hover:bg-[var(--aau-dark-pink)]/5 transition-colors text-[var(--aau-dark-pink)] focus-visible:bg-[var(--aau-dark-pink)]/5 outline-none focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-2"
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
              <LogOut size={16} strokeWidth={2.5} className="shrink-0" />
              <Text size="sm" weight="black" className="leading-none uppercase tracking-widest">
                {t('logout')}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
