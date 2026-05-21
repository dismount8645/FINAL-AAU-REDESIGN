import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ModuleHeader from '@/components/ui/ModuleHeader'

describe('ModuleHeader', () => {
  it('renders title', () => {
    render(<ModuleHeader title="Header" />)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })
})
