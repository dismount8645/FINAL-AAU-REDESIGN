import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import IconCircle from '@/components/IconCircle'
import { Plus } from 'lucide-react'

describe('IconCircle', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<IconCircle icon={Plus} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('handles numeric size', () => {
    const { container } = render(<IconCircle icon={Plus} size={50} />)
    const icon = container.querySelector('svg')
    expect(icon).toHaveAttribute('width', '25') // 50 * 0.5
  })

  it('handles custom background and color', () => {
    const { container } = render(<IconCircle icon={Plus} bg="rgb(255, 0, 0)" color="rgb(255, 255, 255)" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.backgroundColor).toBe('rgb(255, 0, 0)')
    expect(wrapper.style.color).toBe('rgb(255, 255, 255)')
  })

  it('falls back to md for unknown size string', () => {
    const { container } = render(<IconCircle icon={Plus} size={"unknown" as any} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.width).toBe('48px')
  })

  it('handles all size presets', () => {
    const sizes: ('xs' | 'sm' | 'md' | 'lg' | 'xl')[] = ['xs', 'sm', 'md', 'lg', 'xl']
    const expected = [24, 32, 48, 60, 80]
    
    sizes.forEach((size, i) => {
      const { container } = render(<IconCircle icon={Plus} size={size} />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.style.width).toBe(`${expected[i]}px`)
    })
  })
})
