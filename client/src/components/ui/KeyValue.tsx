import type { ReactNode } from 'react';


import { Text } from './Typography';

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


