import type { ReactNode } from 'react'
import { Heading, Text } from '@/components/ui/Typography'
import Stack from '@/components/ui/Stack'

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  actions?: ReactNode
  className?: string
}

export default function SectionHeader({ title, subtitle, level = 2, actions, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-lg ${className}`}>
      <Stack direction="row" align="center" justify="between">
        <Stack gap="2xs">
          <Heading level={level} className="m-0">{title}</Heading>
          {subtitle ? <Text size="xs" muted className="m-0 leading-normal">{subtitle}</Text> : null}
        </Stack>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </Stack>
    </div>
  )
}
