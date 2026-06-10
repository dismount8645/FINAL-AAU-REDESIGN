import { useEffect, type ReactNode } from 'react';
import useStore from '@/store';
import { env } from '@/lib/env';
import { ToastProvider } from '@/components/ui/Toast';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const isDarkMode = useStore((s) => s.isDarkMode)
  const setTheme = useStore((s) => s.setTheme)

  // Sync dark class to <html> whenever isDarkMode changes
  useEffect(() => {
    /* istanbul ignore next */
    if (typeof window === 'undefined') return

    document.documentElement.classList.toggle('dark-mode', isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  // Listen for OS theme changes when "system" is selected
  useEffect(() => {
    const mediaQuery = env.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (useStore.getState().theme === 'system') {
        setTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [setTheme])

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
        isCollapsed: false,
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
      const { setTheme } = useStore.getState()
      render(
        <AppProvider>
          <div>Content</div>
        </AppProvider>
      );

      // Change store theme to dark
      act(() => {
        setTheme('dark')
      });
      expect(useStore.getState().isDarkMode).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // Change store theme to light
      act(() => {
        setTheme('light')
      });
      expect(useStore.getState().isDarkMode).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
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
