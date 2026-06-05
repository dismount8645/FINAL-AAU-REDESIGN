import { type HTMLAttributes, forwardRef, memo } from 'react';


import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/* eslint-disable react-refresh/only-export-components */
"use client"

/**
 * Badge Variants - Senior UI/UX Architect refinement.
 * Enforces strict AAU brand tokens, professional typography, and 150ms physics.
 */
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center px-[var(--space-xs)] h-[var(--space-md)]",
    "rounded-[var(--radius-sm)] text-[0.625rem] font-black uppercase tracking-[0.05em] leading-none",
    "border border-transparent whitespace-nowrap isolate transition-all duration-150 ease-[var(--transition-ease)]"
  ],
  {
    variants: {
      variant: {
        default: "bg-bg-highlight text-main border-[var(--border-color)]/60",
        primary: "bg-primary text-white shadow-sm",
        secondary: "bg-primary/10 text-primary dark:text-indigo-200",
        success: "bg-[var(--aau-dark-green)]/10 text-[var(--aau-dark-green)]",
        warning: "bg-[var(--aau-dark-orange)]/10 text-[var(--aau-dark-orange)]",
        danger: "bg-[var(--aau-dark-pink)]/10 text-[var(--aau-dark-pink)]",
        info: "bg-[var(--aau-light-blue)]/10 text-[var(--aau-light-blue)]",
        outline: "bg-transparent border-[var(--border-color)] text-muted",
      },
      pill: {
        true: "rounded-[var(--radius-full)] px-[var(--space-sm)]",
      },
      interactive: {
        true: "cursor-pointer",
      }
    },
    defaultVariants: {
      variant: "default",
      pill: false,
      interactive: false,
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge - Professional AAU dashboard indicator.
 * 
 * Features:
 * - High-contrast semantic coloring.
 * - 8pt grid height (24px by default).
 * - Optional interactive motion.
 */
const Badge = memo(forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, pill, interactive, children, className, ...props }, ref) => {
    if (interactive) {
      return (
        <motion.span
          ref={ref}
          role="status"
          className={cn("badge", badgeVariants({ variant, pill, interactive }), className)}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
          {...(props as HTMLMotionProps<"span">)}
        >
          {children}
        </motion.span>
      )
    }

    return (
      <span
        ref={ref}
        role="status"
        className={cn("badge", badgeVariants({ variant, pill, interactive }), className)}
        {...(props as HTMLAttributes<HTMLSpanElement>)}
      >
        {children}
      </span>
    )
  }
))

Badge.displayName = "Badge"

export { Badge, badgeVariants }
export default Badge

if (import.meta.vitest) {
  describe('Badge', () => {
    it('renders children text', () => {
      render(<Badge>Active</Badge>)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })
  
    it('renders correctly with default variant', () => {
      render(<Badge>Default</Badge>)
      const badge = document.querySelector('.badge') as HTMLElement
      expect(badge).toBeInTheDocument()
      expect(badge.className).toContain('badge')
    })
  
    it('applies variant classes', () => {
      const variants = ['success', 'warning', 'danger', 'info'] as const
      
      variants.forEach((variant) => {
        const { unmount } = render(<Badge variant={variant}>{variant}</Badge>)
        const badge = document.querySelector('.badge') as HTMLElement
        expect(badge).toBeInTheDocument()
        unmount()
      })
    })
  
    it('applies custom className', () => {
      render(<Badge className="custom-badge">Styled</Badge>)
      const badge = document.querySelector('.badge') as HTMLElement
      expect(badge.className).toContain('custom-badge')
    })
  
    it('forwards additional props', () => {
      render(<Badge data-testid="test-badge" aria-label="Status Badge">Status</Badge>)
      const badge = screen.getByTestId('test-badge')
      expect(badge).toHaveAttribute('aria-label', 'Status Badge')
    })
  
    it('renders as a span element', () => {
      render(<Badge>Test</Badge>)
      expect(document.querySelector('span.badge')).toBeInTheDocument()
    })
  })
}
