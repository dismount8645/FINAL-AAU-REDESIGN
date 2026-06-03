import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PageSkeleton from './PageSkeleton'

describe('PageSkeleton', () => {
  it('renders loading status container', () => {
    render(<PageSkeleton />)
    const status = screen.getByRole('status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })
})
