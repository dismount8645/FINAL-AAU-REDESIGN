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

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) close();
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

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150 active:scale-[0.95] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          isOpen 
            ? "bg-primary text-white shadow-md" 
            : "text-main hover:bg-bg-highlight hover:text-primary dark:hover:bg-white/10"
        )}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={t('notifications')}
        aria-expanded={isOpen}
        aria-haspopup="true"
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
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] w-80 z-50 overflow-hidden rounded-xl border border-border bg-bg-card shadow-xl"
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
                className="rounded-md text-[10px] font-bold uppercase tracking-tighter text-primary hover:underline bg-transparent border-none p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 px-1 h-auto"
                type="button"
              >
                {t('view_all')}
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notificationsData.map((n) => {
                const Icon = getNotifIcon(n.type);
                return (
                  <button
                    key={n.id}
                    type="button"
                    className={cn(
                      "w-full flex items-start gap-md border-b border-border/40 p-md text-left transition-colors focus-visible:outline-none focus-visible:bg-bg-hover focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]",
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
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
