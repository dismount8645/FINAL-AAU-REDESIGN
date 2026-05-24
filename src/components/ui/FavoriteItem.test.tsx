import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
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

  const renderItem = (props = {}) => render(
    <MemoryRouter>
      <FavoriteItem
        item={mockItem}
        lang="en"
        onRemove={mockOnRemove}
        onClick={mockOnClick}
        {...props}
      />
    </MemoryRouter>
  )

  it('renders correctly', () => {
    renderItem()
    expect(screen.getByText('Test Course')).toBeInTheDocument()
    expect(screen.getByText('Course')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    renderItem()
    fireEvent.click(screen.getByText('Test Course'))
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('calls onRemove when remove button is clicked', () => {
    renderItem()
    const removeButton = screen.getByLabelText('Remove from favorites')
    fireEvent.click(removeButton)
    expect(mockOnRemove).toHaveBeenCalledWith('course', 101)
  })

  it('renders correctly in Danish', () => {
    renderItem({ lang: 'da' })
    expect(screen.getByText('Kursus')).toBeInTheDocument()
    expect(screen.getByLabelText('Fjern fra favoritter')).toBeInTheDocument()
  })

  it('handles drag events', () => {
    const onDragStart = vi.fn()
    const onDragOver = vi.fn()
    const onDrop = vi.fn()

    renderItem({
      draggable: true,
      onDragStart,
      onDragOver,
      onDrop,
    })

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
