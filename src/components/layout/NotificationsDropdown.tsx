import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileUp, MessageSquare, Clock, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Text } from '@/components/ui/Typography';
import useStore from '@/store/useStore';
import { notificationsData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function NotificationsDropdown() {
  const navigate = useNavigate();
  const t = useStore((state) => state.t);
  const lang = useStore((state) => state.lang);
  const notificationCount = useStore((state) => state.notificationCount);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const firstItem = menuRef.current?.querySelector<HTMLElement>('button.w-full');
        firstItem?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'AFLEVERING': return FileUp;
      case 'FORUM': return MessageSquare;
      case 'DEADLINE': return Clock;
      case 'FEEDBACK': return Star;
      default: return Bell;
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button[type="button"].w-full'));
      const activeIdx = items.indexOf(document.activeElement as HTMLElement);
      
      let nextIdx = activeIdx;
      if (e.key === 'ArrowDown') {
        nextIdx = activeIdx < items.length - 1 ? activeIdx + 1 : 0;
      } else {
        nextIdx = activeIdx > 0 ? activeIdx - 1 : items.length - 1;
      }
      items[nextIdx].focus();
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        ref={buttonRef}
        onKeyDown={handleTriggerKeyDown}
        variant="ghost"
        size="icon"
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150 active:scale-[0.95] border-none focus-visible:outline-none focus-visible:shadow-focus",
          isOpen 
            ? "bg-primary text-white shadow-md" 
            : "text-main hover:bg-bg-highlight hover:text-primary dark:hover:bg-white/10"
        )}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={t('notifications')}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        type="button"
      >
        <Bell size={20} strokeWidth={2} />
        {notificationCount > 0 && (
          <span className="absolute right-1.5 top-1.5 z-10 flex min-h-[18px] min-w-[18px] animate-pulse items-center justify-center rounded-full border-2 border-bg-main bg-primary text-[10px] font-black leading-none text-white shadow-sm">
            {notificationCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            onKeyDown={handleMenuKeyDown}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] w-80 max-w-[calc(100dvw-1rem)] z-50 overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border p-md">
              <Text size="sm" weight="black" className="uppercase tracking-widest text-main">
                {t('notifications')}
              </Text>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
                className="rounded-md text-[10px] font-bold uppercase tracking-tighter text-primary hover:underline bg-transparent border-none p-0 focus-visible:outline-none focus-visible:shadow-focus px-1 h-auto"
                type="button"
              >
                {t('view_all')}
              </Button>
            </div>
            <ul className="max-h-96 overflow-y-auto" role="menu">
              {notificationsData.map((n) => {
                const Icon = getNotifIcon(n.type);
                return (
                  <li key={n.id} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className={cn(
                        "w-full flex items-start gap-md border-b border-border/40 p-md text-left transition-colors focus-visible:outline-none focus-visible:bg-bg-hover focus-visible:shadow-focus min-h-[44px]",
                        !n.isRead ? "bg-primary/[0.03] hover:bg-primary/[0.05]" : "hover:bg-bg-hover"
                      )}
                      onClick={() => {
                        navigate('/notifications');
                        setIsOpen(false);
                      }}
                    >
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/50",
                          !n.isRead ? "bg-primary/10 text-primary" : "bg-bg-hover text-muted"
                        )}
                      >
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <div className="flex flex-1 flex-col min-w-0">
                        <Text
                          size="xs"
                          weight="bold"
                          className={cn("block truncate", !n.isRead ? "text-main" : "text-muted")}
                        >
                          {lang === 'da' ? n.textDa : n.textEn}
                        </Text>
                        <Text size="2xs" className="mt-xs text-muted">
                          {lang === 'da' ? n.dateDa : n.dateEn}
                        </Text>
                      </div>
                      {!n.isRead && (
                        <div className="mt-xs h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
