import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Star } from 'lucide-react'
import Card from '@/components/ui/Card'

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Hello World</Card>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies default variant class by default', () => {
    render(<Card>Content</Card>)
    // Matches the default variant class added via CVA
    const card = document.querySelector('.card--default')
    expect(card).toBeDefined()
  })

  it('applies variant classes', () => {
    const { rerender } = render(<Card variant="elevated">Content</Card>)
    expect(document.querySelector('.card--elevated')).toBeDefined()

    rerender(<Card variant="outlined">Content</Card>)
    expect(document.querySelector('.card--outlined')).toBeDefined()

    rerender(<Card variant="brand">Content</Card>)
    expect(document.querySelector('.card--brand')).toBeDefined()
  })

  it('renders header when provided', () => {
    render(<Card><Card.Header data-testid="card-header">Header</Card.Header></Card>)
    expect(screen.getByTestId('card-header')).toBeInTheDocument()
    expect(document.querySelector('.card__header')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(<Card><Card.Footer data-testid="card-footer">Footer</Card.Footer></Card>)
    expect(screen.getByTestId('card-footer')).toBeInTheDocument()
    expect(document.querySelector('.card__footer')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="my-custom-class">Content</Card>)
    expect(document.querySelector('.my-custom-class')).toBeDefined()
  })

  it('forwards additional props', () => {
    render(<Card data-testid="test-card" aria-label="Test Card">Content</Card>)
    const card = screen.getByTestId('test-card')
    expect(card).toHaveAttribute('aria-label', 'Test Card')
  })

  it('renders card__body when children are provided', () => {
    render(<Card><Card.Body>Test Content</Card.Body></Card>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(document.querySelector('.card__body')).toBeInTheDocument()
  })

  it('does not render card__body without children inside it', () => {
    const { container } = render(<Card><Card.Header>Header</Card.Header></Card>)
    expect(container.querySelector('.card__body')).not.toBeInTheDocument()
  })

  it('renders Decoration with icon', () => {
    const { container } = render(<Card><Card.Decoration icon={Star} /></Card>)
    expect(container.querySelector('.card__decoration')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders Decoration without icon', () => {
    const { container } = render(<Card><Card.Decoration /></Card>)
    expect(container.querySelector('.card__decoration')).toBeInTheDocument()
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })
})
