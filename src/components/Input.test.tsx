import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Input from '@/components/Input'

describe('Input', () => {
  it('renders input', () => {
    render(<Input placeholder="Test Input" />)
    expect(screen.getByPlaceholderText('Test Input')).toBeInTheDocument()
  })

  it('applies border-danger class when error is true', () => {
    render(<Input error />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-danger')
  })

  it('does not apply border-danger class when error is false', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).not.toHaveClass('border-danger')
  })
})
