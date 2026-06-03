import { renderWithProviders, screen, fireEvent, waitFor } from '@/lib/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import NotificationsDropdown from '@/components/NotificationsDropdown'
import useStore from '@/lib/store'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

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
    expect(mockNavigate).toHaveBeenCalledWith('/notifications')
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
    expect(mockNavigate).toHaveBeenCalledWith('/notifications')
    await waitFor(() => {
      expect(screen.queryByText('view_all')).not.toBeInTheDocument()
    })
  })
})
