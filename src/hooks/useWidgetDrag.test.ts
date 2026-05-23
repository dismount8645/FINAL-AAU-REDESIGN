import { describe, it, expect, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useWidgetDrag } from '@/hooks/useWidgetDrag'

describe('useWidgetDrag', () => {
  const initialWidgets = [
    { id: 'w1', span: 4, visible: true },
    { id: 'w2', span: 8, visible: true },
  ]

  it('initializes with widgets', () => {
    const { result } = renderHook(() => useWidgetDrag(initialWidgets))
    expect(result.current.widgets).toEqual(initialWidgets)
  })

  it('resizes a widget', () => {
    const { result } = renderHook(() => useWidgetDrag(initialWidgets))
    act(() => result.current.resizeWidget('w1', 8))
    expect(result.current.widgets[0].span).toBe(8)
  })

  it('toggles widget visibility', () => {
    const { result } = renderHook(() => useWidgetDrag(initialWidgets))
    act(() => result.current.toggleVisibility('w1'))
    expect(result.current.widgets[0].visible).toBe(false)
  })

  it('handles drag interactions', () => {
    const { result } = renderHook(() => useWidgetDrag(initialWidgets))
    const mockEvent = { 
        dataTransfer: { effectAllowed: null, setData: vi.fn() },
        preventDefault: vi.fn() 
    }
    
    act(() => result.current.onDragStart(mockEvent as any, 'w1', true))
    expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'w1')
    
    // Test onDragOver swapping
    const dragOverEvent = { preventDefault: vi.fn() }
    act(() => result.current.onDragOver(dragOverEvent as any, 'w2'))
    
    // After swapping, w1 should be at index 1 and w2 at index 0 (if swapped)
    // Actually our implementation does splice.
    // If w1 (dragged) is at 0 and target is w2 at 1.
    // removed w1. splice(1, 0, w1). newWidgets = [w2, w1]
    expect(result.current.widgets[0].id).toBe('w2')
    expect(result.current.widgets[1].id).toBe('w1')

    act(() => result.current.onDragEnd())
  })

  it('does not start drag when not editing', () => {
    const { result } = renderHook(() => useWidgetDrag(initialWidgets))
    const mockEvent = {
      dataTransfer: { effectAllowed: null, setData: vi.fn() },
      preventDefault: vi.fn(),
    }
    act(() => result.current.onDragStart(mockEvent as any, 'w1', false))
    expect(mockEvent.dataTransfer.setData).not.toHaveBeenCalled()
  })

  it('throttles rapid drag overs', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useWidgetDrag(initialWidgets))
    const mockEvent = { preventDefault: vi.fn() }

    act(() => result.current.onDragStart(mockEvent as any, 'w1', true))
    act(() => { vi.advanceTimersByTime(200) })

    act(() => result.current.onDragOver(mockEvent as any, 'w2'))
    expect(result.current.widgets[0].id).toBe('w2')

    act(() => result.current.onDragOver(mockEvent as any, 'w2'))
    expect(result.current.widgets[0].id).toBe('w2')
    expect(result.current.widgets[1].id).toBe('w1')

    vi.useRealTimers()
  })

  it('does not swap when target widget is not found', () => {
    const { result } = renderHook(() => useWidgetDrag(initialWidgets))
    const mockEvent = { preventDefault: vi.fn() }

    act(() => result.current.onDragStart(mockEvent as any, 'w1', true))
    act(() => result.current.onDragOver(mockEvent as any, 'nonexistent'))

    expect(result.current.widgets).toEqual(initialWidgets)
  })

  it('moves widget left and right', () => {
    const { result } = renderHook(() => useWidgetDrag([
      { id: 'w1', span: 4, visible: true },
      { id: 'w2', span: 8, visible: true },
      { id: 'w3', span: 6, visible: true },
    ]))

    act(() => result.current.moveWidget('w2', 'right'))
    expect(result.current.widgets.map(w => w.id)).toEqual(['w1', 'w3', 'w2'])

    act(() => result.current.moveWidget('w3', 'left'))
    expect(result.current.widgets.map(w => w.id)).toEqual(['w3', 'w1', 'w2'])
  })
})
