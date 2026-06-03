import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Icon from '@/components/Icon'
import { User } from 'lucide-react'

describe('Icon', () => {
  it('renders default icon', () => {
    const { container } = render(<Icon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders specific icon component', () => {
    const { container } = render(<Icon icon={User} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    const { container } = render(<Icon variant="primary" />)
    expect(container.firstChild).toHaveClass('text-primary')
  })

  it('renders with label setting aria-label and role="img"', () => {
    const { container } = render(<Icon icon={User} label="User icon" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-label', 'User icon')
    expect(svg).toHaveAttribute('role', 'img')
    expect(svg).not.toHaveAttribute('aria-hidden')
  })

  it('renders without label setting aria-hidden="true"', () => {
    const { container } = render(<Icon icon={User} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('aria-label')
    expect(svg).not.toHaveAttribute('role')
  })
})
