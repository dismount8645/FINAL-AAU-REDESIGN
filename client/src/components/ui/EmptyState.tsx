import { type ReactNode } from 'react';

import { type LucideIcon } from 'lucide-react';
import { Heading, Text } from './Typography';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  message?: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({ icon: Icon, title, message, description, action, className }: EmptyStateProps) {
  const displayMessage = message || description

  return (
    <div className={cn("flex flex-col items-center p-xl border-dashed rounded-[var(--radius-md)] bg-card", className)}>
      {Icon ? <Icon size={24} strokeWidth={2} className="text-muted mb-sm" aria-hidden="true" /> : null}
      <Heading level={4} className="mb-md font-semibold">{title}</Heading>
      {displayMessage ? <Text size="sm" className="text-main">{displayMessage}</Text> : null}
      <div className="mt-md">{action}</div>
    </div>
  )
}
