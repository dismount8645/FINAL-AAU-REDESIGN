import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, FileUp, MessageSquare, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Text } from '@/components/ui';
import { notificationsData } from '@/lib/data';
import useStore from '@/store';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/test-utils';
import { useDropdown } from '@/hooks';
import { cn } from '@/lib/utils';

const getNotifIcon = (type: string) => {
  switch (type) {
    case 'AFLEVERING': return FileUp;
    case 'FORUM': return MessageSquare;
    case 'DEADLINE': return Clock;
    case 'FEEDBACK': return Star;
    default: return Bell;
  }
};

export default function NotificationsDropdown() {
  const navigate = useNavigate();
  const t = useStore((state) => state.t);
  const lang = useStore((state) => state.lang);
  const notificationCount = useStore((state) => state.notificationCount);
  const { isOpen, setIsOpen, dropdownRef, menuRef, buttonRef, toggle, handleMenuKeyDown, handleTriggerKeyDown } = useDropdown();

  return (
    <div className="relative flex" ref={dropdownRef}>
      <Button
        ref={buttonRef}
        onKeyDown={handleTriggerKeyDown}
        variant="ghost"
        size="icon"
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150 active:scale-[0.95] border-none focus-visible:outline-none focus-visible:shadow-focus",
          isOpen 
            ? "bg-primary/10 text-primary dark:bg-white/15 dark:text-white shadow-sm" 
            : "text-text-main hover:bg-bg-highlight hover:text-primary dark:hover:bg-white/10"
        )}
        onClick={toggle}
        aria-label={t('notifications')}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        type="button"
      >
        <Bell size={20} strokeWidth={2} />
      </Button>
      {notificationCount > 0 && (
        <span className="absolute right-[4px] top-[4px] z-10 flex min-h-[16px] min-w-[16px] pointer-events-none animate-pulse items-center justify-center rounded-full border-2 border-bg-main bg-primary text-[10px] font-black leading-none text-white shadow-sm">
          {notificationCount}
        </span>
      )}

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
              <Text size="sm" weight="bold" className="text-main">
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
            <ul className="max-h-96 overflow-y-auto pr-1" role="menu">
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

if (import.meta.vitest) {
  describe('NotificationsDropdown', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({
        lang: 'da',
        t: (key: string) => key,
        notificationCount: 2,
      })
    })
  
    it('renders the bell button', () => {
      renderWithProviders(<NotificationsDropdown />)
      expect(screen.getByLabelText('notifications')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  
    it('opens dropdown when bell is clicked', () => {
      renderWithProviders(<NotificationsDropdown />)
      const bellBtn = screen.getByLabelText('notifications')
      fireEvent.click(bellBtn)
      expect(screen.getByText('view_all')).toBeInTheDocument()
    })
  
    it('closes dropdown when clicking outside', async () => {
      renderWithProviders(
        <div>
          <div data-testid="outside">Outside</div>
          <NotificationsDropdown />
        </div>
      )
      const bellBtn = screen.getByLabelText('notifications')
      fireEvent.click(bellBtn)
      expect(screen.getByText('view_all')).toBeInTheDocument()
  
      fireEvent.mouseDown(screen.getByTestId('outside'))
      await waitFor(() => {
        expect(screen.queryByText('view_all')).not.toBeInTheDocument()
      })
    })
  
    it('navigates when view_all is clicked', async () => {
      renderWithProviders(<NotificationsDropdown />)
      const bellBtn = screen.getByLabelText('notifications')
      fireEvent.click(bellBtn)
  
      const viewAllBtn = screen.getByText('view_all')
      fireEvent.click(viewAllBtn)
      await waitFor(() => {
        expect(screen.queryByText('view_all')).not.toBeInTheDocument()
      })
    })
  
    it('navigates when notification item is clicked', async () => {
      renderWithProviders(<NotificationsDropdown />)
      const bellBtn = screen.getByLabelText('notifications')
      fireEvent.click(bellBtn)
  
      const notifItem = screen.getByText(/Modul 4: Projektrapport/i)
      fireEvent.click(notifItem)
      await waitFor(() => {
        expect(screen.queryByText(/Modul 4: Projektrapport/i)).not.toBeInTheDocument()
      })
    })
  })
}
