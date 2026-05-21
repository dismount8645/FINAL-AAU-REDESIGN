import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ActionBlock from '@/components/ui/ActionBlock'

describe('ActionBlock', () => {
  it('renders correctly', () => {
    render(<ActionBlock title="Action">Content</ActionBlock>)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders without title', () => {
    const { container } = render(<ActionBlock description="Desc" />)
    expect(container.querySelector('h4')).not.toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
  })

  it('renders without description', () => {
    render(<ActionBlock title="Title" />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('renders without time', () => {
    const { container } = render(<ActionBlock title="Title" />)
    expect(container.querySelector('.fa-clock')).not.toBeInTheDocument()
  })

  it('renders time when provided', () => {
    render(<ActionBlock title="Title" time="5 min" />)
    expect(screen.getByText('5 min')).toBeInTheDocument()
  })

  it('renders without buttonText', () => {
    render(<ActionBlock title="Title" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders with buttonText', () => {
    render(<ActionBlock title="Title" buttonText="Go" />)
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<ActionBlock title="Title"><span data-testid="child">child</span></ActionBlock>)
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
