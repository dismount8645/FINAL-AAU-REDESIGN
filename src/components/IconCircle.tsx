import { type LucideIcon } from "lucide-react"
import Stack from '@/components/Stack'
import { cn } from '@/lib/utils'

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 60,
  xl: 80,
}

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconCircleProps {
  icon: LucideIcon;
  bg?: string;
  color?: string;
  size?: IconSize | number;
  className?: string;
}

export default function IconCircle({ icon: Icon, bg, color, size = 'md', className }: IconCircleProps) {
  const px = typeof size === 'number' ? size : (sizeMap[size] || sizeMap.md)
  
  // Scale icon size relative to container
  const iconSize = px * 0.5

  return (
    <Stack
      align="center"
      justify="center"
      className={cn("icon-circle shrink-0 rounded-[var(--radius-pill)] transition-colors", className)}
      style={{
        background: bg,
        color: color,
        width: `${px}px`,
        height: `${px}px`,
      }}
    >
      <Icon size={iconSize} strokeWidth={2} aria-hidden="true" />
    </Stack>
  )
}
