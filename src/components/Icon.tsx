import type { SVGProps } from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { type LucideIcon, HelpCircle, CloudUpload, File, CheckSquare, Settings, Search, ChevronUp, ChevronDown, User } from 'lucide-react';
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
}
