import Dashboard from './Dashboard'

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  const renderDashboard = () => {
    return renderWithProviders(<Dashboard />)
  }

  it('renders correctly', () => {
    renderDashboard()
    expect(screen.getByText('Velkommen tilbage, Jacob')).toBeInTheDocument()
  })

  it('renders all widgets', () => {
    renderDashboard()
    expect(screen.getByText('Næste aflevering')).toBeInTheDocument()
    expect(screen.getByText('Favoritter')).toBeInTheDocument()
    expect(screen.getByText(/Seneste karakterer/i)).toBeInTheDocument()
    expect(screen.getByText('Kontakt ITS Support')).toBeInTheDocument()
  })
})
