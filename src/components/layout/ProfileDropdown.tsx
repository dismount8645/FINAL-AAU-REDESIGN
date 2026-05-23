import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { Text } from '@/components/ui/Typography';
import useStore from '@/store/useStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export default function ProfileDropdown() {
  const t = useStore((state) => state.t);
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
    <div className="relative ml-2" ref={dropdownRef}>
      <button
        className="group relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:shadow-focus"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label={t('user_menu')}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        type="button"
      >
        <div className={cn(
          "absolute inset-0 rounded-full transition-colors duration-150",
          isOpen
            ? "bg-primary border-primary"
            : "bg-[var(--bg-highlight)] border-border group-hover:border-primary"
        )} />
        <User 
          size={22} 
          strokeWidth={2.5} 
          className={cn(
            "relative z-10 transition-colors duration-150",
            isOpen ? "text-white" : "text-[var(--text-main)] group-hover:text-primary"
          )} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full mt-2 min-w-[240px] z-50 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] shadow-xl overflow-hidden"
            role="menu"
          >
            <div className="p-4 bg-[var(--bg-highlight)]/50 border-b border-[var(--border-color)]">
              <Text size="sm" weight="black" className="text-[var(--text-main)] leading-none uppercase tracking-tight">
                Jacob Krarup Madsen
              </Text>
              <Text size="xs" muted className="mt-1 font-bold opacity-60 italic">
                Studerende
              </Text>
            </div>
            
            <div className="py-2">
              <Link
                to="/settings?tab=profil"
                className="flex w-full min-h-[44px] items-center gap-3 px-4 py-2 hover:bg-[var(--bg-highlight)] transition-colors focus-visible:bg-[var(--bg-highlight)] focus-visible:outline-none focus-visible:shadow-focus"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <User size={16} strokeWidth={2.5} className="text-primary shrink-0" />
                <Text size="sm" weight="bold" className="leading-none text-[var(--text-main)]">
                  {t('profile')}
                </Text>
              </Link>
              
              <Link
                to="/settings"
                className="flex w-full min-h-[44px] items-center gap-3 px-4 py-2 hover:bg-[var(--bg-highlight)] transition-colors focus-visible:bg-[var(--bg-highlight)] focus-visible:outline-none focus-visible:shadow-focus"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <Settings size={16} strokeWidth={2.5} className="text-primary shrink-0" />
                <Text size="sm" weight="bold" className="leading-none text-[var(--text-main)]">
                  {t('settings')}
                </Text>
              </Link>
            </div>
            
            <div className="border-t border-border bg-danger/[0.02] py-2">
              <button
                type="button"
                className="flex w-full min-h-[44px] items-center gap-3 px-4 py-2 hover:bg-danger/10 transition-colors text-danger focus-visible:bg-danger/10 focus-visible:outline-none focus-visible:shadow-focus"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <LogOut size={16} strokeWidth={2.5} className="shrink-0" />
                <Text size="sm" weight="black" className="leading-none uppercase tracking-widest">
                  {t('logout')}
                </Text>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
