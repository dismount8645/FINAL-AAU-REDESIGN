import { useCallback, useEffect, useRef } from 'react';

export function useResizeHandle(
  widgetId: string,
  initialSpan: number,
  initialRowSpan: number,
  onResize: (id: string, newSpan: number, newRowSpan: number) => void
) {
  const activeListenersRef = useRef<{
    onMove: (e: MouseEvent | TouchEvent) => void;
    onEnd: () => void;
    isTouch: boolean;
  } | null>(null);

  const handleResize = useCallback((
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    type: 'width' | 'height'
  ) => {
    e.stopPropagation();
    
    if (e.cancelable) {
      e.preventDefault();
    }

    const isTouch = 'touches' in e;
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;
    const startSpan = initialSpan;
    const startRowSpan = initialRowSpan;

    const onMove = (moveE: MouseEvent | TouchEvent) => {
      const currentX = 'touches' in moveE ? moveE.touches[0].clientX : moveE.clientX;
      const currentY = 'touches' in moveE ? moveE.touches[0].clientY : moveE.clientY;
      
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      const newSpan = type === 'width' 
        ? Math.max(1, Math.min(24, startSpan + Math.round(deltaX / 50)))
        : startSpan;
      const newRowSpan = type === 'height' 
        ? Math.max(1, Math.min(12, startRowSpan + Math.round(deltaY / 50))) 
        : startRowSpan;

      onResize(widgetId, newSpan, newRowSpan);
    };

    const onEnd = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.body.style.userSelect = '';
      activeListenersRef.current = null;
    };

    activeListenersRef.current = { onMove, onEnd, isTouch };

    document.body.style.userSelect = 'none';
    if (isTouch) {
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    } else {
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
    }
  }, [widgetId, initialSpan, initialRowSpan, onResize]);

  useEffect(() => {
    return () => {
      if (activeListenersRef.current) {
        const { onMove, onEnd, isTouch } = activeListenersRef.current;
        if (isTouch) {
          document.removeEventListener('touchmove', onMove);
          document.removeEventListener('touchend', onEnd);
        } else {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onEnd);
        }
        document.body.style.userSelect = '';
      }
    };
  }, []);

  return { handleResize };
}
