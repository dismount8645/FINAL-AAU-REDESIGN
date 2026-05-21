import { type HTMLAttributes, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Badge Variants - Senior UI/UX Architect refinement.
 * Enforces strict AAU brand tokens and consistent semantic coloring.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center py-0.5 px-[var(--space-xs)] rounded-[var(--radius-sm)] text-[0.75rem] font-bold leading-none tracking-wide border border-transparent whitespace-nowrap isolate transition-colors duration-150",
  {
    variants: {
      variant: {
        default: "bg-[var(--bg-hover)] text-[var(--text-main)]",
        primary: "bg-[var(--aau-blue)]/10 text-[var(--aau-blue)]",
        success: "bg-[var(--aau-dark-green)]/10 text-[var(--aau-dark-green)]",
        warning: "bg-[var(--aau-dark-orange)]/10 text-[var(--aau-dark-orange)]",
        danger: "bg-[var(--aau-dark-pink)]/10 text-[var(--aau-dark-pink)]",
        negative: "bg-[var(--aau-dark-pink)]/10 text-[var(--aau-dark-pink)]",
        info: "bg-[var(--aau-dark-blue-sec)]/10 text-[var(--aau-dark-blue-sec)]",
        gold: "bg-[var(--aau-light-orange)]/10 text-[var(--aau-light-orange)]",
      },
      pill: {
        true: "rounded-full px-2.5",
      }
    },
    defaultVariants: {
      variant: "default",
      pill: false,
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Senior UI/UX Architect Refactored Badge.
 * 
 * Features:
 * - Token-driven variant management.
 * - ARIA status role by default.
 * - Supports both standard (rounded-sm) and pill shapes.
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, pill, children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        className={cn("badge", badgeVariants({ variant, pill }), className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = "Badge"

export { Badge, badgeVariants }
export default Badge
