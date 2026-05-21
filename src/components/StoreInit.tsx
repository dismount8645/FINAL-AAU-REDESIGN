import { useEffect, type ReactNode } from 'react'
import useStore, { computeIsDarkMode } from '@/store/useStore'
import { env } from '@/utils/env'

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
    
    document.body.classList.toggle('dark-mode', isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    const handleResize = () => {
      const width = env.getInnerWidth()
      const isPhone = width < 768
      setIsMobile(isPhone)

      if (width >= 1024) {
        useStore.getState().setCollapsed(false)
        useStore.getState().setIsMobileOpen(false)
      } else if (width >= 768) {
        useStore.getState().setCollapsed(true)
        useStore.getState().setIsMobileOpen(false)
      } else {
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
