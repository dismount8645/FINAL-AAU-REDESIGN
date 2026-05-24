import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Text } from '@/components/ui/Typography';
import Avatar from '@/components/ui/Avatar';
import useStore from '@/store/useStore';
import { messagesData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function MessagesDropdown() {
  const navigate = useNavigate();
  const t = useStore((state) => state.t);
  const lang = useStore((state) => state.lang);
  const messageCount = useStore((state) => state.messageCount);
  
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

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-all duration-150 hover:-translate-y-1 active:scale-[0.95] border-none focus-visible:outline-none focus-visible:shadow-focus",
          isOpen 
            ? "bg-primary text-primary-foreground shadow-md" 
            : "text-main hover:bg-bg-highlight hover:text-primary dark:hover:bg-white/10"
        )}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={t('messages')}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Mail size={20} strokeWidth={2} />
        {messageCount > 0 && (
          <span className="absolute right-1.5 top-1.5 z-10 flex h-[18px] min-w-[18px] animate-pulse items-center justify-center rounded-full border-2 border-bg-main bg-primary text-[10px] font-black leading-none text-primary-foreground shadow-sm">
            {messageCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100dvw-1rem)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-card shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border pl-md pr-2 py-1">
              <Text size="sm" weight="black" className="uppercase tracking-widest">
                {t('messages')}
              </Text>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  navigate('/messages');
                  setIsOpen(false);
                }}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm text-[10px] font-bold uppercase tracking-tighter text-primary hover:underline hover:bg-transparent bg-transparent border-none p-0 focus-visible:outline-none focus-visible:shadow-focus"
              >
                {t('view_all')}
              </Button>
            </div>
            <ul className="max-h-96 overflow-y-auto" role="menu">
              {messagesData.map((m) => (
                <li key={m.id} role="none">
                  <button
                    className="w-full min-h-[44px] cursor-pointer border-b border-border/40 p-md text-left transition-colors hover:bg-bg-hover focus-visible:bg-bg-hover focus-visible:outline-none focus-visible:shadow-focus"
                    onClick={() => {
                      navigate('/messages');
                      setIsOpen(false);
                    }}
                    type="button"
                    role="menuitem"
                  >
                    <div className="flex items-center gap-md">
                      <Avatar
                        name={lang === 'da' ? m.nameDa || m.name : m.nameEn || m.name}
                        size="sm"
                        status={m.unread ? 'online' : undefined}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <Text size="xs" weight="black" className="truncate">
                            {lang === 'da' ? m.nameDa || m.name : m.nameEn || m.name}
                          </Text>
                          <Text size="2xs" className="text-muted">
                            {lang === 'da' ? m.timeDa : m.timeEn}
                          </Text>
                        </div>
                        <Text
                          size="2xs"
                          className={cn(
                            "mt-xs block truncate",
                            m.unread ? "font-bold text-main" : "text-muted"
                          )}
                        >
                          {lang === 'da' ? m.msgDa : m.msgEn}
                        </Text>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
