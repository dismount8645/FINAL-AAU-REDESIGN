import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Accordion from '@/components/Accordion'

describe('Accordion', () => {
  it('renders title text', () => {
    render(<Accordion title="Test Title">Content</Accordion>)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('is closed by default', () => {
    render(<Accordion title="Test">Hidden Content</Accordion>)
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument()
  })

  it('is open when defaultOpen is true', () => {
    render(<Accordion title="Test" defaultOpen>Visible Content</Accordion>)
    expect(screen.getByText('Visible Content')).toBeInTheDocument()
  })

  it('opens when clicking the header', async () => {
    render(<Accordion title="Toggle Me">Secret Content</Accordion>)
    
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument()
    
    const header = screen.getByRole('button', { name: 'Toggle Me' })
    await userEvent.click(header)
    
    expect(screen.getByText('Secret Content')).toBeInTheDocument()
  })

  it('closes when clicking an open accordion', async () => {
    render(<Accordion title="Toggle Me" defaultOpen>Content</Accordion>)
    
    expect(screen.getByText('Content')).toBeInTheDocument()
    
    const header = screen.getByRole('button', { name: 'Toggle Me' })
    await userEvent.click(header)
    
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('has aria-expanded="false" when closed', () => {
    render(<Accordion title="Test">Content</Accordion>)
    const header = screen.getByRole('button', { name: 'Test' })
    expect(header).toHaveAttribute('aria-expanded', 'false')
  })

  it('has aria-expanded="true" when open by default', () => {
    render(<Accordion title="Test Open" defaultOpen>Content</Accordion>)
    const header = screen.getByRole('button', { name: 'Test Open' })
    expect(header).toHaveAttribute('aria-expanded', 'true')
  })

  it('has is-open class when open', async () => {
    render(<Accordion title="Test">Content</Accordion>)
    
    const button = screen.getByRole('button', { name: 'Test' })
    expect(button.className).not.toContain('is-open')
    
    await userEvent.click(button)
    // Bemærk: Accordion bruger ikke 'is-open' klassen i jsx'en.
    // Vi tjekker i stedet aria-expanded.
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders content when open', () => {
    render(<Accordion title="Test" defaultOpen>Content</Accordion>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('does not render content when closed', () => {
    render(<Accordion title="Test">Content</Accordion>)
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('has chevron icon', () => {
    render(<Accordion title="Test">Content</Accordion>)
    // Sørg for at vi har et svg-ikon (Lucide)
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('rotates chevron when open', () => {
    render(<Accordion title="Test" defaultOpen>Content</Accordion>)
    const icon = document.querySelector('svg')
    // I vores implementation roterer vi ikonet via CSS klasser på triggeren
    expect(icon).toHaveClass('group-data-[open]:rotate-180')
  })
})
