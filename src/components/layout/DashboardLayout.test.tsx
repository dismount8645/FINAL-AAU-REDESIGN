import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Mock useWidgetDrag
const mockOnDragStart = vi.fn()
const mockOnDragEnd = vi.fn()
const mockOnDragOver = vi.fn()

vi.mock('@/hooks/useWidgetDrag', () => ({
  useWidgetDrag: (initialWidgets: any) => ({
    widgets: initialWidgets,
    onDragStart: mockOnDragStart,
    onDragEnd: mockOnDragEnd,
    onDragOver: mockOnDragOver
  })
}))

describe('DashboardLayout', () => {
  const mockWidgets = [
    { id: '1', title: 'Widget 1', span: 6, visible: true },
    { id: '2', title: 'Widget 2', span: 6, visible: true },
    { id: '3', title: 'Widget 3', span: 12, visible: false }
  ]

  it('renders title and visible widgets', () => {
    render(<DashboardLayout title="My Dashboard" widgets={mockWidgets} />)
    
    expect(screen.getByText('My Dashboard')).toBeInTheDocument()
    
    const items = document.querySelectorAll('[draggable="true"]')
    expect(items.length).toBe(2)
  })

  it('calls drag handlers on interaction', () => {
    render(<DashboardLayout title="My Dashboard" widgets={mockWidgets} />)
    
    const widget = document.querySelectorAll('[draggable="true"]')[0]
    
    fireEvent.dragStart(widget)
    expect(mockOnDragStart).toHaveBeenCalled()
    
    fireEvent.dragEnd(widget)
    expect(mockOnDragEnd).toHaveBeenCalled()
    
    fireEvent.dragOver(widget)
    expect(mockOnDragOver).toHaveBeenCalled()
  })

  it('uses default widgets if none provided', () => {
    render(<DashboardLayout title="Default Dashboard" />)
    expect(screen.getByText('Default Dashboard')).toBeInTheDocument()
  })
})
