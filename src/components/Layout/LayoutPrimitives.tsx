import { type HTMLAttributes, forwardRef, type ElementType } from 'react';
import { cn } from '@/lib/utils';

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

export function Grid({ gap, columns = 12, tabletColumns, mobileColumns, children, className = '', style, ...props }: GridProps) {
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

if (import.meta.vitest) {
  describe('Grid', () => {
    it('renders children', () => {
      const { container } = render(<Grid><div>Test</div></Grid>)
      expect(container.firstChild).toBeInTheDocument()
    })
  
    it('renders Grid.Item with default span', () => {
      const { getByText } = render(<Grid><Grid.Item>Default</Grid.Item></Grid>)
      const item = getByText('Default')
      expect(item).toBeInTheDocument()
      expect(item.className).toContain('grid-item')
    })
  
    it('applies custom columns and spans', () => {
      const { container } = render(
        <Grid columns={6} mobileColumns={2}>
          <Grid.Item span={3} mobileSpan={1}>Item</Grid.Item>
        </Grid>
      )
      const grid = container.querySelector('.grid-container') as HTMLElement
      const item = container.querySelector('.grid-item') as HTMLElement
      
      expect(grid.style.getPropertyValue('--grid-cols')).toBe('6')
      expect(grid.style.getPropertyValue('--mobile-grid-cols')).toBe('2')
      expect(item.style.getPropertyValue('--span')).toBe('3')
      expect(item.style.getPropertyValue('--mobile-span')).toBe('1')
    })
  
    it('computes responsive gap CSS variables correctly', () => {
      const gaps = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
      gaps.forEach(gap => {
        const { container } = render(<Grid gap={gap} />)
        const grid = container.querySelector('.grid-container') as HTMLElement
        expect(grid.style.getPropertyValue('--grid-gap')).toBe(`var(--space-${gap})`)
      })
    })
  
    it('handles custom gap values', () => {
      const { container } = render(<Grid gap="15px" />)
      const grid = container.querySelector('.grid-container') as HTMLElement
      expect(grid.style.getPropertyValue('--grid-gap')).toBe('15px')
    })
  
    it('handles undefined gap', () => {
      const { container } = render(<Grid />)
      const grid = container.querySelector('.grid-container') as HTMLElement
      expect(grid.style.getPropertyValue('--grid-gap')).toBe('var(--space-lg)')
      expect(grid.style.getPropertyValue('--grid-gap-tablet')).toBe('var(--space-md)')
      expect(grid.style.getPropertyValue('--grid-gap-mobile')).toBe('var(--space-sm)')
    })
  
    it('sets tabletColumns default based on columns', () => {
      const { container: c1 } = render(<Grid columns={12} />)
      expect((c1.firstChild as HTMLElement).style.getPropertyValue('--tablet-grid-cols')).toBe('6')
      
      const { container: c2 } = render(<Grid columns={4} />)
      expect((c2.firstChild as HTMLElement).style.getPropertyValue('--tablet-grid-cols')).toBe('4')
    })
  
    it('Grid.Item handles tabletSpan and mobileSpan fallbacks', () => {
      const { container } = render(<Grid.Item span={4} />)
      const item = container.firstChild as HTMLElement
      expect(item.style.getPropertyValue('--tablet-span')).toBe('4')
      expect(item.style.getPropertyValue('--mobile-span')).toBe('1')
    })
  })

  describe('Stack DOM Props', () => {
    it('should not pass fullWidth to the DOM element', () => {
      render(<Stack fullWidth data-testid="stack">Test</Stack>)
      const element = screen.getByTestId('stack')
      expect(element.getAttribute('fullWidth')).toBeNull()
    })
  
    it('applies flex-wrap class when wrap is true', () => {
      render(<Stack wrap data-testid="stack-wrap">Content</Stack>)
      const el = screen.getByTestId('stack-wrap')
      expect(el.classList.contains('flex-wrap')).toBe(true)
    })
  
    it('applies flex-row class when direction is row', () => {
      render(<Stack direction="row" data-testid="stack-row">Content</Stack>)
      const el = screen.getByTestId('stack-row')
      expect(el.classList.contains('flex-row')).toBe(true)
    })
  
    it('applies w-full h-full when full is true', () => {
      render(<Stack full data-testid="stack-full">Content</Stack>)
      const el = screen.getByTestId('stack-full')
      expect(el.classList.contains('w-full')).toBe(true)
      expect(el.classList.contains('h-full')).toBe(true)
    })
  })
}
