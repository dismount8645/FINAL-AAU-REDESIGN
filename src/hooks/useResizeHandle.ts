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

if (import.meta.vitest) {
  describe('useResizeHandle', () => {
    it('returns handleResize function', () => {
      const onResize = vi.fn()
      const { result } = renderHook(() => useResizeHandle('w1', 4, 2, onResize))
      expect(typeof result.current.handleResize).toBe('function')
    })
  
    it('attaches mousemove listener on mouse event', () => {
      const onResize = vi.fn()
      const { result } = renderHook(() => useResizeHandle('w1', 4, 2, onResize))
  
      const addSpy = vi.spyOn(document, 'addEventListener')
      const e = { stopPropagation: vi.fn(), cancelable: true, preventDefault: vi.fn(), clientX: 100, clientY: 200, button: 0 } as unknown as React.MouseEvent<HTMLElement>
  
      result.current.handleResize(e, 'width')
      expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
      expect(addSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
      addSpy.mockRestore()
    })
  
    it('attaches touch listeners on touch event', () => {
      const onResize = vi.fn()
      const { result } = renderHook(() => useResizeHandle('w1', 4, 2, onResize))
  
      const addSpy = vi.spyOn(document, 'addEventListener')
      const touches = [{ clientX: 100, clientY: 200 }]
      const e = { stopPropagation: vi.fn(), cancelable: true, preventDefault: vi.fn(), touches } as unknown as React.TouchEvent<HTMLElement>
  
      result.current.handleResize(e, 'height')
      expect(addSpy.mock.calls.some(call => call[0] === 'touchmove')).toBe(true)
      expect(addSpy.mock.calls.some(call => call[0] === 'touchend')).toBe(true)
      addSpy.mockRestore()
    })
  
    it('does not call preventDefault if not cancelable', () => {
      const onResize = vi.fn()
      const { result } = renderHook(() => useResizeHandle('w1', 4, 2, onResize))
  
      const preventDefault = vi.fn()
      const e = { stopPropagation: vi.fn(), cancelable: false, preventDefault, clientX: 100, clientY: 200, button: 0 } as unknown as React.MouseEvent<HTMLElement>
  
      result.current.handleResize(e, 'width')
      expect(preventDefault).not.toHaveBeenCalled()
    })
  
    it('calls onResize when mouse moves', () => {
      const onResize = vi.fn()
      const { result } = renderHook(() => useResizeHandle('w1', 4, 2, onResize))
  
      const preventDefault = vi.fn()
      const mouseDown = { stopPropagation: vi.fn(), cancelable: true, preventDefault, clientX: 100, clientY: 200, button: 0 } as unknown as React.MouseEvent<HTMLElement>
  
      result.current.handleResize(mouseDown, 'width')
      const moveEvent = new MouseEvent('mousemove', { clientX: 150, clientY: 200 })
      document.dispatchEvent(moveEvent)
      expect(onResize).toHaveBeenCalledWith('w1', 5, 2)
    })
  
    it('constrains span within bounds', () => {
      const onResize = vi.fn()
      const { result } = renderHook(() => useResizeHandle('w1', 1, 1, onResize))
  
      const preventDefault = vi.fn()
      const mouseDown = { stopPropagation: vi.fn(), cancelable: true, preventDefault, clientX: 100, clientY: 200, button: 0 } as unknown as React.MouseEvent<HTMLElement>
  
      result.current.handleResize(mouseDown, 'width')
      const moveEvent = new MouseEvent('mousemove', { clientX: -1000, clientY: 200 })
      document.dispatchEvent(moveEvent)
      expect(onResize).toHaveBeenCalledWith('w1', 1, 1)
    })
  
    it('cleans up listeners on mouseup', () => {
      const onResize = vi.fn()
      const { result } = renderHook(() => useResizeHandle('w1', 4, 2, onResize))
  
      const removeSpy = vi.spyOn(document, 'removeEventListener')
      const preventDefault = vi.fn()
      const mouseDown = { stopPropagation: vi.fn(), cancelable: true, preventDefault, clientX: 100, clientY: 200, button: 0 } as unknown as React.MouseEvent<HTMLElement>
  
      result.current.handleResize(mouseDown, 'width')
      document.dispatchEvent(new MouseEvent('mouseup'))
      expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
      expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
      removeSpy.mockRestore()
    })
  
    it('only updates width span on width resize', () => {
      const onResize = vi.fn()
      const { result } = renderHook(() => useResizeHandle('w1', 4, 2, onResize))
  
      const mouseDown = { stopPropagation: vi.fn(), cancelable: true, preventDefault: vi.fn(), clientX: 100, clientY: 200, button: 0 } as unknown as React.MouseEvent<HTMLElement>
  
      result.current.handleResize(mouseDown, 'height')
      const moveEvent = new MouseEvent('mousemove', { clientX: 150, clientY: 300 })
      document.dispatchEvent(moveEvent)
      expect(onResize).toHaveBeenCalledWith('w1', 4, 4)
    })
  
    it('restores user-select after mouseup', () => {
      const onResize = vi.fn()
      const { result } = renderHook(() => useResizeHandle('w1', 4, 2, onResize))
  
      document.body.style.userSelect = 'text'
      const mouseDown = { stopPropagation: vi.fn(), cancelable: true, preventDefault: vi.fn(), clientX: 100, clientY: 200, button: 0 } as unknown as React.MouseEvent<HTMLElement>
  
      result.current.handleResize(mouseDown, 'width')
      expect(document.body.style.userSelect).toBe('none')
      document.dispatchEvent(new MouseEvent('mouseup'))
      expect(document.body.style.userSelect).toBe('')
    })

    it('handles touch events correctly', () => {
      const onResize = vi.fn()
      const { result } = renderHook(() => useResizeHandle('w1', 4, 2, onResize))

      const preventDefault = vi.fn()
      const touchStart = {
        stopPropagation: vi.fn(),
        cancelable: true,
        preventDefault,
        touches: [{ clientX: 100, clientY: 200 }],
      } as unknown as React.TouchEvent<HTMLElement>

      result.current.handleResize(touchStart, 'width')
      
      const touchMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 150, clientY: 200 } as any],
      } as any)
      document.dispatchEvent(touchMove)
      expect(onResize).toHaveBeenCalledWith('w1', 5, 2)

      document.dispatchEvent(new TouchEvent('touchend'))
    })
  })
}
