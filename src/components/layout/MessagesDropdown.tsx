import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Text } from '@/components/ui/Typography';
import Avatar from '@/components/ui/Avatar';
import useStore from '@/store/useStore';
import { messagesData } from '@/data/mockData';

export default function MessagesDropdown() {
  const navigate = useNavigate();
  const { t, lang, messageCount } = useStore();
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
      <button
        className={`topbar__trigger-btn relative w-11 h-11 flex items-center justify-center rounded-[var(--radius-lg)] transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:shadow-focus ${
          isOpen ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-bg-hover dark:hover:bg-white/10 hover:text-primary'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('messages')}
        type="button"
      >
        <Mail size={20} strokeWidth={2} />
        {messageCount > 0 && (
          <span className="topbar__badge absolute top-1 right-1 min-w-[18px] h-[18px] text-[10px] bg-primary text-white font-bold rounded-[var(--radius-pill)] flex items-center justify-center border-2 border-[var(--bg-topbar)] leading-none shadow-[var(--shadow-sm)]">
            {messageCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="topbar-panel w-80">
          <div className="p-md border-b border-border bg-[var(--bg-hover)] flex justify-between items-center">
            <Text size="sm" weight="black" className="uppercase tracking-widest">
              {t('messages')}
            </Text>
            <button
              onClick={() => {
                navigate('/messages');
                setIsOpen(false);
              }}
              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
            >
              {t('view_all')}
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {messagesData.map((m) => (
              <div
                key={m.id}
                className="p-md border-b border-border/40 hover:bg-bg-hover cursor-pointer transition-colors"
                onClick={() => {
                  navigate('/messages');
                  setIsOpen(false);
                }}
              >
                <div className="flex gap-md items-center">
                  <Avatar
                    name={lang === 'da' ? m.nameDa || m.name : m.nameEn || m.name}
                    size="sm"
                    status={m.unread ? 'online' : undefined}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <Text size="xs" weight="black" className="truncate">
                        {lang === 'da' ? m.nameDa || m.name : m.nameEn || m.name}
                      </Text>
                      <Text size="2xs" className="text-muted">
                        {lang === 'da' ? m.timeDa : m.timeEn}
                      </Text>
                    </div>
                    <Text
                      size="2xs"
                      className={`truncate block mt-xs ${
                        m.unread ? 'text-main font-bold' : 'text-muted'
                      }`}
                    >
                      {lang === 'da' ? m.msgDa : m.msgEn}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
