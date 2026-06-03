import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Stack from '@/components/Stack'

describe('Stack DOM Props', () => {
  it('should not pass fullWidth to the DOM element', () => {
    render(<Stack fullWidth data-testid="stack">Test</Stack>)
    const element = screen.getByTestId('stack')
    expect(element.getAttribute('fullWidth')).toBeNull()
  })

  it('applies flex-wrap class when wrap is true', () => {
    render(<Stack wrap data-testid="stack-wrap">Content</Stack>)
    const el = screen.getByTestId('stack-wrap')
    expect(el.classList.contains('flex-wrap')).toBe(true)
  })

  it('applies flex-row class when direction is row', () => {
    render(<Stack direction="row" data-testid="stack-row">Content</Stack>)
    const el = screen.getByTestId('stack-row')
    expect(el.classList.contains('flex-row')).toBe(true)
  })

  it('applies w-full h-full when full is true', () => {
    render(<Stack full data-testid="stack-full">Content</Stack>)
    const el = screen.getByTestId('stack-full')
    expect(el.classList.contains('w-full')).toBe(true)
    expect(el.classList.contains('h-full')).toBe(true)
  })
})
