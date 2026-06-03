import { forwardRef, type ElementType, type CSSProperties } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Typography Tokens & Maps
 */
const weightMap: Record<string, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
}

const sizeMap: Record<string, string> = {
  '2xs': '0.625rem',
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.1rem',
  xl: '1.4rem',
  '2xl': '1.6rem',
}

const headingVariants = cva(
  'm-0 font-bold tracking-tight leading-[1.2] text-main transition-colors',
  {
    variants: {
      level: {
        1: 'text-4xl md:text-5xl',
        2: 'text-3xl md:text-4xl',
        3: 'text-2xl md:text-[1.75rem]',
        4: 'text-xl md:text-2xl',
        5: 'text-lg md:text-xl',
        6: 'text-base md:text-lg',
      },
      truncate: {
        true: 'truncate',
      },
    },
    defaultVariants: {
      level: 1,
    },
  }
)

const textVariants = cva(
  'm-0 leading-[1.6] text-main transition-colors',
  {
    variants: {
      size: {
        '2xs': 'text-[0.625rem]',
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
      },
      muted: {
        true: 'text-muted',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  weight?: string | number
  as?: ElementType
}

/**
 * Senior UI/UX Architect Refactored Heading.
 */
const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 1, weight, truncate, as, style, ...props }, ref) => {
    const Tag = as || (`h${level}` as ElementType)
    const resolvedStyle: CSSProperties = { ...style }
    
    if (weight) {
      resolvedStyle.fontWeight = weightMap[weight as string] || weight
    }

    return (
      <Tag
        ref={ref}
        className={cn(headingVariants({ level, truncate }), className)}
        style={resolvedStyle}
        {...props}
      />
    )
  }
)

Heading.displayName = 'Heading'

export interface TextProps 
  extends Omit<React.HTMLAttributes<HTMLElement>, 'size'>, 
    Omit<VariantProps<typeof textVariants>, 'size'> {
  bold?: boolean
  tag?: ElementType
  weight?: string | number
  htmlFor?: string
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string | null
}

/**
 * Senior UI/UX Architect Refactored Text.
 */
const Text = forwardRef<HTMLElement, TextProps>(
  ({ className, size = 'md', weight, bold, muted, tag: Tag = 'p' as ElementType, style, ...props }, ref) => {
    const resolvedWeight = weight || (bold ? 'bold' : null)
    const resolvedStyle: CSSProperties = { ...style }

    if (resolvedWeight) {
      resolvedStyle.fontWeight = weightMap[resolvedWeight as string] || resolvedWeight
    }

    // Handle custom sizes not in standard tokens via inline styles to maintain compatibility
    type TextSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    const isStandardSize = (s: string): s is TextSize => s in sizeMap
    const standardSize = size && isStandardSize(size) ? size : undefined
    
    if (size && !isStandardSize(size)) {
        resolvedStyle.fontSize = size
    }

    return (
      <Tag
        ref={ref}
        className={cn(textVariants({ size: standardSize, muted }), className)}
        style={resolvedStyle}
        {...props}
      />
    )
  }
)

Text.displayName = 'Text'

export type CaptionProps = React.HTMLAttributes<HTMLSpanElement>

const Caption = forwardRef<HTMLSpanElement, CaptionProps>(
  ({ className, style, ...props }, ref) => (
    <Text
      ref={ref}
      tag="span"
      size="xs"
      muted
      className={cn('italic font-medium', className)}
      style={style}
      {...props}
    />
  )
)

Caption.displayName = 'Caption'

// eslint-disable-next-line react-refresh/only-export-components
export { Heading, Text, Caption, headingVariants, textVariants }
export default Text

if (import.meta.vitest) {
  describe('Typography', () => {
    it('renders heading with different levels', () => {
      const { rerender } = render(<Heading level={1}>H1</Heading>)
      expect(screen.getByText('H1').tagName).toBe('H1')
      
      rerender(<Heading level={2}>H2</Heading>)
      expect(screen.getByText('H2').tagName).toBe('H2')
    })
  
    it('renders heading with default level', () => {
      render(<Heading>Default H1</Heading>)
      expect(screen.getByText('Default H1').tagName).toBe('H1')
    })
  
    it('applies weight to heading', () => {
      render(<Heading level={1} weight="bold">Bold Heading</Heading>)
      const el = screen.getByText('Bold Heading')
      expect(el.style.fontWeight).toBe('700')
      
      render(<Heading level={2} weight={300}>Custom Weight</Heading>)
      expect(screen.getByText('Custom Weight').style.fontWeight).toBe('300')
    })
  
    it('renders text with size and weight', () => {
      render(<Text size="lg" weight="medium">Large Text</Text>)
      const el = screen.getByText('Large Text')
      // Standard size "lg" is now applied via class text-lg
      expect(el.className).toContain('text-lg')
      expect(el.style.fontWeight).toBe('500')
    })
  
    it('renders bold and muted text', () => {
      render(<Text bold muted>Bold Muted</Text>)
      const el = screen.getByText('Bold Muted')
      expect(el.style.fontWeight).toBe('700')
      // Muted is now applied via class text-muted
      expect(el.className).toContain('text-muted')
    })
  
    it('renders text with custom tag', () => {
      render(<Text tag="span">Span Text</Text>)
      expect(screen.getByText('Span Text').tagName).toBe('SPAN')
    })
  
    it('renders caption', () => {
      render(<Caption>Caption Text</Caption>)
      const el = screen.getByText('Caption Text')
      expect(el.tagName).toBe('SPAN')
      expect(el.className).toContain('text-xs')
      expect(el.className).toContain('text-muted')
    })
  
    it('renders text with custom size not in standard tokens', () => {
      render(<Text size="20px">Custom Size</Text>)
      expect(screen.getByText('Custom Size').style.fontSize).toBe('20px')
    })
  
    it('renders text with custom weight not in weightMap', () => {
      render(<Text weight={100}>Light Weight</Text>)
      expect(screen.getByText('Light Weight').style.fontWeight).toBe('100')
    })
  })
}
