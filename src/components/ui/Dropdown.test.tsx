import { AllProviders, render, screen, userEvent } from '@/test/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Dropdown from '@/components/ui/Dropdown'

describe('Dropdown', () => {
  const trigger = <button data-testid="trigger">Open</button>

  it('renders trigger element', () => {
    render(<Dropdown trigger={trigger}>Content</Dropdown>, { wrapper: AllProviders })
    expect(screen.getByTestId('trigger')).toBeInTheDocument()
  })

  it('is closed by default', () => {
    render(<Dropdown trigger={trigger}>Content</Dropdown>, { wrapper: AllProviders })
    const menu = document.querySelector('.dropdown-menu')
    expect(menu).not.toBeInTheDocument()
  })

  it('opens when clicking trigger', async () => {
    render(<Dropdown trigger={trigger}>Content</Dropdown>, { wrapper: AllProviders })
    
    await userEvent.click(screen.getByTestId('trigger'))
    
    const menu = document.querySelector('.dropdown-menu')
    expect(menu).toBeInTheDocument()
  })

  it('closes when clicking trigger again', async () => {
    render(<Dropdown trigger={trigger}>Content</Dropdown>, { wrapper: AllProviders })
    
    await userEvent.click(screen.getByTestId('trigger'))
    expect(document.querySelector('.dropdown-menu')).toBeInTheDocument()
    
    await userEvent.click(screen.getByTestId('trigger'))
    expect(document.querySelector('.dropdown-menu')).not.toBeInTheDocument()
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
    expect(document.querySelector('.dropdown-menu')).toBeInTheDocument()
    
    await userEvent.click(screen.getByTestId('outside'))
    expect(document.querySelector('.dropdown-menu')).not.toBeInTheDocument()
  })

  it('closes when pressing Escape', async () => {
    render(<Dropdown trigger={trigger}>Content</Dropdown>, { wrapper: AllProviders })
    
    await userEvent.click(screen.getByTestId('trigger'))
    expect(document.querySelector('.dropdown-menu')).toBeInTheDocument()
    
    await userEvent.keyboard('{Escape}')
    expect(document.querySelector('.dropdown-menu')).not.toBeInTheDocument()
  })

  it('supports controlled mode with isOpen', () => {
    const { rerender } = render(<Dropdown trigger={trigger} isOpen={false}>Content</Dropdown>, { wrapper: AllProviders })
    
    expect(document.querySelector('.dropdown-menu')).not.toBeInTheDocument()
    
    rerender(<Dropdown trigger={trigger} isOpen>Content</Dropdown>)
    expect(document.querySelector('.dropdown-menu')).toBeInTheDocument()
  })


  it('calls onToggle in controlled mode when clicking trigger', async () => {
    const onToggle = vi.fn()
    render(<Dropdown trigger={trigger} isOpen={false} onToggle={onToggle}>Content</Dropdown>, { wrapper: AllProviders })
    
    await userEvent.click(screen.getByTestId('trigger'))
    expect(onToggle).toHaveBeenCalledOnce()
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
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('applies right alignment by default', () => {
    render(<Dropdown trigger={trigger} isOpen>Content</Dropdown>, { wrapper: AllProviders })
    const menu = document.querySelector('.dropdown-menu') as HTMLElement
    expect(menu.style.right).toBe('0px')
  })

  it('applies left alignment when align="left"', () => {
    render(<Dropdown trigger={trigger} isOpen align="left">Content</Dropdown>, { wrapper: AllProviders })
    const menu = document.querySelector('.dropdown-menu') as HTMLElement
    expect(menu.style.left).toBe('0px')
  })

  it('applies custom width when provided', () => {
    render(<Dropdown trigger={trigger} isOpen width="300px">Content</Dropdown>, { wrapper: AllProviders })
    const menu = document.querySelector('.dropdown-menu') as HTMLElement
    expect(menu.style.width).toBe('300px')
  })

  it('applies custom className', () => {
    render(<Dropdown trigger={trigger} className="my-dropdown">Content</Dropdown>, { wrapper: AllProviders })
    const dropdown = document.querySelector('.my-dropdown')
    expect(dropdown).toBeInTheDocument()
  })

  it('calls onClose in controlled mode when pressing Escape', async () => {
    const onClose = vi.fn()
    render(<Dropdown trigger={trigger} isOpen onClose={onClose}>Content</Dropdown>, { wrapper: AllProviders })

    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does nothing when pressing Escape while closed (visible=false)', async () => {
    const onToggle = vi.fn()
    render(<Dropdown trigger={trigger} isOpen={false} onToggle={onToggle}>Content</Dropdown>, { wrapper: AllProviders })

    await userEvent.keyboard('{Escape}')
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('does not call close when pressing non-Escape keys', async () => {
    const onClose = vi.fn()
    render(<Dropdown trigger={trigger} isOpen onClose={onClose}>Content</Dropdown>, { wrapper: AllProviders })

    await userEvent.keyboard('{Enter}')
    expect(onClose).not.toHaveBeenCalled()
  })
})
