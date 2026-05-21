import { useCallback } from 'react';

export function useResizeHandle(
  widgetId: string,
  initialSpan: number,
  initialRowSpan: number,
  onResize: (id: string, newSpan: number, newRowSpan: number) => void
) {
  const handleResize = useCallback((
    e: React.MouseEvent,
    type: 'width' | 'height'
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startSpan = initialSpan;
    const startRowSpan = initialRowSpan;

    const onMouseMove = (moveE: MouseEvent) => {
      const deltaX = moveE.clientX - startX;
      const deltaY = moveE.clientY - startY;

      const newSpan = type === 'width' 
        ? Math.max(1, Math.min(24, startSpan + Math.round(deltaX / 50))) // Adjusted sensitivity and safe bounds [1, 24]
        : startSpan;
      const newRowSpan = type === 'height' 
        ? Math.max(1, Math.min(12, startRowSpan + Math.round(deltaY / 50))) 
        : startRowSpan;

      onResize(widgetId, newSpan, newRowSpan);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = '';
    };

    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [widgetId, initialSpan, initialRowSpan, onResize]);

  return { handleResize };
}
