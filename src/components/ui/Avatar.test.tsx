import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Avatar from '@/components/ui/Avatar'

describe('Avatar', () => {
  it('renders initials when no src is provided', () => {
    render(<Avatar name="Test User" />)
    expect(screen.getByText('TU')).toBeInTheDocument()
  })

  it('renders image when src is provided', () => {
    render(<Avatar name="Test User" src="https://example.com/avatar.jpg" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('renders question mark when no name is provided', () => {
    render(<Avatar />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('renders status indicator when status is provided', () => {
    const { container } = render(<Avatar name="Test" status="online" />)
    const statusDot = container.querySelector('[style*="background-color"]')
    expect(statusDot).toBeInTheDocument()
  })

  it('does not render status indicator when no status', () => {
    const { container } = render(<Avatar name="Test" />)
    const statusDot = container.querySelector('[style*="background-color"]')
    expect(statusDot).not.toBeInTheDocument()
  })

  it('renders with different size presets', () => {
    const { container: sm } = render(<Avatar name="A" size="sm" />)
    const el1 = sm.firstChild as HTMLElement
    expect(el1.style.width).toBe('32px')

    const { container: lg } = render(<Avatar name="B" size="lg" />)
    const el2 = lg.firstChild as HTMLElement
    expect(el2.style.width).toBe('56px')

    const { container: custom } = render(<Avatar name="C" size={100} />)
    const el3 = custom.firstChild as HTMLElement
    expect(el3.style.width).toBe('100px')
  })

  it('renders with custom className', () => {
    const { container } = render(<Avatar name="Test" className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders with status away and offline', () => {
    const { container: away } = render(<Avatar name="A" status="away" />)
    expect(away.firstChild).toBeInTheDocument()

    const { container: offline } = render(<Avatar name="B" status="offline" />)
    expect(offline.firstChild).toBeInTheDocument()
  })

  it('falls back to md for unknown size string', () => {
    const { container } = render(<Avatar name="Test" size={"unknown" as any} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('40px')
  })

  it('handles large status size for px >= 80', () => {
    const { container } = render(<Avatar name="Test" size="xl" status="online" />)
    const dot = container.querySelector('[style*="width: 18px"]') as HTMLElement
    expect(dot).toBeInTheDocument()
  })

  it('handles small status size for px <= 32', () => {
    const { container } = render(<Avatar name="Test" size="sm" status="online" />)
    const dot = container.querySelector('[style*="width: 10px"]') as HTMLElement
    expect(dot).toBeInTheDocument()
  })

  it('renders image with empty alt when no name is provided', () => {
    const { container } = render(<Avatar src="https://example.com/avatar.jpg" />)
    const img = container.querySelector('img') as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', '')
  })

  it('renders offline status dot with correct color', () => {
    const { container } = render(<Avatar name="Test" status="offline" />)
    const dot = container.querySelector('[style*="background-color"]') as HTMLElement
    expect(dot.style.backgroundColor).toBe('var(--text-disabled)')
  })

  it('renders away status dot with correct color', () => {
    const { container } = render(<Avatar name="Test" status="away" />)
    const dot = container.querySelector('[style*="background-color"]') as HTMLElement
    expect(dot.style.backgroundColor).toBe('var(--color-warning)')
  })
})
