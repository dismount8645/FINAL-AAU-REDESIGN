import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ErrorBoundary from '@/components/ErrorBoundary'

// Mock useStore for translation function
vi.mock('@/store/useStore', () => {
  const mockState = {
    t: (key: string) => {
      const map: Record<string, string> = {
        error_title: 'Something went wrong',
        error_message: 'An unexpected error occurred.',
        try_again: 'Try again',
      }
      return map[key] || key
    }
  }
  return {
    default: vi.fn((selector) => selector(mockState)),
  }
})

function Explode() {
  throw new Error('KABOOM')
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
      <ErrorBoundary>
        <div>All good</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <Explode />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
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
      <ErrorBoundary>
        <ConditionalExplode />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    shouldThrow = false
    fireEvent.click(screen.getByText('Try again'))

    expect(screen.getByText('After reset')).toBeInTheDocument()
  })

  it('supports keyboard trigger on Enter or Space', () => {
    let shouldThrow = true
    function ConditionalExplode() {
      if (shouldThrow) throw new Error('KABOOM')
      return <div>After reset</div>
    }

    render(
      <ErrorBoundary>
        <ConditionalExplode />
      </ErrorBoundary>
    )
    
    shouldThrow = false
    const button = screen.getByText('Try again')
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(screen.getByText('After reset')).toBeInTheDocument()
  })
})
