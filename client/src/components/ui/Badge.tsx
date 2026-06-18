import { type HTMLAttributes, forwardRef, memo } from 'react';


import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* eslint-disable react-refresh/only-export-components */

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
        true: "cursor-pointer hover:scale-105 hover:-translate-y-1 active:scale-95",
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
    return (
      <span
        ref={ref}
        role="status"
        className={cn("badge", badgeVariants({ variant, pill, interactive }), className)}
        {...props}
      >
        {children}
      </span>
    )
  }
))

Badge.displayName = "Badge"

export { Badge }
export default Badge
