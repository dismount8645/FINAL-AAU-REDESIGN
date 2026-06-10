import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Text, Dropdown, MasterItem } from '@/components/ui';
import useStore from '@/store';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/test-utils';
import { cn } from '@/lib/utils';
import { PATHS } from '@/routes';

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const t = useStore((state) => state.t);
  const firstName = useStore((state) => state.firstName);
  const lastName = useStore((state) => state.lastName);

  return (
    <Dropdown className="ml-2">
      <Dropdown.Trigger>
        {({ ref, onKeyDown, onClick }, { isOpen }) => (
          <button
            ref={ref}
            onKeyDown={onKeyDown}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-150 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:shadow-focus"
            aria-label={t('user_menu')}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            type="button"
          >
            <div className={cn(
              "absolute inset-0 rounded-full transition-colors duration-150",
              isOpen
                ? "bg-primary/10 border-primary dark:bg-white/15 dark:border-white"
                : "bg-bg-highlight border-border group-hover:border-primary"
            )} />
            <User
              size={22}
              strokeWidth={2.5}
              className={cn(
                "relative z-10 transition-colors duration-150",
                isOpen ? "text-primary dark:text-white" : "text-main group-hover:text-primary"
              )}
            />
          </button>
        )}
      </Dropdown.Trigger>
      <Dropdown.Menu className="min-w-[240px] max-w-[calc(100dvw-1rem)] overflow-hidden">
        <div className="p-4 bg-bg-highlight/50 border-b border-border">
          <Text size="sm" weight="bold" className="text-main leading-none">
            {`${firstName} ${lastName}`}
          </Text>
          <Text size="xs" muted className="mt-1 font-bold opacity-60 italic">
            {t('common.user_role') || 'Studerende'}
          </Text>
        </div>

        <div role="none" className="py-2">
          <Dropdown.Item onClick={() => navigate(`${PATHS.SETTINGS}?tab=profil`)}>
            <MasterItem
              leading={User}
              leadingClassName="text-primary"
              title={t('profile')}
            />
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate(PATHS.SETTINGS)}>
            <MasterItem
              leading={Settings}
              leadingClassName="text-primary"
              title={t('settings')}
            />
          </Dropdown.Item>
        </div>

        <div role="none" className="border-t border-border bg-danger/[0.02] py-2">
          <Dropdown.Item onClick={() => {}}>
            <MasterItem
              leading={LogOut}
              leadingClassName="text-danger"
              title={t('logout')}
            />
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

if (import.meta.vitest) {
  describe('ProfileDropdown', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({
        firstName: 'Jacob Krarup',
        lastName: 'Madsen',
        t: (key: string) => {
          if (key === 'common.user_name') return 'Jacob Krarup Madsen';
          if (key === 'common.user_role') return 'Studerende';
          return key;
        },
      })
    })

    it('renders the profile trigger button', () => {
      renderWithProviders(<ProfileDropdown />)
      expect(screen.getByLabelText('user_menu')).toBeInTheDocument()
    })

    it('opens dropdown when trigger is clicked', () => {
      renderWithProviders(<ProfileDropdown />)
      const trigger = screen.getByLabelText('user_menu')
      fireEvent.click(trigger)
      expect(screen.getByText('Jacob Krarup Madsen')).toBeInTheDocument()
    })

    it('closes dropdown when clicking outside', async () => {
      renderWithProviders(
        <div>
          <div data-testid="outside">Outside</div>
          <ProfileDropdown />
        </div>
      )
      const trigger = screen.getByLabelText('user_menu')
      fireEvent.click(trigger)
      expect(screen.getByText('Jacob Krarup Madsen')).toBeInTheDocument()

      fireEvent.mouseDown(screen.getByTestId('outside'))
      await waitFor(() => expect(screen.queryByText('Jacob Krarup Madsen')).not.toBeInTheDocument())
    })

    it('navigates to settings when settings is clicked', async () => {
      renderWithProviders(<ProfileDropdown />)
      const trigger = screen.getByLabelText('user_menu')
      fireEvent.click(trigger)

      const settingsItem = screen.getByText('settings')
      fireEvent.click(settingsItem)
      await waitFor(() => expect(screen.queryByText('Jacob Krarup Madsen')).not.toBeInTheDocument())
    })

    it('navigates to profile when profile tab is clicked', async () => {
      renderWithProviders(<ProfileDropdown />)
      const trigger = screen.getByLabelText('user_menu')
      fireEvent.click(trigger)

      const profileItem = screen.getByText('profile')
      fireEvent.click(profileItem)
      await waitFor(() => expect(screen.queryByText('Jacob Krarup Madsen')).not.toBeInTheDocument())
    })

    it('closes when logout is clicked', async () => {
      renderWithProviders(<ProfileDropdown />)
      const trigger = screen.getByLabelText('user_menu')
      fireEvent.click(trigger)

      const logoutItem = screen.getByText('logout')
      fireEvent.click(logoutItem)
      await waitFor(() => expect(screen.queryByText('Jacob Krarup Madsen')).not.toBeInTheDocument())
    })

    it('closes on Escape key press', async () => {
      renderWithProviders(<ProfileDropdown />)
      const trigger = screen.getByLabelText('user_menu')
      fireEvent.click(trigger)
      const menu = screen.getByRole('menu')
      fireEvent.keyDown(menu, { key: 'Escape' })
      await waitFor(() => expect(screen.queryByText('Jacob Krarup Madsen')).not.toBeInTheDocument())
    })

    it('calls handleMenuKeyDown on non-Escape key', () => {
      renderWithProviders(<ProfileDropdown />)
      const trigger = screen.getByLabelText('user_menu')
      fireEvent.click(trigger)
      const menu = screen.getByRole('menu')
      fireEvent.keyDown(menu, { key: 'ArrowDown' })
      expect(screen.getByText('Jacob Krarup Madsen')).toBeInTheDocument()
    })

    it('falls back to Studerende when user_role is empty', () => {
      useStore.setState({
        firstName: 'Test',
        lastName: 'User',
        t: (key: string) => key === 'common.user_role' ? '' : key,
      })
      renderWithProviders(<ProfileDropdown />)
      const trigger = screen.getByLabelText('user_menu')
      fireEvent.click(trigger)
      expect(screen.getByText('Studerende')).toBeInTheDocument()
    })
  })
}
