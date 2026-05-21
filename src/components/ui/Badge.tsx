import { type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Badge‑komponent med fuld token‑baseret styling.
 * - Undgår overflødige variant‑klasser (badge--*).
 * - Tilføjer ARIA‑rolle for bedre tilgængelighed.
 * - Giver mulighed for at logge klik (hvis den bruges som knap) via onClick‑prop.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center py-0.5 px-sm rounded-pill text-[0.7rem] font-semibold leading-tight tracking-wide border border-transparent [&_i]:text-[0.8em]",
  {
    variants: {
      variant: {
        default: "bg-[var(--bg-hover)] text-[var(--text-main)] dark:text-slate-300",
        primary: "bg-primary/15 text-primary",
        negative: "bg-danger/15 text-danger",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        danger: "bg-danger/15 text-danger",
        info: "bg-info/15 text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Variant af badge */
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "negative"
  /** Gør badge rundere (pill) */
  pill?: boolean
  /** Valgfri ARIA‑label for screen‑readere */
  "aria-label"?: string
}

/**
 * Badge‑elementet er primært dekorativt, men kan også fungere som
 * interaktiv komponent (fx klik‑bare tags). Derfor understøtter den
 * både `onClick` og ARIA‑attributter.
 */
function Badge({
  variant = "default",
  pill = false,
  children,
  className,
  "aria-label": ariaLabel,
  ...props
}: BadgeProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={cn(
        "badge",
        badgeVariants({ variant }),
        pill && "rounded-pill",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
export default Badge
