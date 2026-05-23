import { useState, useRef, useEffect } from 'react';
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
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-all duration-150 hover:-translate-y-1 active:scale-[0.95] border-none focus-visible:outline-none focus-visible:shadow-focus",
          isOpen 
            ? "bg-[var(--aau-blue)] text-white shadow-md" 
            : "text-[var(--text-main)] hover:bg-[var(--bg-highlight)] hover:text-primary dark:hover:bg-white/10"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('messages')}
        type="button"
        aria-expanded={isOpen}
      >
        <Mail size={20} strokeWidth={2} />
        {messageCount > 0 && (
          <span className="absolute right-1.5 top-1.5 z-10 flex h-[18px] min-w-[18px] animate-pulse items-center justify-center rounded-full border-2 border-[var(--bg-topbar)] bg-[var(--aau-blue)] text-[10px] font-black leading-none text-white shadow-sm">
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
            className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-[var(--bg-surface)] shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border bg-bg-hover pl-md pr-2 py-1">
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
            <div className="max-h-96 overflow-y-auto">
              {messagesData.map((m) => (
                <button
                  key={m.id}
                  className="w-full min-h-[44px] cursor-pointer border-b border-border/40 p-md text-left transition-colors hover:bg-bg-hover focus-visible:bg-bg-hover focus-visible:outline-none focus-visible:shadow-focus"
                  onClick={() => {
                    navigate('/messages');
                    setIsOpen(false);
                  }}
                  type="button"
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
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
