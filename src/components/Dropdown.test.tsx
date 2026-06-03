import { AllProviders, render, screen, userEvent, waitFor } from '@/lib/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Dropdown from '@/components/Dropdown'

describe('Dropdown', () => {
  const trigger = <button data-testid="trigger">Open</button>

  it('renders trigger element', () => {
    render(<Dropdown trigger={trigger}>Content</Dropdown>, { wrapper: AllProviders })
    expect(screen.getByTestId('trigger')).toBeInTheDocument()
  })

  it('is closed by default', () => {
    render(<Dropdown trigger={trigger}>Content</Dropdown>, { wrapper: AllProviders })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens when clicking trigger', async () => {
    render(<Dropdown trigger={trigger}>Content</Dropdown>, { wrapper: AllProviders })
    
    await userEvent.click(screen.getByTestId('trigger'))
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })
  })

  it('closes when clicking trigger again', async () => {
    render(<Dropdown trigger={trigger}>Content</Dropdown>, { wrapper: AllProviders })
    
    await userEvent.click(screen.getByTestId('trigger'))
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
    
    await userEvent.click(screen.getByTestId('trigger'))
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('closes when clicking outside', async () => {
    render(
      <AllProviders>
        <div>
          <Dropdown trigger={trigger}>Content</Dropdown>
          <button data-testid="outside">Outside</button>
        </div>
      </AllProviders>
    )
    
    await userEvent.click(screen.getByTestId('trigger'))
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
    
    await userEvent.click(screen.getByTestId('outside'))
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('closes when pressing Escape', async () => {
    render(<Dropdown trigger={trigger}>Content</Dropdown>, { wrapper: AllProviders })
    
    await userEvent.click(screen.getByTestId('trigger'))
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
    
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('supports controlled mode with isOpen', async () => {
    const { rerender } = render(<Dropdown trigger={trigger} isOpen={false}>Content</Dropdown>, { wrapper: AllProviders })
    
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    
    rerender(<Dropdown trigger={trigger} isOpen>Content</Dropdown>)
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
  })

  it('calls onToggle in controlled mode when clicking trigger', async () => {
    const onToggle = vi.fn()
    render(<Dropdown trigger={trigger} isOpen={false} onToggle={onToggle}>Content</Dropdown>, { wrapper: AllProviders })
    
    await userEvent.click(screen.getByTestId('trigger'))
    await waitFor(() => expect(onToggle).toHaveBeenCalled())
  })

  it('calls onClose in controlled mode when clicking outside', async () => {
    const onClose = vi.fn()
    render(
      <AllProviders>
        <div>
          <Dropdown trigger={trigger} isOpen onClose={onClose}>Content</Dropdown>
          <button data-testid="outside">Outside</button>
        </div>
      </AllProviders>
    )
    
    await userEvent.click(screen.getByTestId('outside'))
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('applies custom width when provided', async () => {
    render(<Dropdown trigger={trigger} isOpen width="300px">Content</Dropdown>, { wrapper: AllProviders })
    await waitFor(() => {
      const menu = screen.getByRole('menu')
      expect(menu.style.minWidth).toBe('300px')
    })
  })

  it('applies custom className', async () => {
    render(<Dropdown trigger={trigger} isOpen className="my-dropdown">Content</Dropdown>, { wrapper: AllProviders })
    await waitFor(() => {
      const menu = screen.getByRole('menu')
      expect(menu).toHaveClass('my-dropdown')
    })
  })

  it('calls onClose in controlled mode when pressing Escape', async () => {
    const onClose = vi.fn()
    render(<Dropdown trigger={trigger} isOpen onClose={onClose}>Content</Dropdown>, { wrapper: AllProviders })

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })
})
