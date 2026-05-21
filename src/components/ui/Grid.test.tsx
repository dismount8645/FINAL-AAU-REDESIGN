import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Grid from '@/components/ui/Grid'

describe('Grid', () => {
  it('renders children', () => {
    const { container } = render(<Grid><div>Test</div></Grid>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders Grid.Item with default span', () => {
    const { getByText } = render(<Grid><Grid.Item>Default</Grid.Item></Grid>)
    const item = getByText('Default')
    expect(item).toBeInTheDocument()
    // It should have the grid-item class
    expect(item.className).toContain('grid-item')
  })

  it('applies custom columns and spans', () => {
    const { container } = render(
      <Grid columns={6} mobileColumns={2}>
        <Grid.Item span={3} mobileSpan={1}>Item</Grid.Item>
      </Grid>
    )
    const grid = container.querySelector('.grid-container') as HTMLElement
    const item = container.querySelector('.grid-item') as HTMLElement
    
    expect(grid.style.getPropertyValue('--grid-cols')).toBe('6')
    expect(grid.style.getPropertyValue('--mobile-grid-cols')).toBe('2')
    expect(item.style.getPropertyValue('--span')).toBe('3')
    expect(item.style.getPropertyValue('--mobile-span')).toBe('1')
  })

  it('computes responsive gap CSS variables correctly', () => {
    const gaps = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
    gaps.forEach(gap => {
      const { container } = render(<Grid gap={gap} />)
      const grid = container.querySelector('.grid-container') as HTMLElement
      expect(grid.style.getPropertyValue('--grid-gap')).toBe(`var(--space-${gap})`)
    })
  })

  it('handles custom gap values', () => {
    const { container } = render(<Grid gap="15px" />)
    const grid = container.querySelector('.grid-container') as HTMLElement
    expect(grid.style.getPropertyValue('--grid-gap')).toBe('15px')
  })

  it('handles undefined gap', () => {
    const { container } = render(<Grid />)
    const grid = container.querySelector('.grid-container') as HTMLElement
    expect(grid.style.getPropertyValue('--grid-gap')).toBe('var(--space-lg)')
    expect(grid.style.getPropertyValue('--grid-gap-tablet')).toBe('var(--space-md)')
    expect(grid.style.getPropertyValue('--grid-gap-mobile')).toBe('var(--space-sm)')
  })

  it('sets tabletColumns default based on columns', () => {
    const { container: c1 } = render(<Grid columns={12} />)
    expect((c1.firstChild as HTMLElement).style.getPropertyValue('--tablet-grid-cols')).toBe('6')
    
    const { container: c2 } = render(<Grid columns={4} />)
    expect((c2.firstChild as HTMLElement).style.getPropertyValue('--tablet-grid-cols')).toBe('4')
  })

  it('Grid.Item handles tabletSpan and mobileSpan fallbacks', () => {
    const { container } = render(<Grid.Item span={4} />)
    const item = container.firstChild as HTMLElement
    expect(item.style.getPropertyValue('--tablet-span')).toBe('4')
    expect(item.style.getPropertyValue('--mobile-span')).toBe('1')
  })
})
