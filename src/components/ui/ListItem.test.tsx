import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { User } from 'lucide-react'
import ListItem from '@/components/ui/ListItem'

describe('ListItem', () => {
  it('renders title', () => {
    render(<ListItem title="Item" />)
    expect(screen.getByText('Item')).toBeInTheDocument()
  })

  it('renders as link when href is provided', () => {
    render(<ListItem title="Item" href="/page" />)
    const link = screen.getByText('Item').closest('a')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/page')
  })

  it('renders as div when no href', () => {
    render(<ListItem title="Item" />)
    const el = screen.getByText('Item').closest('div')
    expect(el?.tagName).toBe('DIV')
  })

  it('renders icon', () => {
    const { container } = render(<ListItem title="Item" icon={User} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<ListItem title="Item" subtitle="Sub" />)
    expect(screen.getByText('Sub')).toBeInTheDocument()
  })

  it('renders children as fallback title', () => {
    render(<ListItem>Child Content</ListItem>)
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('renders right slot', () => {
    render(<ListItem title="Item" right={<span data-testid="right">R</span>} />)
    expect(screen.getByTestId('right')).toBeInTheDocument()
  })

  it('renders chevron when onClick is provided and no right slot', () => {
    const { container } = render(<ListItem title="Item" onClick={() => {}} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders chevron when href is provided and no right slot', () => {
    const { container } = render(<ListItem title="Item" href="/page" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render chevron when right slot is provided', () => {
    const { container } = render(<ListItem title="Item" right={<span>R</span>} onClick={() => {}} />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('renders external link with target _blank and rel noreferrer', () => {
    render(<ListItem title="External" href="https://example.com" />)
    const link = screen.getByText('External').closest('a')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
