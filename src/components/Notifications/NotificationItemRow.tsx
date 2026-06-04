import { type MouseEvent } from 'react';
import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Check, Archive, Undo2, LucideIcon } from 'lucide-react';
import { type NotificationItem } from '@/components/notificationsTypes';
import Button from '@/components/Button';
import { Stack } from '@/components/LayoutPrimitives';
import { Text } from '@/components/Typography';
import { formatTime } from '@/lib/dates';
import type { Lang } from '@/lib/store';

interface NotificationItemRowProps {
  notif: NotificationItem
  isSelected: boolean
  view: 'active' | 'archive'
  lang: Lang
  t: (key: string) => string
  getIcon: (type: string) => LucideIcon
  onSelect: () => void
  onMarkRead: (id: number, e: MouseEvent) => void
  onArchive: (id: number, e: MouseEvent) => void
  onRestore: (id: number, e: MouseEvent) => void
}

export default function NotificationItemRow({
  notif,
  isSelected,
  view,
  lang,
  t,
  getIcon,
  onSelect,
  onMarkRead,
  onArchive,
  onRestore,
}: NotificationItemRowProps) {
  const Icon = getIcon(notif.type)
  
  return (
    <Stack
      direction="row"
      align="center"
      gap="md"
      className={`notification-item group p-md border-b border-border/40 transition-all duration-150 relative bg-bg-card cursor-pointer hover:bg-bg-hover focus-visible:outline-none focus-visible:shadow-focus ${!notif.isRead ? 'is-unread' : ''} ${isSelected ? 'is-selected bg-primary/5 dark:bg-primary/10' : ''}`}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      {isSelected && (
        <div className="panel-active-indicator" />
      )}
      
      <div className={`notification-icon-wrapper notif-type--${notif.type.toLowerCase()} w-11 h-11 rounded-[var(--radius-xl)] flex items-center justify-center shrink-0 transition-all duration-300 shadow-[var(--shadow-sm)] border border-border/50 ${notif.isRead ? 'opacity-60 grayscale' : 'scale-105'}`}>
        <Icon size={20} strokeWidth={2} className={notif.isRead ? 'text-muted' : 'text-primary'} />
      </div>

      <Stack gap="none" className="notification-content flex-1 min-w-0">
        <Stack direction="row" align="center" gap="xs" className="mb-0.5">
          <Text size="2xs" weight="black" className="text-primary uppercase tracking-tighter opacity-80">{notif.type}</Text>
          <Text size="2xs" muted className="opacity-40">&bull;</Text>
          <Text size="2xs" weight="bold" muted className="truncate">{notif.course}</Text>
        </Stack>
        <Text weight={notif.isRead ? 'medium' : 'black'} size="sm" className={`truncate ${notif.isRead ? 'text-muted' : 'text-main'}`}>{notif.text}</Text>
        <Text size="2xs" muted className="mt-[var(--space-2xs)] opacity-60">
          {formatTime(notif.date, lang)}
        </Text>
      </Stack>

      <div className="notification-meta flex items-center gap-sm shrink-0">
        {!notif.isRead && (
          <div className="w-2 h-2 rounded-[var(--radius-pill)] bg-primary shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.5)]" />
        )}
        <div className="notification-actions flex gap-3xs opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          {!notif.isRead && (
            <Button
              variant="ghost"
              size="icon-sm"
              pill
              icon={Check}
              onClick={(e) => onMarkRead(notif.id, e)}
              title={t('mark_as_read')}
              aria-label={t('mark_as_read')}
              className="bg-bg-card border border-border shadow-[var(--shadow-sm)] hover:border-primary"
            />
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            pill
            icon={view === 'active' ? Archive : Undo2}
            onClick={(e) => (view === 'active' ? onArchive(notif.id, e) : onRestore(notif.id, e))}
            title={view === 'active' ? t('archive') : t('restore')}
            aria-label={view === 'active' ? t('archive') : t('restore')}
            className="bg-bg-card border border-border shadow-[var(--shadow-sm)] hover:border-primary"
          />
        </div>
      </div>
    </Stack>
  )
}


if (import.meta.vitest) {
  const mockOnSelect = vi.fn()
  const mockOnMarkRead = vi.fn()
  const mockOnArchive = vi.fn()
  const mockOnRestore = vi.fn()
  const mockT = vi.fn((key: string) => key)
  
  vi.mock('@/lib/dates', async () => {
    const actual = await vi.importActual('@/lib/dates')
    return {
      ...actual,
      formatTime: () => '2 hours ago',
    }
  })
  
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
}
