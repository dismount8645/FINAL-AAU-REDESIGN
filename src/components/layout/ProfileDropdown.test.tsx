import { renderWithProviders, screen, fireEvent } from '@/test/test-utils'
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

  it('closes dropdown when clicking outside', () => {
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
    expect(screen.queryByText('Jacob Krarup Madsen')).not.toBeInTheDocument()
  })

  it('navigates to settings when settings is clicked', () => {
    renderWithProviders(<ProfileDropdown />)
    const trigger = screen.getByLabelText('user_menu')
    fireEvent.click(trigger)

    const settingsItem = screen.getByText('settings')
    fireEvent.click(settingsItem)
    expect(mockNavigate).toHaveBeenCalledWith('/settings')
    expect(screen.queryByText('Jacob Krarup Madsen')).not.toBeInTheDocument()
  })

  it('navigates to profile when profile tab is clicked', () => {
    renderWithProviders(<ProfileDropdown />)
    const trigger = screen.getByLabelText('user_menu')
    fireEvent.click(trigger)

    const profileItem = screen.getByText('profile')
    fireEvent.click(profileItem)
    expect(mockNavigate).toHaveBeenCalledWith('/settings?tab=profil')
    expect(screen.queryByText('Jacob Krarup Madsen')).not.toBeInTheDocument()
  })

  it('closes when logout is clicked', () => {
    renderWithProviders(<ProfileDropdown />)
    const trigger = screen.getByLabelText('user_menu')
    fireEvent.click(trigger)

    const logoutItem = screen.getByText('logout')
    fireEvent.click(logoutItem)
    expect(screen.queryByText('Jacob Krarup Madsen')).not.toBeInTheDocument()
  })

  it('keyboard navigation: navigates on Enter key', () => {
    renderWithProviders(<ProfileDropdown />)
    const trigger = screen.getByLabelText('user_menu')
    fireEvent.click(trigger)

    const profileItem = screen.getByText('profile').closest('[role="menuitem"]')
    fireEvent.keyDown(profileItem!, { key: 'Enter' })
    expect(mockNavigate).toHaveBeenCalledWith('/settings?tab=profil')
  })

  it('keyboard navigation: navigates on Space key', () => {
    renderWithProviders(<ProfileDropdown />)
    const trigger = screen.getByLabelText('user_menu')
    fireEvent.click(trigger)

    const settingsItem = screen.getByText('settings').closest('[role="menuitem"]')
    fireEvent.keyDown(settingsItem!, { key: ' ' })
    expect(mockNavigate).toHaveBeenCalledWith('/settings')
  })
})
