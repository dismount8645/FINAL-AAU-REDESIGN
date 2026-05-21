export function useResponsiveSize<T>(span: number, small: T, medium: T | null = null, large: T | null = null): T {
  if (span <= 4) return small
  if (span >= 8) return large ?? medium ?? small
  return medium ?? small
}
