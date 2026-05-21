import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const mockT = (key: string) => {
  const map: Record<string, string> = {
    error_title: 'Something went wrong',
    error_message: 'An unexpected error occurred.',
    try_again: 'Try again',
  }
  return map[key] || key
}

function Explode({ message }: { message?: string }) {
  throw new Error(message ?? 'KABOOM')
  return null
}

function SilentExplode() {
  throw new Error()
  return null
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary t={mockT}>
        <div>All good</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary t={mockT}>
        <Explode />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('KABOOM')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary t={mockT} fallback={<div>Custom fallback</div>}>
        <Explode />
      </ErrorBoundary>
    )
    expect(screen.getByText('Custom fallback')).toBeInTheDocument()
  })

  it('resets error state on "Try again" click', () => {
    let shouldThrow = true
    function ConditionalExplode() {
      if (shouldThrow) throw new Error('KABOOM')
      return <div>After reset</div>
    }

    render(
      <ErrorBoundary t={mockT}>
        <ConditionalExplode />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    shouldThrow = false
    fireEvent.click(screen.getByText('Try again'))

    expect(screen.getByText('After reset')).toBeInTheDocument()
  })

  it('calls onError prop when an error is caught', () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary t={mockT} onError={onError}>
        <Explode />
      </ErrorBoundary>
    )
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object))
  })

  it('uses default error message when error has no message', () => {
    render(
      <ErrorBoundary t={mockT}>
        <SilentExplode />
      </ErrorBoundary>
    )
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument()
  })

  it('uses default translation function when t is not provided', () => {
    render(
      <ErrorBoundary>
        <Explode />
      </ErrorBoundary>
    )
    expect(screen.getByText('error_title')).toBeInTheDocument()
    expect(screen.getByText('try_again')).toBeInTheDocument()
  })
})
