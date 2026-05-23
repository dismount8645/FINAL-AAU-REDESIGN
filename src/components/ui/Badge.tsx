"use client"

import { type HTMLAttributes, forwardRef, memo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

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
        default: "bg-[var(--bg-highlight)] text-[var(--text-main)] border-[var(--border-color)]/60",
        primary: "bg-primary text-white shadow-sm",
        secondary: "bg-primary/10 text-primary",
        success: "bg-[var(--aau-dark-green)]/10 text-[var(--aau-dark-green)]",
        warning: "bg-[var(--aau-dark-orange)]/10 text-[var(--aau-dark-orange)]",
        danger: "bg-[var(--aau-dark-pink)]/10 text-[var(--aau-dark-pink)]",
        info: "bg-[var(--aau-light-blue)]/10 text-[var(--aau-light-blue)]",
        outline: "bg-transparent border-[var(--border-color)] text-[var(--text-muted)]",
      },
      pill: {
        true: "rounded-[var(--radius-full)] px-[var(--space-sm)]",
      },
      interactive: {
        true: "cursor-pointer hover:scale-105 active:scale-95",
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
    const Component = interactive ? motion.span : "span"

    return (
      <Component
        ref={ref as any}
        role="status"
        className={cn("badge", badgeVariants({ variant, pill, interactive }), className)}
        {...(interactive ? {
          whileHover: { translateY: -1 },
          whileTap: { scale: 0.95 },
          transition: { duration: 0.15 }
        } : {})}
        {...props}
      >
        {children}
      </Component>
    )
  }
))

Badge.displayName = "Badge"

export { Badge, badgeVariants }
export default Badge
