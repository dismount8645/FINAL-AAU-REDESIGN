import { render, screen, AllProviders } from '@/lib/test-utils'
import { describe, it, expect } from 'vitest'
import { Inbox } from 'lucide-react'
import EmptyState from '@/components/EmptyState'

describe('EmptyState', () => {
  it('renders correctly', () => {
    render(<EmptyState title="Test" icon={Inbox} />, { wrapper: AllProviders })
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('renders without icon', () => {
    render(<EmptyState title="No Icon" />, { wrapper: AllProviders })
    expect(screen.getByText('No Icon')).toBeInTheDocument()
  })
})
