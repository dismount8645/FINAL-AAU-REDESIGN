import type { SVGProps } from 'react'

export default function ResizeCorner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" {...props}>
      <path d="M10 2 L2 10 M10 6 L6 10 M10 9 L9 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
