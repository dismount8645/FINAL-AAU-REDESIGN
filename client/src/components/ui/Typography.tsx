import { forwardRef, type ElementType, type CSSProperties } from 'react';
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

export interface HeadingVariantProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6 | '1' | '2' | '3' | '4' | '5' | '6' | null;
  truncate?: boolean | null;
}

function headingVariants({
  level,
  truncate,
}: HeadingVariantProps = {}): string {
  const resolvedLevel = level !== undefined ? String(level) : '1';
  return cn(
    'm-0 font-bold tracking-tight leading-[1.2] text-main transition-colors',
    resolvedLevel === '1' && 'text-4xl md:text-5xl',
    resolvedLevel === '2' && 'text-3xl md:text-4xl',
    resolvedLevel === '3' && 'text-2xl md:text-[1.75rem]',
    resolvedLevel === '4' && 'text-xl md:text-2xl',
    resolvedLevel === '5' && 'text-lg md:text-xl',
    resolvedLevel === '6' && 'text-base md:text-lg',
    truncate === true && 'truncate'
  );
}

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, HeadingVariantProps {
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

export interface TextVariantProps {
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string | null;
  muted?: boolean | null;
}

function textVariants({
  size,
  muted,
}: {
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null;
  muted?: boolean | null;
} = {}): string {
  const resolvedSize = size !== undefined ? size : 'md';
  return cn(
    'm-0 leading-[1.6] text-main transition-colors',
    resolvedSize === '2xs' && 'text-[0.625rem]',
    resolvedSize === 'xs' && 'text-xs',
    resolvedSize === 'sm' && 'text-sm',
    resolvedSize === 'md' && 'text-base',
    resolvedSize === 'lg' && 'text-lg',
    resolvedSize === 'xl' && 'text-xl',
    resolvedSize === '2xl' && 'text-2xl',
    muted === true && 'text-muted'
  );
}

export interface TextProps 
  extends Omit<React.HTMLAttributes<HTMLElement>, 'size'> {
  bold?: boolean
  tag?: ElementType
  weight?: string | number
  htmlFor?: string
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string | null
  muted?: boolean | null
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
export { Heading, Text, Caption }
