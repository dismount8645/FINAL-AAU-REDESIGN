import { useState, useRef, type DragEvent } from 'react';
import { DEFAULT_WIDGETS } from '@/data/mockData';
import type { Widget } from '@/types';

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
    setWidgets(widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)));
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
