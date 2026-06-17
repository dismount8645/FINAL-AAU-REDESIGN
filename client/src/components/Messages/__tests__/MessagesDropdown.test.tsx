import useStore from '@/store'
import MessagesDropdown from '../MessagesDropdown'

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
