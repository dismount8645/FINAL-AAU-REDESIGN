import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DeadlinesWidget from '@/widgets/DeadlinesWidget'
import { renderWithProviders } from '@/test/test-utils'
import useStore from '@/store/useStore'
import * as dates from '@/lib/dates'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('DeadlinesWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useStore.setState({ lang: 'da' })
  })
  it('renders correctly', () => {
    renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
    expect(screen.getByText('Næste aflevering')).toBeInTheDocument()
    expect(screen.getByText('To-Do App')).toBeInTheDocument()
    expect(screen.getByText('Designskitse')).toBeInTheDocument()
    expect(screen.getByText('Analyseopgave')).toBeInTheDocument()
  })

  it('navigates to submission when item is clicked', () => {
    renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
    const item = screen.getByText('To-Do App')
    fireEvent.click(item)
    expect(mockNavigate).toHaveBeenCalledWith('/submission/2/204')
  })

  it('navigates to calendar when footer button is clicked', () => {
    renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
    const btn = screen.getByText(/Se alle deadlines/i)
    fireEvent.click(btn)
    expect(mockNavigate).toHaveBeenCalledWith('/calendar')
  })

  it('renders correctly in English', () => {
    useStore.setState({ lang: 'en' })
    renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
    expect(screen.getByText('Monday 09:00')).toBeInTheDocument()
  })

  it('does not navigate when isEditing is true', () => {
    renderWithProviders(<DeadlinesWidget span={12} isEditing={true} />)
    fireEvent.click(screen.getByText('To-Do App'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('does not navigate from footer button when isEditing is true', () => {
    renderWithProviders(<DeadlinesWidget span={12} isEditing={true} />)
    fireEvent.click(screen.getByText(/Se alle deadlines/i))
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('renders only 1 item for small span (4)', () => {
    renderWithProviders(<DeadlinesWidget span={4} isEditing={false} />)
    expect(screen.getByText('To-Do App')).toBeInTheDocument()
    expect(screen.queryByText('Designskitse')).not.toBeInTheDocument()
    expect(screen.queryByText('Analyseopgave')).not.toBeInTheDocument()
  })

  it('renders 2 items for medium span (8)', () => {
    renderWithProviders(<DeadlinesWidget span={8} isEditing={false} />)
    expect(screen.getByText('To-Do App')).toBeInTheDocument()
    expect(screen.getByText('Designskitse')).toBeInTheDocument()
    expect(screen.queryByText('Analyseopgave')).not.toBeInTheDocument()
  })

  it('handles past deadline urgency color', () => {
    // Mock Date.now to be far in the future
    const now = new Date('2026-06-01').getTime()
    vi.spyOn(Date, 'now').mockReturnValue(now)
    
    renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
    // The items should now have the red color class
    // 'To-Do App' subtitle is 'Mandag 09:00'
    expect(screen.getByText('Mandag 09:00')).toHaveClass('text-danger')
    
    vi.restoreAllMocks()
  })

  it('handles overdue deadlines', () => {
    const spy = vi.spyOn(dates, 'getHoursUntil').mockReturnValue(-5)
    
    renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
    const button = screen.getByRole('button', { name: /To-Do App/i })
    expect(button.className).toContain('bg-danger/5')
    
    spy.mockRestore()
  })

  it('supports keyboard focus and navigation', () => {
    renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
    const button = screen.getByRole('button', { name: /To-Do App/i })
    expect(button).toBeInTheDocument()
    button.focus()
    expect(button).toHaveFocus()
  })
})
