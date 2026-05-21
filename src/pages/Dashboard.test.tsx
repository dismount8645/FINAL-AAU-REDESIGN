import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dashboard from '@/pages/Dashboard'
import { MemoryRouter } from 'react-router-dom'

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  const renderDashboard = () => {
    return render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )
  }

  it('renders correctly', () => {
    renderDashboard()
    expect(screen.getByText('Velkommen tilbage, Jacob')).toBeInTheDocument()
    expect(screen.getByText('Rediger dashboard')).toBeInTheDocument()
  })

  it('toggles edit mode', () => {
    renderDashboard()
    const editBtn = screen.getByText('Rediger dashboard')
    fireEvent.click(editBtn)
    
    expect(screen.getByText('Redigeringstilstand aktiveret')).toBeInTheDocument()
    expect(screen.getByText('Færdig')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Færdig'))
    expect(screen.queryByText('Redigeringstilstand aktiveret')).not.toBeInTheDocument()
  })

  it('hides a widget in edit mode', () => {
    renderDashboard()
    fireEvent.click(screen.getByText('Rediger dashboard'))
    
    const hideBtn = screen.getAllByLabelText(/skjul|hide/i)[0]
    fireEvent.click(hideBtn)
    
    expect(screen.queryByText('Favoritter')).not.toBeInTheDocument()
  })

  it('handles drag events', () => {
    renderDashboard()
    fireEvent.click(screen.getByText('Rediger dashboard'))
    
    const widget = screen.getByText('Favoritter').closest('.dashboard__widget')
    
    // Drag Start
    fireEvent.dragStart(widget!)
    // Drag Over
    fireEvent.dragOver(widget!)
    // Drag End
    fireEvent.dragEnd(widget!)
    
    // Just verify no errors occurred
    expect(screen.getByText('Favoritter')).toBeInTheDocument()
  })

    it('resets widgets via dialog', () => {
    renderDashboard()
    fireEvent.click(screen.getByText('Rediger dashboard'))

    // Hide a widget
    fireEvent.click(screen.getAllByLabelText(/skjul|hide/i)[0])
    expect(screen.queryByText('Favoritter')).not.toBeInTheDocument()

    // Open reset dialog
    fireEvent.click(screen.getByText('Nulstil'))
    expect(screen.getByText('Nulstil layout?')).toBeInTheDocument()

    // Confirm reset
    fireEvent.click(screen.getByText('Bekræft nulstilling'))
    expect(screen.getByText('Favoritter')).toBeInTheDocument()
    })

    it('hides and adds widget back', () => {
    renderDashboard()
    fireEvent.click(screen.getByText('Rediger dashboard'))

    // Hide Favorites
    const hideBtn = screen.getAllByLabelText(/skjul|hide/i)[0]
    fireEvent.click(hideBtn)
    expect(screen.queryByText('Favoritter')).not.toBeInTheDocument()

    // Add it back
    fireEvent.click(screen.getByText('Tilføj widget'))
    fireEvent.click(screen.getByText('Favoritter'))
    expect(screen.getByText('Favoritter')).toBeInTheDocument()
    })
})
