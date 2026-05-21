import type { ReactNode, CSSProperties, ElementType } from 'react'

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  weight?: string | number
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export interface TextProps {
  id?: string;
  size?: string
  weight?: string | number
  bold?: boolean
  muted?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  tag?: ElementType
  htmlFor?: string
}

export interface CaptionProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

const sizeMap: Record<string, string> = {
  '2xs': '0.625rem',
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.1rem',
  'lg-plus': '1.25rem',
  xl: '1.4rem',
  '2xl': '1.6rem',
  '3xl': '2rem',
}

const weightMap: Record<string, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
}

export function Heading({ level = 1, weight, children, className = '', style, ...props }: HeadingProps) {
  const Tag = `h${level}` as ElementType
  const styles: Record<string, string | number> = {}
  if (weight) styles.fontWeight = weightMap[weight] || weight
  return <Tag className={className} style={{ ...styles, ...style }} {...props}>{children}</Tag>
}

export function Text({ size = 'md', weight, bold, muted, children, className = '', style, tag: Tag = 'p' as ElementType, ...props }: TextProps) {
  const resolvedWeight = weight || (bold ? 'bold' : null)
  const styles: Record<string, string | number> = {}
  if (size !== 'md') styles.fontSize = sizeMap[size] || size
  if (resolvedWeight) styles.fontWeight = weightMap[resolvedWeight] || resolvedWeight
  if (muted) styles.color = 'var(--text-muted)'
  return <Tag className={className} style={{ ...styles, ...style }} {...props}>{children}</Tag>
}

export function Caption({ children, className = '', style, ...props }: CaptionProps) {
  const Tag = 'span' as ElementType
  return <Tag className={`text-xs ${className}`} style={{ color: 'var(--text-muted)', ...style }} {...props}>{children}</Tag>
}
