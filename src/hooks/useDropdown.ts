import { useState, useRef, useEffect, useCallback } from 'react'

export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    buttonRef.current?.focus()
  }, [])

  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const firstItem = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"], button.w-full')
        firstItem?.focus()
      }, 50)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close])

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      close()
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"], button.w-full'))
      const activeIdx = items.indexOf(document.activeElement as HTMLElement)
      let nextIdx = activeIdx
      if (e.key === 'ArrowDown') {
        nextIdx = activeIdx < items.length - 1 ? activeIdx + 1 : 0
      } else {
        nextIdx = activeIdx > 0 ? activeIdx - 1 : items.length - 1
      }
      items[nextIdx]?.focus()
    }
  }

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(true)
    }
  }

  return {
    isOpen,
    setIsOpen,
    dropdownRef,
    menuRef,
    buttonRef,
    close,
    toggle,
    handleMenuKeyDown,
    handleTriggerKeyDown,
  }
}

if (import.meta.vitest) {
  describe('useDropdown', () => {
    it('initializes correctly', () => {
      const { result } = renderHook(() => useDropdown())
      expect(result.current.isOpen).toBe(false)
      expect(result.current.dropdownRef.current).toBeNull()
    })

    it('toggles and closes dropdown', () => {
      const { result } = renderHook(() => useDropdown())
      act(() => {
        result.current.toggle()
      })
      expect(result.current.isOpen).toBe(true)

      act(() => {
        result.current.close()
      })
      expect(result.current.isOpen).toBe(false)
    })

    it('handles document click outside and keydown Escape', () => {
      const { result } = renderHook(() => useDropdown())
      
      const container = document.createElement('div')
      const target = document.createElement('div')
      container.appendChild(target)
      ;(result.current.dropdownRef as any).current = container

      act(() => { result.current.toggle() })
      expect(result.current.isOpen).toBe(true)

      act(() => {
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      })
      expect(result.current.isOpen).toBe(false)

      act(() => { result.current.toggle() })
      expect(result.current.isOpen).toBe(true)

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })
      expect(result.current.isOpen).toBe(false)
    })

    it('focuses first item when opened', () => {
      vi.useFakeTimers()
      const { result } = renderHook(() => useDropdown())
      
      const div = document.createElement('div')
      const menu = document.createElement('div')
      const button = document.createElement('button')
      button.className = 'w-full'
      button.setAttribute('role', 'menuitem')
      menu.appendChild(button)
      div.appendChild(menu)
      
      ;(result.current.dropdownRef as any).current = div
      ;(result.current.menuRef as any).current = menu
      const focusSpy = vi.spyOn(button, 'focus')

      act(() => {
        result.current.toggle()
      })

      act(() => {
        vi.advanceTimersByTime(50)
      })

      expect(focusSpy).toHaveBeenCalled()
      vi.useRealTimers()
    })

    it('handles handleMenuKeyDown', () => {
      const { result } = renderHook(() => useDropdown())

      act(() => { result.current.setIsOpen(true) })
      const eEscape = { key: 'Escape' } as any
      act(() => { result.current.handleMenuKeyDown(eEscape) })
      expect(result.current.isOpen).toBe(false)

      const menu = document.createElement('div')
      const b1 = document.createElement('button')
      b1.className = 'w-full'
      const b2 = document.createElement('button')
      b2.className = 'w-full'
      menu.appendChild(b1)
      menu.appendChild(b2)
      document.body.appendChild(menu)

      const eArrowDown = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
        currentTarget: menu
      } as any

      b1.focus()
      result.current.handleMenuKeyDown(eArrowDown)
      expect(document.activeElement).toBe(b2)

      const eArrowUp = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
        currentTarget: menu
      } as any
      result.current.handleMenuKeyDown(eArrowUp)
      expect(document.activeElement).toBe(b1)

      document.body.removeChild(menu)
    })

    it('handles handleTriggerKeyDown', () => {
      const { result } = renderHook(() => useDropdown())
      const e = { key: 'ArrowDown', preventDefault: vi.fn() } as any
      act(() => {
        result.current.handleTriggerKeyDown(e)
      })
      expect(result.current.isOpen).toBe(true)
    })
  })
}
