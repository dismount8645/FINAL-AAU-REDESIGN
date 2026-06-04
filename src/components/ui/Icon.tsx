import type { SVGProps } from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { type LucideIcon, HelpCircle, CloudUpload, File, CheckSquare, Settings, Search, ChevronUp, ChevronDown, User, Plus } from 'lucide-react';
import { Stack } from '@/components/Layout';
import { cn } from '@/lib/utils';

const iconNameMap: Record<string, LucideIcon> = {
  'cloud-arrow-up': CloudUpload,
  'file': File,
  'square-check': CheckSquare,
  'gear': Settings,
  'magnifying-glass': Search,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
}

export interface IconProps extends SVGProps<SVGSVGElement> {
  icon?: LucideIcon
  name?: string
  variant?: 'primary' | 'accent' | 'success' | 'danger' | 'warning' | 'info' | 'muted'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  label?: string
  strokeWidth?: number
}

const sizeMap: Record<string, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
}

const variantColors: Record<string, string> = {
  primary: 'text-primary',
  accent: 'text-accent',
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
  muted: 'text-muted',
}

export default function Icon({
  icon: IconComponent,
  name,
  variant,
  size = 'md',
  label,
  className,
  style,
  ...props
}: IconProps) {
  const FinalIcon = IconComponent || (name ? iconNameMap[name] : undefined) || HelpCircle

  return (
    <FinalIcon
      size={sizeMap[size]}
      strokeWidth={2}
      className={cn(
        'inline-flex items-center justify-center leading-none transition-colors duration-150 shrink-0',
        variant ? variantColors[variant] : '',
        className
      )}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={style}
      {...props}
    />
  )
}

const circleSizeMap = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 60,
  xl: 80,
}

type IconCircleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconCircleProps {
  icon: LucideIcon;
  bg?: string;
  color?: string;
  size?: IconCircleSize | number;
  className?: string;
}

export function IconCircle({ icon: IconComponent, bg, color, size = 'md', className }: IconCircleProps) {
  const px = typeof size === 'number' ? size : (circleSizeMap[size] || circleSizeMap.md)
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
      <IconComponent size={iconSize} strokeWidth={2} aria-hidden="true" />
    </Stack>
  )
}

if (import.meta.vitest) {
  describe('Icon', () => {
    it('renders default icon', () => {
      const { container } = render(<Icon />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  
    it('renders specific icon component', () => {
      const { container } = render(<Icon icon={User} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  
    it('applies variant classes', () => {
      const { container } = render(<Icon variant="primary" />)
      expect(container.firstChild).toHaveClass('text-primary')
    })
  
    it('renders with label setting aria-label and role="img"', () => {
      const { container } = render(<Icon icon={User} label="User icon" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'User icon')
      expect(svg).toHaveAttribute('role', 'img')
      expect(svg).not.toHaveAttribute('aria-hidden')
    })
  
    it('renders without label setting aria-hidden="true"', () => {
      const { container } = render(<Icon icon={User} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).not.toHaveAttribute('aria-label')
      expect(svg).not.toHaveAttribute('role')
    })
  })

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
