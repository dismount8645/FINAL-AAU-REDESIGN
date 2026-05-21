import { renderWithProviders, screen, fireEvent } from '@/test/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MessagesDropdown from '@/components/layout/MessagesDropdown'
import useStore from '@/store/useStore'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

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
    expect(screen.getByText('view_all')).toBeInTheDocument()
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
    expect(screen.getByText('view_all')).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByTestId('outside'))
    expect(screen.queryByText('view_all')).not.toBeInTheDocument()
  })

  it('navigates when view_all is clicked', () => {
    renderWithProviders(<MessagesDropdown />)
    const mailBtn = screen.getByLabelText('messages')
    fireEvent.click(mailBtn)

    const viewAllBtn = screen.getByText('view_all')
    fireEvent.click(viewAllBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/messages')
    expect(screen.queryByText('view_all')).not.toBeInTheDocument()
  })

  it('navigates when message item is clicked', () => {
    renderWithProviders(<MessagesDropdown />)
    const mailBtn = screen.getByLabelText('messages')
    fireEvent.click(mailBtn)

    // Using one of the mock message senders from messagesData (e.g. Mette Jensen)
    const msgItem = screen.getByText('Mette Jensen')
    fireEvent.click(msgItem)
    expect(mockNavigate).toHaveBeenCalledWith('/messages')
    expect(screen.queryByText('view_all')).not.toBeInTheDocument()
  })
})
