import { type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

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
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "negative"
  pill?: boolean
}

function Badge({
  variant = "default",
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        badgeVariants({ variant }),
        `badge--${variant}`,
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
