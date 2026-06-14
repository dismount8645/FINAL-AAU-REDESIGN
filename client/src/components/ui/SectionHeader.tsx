import type { ReactNode } from 'react';


import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  actions?: ReactNode
  className?: string
}

export default function SectionHeader({ title, subtitle, description, level = 2, actions, className = '' }: SectionHeaderProps) {
  const desc = description ?? subtitle
  return (
    <div className={cn('mb-lg', className)}>
      <Stack direction="row" align="center" justify="between">
        <Stack gap="2xs">
          <Heading level={level} className="m-0">{title}</Heading>
          {desc ? <Text size="sm" muted className="m-0 leading-normal">{desc}</Text> : null}
        </Stack>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </Stack>
    </div>
  )
}

if (import.meta.vitest) {
  describe('SectionHeader', () => {
    it('renders title', () => {
      render(<SectionHeader title="Section" />)
      expect(screen.getByText('Section')).toBeInTheDocument()
    })
  
    it('renders description', () => {
      render(<SectionHeader title="Section" description="Description text" />)
      expect(screen.getByText('Description text')).toBeInTheDocument()
    })

    it('renders subtitle as fallback when description is not provided', () => {
      render(<SectionHeader title="Section" subtitle="Subtitle text" />)
      expect(screen.getByText('Subtitle text')).toBeInTheDocument()
    })

    it('renders actions', () => {
      render(<SectionHeader title="Section" actions={<button>Action</button>} />)
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })
}
