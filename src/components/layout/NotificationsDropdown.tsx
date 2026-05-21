import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileUp, MessageSquare, Clock, Star } from 'lucide-react';
import { Text } from '@/components/ui/Typography';
import useStore from '@/store/useStore';
import { notificationsData } from '@/data/mockData';

export default function NotificationsDropdown() {
  const navigate = useNavigate();
  const { t, lang, notificationCount } = useStore();
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
      <button
        className={`topbar__trigger-btn relative w-11 h-11 flex items-center justify-center rounded-[var(--radius-lg)] transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:shadow-focus ${
          isOpen ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-200 hover:bg-bg-hover dark:hover:bg-white/10 hover:text-primary'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('notifications')}
        type="button"
      >
        <Bell size={20} strokeWidth={2} />
        {notificationCount > 0 && (
          <span className="topbar__badge absolute top-1 right-1 min-w-[18px] h-[18px] text-[10px] bg-primary text-white font-bold rounded-[var(--radius-pill)] flex items-center justify-center border-2 border-[var(--bg-topbar)] leading-none shadow-[var(--shadow-sm)]">
            {notificationCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="topbar-panel w-80">
          <div className="p-md border-b border-border bg-[var(--bg-hover)] flex justify-between items-center">
            <Text size="sm" weight="black" className="uppercase tracking-widest">
              {t('notifications')}
            </Text>
            <button
              onClick={() => {
                navigate('/notifications');
                setIsOpen(false);
              }}
              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
            >
              {t('view_all')}
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notificationsData.map((n) => {
              const Icon = getNotifIcon(n.type);
              return (
                <div
                  key={n.id}
                  className={`p-md border-b border-border/40 hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors ${
                    !n.isRead ? 'bg-primary/[0.03]' : ''
                  }`}
                  onClick={() => {
                    navigate('/notifications');
                    setIsOpen(false);
                  }}
                >
                  <div className="flex gap-md">
                    <div
                      className={`w-11 h-11 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0 border border-border/50 ${
                        !n.isRead
                          ? 'bg-primary/10 text-primary'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text
                        size="xs"
                        weight="bold"
                        className={`block truncate ${!n.isRead ? 'text-main' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        {lang === 'da' ? n.textDa : n.textEn}
                      </Text>
                      <Text size="2xs" className="mt-0.5 text-slate-500 dark:text-slate-400">
                        {lang === 'da' ? n.dateDa : n.dateEn}
                      </Text>
                    </div>
                    {!n.isRead && <div className="w-2 h-2 rounded-[var(--radius-pill)] bg-primary mt-2xs shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
