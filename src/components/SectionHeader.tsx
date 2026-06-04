import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from '@/components/LayoutPrimitives';
import { Heading, Text } from '@/components/Typography';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  actions?: ReactNode
  className?: string
}

export default function SectionHeader({ title, subtitle, level = 2, actions, className = '' }: SectionHeaderProps) {
  return (
    <div className={cn('mb-lg', className)}>
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

if (import.meta.vitest) {
  describe('SectionHeader', () => {
    it('renders title', () => {
      render(<SectionHeader title="Section" />)
      expect(screen.getByText('Section')).toBeInTheDocument()
    })
  
    it('renders actions', () => {
      render(<SectionHeader title="Section" actions={<button>Action</button>} />)
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })
}
