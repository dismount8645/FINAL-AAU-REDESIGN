import { useEffect, type ReactNode } from 'react';
import useStore, { computeIsDarkMode } from '@/store';
import { env } from '@/lib/env';
import { ToastProvider } from '@/components/ui/Toast';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
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
    if (typeof window === 'undefined') return
    
    document.documentElement.classList.toggle('dark-mode', isDarkMode)
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

  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
