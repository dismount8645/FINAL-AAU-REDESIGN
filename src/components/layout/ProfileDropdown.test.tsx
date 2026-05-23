import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProfileDropdown from '@/components/layout/ProfileDropdown'
import useStore from '@/store/useStore'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('ProfileDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useStore.setState({
      t: (key: string) => key,
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
    expect(settingsItem.closest('a')).toHaveAttribute('href', '/settings')
    fireEvent.click(settingsItem)
    await waitFor(() => expect(screen.queryByText('Jacob Krarup Madsen')).not.toBeInTheDocument())
  })

  it('navigates to profile when profile tab is clicked', async () => {
    renderWithProviders(<ProfileDropdown />)
    const trigger = screen.getByLabelText('user_menu')
    fireEvent.click(trigger)

    const profileItem = screen.getByText('profile')
    expect(profileItem.closest('a')).toHaveAttribute('href', '/settings?tab=profil')
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
})
