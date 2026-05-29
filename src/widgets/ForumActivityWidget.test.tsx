import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ForumActivityWidget from '@/widgets/ForumActivityWidget'
import { renderWithProviders } from '@/test/test-utils'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ForumActivityWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    renderWithProviders(<ForumActivityWidget span={12} isEditing={false} />)
    expect(screen.getByText('Forum aktivitet')).toBeInTheDocument()
    expect(screen.getByText('Spørgsmål til teksten')).toBeInTheDocument()
    expect(screen.getByText('Gruppesøgning')).toBeInTheDocument()
    expect(screen.getByText('Pensumliste')).toBeInTheDocument()
  })

  it('renders limited number of items based on span', () => {
    renderWithProviders(<ForumActivityWidget span={4} isEditing={false} />)
    expect(screen.getByText('Spørgsmål til teksten')).toBeInTheDocument()
    expect(screen.queryByText('Pensumliste')).not.toBeInTheDocument()
  })

  it('renders 2 items for medium span (8) without snippets', () => {
    renderWithProviders(<ForumActivityWidget span={8} isEditing={false} />)
    expect(screen.getByText('Spørgsmål til teksten')).toBeInTheDocument()
    expect(screen.getByText('Gruppesøgning')).toBeInTheDocument()
    expect(screen.queryByText('Pensumliste')).not.toBeInTheDocument()
    expect(screen.queryByText(/Jeg har lagt de nye slides op nu/)).not.toBeInTheDocument()
  })

  it('shows snippets for large span', () => {
    renderWithProviders(<ForumActivityWidget span={12} isEditing={false} />)
    expect(screen.getByText(/Jeg har lagt de nye slides op nu/)).toBeInTheDocument()
  })

  it('navigates to courses when view all is clicked', () => {
    renderWithProviders(<ForumActivityWidget span={12} isEditing={false} />)
    const btn = screen.getByText('Se alle')
    fireEvent.click(btn)
    expect(mockNavigate).toHaveBeenCalledWith('/courses')
  })

  it('does not navigate when isEditing is true', () => {
    renderWithProviders(<ForumActivityWidget span={12} isEditing={true} />)
    const btn = screen.getByText('Se alle')
    fireEvent.click(btn)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('navigates to forum post when activity item is clicked', () => {
    renderWithProviders(<ForumActivityWidget span={12} isEditing={false} />)
    const item = screen.getByText('Spørgsmål til teksten')
    fireEvent.click(item)
    expect(mockNavigate).toHaveBeenCalledWith('/forum/1')
  })

  it('does not navigate on activity item click when isEditing is true', () => {
    renderWithProviders(<ForumActivityWidget span={12} isEditing={true} />)
    const item = screen.getByText('Spørgsmål til teksten')
    fireEvent.click(item)
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
