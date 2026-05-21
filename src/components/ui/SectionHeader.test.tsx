import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SectionHeader from '@/components/ui/SectionHeader'

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
