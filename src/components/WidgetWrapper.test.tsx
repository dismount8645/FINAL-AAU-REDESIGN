import { render, screen, fireEvent } from '@testing-library/react'
import { it, expect, vi } from 'vitest'
import { WidgetWrapper } from './WidgetWrapper'
import type { Widget } from '@/types'

const mockResize = vi.fn()
const mockMoveWidget = vi.fn()
const mockToggleVisibility = vi.fn()
const mockOnDragStart = vi.fn()
const mockOnDragEnd = vi.fn()
const mockOnDragOver = vi.fn()
const mockOnDrop = vi.fn()
const mockT = vi.fn((key: string) => key)

vi.mock('@/lib/mockData', () => ({
  WIDGET_CONFIG: {
    test_widget: { rowSpan: 2, tabletSpan: 4 },
  },
}))

vi.mock('@/lib/useResizeHandle', () => ({
  useResizeHandle: () => ({ handleResize: mockResize }),
}))

const baseWidget: Widget = {
  id: 'test_widget',
  type: 'widget',
  span: 6,
  rowSpan: 2,
  x: 0,
  y: 0,
  visible: true,
}

const WidgetComponent = () => <div data-testid="widget-content">Widget Content</div>

function renderWrapper(isEditing = false, isDragged = false, overrides: Partial<Widget> = {}) {
  return render(
    <WidgetWrapper
      widget={{ ...baseWidget, ...overrides }}
      x={baseWidget.x}
      y={baseWidget.y}
      tabletSpan={4}
      mobileSpan={6}
      isEditing={isEditing}
      isDragged={isDragged}
      WidgetComponent={WidgetComponent}
      onDragStart={mockOnDragStart}
      onDragEnd={mockOnDragEnd}
      onDragOver={mockOnDragOver}
      onDrop={mockOnDrop}
      toggleVisibility={mockToggleVisibility}
      resizeWidget={mockResize}
      t={mockT}
      moveWidget={mockMoveWidget}
    />
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

it('renders widget content', () => {
  renderWrapper()
  expect(screen.getByTestId('widget-content')).toBeInTheDocument()
})

it('does not show editing UI when isEditing is false', () => {
  renderWrapper()
  expect(screen.queryByTitle('drag_to_reorder')).not.toBeInTheDocument()
  expect(screen.queryByTitle('hide_widget')).not.toBeInTheDocument()
})

it('shows editing UI when isEditing is true', () => {
  renderWrapper(true)
  expect(screen.getByTitle('drag_to_reorder')).toBeInTheDocument()
  expect(screen.getByLabelText('hide_widget')).toBeInTheDocument()
})

it('applies dragged styles when isDragged is true', () => {
  const { container } = renderWrapper(true, true)
  const gridItem = container.querySelector('[class*="dashboard__widget"]')
  expect(gridItem?.className).toContain('opacity-40')
})

it('calls onDragStart when grid item is dragged', () => {
  renderWrapper(true)
  const gridItem = screen.getByTestId('widget-content').closest('[class*="dashboard__widget"]')!
  fireEvent.dragStart(gridItem)
  expect(mockOnDragStart).toHaveBeenCalled()
})

it('calls toggleVisibility when hide button is clicked', () => {
  renderWrapper(true)
  const hideBtn = screen.getByLabelText('hide_widget')
  fireEvent.click(hideBtn)
  expect(mockToggleVisibility).toHaveBeenCalledWith('test_widget')
})

it('calls moveWidget left on ArrowLeft key', () => {
  renderWrapper(true)
  const gripBtn = screen.getByTitle('drag_to_reorder')
  fireEvent.keyDown(gripBtn, { key: 'ArrowLeft' })
  expect(mockMoveWidget).toHaveBeenCalledWith('test_widget', 'left')
})

it('calls moveWidget right on ArrowRight key', () => {
  renderWrapper(true)
  const gripBtn = screen.getByTitle('drag_to_reorder')
  fireEvent.keyDown(gripBtn, { key: 'ArrowRight' })
  expect(mockMoveWidget).toHaveBeenCalledWith('test_widget', 'right')
})

it('calls resizeWidget width on width handle mousedown', () => {
  renderWrapper(true)
  const handles = document.querySelectorAll('[class*="cursor-ew-resize"]')
  fireEvent.mouseDown(handles[0])
  expect(mockResize).toHaveBeenCalledWith(expect.any(Object), 'width')
})

it('calls resizeWidget height on height handle mousedown', () => {
  renderWrapper(true)
  const handles = document.querySelectorAll('[class*="cursor-ns-resize"]')
  fireEvent.mouseDown(handles[0])
  expect(mockResize).toHaveBeenCalledWith(expect.any(Object), 'height')
})

it('calls resizeWidget on width handle touchstart', () => {
  renderWrapper(true)
  const handles = document.querySelectorAll('[class*="cursor-ew-resize"]')
  fireEvent.touchStart(handles[0])
  expect(mockResize).toHaveBeenCalledWith(expect.any(Object), 'width')
})

it('calls resizeWidget on height handle touchstart', () => {
  renderWrapper(true)
  const handles = document.querySelectorAll('[class*="cursor-ns-resize"]')
  fireEvent.touchStart(handles[0])
  expect(mockResize).toHaveBeenCalledWith(expect.any(Object), 'height')
})

it('calls onDrop with widget id on grid item drop', () => {
  renderWrapper()
  const gridItem = screen.getByTestId('widget-content').closest('[class*="dashboard__widget"]')!
  fireEvent.drop(gridItem)
  expect(mockOnDrop).toHaveBeenCalledWith(expect.any(Object), 'test_widget')
})

it('calls onDragOver on grid item dragover', () => {
  renderWrapper()
  const gridItem = screen.getByTestId('widget-content').closest('[class*="dashboard__widget"]')!
  fireEvent.dragOver(gridItem)
  expect(mockOnDragOver).toHaveBeenCalled()
})

it('does not render editing UI for non-editing mode', () => {
  renderWrapper()
  expect(screen.queryByText('resize_width')).not.toBeInTheDocument()
})
