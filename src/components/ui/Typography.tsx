import { forwardRef, type ElementType, type CSSProperties } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

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
    const isStandardSize = size && size in sizeMap
    if (!isStandardSize && size) {
        resolvedStyle.fontSize = size
    }

    return (
      <Tag
        ref={ref}
        className={cn(textVariants({ size: isStandardSize ? (size as any) : undefined, muted }), className)}
        style={resolvedStyle}
        {...props}
      />
    )
  }
)

Text.displayName = 'Text'

export interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {}

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

export { Heading, Text, Caption, headingVariants, textVariants }
export default Text
