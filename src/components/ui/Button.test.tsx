import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Button from '@/components/ui/Button'
import { Plus, Check } from 'lucide-react'

describe('Button', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders with default props', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument()
  })

  it('renders with icon only', () => {
    const { container } = render(<Button icon={Plus} aria-label="Add" />)
    expect(screen.getByLabelText('Add')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with icon and text', () => {
    render(<Button icon={Plus}>Add</Button>)
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
  })

  it('renders with iconRight', () => {
    render(<Button iconRight={Check}>Done</Button>)
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument()
  })

  it('renders in loading state', () => {
    render(<Button loading>Submit</Button>)
    const button = screen.getByRole('button')
    // Base UI uses aria-disabled="true" by default for accessibility continuity
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('applies pill and full classes', () => {
    const { rerender } = render(<Button pill>Pill</Button>)
    expect(screen.getByRole('button')).toHaveClass('rounded-full')

    rerender(<Button full>Full</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('warns in dev for icon-only buttons without aria-label', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Button icon={Plus} />)
    expect(consoleWarn).toHaveBeenCalledTimes(1)
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringMatching(/MUST have an aria-label/)
    )
    consoleWarn.mockRestore()
    process.env.NODE_ENV = originalEnv
  })
})
