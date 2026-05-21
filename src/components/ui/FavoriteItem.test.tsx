import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FavoriteItem from '@/components/ui/FavoriteItem'
import { BookOpen } from 'lucide-react'

describe('FavoriteItem', () => {
  const mockItem = {
    id: '1',
    type: 'course' as const,
    entityId: 101,
    title: 'Test Course',
    icon: BookOpen,
    iconBg: 'blue',
    iconColor: 'white',
    link: '/course/101',
  }

  const mockOnRemove = vi.fn()
  const mockOnClick = vi.fn()

  it('renders correctly', () => {
    render(
      <FavoriteItem
        item={mockItem}
        lang="en"
        onRemove={mockOnRemove}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText('Test Course')).toBeInTheDocument()
    expect(screen.getByText('Course')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(
      <FavoriteItem
        item={mockItem}
        lang="en"
        onRemove={mockOnRemove}
        onClick={mockOnClick}
      />
    )

    fireEvent.click(screen.getByText('Test Course'))
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('calls onRemove when remove button is clicked', () => {
    render(
      <FavoriteItem
        item={mockItem}
        lang="en"
        onRemove={mockOnRemove}
      />
    )

    const removeButton = screen.getByLabelText('Remove from favorites')
    fireEvent.click(removeButton)

    expect(mockOnRemove).toHaveBeenCalledWith('course', 101)
  })

  it('renders correctly in Danish', () => {
    render(
      <FavoriteItem
        item={mockItem}
        lang="da"
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText('Kursus')).toBeInTheDocument()
    expect(screen.getByLabelText('Fjern fra favoritter')).toBeInTheDocument()
  })

  it('handles drag events', () => {
    const onDragStart = vi.fn()
    const onDragOver = vi.fn()
    const onDrop = vi.fn()

    render(
      <FavoriteItem
        item={mockItem}
        lang="en"
        onRemove={mockOnRemove}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />
    )

    const container = screen.getByText('Test Course').closest('div[draggable="true"]')
    if (!container) throw new Error('Container not found')

    fireEvent.dragStart(container)
    expect(onDragStart).toHaveBeenCalled()

    fireEvent.dragOver(container)
    expect(onDragOver).toHaveBeenCalled()

    fireEvent.drop(container)
    expect(onDrop).toHaveBeenCalled()
  })
})
