import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@/components/Avatar';
import Button from '@/components/ui/Button';
import { Text } from '@/components/Typography';
import { messagesData } from '@/lib/mockData';
import useStore from '@/store';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/lib/test-utils';
import { useDropdown } from '@/lib/useDropdown';
import { cn } from '@/lib/utils';

export default function MessagesDropdown() {
  const navigate = useNavigate();
  const t = useStore((state) => state.t);
  const lang = useStore((state) => state.lang);
  const messageCount = useStore((state) => state.messageCount);
  const { isOpen, setIsOpen, dropdownRef, toggle } = useDropdown();

  return (
    <div className="relative flex" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-all duration-150 hover:-translate-y-1 active:scale-[0.95] border-none focus-visible:outline-none focus-visible:shadow-focus",
          isOpen 
            ? "bg-primary/10 text-primary dark:bg-white/15 dark:text-white shadow-sm" 
            : "text-text-main hover:bg-bg-highlight hover:text-primary dark:hover:bg-white/10"
        )}
        onClick={toggle}
        aria-label={t('messages')}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Mail size={20} strokeWidth={2} />
      </Button>
      {messageCount > 0 && (
        <span className="absolute right-[4px] top-[4px] z-10 flex h-[16px] min-w-[16px] pointer-events-none animate-pulse items-center justify-center rounded-full border-2 border-bg-main bg-primary text-[10px] font-black leading-none text-white shadow-sm">
          {messageCount}
        </span>
      )}

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
              <Text size="sm" weight="bold" className="text-main">
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
            <ul className="max-h-96 overflow-y-auto pr-1">
              {messagesData.map((m) => (
                <li key={m.id}>
                  <button
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
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

if (import.meta.vitest) {
  describe('MessagesDropdown', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({
        lang: 'da',
        t: (key: string) => key,
        messageCount: 3,
      })
    })
  
    it('renders the messages button', () => {
      renderWithProviders(<MessagesDropdown />)
      expect(screen.getByLabelText('messages')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  
    it('opens dropdown when message button is clicked', () => {
      renderWithProviders(<MessagesDropdown />)
      const mailBtn = screen.getByLabelText('messages')
      fireEvent.click(mailBtn)
      expect(screen.getByText('messages')).toBeInTheDocument()
    })
  
    it('closes dropdown when clicking outside', () => {
      renderWithProviders(
        <div>
          <div data-testid="outside">Outside</div>
          <MessagesDropdown />
        </div>
      )
      const mailBtn = screen.getByLabelText('messages')
      fireEvent.click(mailBtn)
      expect(screen.getByText('messages')).toBeInTheDocument()
      fireEvent.mouseDown(screen.getByTestId('outside'))
      expect(screen.queryByText('messages')).not.toBeInTheDocument()
    })
  
    it('navigates to messages when a message item is clicked', async () => {
      renderWithProviders(<MessagesDropdown />)
      const mailBtn = screen.getByLabelText('messages')
      fireEvent.click(mailBtn)
      fireEvent.click(screen.getByText('Mette Jensen'))
      await waitFor(() => {
        expect(screen.queryByText('Mette Jensen')).not.toBeInTheDocument()
      })
    })
  
    it('navigates to messages when "view all" is clicked', async () => {
      renderWithProviders(<MessagesDropdown />)
      const mailBtn = screen.getByLabelText('messages')
      fireEvent.click(mailBtn)
      fireEvent.click(screen.getByText('view_all'))
      await waitFor(() => {
        expect(screen.queryByText('view_all')).not.toBeInTheDocument()
      })
    })
  })
}
