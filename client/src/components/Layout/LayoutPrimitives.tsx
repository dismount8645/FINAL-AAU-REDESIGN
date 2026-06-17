import { type HTMLAttributes, forwardRef, type ElementType } from 'react';
import { cn } from '@/lib/utils';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  gap?: string
  columns?: number
}

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: number
  rowSpan?: number
  x?: number
  y?: number
}

export function Grid({ gap, columns = 12, children, className = '', style, ...props }: GridProps) {
  const desktopGap = gap && ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(gap)
    ? `var(--space-${gap})`
    : gap || 'var(--space-lg)';

  return (
    <div
      className={cn('grid-container', className)}
      style={{
        '--grid-gap': desktopGap,
        '--grid-cols': columns,
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
        minWidth: 0,
        overflow: 'hidden',
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}

export interface StackProps extends HTMLAttributes<HTMLElement> {
  direction?: 'row' | 'col'
  display?: 'flex' | 'grid' | 'inline-flex'
  gap?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean
  tag?: ElementType
  fullWidth?: boolean
  full?: boolean
  type?: string
}

const gapClasses: Record<string, string> = {
  none: 'gap-0',
  '2xs': 'gap-[2px]',
  xs: 'gap-[var(--space-xs)]',
  sm: 'gap-[var(--space-sm)]',
  md: 'gap-[var(--space-md)]',
  lg: 'gap-[var(--space-lg)]',
  xl: 'gap-[var(--space-xl)]',
  '2xl': 'gap-[var(--space-2xl)]',
  '3xl': 'gap-[var(--space-3xl)]',
}

const alignClasses: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyClasses: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(({
  direction = 'col',
  display = 'flex',
  gap = 'md',
  align,
  justify,
  wrap,
  children,
  className = '',
  style,
  tag: Tag = 'div' as ElementType,
  fullWidth,
  full,
  ...props
}: StackProps, ref) => {
  return (
    <Tag
      ref={ref}
      className={cn(
        display,
        direction === 'row' ? 'flex-row' : 'flex-col',
        gapClasses[gap],
        align && alignClasses[align],
        justify && justifyClasses[justify],
        wrap && 'flex-wrap',
        fullWidth && 'w-full',
        full && 'w-full h-full',
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </Tag>
  )
})
Stack.displayName = 'Stack'

