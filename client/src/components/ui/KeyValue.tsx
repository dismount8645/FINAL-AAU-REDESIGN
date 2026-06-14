import type { ReactNode } from 'react';


import { Text } from '@/components/ui';

export interface KeyValueProps {
  label: string
  value: ReactNode
  divider?: boolean
  className?: string
}

export default function KeyValue({ label, value, divider, className = '' }: KeyValueProps) {
  return (
    <div className={['flex justify-between items-center py-xs', divider ? 'border-b border-border pb-sm' : '', className].filter(Boolean).join(' ')}>
      <Text size="sm" className="m-0">{label}</Text>
      <Text size="sm" weight="bold" className="m-0">{value}</Text>
    </div>
  )
}

if (import.meta.vitest) {
  describe('KeyValue', () => {
    it('renders label and value', () => {
      render(<KeyValue label="Key" value="Value" />)
      expect(screen.getByText('Key')).toBeInTheDocument()
      expect(screen.getByText('Value')).toBeInTheDocument()
    })
  
    it('renders with divider class', () => {
      const { container } = render(<KeyValue label="K" value="V" divider />)
      expect(container.firstChild).toHaveClass('border-b')
    })
  
    it('renders with custom className', () => {
      const { container } = render(<KeyValue label="K" value="V" className="custom" />)
      expect(container.firstChild).toHaveClass('custom')
    })
  })
}
