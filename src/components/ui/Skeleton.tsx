import { cn } from "@/lib/utils"

interface SkeletonProps {
  variant?: "text" | "circle" | "rectangular"
  width?: string | number
  height?: string | number
  size?: string | number
  className?: string
}

export function Skeleton({ variant = "text", width, height, size, className }: SkeletonProps) {
  if (variant === "circle") {
    const dim = size ?? 40
    return (
      <div
        className={cn("animate-pulse rounded-[var(--radius-pill)] bg-muted/60", className)}
        style={{ width: dim, height: dim }}
        aria-hidden="true"
      />
    )
  }

  if (variant === "rectangular") {
    return (
      <div
        className={cn("animate-pulse rounded-[var(--radius-md)] bg-muted/60", className)}
        style={{ width, height }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className={cn("animate-pulse rounded-[var(--radius-sm)] bg-muted/60", className)}
      style={{ width: width ?? "100%", height: height ?? 'var(--space-md)' }}
      aria-hidden="true"
    />
  )
}
