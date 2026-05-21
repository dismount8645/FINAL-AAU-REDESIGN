import { forwardRef, type HTMLAttributes, type ElementType } from 'react'
import { cn } from '@/lib/utils'

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

const Stack = forwardRef<HTMLDivElement, StackProps>(({
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
export default Stack

