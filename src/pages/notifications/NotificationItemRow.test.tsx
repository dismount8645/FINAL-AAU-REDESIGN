import { render, screen, fireEvent } from '@testing-library/react'
import { it, expect, vi } from 'vitest'
import NotificationItemRow from './NotificationItemRow'
import type { NotificationItem } from './types'

const mockOnSelect = vi.fn()
const mockOnMarkRead = vi.fn()
const mockOnArchive = vi.fn()
const mockOnRestore = vi.fn()
const mockT = vi.fn((key: string) => key)

vi.mock('@/utils/dates', () => ({
  formatTime: () => '2 hours ago',
}))

vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react')
  return {
    ...actual,
    Info: () => <svg data-testid="mock-icon" />,
  }
})

const baseNotif: NotificationItem = {
  id: 1,
  type: 'Info',
  text: 'Test notification',
  course: 'DD101',
  date: new Date('2024-01-15'),
  isRead: false,
  archived: false,
  content: '',
  link: '',
}

function renderRow(overrides: Partial<NotificationItem> = {}, view: 'active' | 'archive' = 'active', isSelected = false) {
  const getIcon = vi.fn(() => {
    const { Info } = require('lucide-react')
    return Info
  })

  return render(
    <NotificationItemRow
      notif={{ ...baseNotif, ...overrides }}
      isSelected={isSelected}
      view={view}
      lang="da"
      t={mockT}
      getIcon={getIcon}
      onSelect={mockOnSelect}
      onMarkRead={mockOnMarkRead}
      onArchive={mockOnArchive}
      onRestore={mockOnRestore}
    />
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

it('renders notification type, course and text', () => {
  renderRow()
  expect(screen.getByText('Info')).toBeInTheDocument()
  expect(screen.getByText('DD101')).toBeInTheDocument()
  expect(screen.getByText('Test notification')).toBeInTheDocument()
})

it('renders formatted time', () => {
  renderRow()
  expect(screen.getByText('2 hours ago')).toBeInTheDocument()
})

it('shows unread indicator when notif is not read', () => {
  const { container } = renderRow({ isRead: false })
  expect(container.querySelector('.is-unread')).toBeInTheDocument()
})

it('shows active indicator when selected', () => {
  const { container } = renderRow({}, 'active', true)
  expect(container.querySelector('.panel-active-indicator')).toBeInTheDocument()
})

it('does not show active indicator when not selected', () => {
  const { container } = renderRow({}, 'active', false)
  expect(container.querySelector('.panel-active-indicator')).not.toBeInTheDocument()
})

it('calls onSelect when clicked', () => {
  renderRow()
  fireEvent.click(screen.getByText('Test notification').closest('[role="button"]')!)
  expect(mockOnSelect).toHaveBeenCalled()
})

it('calls onSelect on Enter key', () => {
  renderRow()
  const el = screen.getByText('Test notification').closest('[role="button"]')!
  fireEvent.keyDown(el, { key: 'Enter' })
  expect(mockOnSelect).toHaveBeenCalled()
})

it('calls onSelect on Space key', () => {
  renderRow()
  const el = screen.getByText('Test notification').closest('[role="button"]')!
  fireEvent.keyDown(el, { key: ' ' })
  expect(mockOnSelect).toHaveBeenCalled()
})

it('shows mark as read button when unread', () => {
  renderRow({ isRead: false })
  expect(screen.getByLabelText('mark_as_read')).toBeInTheDocument()
})

it('hides mark as read button when already read', () => {
  renderRow({ isRead: true })
  expect(screen.queryByLabelText('mark_as_read')).not.toBeInTheDocument()
})

it('calls onMarkRead when mark as read button clicked', () => {
  renderRow({ isRead: false })
  fireEvent.click(screen.getByLabelText('mark_as_read'))
  expect(mockOnMarkRead).toHaveBeenCalledWith(1, expect.any(Object))
})

it('shows archive button in active view', () => {
  renderRow({}, 'active')
  expect(screen.getByLabelText('archive')).toBeInTheDocument()
})

it('shows restore button in archive view', () => {
  renderRow({}, 'archive')
  expect(screen.getByLabelText('restore')).toBeInTheDocument()
})

it('calls onArchive in active view', () => {
  renderRow({}, 'active')
  fireEvent.click(screen.getByLabelText('archive'))
  expect(mockOnArchive).toHaveBeenCalledWith(1, expect.any(Object))
})

it('calls onRestore in archive view', () => {
  renderRow({}, 'archive')
  fireEvent.click(screen.getByLabelText('restore'))
  expect(mockOnRestore).toHaveBeenCalledWith(1, expect.any(Object))
})
