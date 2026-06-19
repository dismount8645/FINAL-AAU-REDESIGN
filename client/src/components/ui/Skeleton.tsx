import { cn } from '@/lib/utils';

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
        className={cn("animate-pulse rounded-[var(--radius-pill)] bg-bg-highlight/60", className)}
        style={{ width: dim, height: dim }}
        aria-hidden="true"
      />
    )
  }

  if (variant === "rectangular") {
    return (
      <div
        className={cn("animate-pulse rounded-[var(--radius-md)] bg-bg-highlight/60", className)}
        style={{ width, height }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className={cn("animate-pulse rounded-[var(--radius-sm)] bg-bg-highlight/60", className)}
      style={{ width: width ?? "100%", height: height ?? 'var(--space-md)' }}
      aria-hidden="true"
    />
  )
}

export function PageSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="animate-fade-in">
      <div className="container pb-[var(--space-2xl)]">
        <div className="px-lg sm:px-2xl">
          <Skeleton variant="rectangular" width={180} height={28} className="mb-sm" />
          <Skeleton variant="text" width={300} height={16} className="mb-lg" />
        </div>
        <div className="px-lg sm:px-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[var(--radius-md)] p-md bg-muted/10">
                <Skeleton variant="rectangular" width="60%" height={20} className="mb-sm" />
                <Skeleton variant="text" width="100%" className="mb-xs" />
                <Skeleton variant="text" width="80%" className="mb-xs" />
                <Skeleton variant="text" width="45%" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
