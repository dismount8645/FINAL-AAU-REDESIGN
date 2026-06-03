import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { Text } from '@/components/Typography';
import useStore from '@/store/useStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useDropdown } from '@/lib/useDropdown';

export default function ProfileDropdown() {
  const t = useStore((state) => state.t);
  const { isOpen, setIsOpen, dropdownRef, menuRef, buttonRef, toggle, handleMenuKeyDown, handleTriggerKeyDown } = useDropdown();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
      return;
    }
    handleMenuKeyDown(e);
  };

  return (
    <div className="relative ml-2" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onKeyDown={handleTriggerKeyDown}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:shadow-focus"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
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
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            onKeyDown={handleKeyDown}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full mt-2 min-w-[240px] max-w-[calc(100dvw-1rem)] z-50 rounded-xl bg-bg-elevated border border-border shadow-xl overflow-hidden"
            role="menu"
          >
            <div className="p-4 bg-bg-highlight/50 border-b border-border">
              <Text size="sm" weight="bold" className="text-main leading-none">
                {t('common.user_name') || 'Jacob Krarup Madsen'}
              </Text>
              <Text size="xs" muted className="mt-1 font-bold opacity-60 italic">
                {t('common.user_role') || 'Studerende'}
              </Text>
            </div>
            
            <ul className="py-2" role="none">
              <li role="none">
                <Link
                  to="/settings?tab=profil"
                  className="flex w-full min-h-[44px] items-center gap-3 px-4 py-2 hover:bg-bg-highlight transition-colors focus-visible:bg-bg-highlight focus-visible:outline-none focus-visible:shadow-focus"
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                >
                  <User size={16} strokeWidth={2.5} className="text-primary shrink-0" />
                  <Text size="sm" weight="bold" className="leading-none text-main">
                    {t('profile')}
                  </Text>
                </Link>
              </li>
              
              <li role="none">
                <Link
                  to="/settings"
                  className="flex w-full min-h-[44px] items-center gap-3 px-4 py-2 hover:bg-bg-highlight transition-colors focus-visible:bg-bg-highlight focus-visible:outline-none focus-visible:shadow-focus"
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                >
                  <Settings size={16} strokeWidth={2.5} className="text-primary shrink-0" />
                  <Text size="sm" weight="bold" className="leading-none text-main">
                    {t('settings')}
                  </Text>
                </Link>
              </li>
            </ul>
            
            <ul className="border-t border-border bg-danger/[0.02] py-2" role="none">
              <li role="none">
                <button
                  type="button"
                  className="flex w-full min-h-[44px] items-center gap-3 px-4 py-2 hover:bg-danger/10 transition-colors text-danger focus-visible:bg-danger/10 focus-visible:outline-none focus-visible:shadow-focus"
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                >
                  <LogOut size={16} strokeWidth={2.5} className="shrink-0" />
                  <Text size="sm" weight="bold" className="leading-none text-danger">
                    {t('logout')}
                  </Text>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
