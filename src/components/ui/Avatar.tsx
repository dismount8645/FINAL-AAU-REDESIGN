import { memo, useMemo, type KeyboardEvent } from 'react';


import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

"use client"

/**
 * Avatar - Senior UI/UX Architect refinement.
 * Enforces AAU brand tokens, 8pt grid logic, and high-performance rendering.
 */

export interface AvatarProps {
  /** Image source URL */
  src?: string
  /** Display name for initials and alt text */
  name?: string
  /** 
   * Size presets (8pt grid):
   * 2xs: 16px | xs: 24px | sm: 32px | md: 40px | lg: 48px | xl: 56px | 2xl: 64px 
   */
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number
  /** Availability status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy'
  /** Custom CSS classes */
  className?: string
  /** Click handler */
  onClick?: () => void
}

const sizeMap = {
  '2xs': 16,
  'xs': 24,
  'sm': 32,
  'md': 40,
  'lg': 48,
  'xl': 56,
  '2xl': 64,
}

const statusColorMap = {
  online: 'var(--color-success)',
  offline: 'var(--color-text-disabled)',
  away: 'var(--color-warning)',
  busy: 'var(--color-danger)',
}

/**
 * Avatar - Collaborative peer programmer version.
 */
const Avatar = memo(function Avatar({
  src,
  name,
  size = 'md',
  status,
  className = '',
  onClick,
}: AvatarProps) {
  const px = useMemo(() => {
    if (typeof size === 'number') return size
    return sizeMap[size] ?? sizeMap.md
  }, [size])

  const initials = useMemo(() => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [name])

  const { statusSize, borderWidth } = useMemo(() => ({
    statusSize: px <= 24 ? 6 : px <= 40 ? 10 : 14,
    borderWidth: px <= 32 ? 2 : 3
  }), [px])

  return (
    <motion.div
      role={onClick ? "button" : "img"}
      aria-label={name ?? 'Avatar'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
      whileHover={onClick ? { scale: 1.05, y: -4, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={cn(
        "relative rounded-[var(--radius-full)] shrink-0 overflow-visible transition-shadow duration-150 isolate",
        onClick && "cursor-pointer hover:shadow-[var(--shadow-md)]",
        className
      )}
      style={{ width: px, height: px }}
      onClick={onClick}
    >
      <div className="w-full h-full rounded-[var(--radius-full)] overflow-hidden border border-[var(--border-color)]/40 bg-bg-highlight flex items-center justify-center">
        <AnimatePresence mode="wait">
          {src ? (
            <motion.img
              key="image"
              src={src}
              alt={name ?? ''}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div 
              key="initials"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center text-main font-black tracking-tighter"
              style={{ fontSize: px * 0.4 }}
            >
              {initials}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {status && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute bottom-0 right-0 rounded-[var(--radius-full)] bg-bg-card shadow-sm"
          style={{
            width: statusSize,
            height: statusSize,
            padding: borderWidth,
          }}
        >
          <div 
            className="w-full h-full rounded-[var(--radius-full)]"
            style={{ backgroundColor: statusColorMap[status] }}
          />
        </motion.div>
      )}
    </motion.div>
  )
})

export default Avatar

if (import.meta.vitest) {
  describe('Avatar', () => {
    it('renders initials when no src is provided', () => {
      render(<Avatar name="Test User" />)
      expect(screen.getByText('TU')).toBeInTheDocument()
    })
  
    it('renders image when src is provided', () => {
      render(<Avatar name="Test User" src="https://example.com/avatar.jpg" />)
      const img = screen.getByAltText('Test User')
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
  
    it('renders with different size presets', () => {
      const { container: sm } = render(<Avatar name="A" size="sm" />)
      const el1 = sm.firstChild as HTMLElement
      expect(el1.style.width).toBe('32px')
  
      const { container: lg } = render(<Avatar name="B" size="lg" />)
      const el2 = lg.firstChild as HTMLElement
      expect(el2.style.width).toBe('48px')
  
      const { container: custom } = render(<Avatar name="C" size={100} />)
      const el3 = custom.firstChild as HTMLElement
      expect(el3.style.width).toBe('100px')
    })
  
    it('renders with custom className', () => {
      const { container } = render(<Avatar name="Test" className="custom-class" />)
      expect(container.firstChild).toHaveClass('custom-class')
    })
  
    it('falls back to md for unknown size string', () => {
      const { container } = render(<Avatar name="Test" size={"unknown" as any} />)
      const el = container.firstChild as HTMLElement
      expect(el.style.width).toBe('40px')
    })
  
    it('handles large status size for px >= 56', () => {
      const { container } = render(<Avatar name="Test" size="xl" status="online" />)
      const dot = container.querySelector('[style*="width: 14px"]') as HTMLElement
      expect(dot).toBeInTheDocument()
    })
  
    it('handles small status size for px <= 24', () => {
      const { container } = render(<Avatar name="Test" size="xs" status="online" />)
      const dot = container.querySelector('[style*="width: 6px"]') as HTMLElement
      expect(dot).toBeInTheDocument()
    })
  
    it('renders offline status dot with correct color', () => {
      const { container } = render(<Avatar name="Test" status="offline" />)
      const dot = container.querySelector('[style*="background-color"]') as HTMLElement
      expect(dot.style.backgroundColor).toBe('var(--color-text-disabled)')
    })
  
    it('renders away status dot with correct color', () => {
      const { container } = render(<Avatar name="Test" status="away" />)
      const dot = container.querySelector('[style*="background-color"]') as HTMLElement
      expect(dot.style.backgroundColor).toBe('var(--color-warning)')
    })
  })
}
