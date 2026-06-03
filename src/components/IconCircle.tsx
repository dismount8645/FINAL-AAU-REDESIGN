import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { type LucideIcon, Plus } from 'lucide-react';
import Stack from '@/components/Stack';
import { cn } from '@/lib/utils';

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 60,
  xl: 80,
}

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconCircleProps {
  icon: LucideIcon;
  bg?: string;
  color?: string;
  size?: IconSize | number;
  className?: string;
}

export default function IconCircle({ icon: Icon, bg, color, size = 'md', className }: IconCircleProps) {
  const px = typeof size === 'number' ? size : (sizeMap[size] || sizeMap.md)
  
  // Scale icon size relative to container
  const iconSize = px * 0.5

  return (
    <Stack
      align="center"
      justify="center"
      className={cn("icon-circle shrink-0 rounded-[var(--radius-pill)] transition-colors", className)}
      style={{
        background: bg,
        color: color,
        width: `${px}px`,
        height: `${px}px`,
      }}
    >
      <Icon size={iconSize} strokeWidth={2} aria-hidden="true" />
    </Stack>
  )
}

if (import.meta.vitest) {
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
}
