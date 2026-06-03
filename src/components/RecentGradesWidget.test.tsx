import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RecentGradesWidget from '@/components/RecentGradesWidget'
import { renderWithProviders } from '@/lib/test-utils'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('RecentGradesWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly for large span (12)', () => {
    renderWithProviders(<RecentGradesWidget span={12} isEditing={false} />)
    expect(screen.getByText(/Seneste karakterer/i)).toBeInTheDocument()
    expect(screen.getByText('Digital Design')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders correctly for small span (4)', () => {
    renderWithProviders(<RecentGradesWidget span={4} isEditing={false} />)
    // Should show 2 items
    expect(screen.getByText('Digital Design')).toBeInTheDocument()
    expect(screen.getByText('Videnskabsteori')).toBeInTheDocument()
    expect(screen.queryByText('Webudvikling')).not.toBeInTheDocument()
  })

  it('navigates to grades when footer button is clicked', () => {
    renderWithProviders(<RecentGradesWidget span={12} isEditing={false} />)
    const btn = screen.getByText(/Se alle/i)
    fireEvent.click(btn)
    expect(mockNavigate).toHaveBeenCalledWith('/grades')
  })

  it('does not navigate when isEditing is true', () => {
    renderWithProviders(<RecentGradesWidget span={12} isEditing={true} />)
    const btn = screen.getByText(/Se alle/i)
    fireEvent.click(btn)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('shows "not graded" badge for ungraded courses', () => {
    renderWithProviders(<RecentGradesWidget span={12} isEditing={false} />)
    expect(screen.getByText('Ikke bedømt')).toBeInTheDocument()
  })

  it('renders 2 items for medium span (8)', () => {
    renderWithProviders(<RecentGradesWidget span={8} isEditing={false} />)
    expect(screen.getByText('Digital Design')).toBeInTheDocument()
    expect(screen.getByText('Videnskabsteori')).toBeInTheDocument()
    expect(screen.queryByText('Webudvikling')).not.toBeInTheDocument()
  })
})
