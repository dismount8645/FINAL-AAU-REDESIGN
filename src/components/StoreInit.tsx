import { useEffect, type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { env } from '@/lib/env';
import useStore, { computeIsDarkMode } from '@/lib/store';

export default function StoreInit({ children }: { children: ReactNode }) {
  const theme = useStore((s) => s.theme)
  const isDarkMode = useStore((s) => s.isDarkMode)
  const setTheme = useStore((s) => s.setTheme)
  const setIsMobile = useStore((s) => s.setIsMobile)

  // Sync isDarkMode state when theme changes
  useEffect(() => {
    const isDark = computeIsDarkMode(theme)
    if (isDark !== isDarkMode) {
      useStore.setState({ isDarkMode: isDark })
    }
  }, [theme, isDarkMode])

  // Sync theme classes on mount and when isDarkMode changes
  useEffect(() => {
    /* istanbul ignore next */
    if (typeof window === 'undefined') return
    
    document.documentElement.classList.toggle('dark-mode', isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    const handleResize = () => {
      const width = env.getInnerWidth()
      // Mobile: < 768
      const isPhone = width < 768
      setIsMobile(isPhone)

      if (width >= 1024) {
        // Desktop: >= 1024
        useStore.getState().setCollapsed(false)
        useStore.getState().setIsMobileOpen(false)
      } else if (width >= 768) {
        // Tablet: >= 768 and < 1024
        useStore.getState().setCollapsed(true)
        useStore.getState().setIsMobileOpen(false)
      } else {
        // Mobile: < 768
        useStore.getState().setCollapsed(true)
      }
    }

    const mediaQuery = env.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (useStore.getState().theme === 'system') {
        setTheme('system')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [setIsMobile, setTheme])

  return <>{children}</>
}

if (import.meta.vitest) {
  describe('StoreInit', () => {
    beforeEach(() => {
      useStore.setState({
        theme: 'system',
        isDarkMode: false,
        lang: 'da',
        isCollapsed: false,
        isMobile: false,
        isMobileOpen: false,
      })
      document.body.classList.remove('dark-mode', 'sidebar-collapsed', 'mobile-nav-open')
      document.documentElement.classList.remove('dark')
    })
  
    afterEach(() => {
      vi.restoreAllMocks()
    })
  
    it('renders children', () => {
      const { getByText } = render(
        <StoreInit>
          <div>test child</div>
        </StoreInit>
      )
      expect(getByText('test child')).toBeInTheDocument()
    })
  
    it('sets isMobile and isCollapsed appropriately for desktop, tablet, and phone', () => {
      // 1. Desktop (width >= 1024)
      window.innerWidth = 1200
      render(<StoreInit><div /></StoreInit>)
      expect(useStore.getState().isMobile).toBe(false)
      expect(useStore.getState().isCollapsed).toBe(false)
  
      // 2. Tablet (768 <= width < 1024)
      act(() => {
        window.innerWidth = 800
        window.dispatchEvent(new Event('resize'))
      })
      expect(useStore.getState().isMobile).toBe(false)
      expect(useStore.getState().isCollapsed).toBe(true)
  
      // 3. Phone (width < 768)
      act(() => {
        window.innerWidth = 600
        window.dispatchEvent(new Event('resize'))
      })
      expect(useStore.getState().isMobile).toBe(true)
      expect(useStore.getState().isCollapsed).toBe(true)
    })
  
    it('responds to system theme changes when in system mode', () => {
      const listeners: Record<string, (e?: any) => void> = {}
      const addEventListenerSpy = vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        addEventListener: (event: string, handler: (e?: any) => void) => {
          listeners[event] = handler
        },
        removeEventListener: vi.fn(),
      } as any)
  
      useStore.setState({ theme: 'system', isDarkMode: false })
      render(<StoreInit><div /></StoreInit>)
  
      act(() => {
        listeners.change?.()
      })
  
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
  
      addEventListenerSpy.mockRestore()
    })
  
    it('does not apply system theme when theme is not system', () => {
      const listeners: Record<string, (e?: any) => void> = {}
      window.matchMedia = vi.fn().mockReturnValue({
        matches: true,
        addEventListener: (event: string, handler: (e?: any) => void) => {
          listeners[event] = handler
        },
        removeEventListener: vi.fn(),
      }) as any
  
      useStore.setState({ theme: 'dark', isDarkMode: false })
      render(<StoreInit><div /></StoreInit>)
  
      act(() => {
        listeners.change?.()
      })
  
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
      expect(useStore.getState().theme).toBe('dark')
    })
  
    it('cleans up event listeners on unmount', () => {
      window.matchMedia = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as any
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      const { unmount } = render(<StoreInit><div /></StoreInit>)
      unmount()
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      removeEventListenerSpy.mockRestore()
    })
  
    it('toggles dark-mode class on html when isDarkMode changes', () => {
      useStore.setState({ theme: 'dark', isDarkMode: true })
      render(<StoreInit><div /></StoreInit>)
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })
}
