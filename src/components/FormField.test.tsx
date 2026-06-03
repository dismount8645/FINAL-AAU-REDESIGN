import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FormField from '@/components/FormField'

describe('FormField', () => {
  it('renders without crashing', () => {
    const { container } = render(<FormField label="Test" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders required asterisk', () => {
    render(<FormField label="Name" required />)
    const asterisk = screen.getByText('*')
    expect(asterisk).toBeInTheDocument()
    expect(asterisk).toHaveClass('text-danger')
  })

  it('does not render asterisk when not required', () => {
    render(<FormField label="Name" />)
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('renders helpText', () => {
    render(<FormField label="Name" helpText="This is helpful" />)
    expect(screen.getByText('This is helpful')).toBeInTheDocument()
  })

  it('renders error text', () => {
    render(<FormField label="Name" error="Something went wrong" />)
    const errorEl = screen.getByText('Something went wrong')
    expect(errorEl).toBeInTheDocument()
    expect(errorEl).toHaveClass('text-danger')
  })

  it('renders without label', () => {
    render(<FormField><span data-testid="child">Content</span></FormField>)
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
