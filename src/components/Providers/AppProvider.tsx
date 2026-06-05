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
    /* istanbul ignore next */
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

/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  const { render, screen, act } = await import('@testing-library/react');
  
  describe('AppProvider', () => {
    beforeEach(() => {
      useStore.setState({
        theme: 'system',
        isDarkMode: false,
        isMobile: false,
        isCollapsed: false,
        isMobileOpen: false,
      });
      if (typeof document !== 'undefined') {
        document.documentElement.className = '';
      }
    });

    it('renders children and provides ToastProvider context', () => {
      render(
        <AppProvider>
          <div data-testid="child">Child Content</div>
        </AppProvider>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('syncs dark mode class when theme changes', () => {
      render(
        <AppProvider>
          <div>Content</div>
        </AppProvider>
      );

      // Change store theme to dark
      act(() => {
        useStore.setState({ theme: 'dark' });
      });
      expect(useStore.getState().isDarkMode).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // Change store theme to light
      act(() => {
        useStore.setState({ theme: 'light' });
      });
      expect(useStore.getState().isDarkMode).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('listens to resize and updates mobile/collapsed state', () => {
      const getInnerWidthMock = vi.spyOn(env, 'getInnerWidth');
      
      render(
        <AppProvider>
          <div>Content</div>
        </AppProvider>
      );

      // Width >= 1024
      getInnerWidthMock.mockReturnValue(1024);
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      expect(useStore.getState().isMobile).toBe(false);
      expect(useStore.getState().isCollapsed).toBe(false);

      // Width >= 768 and < 1024
      getInnerWidthMock.mockReturnValue(800);
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      expect(useStore.getState().isMobile).toBe(false);
      expect(useStore.getState().isCollapsed).toBe(true);

      // Width < 768
      getInnerWidthMock.mockReturnValue(500);
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      expect(useStore.getState().isMobile).toBe(true);
      expect(useStore.getState().isCollapsed).toBe(true);

      getInnerWidthMock.mockRestore();
    });

    it('handles prefers-color-scheme change', () => {
      let changeCallback: any;
      const mediaQueryMock = {
        matches: true,
        addEventListener: vi.fn((event, cb) => {
          if (event === 'change') changeCallback = cb;
        }),
        removeEventListener: vi.fn(),
      } as any;
      const matchMediaSpy = vi.spyOn(env, 'matchMedia').mockReturnValue(mediaQueryMock);

      render(
        <AppProvider>
          <div>Content</div>
        </AppProvider>
      );

      act(() => {
        useStore.setState({ theme: 'system' });
      });

      // Trigger change
      act(() => {
        changeCallback();
      });

      expect(useStore.getState().theme).toBe('system');

      // Now set theme to 'dark' and trigger again to cover the else branch
      act(() => {
        useStore.setState({ theme: 'dark' });
      });
      act(() => {
        changeCallback();
      });
      expect(useStore.getState().theme).toBe('dark');

      matchMediaSpy.mockRestore();
    });
  });
}
