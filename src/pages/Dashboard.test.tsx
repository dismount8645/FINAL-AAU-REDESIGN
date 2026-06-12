import Dashboard from './Dashboard'
import { fireEvent } from '@testing-library/react'

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
    expect(screen.getByTestId('focus-banner')).toHaveTextContent(/Jacob/)
  })

  it('renders all widgets', () => {
    renderDashboard()
    expect(screen.getByText('Næste aflevering')).toBeInTheDocument()
    expect(screen.getByText('Favoritter')).toBeInTheDocument()
    expect(screen.getByText('Kontakt ITS Support')).toBeInTheDocument()
  })

  it('toggles edit mode and shows hint', () => {
    renderDashboard()
    const editBtn = screen.getByText('Rediger dashboard')
    expect(editBtn).toBeInTheDocument()
    
    fireEvent.click(editBtn)
    expect(screen.getByText(/Træk widgets for at omarrangere/i)).toBeInTheDocument()
    
    const doneBtn = screen.getByText('Færdig')
    expect(doneBtn).toBeInTheDocument()
    
    fireEvent.click(doneBtn)
    expect(screen.queryByText(/Træk widgets for at omarrangere/i)).not.toBeInTheDocument()
  })

  it('renders Focus Banner with personal greeting and redirects on button click', () => {
    const { getByTestId, getByText } = renderDashboard()
    const banner = getByTestId('focus-banner')
    expect(banner).toBeInTheDocument()
    expect(banner).toHaveTextContent(/Jacob/)
    
    const actionBtn = getByText(/Gå til aflevering|Go to assignment/)
    expect(actionBtn).toBeInTheDocument()
    fireEvent.click(actionBtn)
  })
})

