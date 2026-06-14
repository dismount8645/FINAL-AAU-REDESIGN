import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Text, Dropdown } from '@/components/ui';
import { notificationsData } from '@/lib/data';
import { getNotificationIcon } from '@/components/Notifications/notifications';
import useStore from '@/store';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/test-utils';
import { cn } from '@/lib/utils';
import { PATHS } from '@/routes';

export default function NotificationsDropdown() {
  const navigate = useNavigate();
  const t = useStore((state) => state.t);
  const lang = useStore((state) => state.lang);
  const notificationCount = useStore((state) => state.notificationCount);

  return (
    <Dropdown>
      <Dropdown.Trigger>
        {({ ref, onKeyDown, onClick }, { isOpen }) => (
          <Button
            ref={ref as any}
            onKeyDown={onKeyDown}
            onClick={onClick}
            variant="ghost"
            size="icon"
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150 active:scale-[0.95] border-none focus-visible:outline-none focus-visible:shadow-focus",
              isOpen
                ? "bg-primary/10 text-primary dark:bg-white/15 dark:text-white shadow-sm"
                : "text-text-main hover:bg-bg-highlight hover:text-primary dark:hover:bg-white/10"
            )}
            aria-label={t('notifications')}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            type="button"
          >
            <Bell size={20} strokeWidth={2} />
            {notificationCount > 0 && (
              <span className="absolute right-[2px] top-[2px] z-10 flex h-4.5 w-4.5 pointer-events-none items-center justify-center rounded-full border-2 border-bg-card bg-primary text-[9px] font-black leading-none text-white shadow-sm">
                <span>{notificationCount}</span>
                <span className="sr-only"> {notificationCount === 1 ? t('new_singular') : t('new_plural')}</span>
              </span>
            )}
          </Button>
        )}
      </Dropdown.Trigger>
      <Dropdown.Menu className="w-96 max-w-[calc(100dvw-1rem)]">
        {({ close }) => (
          <>
        <div className="flex items-center justify-between border-b border-border p-md">
          <Text size="sm" weight="bold" className="text-main">
            {t('notifications')}
          </Text>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              navigate(PATHS.NOTIFICATIONS);
              close();
            }}
            className="rounded-md text-xs font-bold text-primary hover:underline bg-transparent border-none p-0 focus-visible:outline-none focus-visible:shadow-focus px-1 h-auto normal-case tracking-normal"
            type="button"
          >
            {t('view_all')}
          </Button>
        </div>
        <ul className="max-h-96 overflow-y-auto pr-1" role="none">
          {notificationsData.map((n) => {
            const Icon = getNotificationIcon(n.type);
            return (
              <li key={n.id} role="none">
                <Dropdown.Item
                  onClick={() => navigate(PATHS.NOTIFICATIONS)}
                  className={cn(
                    "border-b border-border/40 px-md py-md flex items-start gap-md",
                    !n.isRead ? "bg-primary/[0.06] hover:bg-primary/[0.09]" : "hover:bg-bg-hover"
                  )}
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
                    <div className="flex items-center justify-between gap-xs">
                      <Text
                        size="xs"
                        weight="bold"
                        className={cn("block truncate flex-1", !n.isRead ? "text-main font-black" : "text-muted")}
                      >
                        {lang === 'da' ? n.textDa : n.textEn}
                      </Text>
                      {!n.isRead && (
                        <span className="shrink-0 text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-primary/20 text-primary scale-90 leading-none">
                          {lang === 'da' ? 'Ny' : 'New'}
                        </span>
                      )}
                    </div>
                    <Text size="2xs" className="mt-xs text-muted">
                      {lang === 'da' ? n.dateDa : n.dateEn}
                    </Text>
                  </div>
                  {!n.isRead && (
                    <div className="mt-xs h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </Dropdown.Item>
              </li>
            );
          })}
        </ul>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
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

    it('renders notification text in English', () => {
      useStore.setState({
        lang: 'en',
        t: (key: string) => key,
        notificationCount: 2,
      })
      renderWithProviders(<NotificationsDropdown />)
      const bellBtn = screen.getByLabelText('notifications')
      fireEvent.click(bellBtn)
      expect(screen.getAllByRole('menuitem').length).toBeGreaterThan(0)
    })
  })
}
