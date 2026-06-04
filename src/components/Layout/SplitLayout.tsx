import { type ReactNode } from 'react'
import { Grid } from '@/components/Layout'

interface SplitLayoutProps {
  main: ReactNode
  sidebar: ReactNode
  className?: string
  mainSpan?: 8 | 9
  sidebarSpan?: 4 | 3
}

export function SplitLayout({
  main,
  sidebar,
  className = '',
  mainSpan = 8,
  sidebarSpan = 4,
}: SplitLayoutProps) {
  return (
    <div className={`animate-fade-in ${className}`}>
      <Grid columns={12} gap="lg">
        <Grid.Item span={mainSpan} mobileSpan={12} className="min-w-0">
          {main}
        </Grid.Item>
        <Grid.Item span={sidebarSpan} mobileSpan={12} className="min-w-0">
          {sidebar}
        </Grid.Item>
      </Grid>
    </div>
  )
}

export default SplitLayout
