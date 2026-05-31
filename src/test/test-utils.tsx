/* eslint-disable react-refresh/only-export-components */
import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ToastProvider } from '@/context/providers/ToastProvider'
import ErrorBoundary from '@/components/ErrorBoundary'

interface AllProvidersProps {
  children: ReactNode;
  initialRoute?: string;
}

/**
 * A wrapper component that provides all necessary context providers for testing.
 */
export const AllProviders = ({ children, initialRoute = '/' }: AllProvidersProps) => (
  <MemoryRouter initialEntries={[initialRoute]}>
    <ErrorBoundary>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ErrorBoundary>
  </MemoryRouter>
)

/**
 * Custom render method that includes all providers by default.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    ...renderOptions
  }: { route?: string } & Omit<RenderOptions, 'wrapper'> = {}
) {
  return {
    ...render(ui, {
      wrapper: ({ children }) => <AllProviders initialRoute={route}>{children}</AllProviders>,
      ...renderOptions
    })
  }
}

// Re-export everything from RTL
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
