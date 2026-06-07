import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Text } from '@/components/ui';
import Button from '@/components/ui/Button';
import { Dropdown } from '@/components/ui';
import { messagesData } from '@/lib/data';
import useStore from '@/store';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/test-utils';
import { cn } from '@/lib/utils';

export default function MessagesDropdown() {
  const navigate = useNavigate();
  const t = useStore((state) => state.t);
  const lang = useStore((state) => state.lang);
  const messageCount = useStore((state) => state.messageCount);

  return (
    <Dropdown>
      <Dropdown.Trigger>
        {({ ref, onKeyDown, onClick }, { isOpen }) => (
          <Button
            ref={ref}
            onKeyDown={onKeyDown}
            onClick={onClick}
            variant="ghost"
            size="icon"
            className={cn(
              "relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-all duration-150 hover:-translate-y-1 active:scale-[0.95] border-none focus-visible:outline-none focus-visible:shadow-focus",
              isOpen
                ? "bg-primary/10 text-primary dark:bg-white/15 dark:text-white shadow-sm"
                : "text-text-main hover:bg-bg-highlight hover:text-primary dark:hover:bg-white/10"
            )}
            aria-label={t('messages')}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            type="button"
          >
            <Mail size={20} strokeWidth={2} />
            {messageCount > 0 && (
              <Badge variant="primary" className="absolute right-[4px] top-[4px] z-10 pointer-events-none animate-pulse border-2 border-bg-main h-4 min-w-[16px] rounded-full px-1 leading-none shadow-sm">
                {messageCount}
              </Badge>
            )}
          </Button>
        )}
      </Dropdown.Trigger>
      <Dropdown.Menu className="w-80 max-w-[calc(100dvw-1rem)]">
        {({ close }) => (
          <>
        <div className="flex items-center justify-between border-b border-border pl-md pr-2 py-1">
          <Text size="sm" weight="bold" className="text-main">
            {t('messages')}
          </Text>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              navigate('/messages');
              close();
            }}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm text-[10px] font-bold uppercase tracking-tighter text-primary hover:underline hover:bg-transparent bg-transparent border-none p-0 focus-visible:outline-none focus-visible:shadow-focus"
          >
            {t('view_all')}
          </Button>
        </div>
        <ul className="max-h-96 overflow-y-auto pr-1">
          {messagesData.map((m) => (
            <li key={m.id}>
              <Dropdown.Item
                onClick={() => navigate('/messages')}
                className="border-b border-border/40 px-md py-md hover:bg-bg-hover"
              >
                <div className="flex items-center gap-md w-full">
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
              </Dropdown.Item>
            </li>
          ))}
        </ul>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
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
