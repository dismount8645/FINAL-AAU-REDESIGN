import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ForumWidget from '@/widgets/ForumWidget'
import { renderWithProviders } from '@/test/test-utils'
import useStore from '@/store/useStore'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ForumWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useStore.setState({ lang: 'da' })
  })

  it('renders correctly', () => {
    renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
    expect(screen.getByText('Kursusforum')).toBeInTheDocument()
    expect(screen.getByText('Spørgsmål til litteraturen i uge 2')).toBeInTheDocument()
    expect(screen.getByText('Prof. Hansen')).toBeInTheDocument()
  })

  it('renders correctly in English', () => {
    useStore.setState({ lang: 'en' })
    
    renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
    expect(screen.getByText('Questions regarding literature week 2')).toBeInTheDocument()
    expect(screen.getByText('Prof. Hansen')).toBeInTheDocument()
  })

  it('renders medium number of items for span 8', () => {
    renderWithProviders(<ForumWidget span={8} isEditing={false} professor="Prof. Hansen" />)
    const replyCounts = document.querySelectorAll('.forum-list-item__reply-count')
    expect(replyCounts.length).toBe(2)
  })

  it('renders only 1 item for small span (4)', () => {
    renderWithProviders(<ForumWidget span={4} isEditing={false} professor="Prof. Hansen" />)
    const replyCounts = document.querySelectorAll('.forum-list-item__reply-count')
    expect(replyCounts.length).toBe(1)
  })

  it('shows important badge for important posts', () => {
    renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
    expect(screen.getByText('Vigtigt')).toBeInTheDocument()
  })

  it('button is disabled when isEditing is true', () => {
    renderWithProviders(<ForumWidget span={12} isEditing={true} professor="Prof. Hansen" />)
    const btn = screen.getByRole('button', { name: /nyt indlæg/i })
    expect(btn).toBeDisabled()
  })

  it('navigates to forum post when post is clicked', () => {
    renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
    const item = screen.getByText('Spørgsmål til litteraturen i uge 2')
    fireEvent.click(item)
    expect(mockNavigate).toHaveBeenCalledWith('/forum/1')
  })

  it('navigates to new post when button is clicked', () => {
    renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
    const btn = screen.getByRole('button', { name: /nyt indlæg/i })
    fireEvent.click(btn)
    expect(mockNavigate).toHaveBeenCalledWith('/forum/new')
  })
})
