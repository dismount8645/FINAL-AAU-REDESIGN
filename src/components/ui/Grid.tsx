import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  gap?: string
  columns?: number
  tabletColumns?: number
  mobileColumns?: number
}

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: number
  rowSpan?: number
  x?: number
  y?: number
  tabletSpan?: number
  mobileSpan?: number
}

export default function Grid({ gap, columns = 12, tabletColumns, mobileColumns, children, className = '', style, ...props }: GridProps) {
  const desktopGap = gap && ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(gap)
    ? `var(--space-${gap})`
    : gap || 'var(--space-lg)';

  const tabletGap = gap === '2xl' ? 'var(--space-xl)'
    : gap === 'xl' ? 'var(--space-lg)'
    : gap === 'lg' ? 'var(--space-md)'
    : gap === 'md' ? 'var(--space-sm)'
    : gap === 'sm' ? 'var(--space-xs)'
    : gap === 'xs' ? 'var(--space-xs)'
    : 'var(--space-md)'; // default tablet gap

  const mobileGap = gap === '2xl' ? 'var(--space-lg)'
    : gap === 'xl' ? 'var(--space-md)'
    : gap === 'lg' ? 'var(--space-sm)'
    : gap === 'md' ? 'var(--space-xs)'
    : gap === 'sm' ? 'var(--space-xs)'
    : gap === 'xs' ? 'var(--space-xs)'
    : 'var(--space-sm)'; // default mobile gap

  return (
    <div
      className={cn('grid-container', className)}
      style={{
        '--grid-gap': desktopGap,
        '--grid-gap-tablet': tabletGap,
        '--grid-gap-mobile': mobileGap,
        '--grid-cols': columns,
        '--tablet-grid-cols': tabletColumns || (columns > 6 ? 6 : columns),
        '--mobile-grid-cols': mobileColumns || 1,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}

Grid.Item = function GridItem({
  span = 12,
  rowSpan = 1,
  x,
  y,
  tabletSpan,
  mobileSpan,
  children,
  className = '',
  style,
  ...props
}: GridItemProps) {
  return (
    <div
      className={cn(
        'grid-item h-full flex flex-col max-w-full transition-all duration-300 ease-in-out',
        props['draggable'] && 'border-2 border-dashed border-primary/30 rounded-[var(--radius-lg)] hover:border-primary/60 hover:bg-primary/5',
        className
      )}
      style={{
        '--span': span,
        '--row-span': rowSpan,
        gridColumnStart: x !== undefined ? x + 1 : undefined,
        gridRowStart: y !== undefined ? y + 1 : undefined,
        '--tablet-span': tabletSpan || span,
        '--mobile-span': mobileSpan || 1,
        minWidth: 0,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}
