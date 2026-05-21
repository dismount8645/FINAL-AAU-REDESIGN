import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchInput from './SearchInput'

describe('SearchInput', () => {
  it('renders search input with default placeholder', () => {
    render(<SearchInput />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('renders search input with custom placeholder', () => {
    render(<SearchInput placeholder="Custom placeholder" />)
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
  })

  it('calls onChange when text is entered', () => {
    const handleChange = vi.fn()
    render(<SearchInput value="" onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test query' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('shows clear button when value is present and onClear is provided', () => {
    const handleClear = vi.fn()
    render(<SearchInput value="test" onChange={() => {}} onClear={handleClear} />)
    const clearButton = screen.getByLabelText('Clear search')
    expect(clearButton).toBeInTheDocument()
    fireEvent.click(clearButton)
    expect(handleClear).toHaveBeenCalledTimes(1)
  })

  it('does not show clear button when value is empty', () => {
    render(<SearchInput value="" onChange={() => {}} onClear={() => {}} />)
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('shows submit button when onSubmit is provided and value is not clearable', () => {
    const handleSubmit = vi.fn()
    render(<SearchInput value="test" onChange={() => {}} onSubmit={handleSubmit} />)
    const submitBtn = screen.getByRole('button')
    expect(submitBtn).toBeInTheDocument()
    expect(submitBtn.getAttribute('type')).toBe('submit')
  })

  it('calls onSubmit on form submit', () => {
    const handleSubmit = vi.fn()
    render(<SearchInput value="test" onChange={() => {}} onSubmit={handleSubmit} />)
    const input = screen.getByRole('textbox')
    fireEvent.submit(input)
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})
