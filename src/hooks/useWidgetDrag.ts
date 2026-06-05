import { useState, useRef, type DragEvent } from 'react';


import { DEFAULT_WIDGETS } from '@/lib/data';
import type { Widget } from '@/lib/types';

interface UseWidgetDragReturn {
  widgets: Widget[];
  resizeWidget: (id: string, newSpan: number, newRowSpan?: number) => void;
  toggleVisibility: (id: string) => void;
  resetWidgets: () => void;
  onDragStart: (e: DragEvent<HTMLElement>, id: string, isEditing: boolean) => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent<HTMLElement>, targetId?: string) => void;
  onDrop: (e: DragEvent<HTMLElement>, x: number | string, y?: number) => void;
  draggedItemId: string | null;
  moveWidget: (id: string, direction: 'left' | 'right') => void;
}

export function useWidgetDrag(initialWidgets: Widget[]): UseWidgetDragReturn {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const lastSwapTime = useRef<number>(0);

  const resizeWidget = (id: string, newSpan: number, newRowSpan?: number) => {
    setWidgets(prev => prev.map((w) => (w.id === id ? { ...w, span: newSpan, ...(newRowSpan !== undefined ? { rowSpan: newRowSpan } : {}) } : w)));
  };

  const toggleVisibility = (id: string) => {
    setWidgets(prev => prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)));
  };

  const onDragStart = (e: DragEvent<HTMLElement>, id: string, isEditing: boolean) => {
    if (!isEditing) return;
    setDraggedItemId(id);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', id);
    }
  };
const onDrop = (e: DragEvent<HTMLElement>, x: number | string, y?: number) => {
  e.preventDefault();
  if (!draggedItemId) return;

  setWidgets((prevWidgets) => {
    return prevWidgets.map((w) => {
      if (w.id === draggedItemId) {
        // Update X/Y coordinates based on the drop target if they are numbers
        if (typeof x === 'number' && typeof y === 'number') {
          return { ...w, x, y };
        }
      }
      return w;
    });
  });

  setDraggedItemId(null);
};
  const onDragEnd = () => setDraggedItemId(null);

  const onDragOver = (e: DragEvent<HTMLElement>, targetId?: string) => {
    e.preventDefault();
    if (!draggedItemId) return;
    
    // If hovering over a placeholder (targetId is undefined), just allow dropping.
    // If hovering over an existing widget, perform swap.
    if (!targetId || draggedItemId === targetId) return;

    const now = Date.now();
    if (now - lastSwapTime.current < 200) return;

    lastSwapTime.current = now;
    const draggedIdx = widgets.findIndex((w) => w.id === draggedItemId);
    const targetIdx = widgets.findIndex((w) => w.id === targetId);

    if (draggedIdx === -1 || targetIdx === -1) return;

    const newWidgets = [...widgets];
    const [removed] = newWidgets.splice(draggedIdx, 1);
    newWidgets.splice(targetIdx, 0, removed);
    setWidgets(newWidgets);
  };

  const moveWidget = (id: string, direction: 'left' | 'right') => {
    setWidgets((prev) => {
      const idx = prev.findIndex((w) => w.id === id);
      if (idx === -1) return prev;

      const visibleIds = prev.filter((w) => w.visible).map((w) => w.id);
      const visibleIdx = visibleIds.indexOf(id);
      if (visibleIdx === -1) return prev;

      let targetVisibleIdx = -1;
      if (direction === 'left') {
        if (visibleIdx > 0) {
          targetVisibleIdx = visibleIdx - 1;
        }
      } else {
        if (visibleIdx < visibleIds.length - 1) {
          targetVisibleIdx = visibleIdx + 1;
        }
      }

      if (targetVisibleIdx === -1) return prev;

      const targetId = visibleIds[targetVisibleIdx];
      const targetIdx = prev.findIndex((w) => w.id === targetId);

      if (targetIdx === -1) return prev;

      const newWidgets = [...prev];
      const temp = newWidgets[idx];
      newWidgets[idx] = newWidgets[targetIdx];
      newWidgets[targetIdx] = temp;
      return newWidgets;
    });
  };

  const resetWidgets = () => setWidgets(DEFAULT_WIDGETS);

  return { widgets, resizeWidget, toggleVisibility, resetWidgets, onDragStart, onDragEnd, onDragOver, onDrop, draggedItemId, moveWidget };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
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

    it('onDrop does nothing if draggedItemId is null', () => {
      const { result } = renderHook(() => useWidgetDrag(initialWidgets))
      const dropEvent = { preventDefault: vi.fn() }
      act(() => result.current.onDrop(dropEvent as any, 0, 0))
      expect(result.current.widgets).toEqual(initialWidgets)
    })

    it('onDrop updates coordinates when x and y are numbers', () => {
      const { result } = renderHook(() => useWidgetDrag(initialWidgets))
      const dragStartEvent = {
        dataTransfer: { effectAllowed: null, setData: vi.fn() },
        preventDefault: vi.fn(),
      }
      act(() => result.current.onDragStart(dragStartEvent as any, 'w1', true))
      
      const dropEvent = { preventDefault: vi.fn() }
      act(() => result.current.onDrop(dropEvent as any, 5, 10))
      
      const w1 = result.current.widgets.find(w => w.id === 'w1')
      expect(w1?.x).toBe(5)
      expect(w1?.y).toBe(10)
    })

    it('onDrop does not update coordinates when x is not a number', () => {
      const { result } = renderHook(() => useWidgetDrag(initialWidgets))
      const dragStartEvent = {
        dataTransfer: { effectAllowed: null, setData: vi.fn() },
        preventDefault: vi.fn(),
      }
      act(() => result.current.onDragStart(dragStartEvent as any, 'w1', true))
      
      const dropEvent = { preventDefault: vi.fn() }
      act(() => result.current.onDrop(dropEvent as any, 'w2'))
      
      const w1 = result.current.widgets.find(w => w.id === 'w1')
      expect(w1?.x).toBeUndefined()
    })

    it('resetWidgets resets to default widgets', () => {
      const { result } = renderHook(() => useWidgetDrag(initialWidgets))
      act(() => result.current.resetWidgets())
      expect(result.current.widgets).toEqual(DEFAULT_WIDGETS)
    })

    it('onDragOver returns early when targetId is undefined', () => {
      const { result } = renderHook(() => useWidgetDrag(initialWidgets))
      const mockEvent = { preventDefault: vi.fn() }

      act(() => result.current.onDragStart(mockEvent as any, 'w1', true))
      act(() => result.current.onDragOver(mockEvent as any, undefined))

      expect(result.current.widgets).toEqual(initialWidgets)
    })

    it('moveWidget does not move left from first position', () => {
      const { result } = renderHook(() => useWidgetDrag(initialWidgets))
      act(() => result.current.moveWidget('w1', 'left'))
      expect(result.current.widgets.map(w => w.id)).toEqual(['w1', 'w2'])
    })

    it('moveWidget does not move right from last position', () => {
      const { result } = renderHook(() => useWidgetDrag(initialWidgets))
      act(() => result.current.moveWidget('w2', 'right'))
      expect(result.current.widgets.map(w => w.id)).toEqual(['w1', 'w2'])
    })
  })
}
