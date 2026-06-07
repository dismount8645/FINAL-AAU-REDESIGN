import { createContext, useContext, isValidElement, cloneElement, type ReactNode, type ReactElement } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { useDropdown } from '@/hooks';
import { cn } from '@/lib/utils';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

interface DropdownContextValue {
  isOpen: boolean
  close: () => void
  menuRef: React.RefObject<HTMLDivElement | null>
  buttonRef: React.RefObject<HTMLButtonElement | null>
  handleMenuKeyDown: (e: React.KeyboardEvent) => void
  handleTriggerKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void
  toggle: () => void
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

function useDropdownContext() {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('Dropdown compound components must be used within <Dropdown>')
  return ctx
}

interface TriggerHandlers {
  ref: React.RefObject<HTMLButtonElement | null>
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void
  onClick: () => void
}

interface TriggerState {
  isOpen: boolean
}

type TriggerChild = ((handlers: TriggerHandlers, state: TriggerState) => ReactNode) | ReactElement

interface RootProps {
  children: ReactNode
  className?: string
}

function DropdownRoot({ children, className }: RootProps) {
  const dropdown = useDropdown()
  return (
    <DropdownContext.Provider value={dropdown}>
      <div ref={dropdown.dropdownRef} className={cn('relative inline-flex', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

interface TriggerProps {
  children: TriggerChild
  className?: string
}

function DropdownTrigger({ children, className }: TriggerProps) {
  const ctx = useDropdownContext()

  if (typeof children === 'function') {
    return children(
      {
        ref: ctx.buttonRef,
        onKeyDown: ctx.handleTriggerKeyDown,
        onClick: ctx.toggle,
      },
      { isOpen: ctx.isOpen }
    ) as ReactElement
  }

  if (isValidElement(children)) {
    return cloneElement(children, {
      ref: ctx.buttonRef,
      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        children.props.onKeyDown?.(e)
        ctx.handleTriggerKeyDown(e)
      },
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e)
        ctx.toggle()
      },
      'aria-expanded': ctx.isOpen,
      'aria-haspopup': 'menu' as const,
    } as Partial<unknown>)
  }

  return children as ReactElement
}

interface MenuProps {
  children: ReactNode | ((helpers: { close: () => void }) => ReactNode)
  className?: string
}

function DropdownMenu({ children, className }: MenuProps) {
  const ctx = useDropdownContext()

  return (
    <AnimatePresence>
      {ctx.isOpen && (
        <motion.div
          ref={ctx.menuRef}
          onKeyDown={ctx.handleMenuKeyDown}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'absolute right-0 top-full z-50 mt-2',
            'rounded-[var(--radius-lg)] border border-border bg-bg-card shadow-xl',
            'outline-none',
            className
          )}
          role="menu"
        >
          {typeof children === 'function' ? children({ close: ctx.close }) : children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ItemProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

function DropdownItem({ children, onClick, className, disabled }: ItemProps) {
  const ctx = useDropdownContext()

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'flex w-full cursor-pointer items-center',
        'px-[var(--space-sm)] py-[var(--space-2xs)]',
        'rounded-[var(--radius-md)] transition-colors duration-150',
        'text-sm font-bold text-main',
        'hover:bg-bg-highlight hover:text-primary',
        'focus-visible:bg-bg-highlight focus-visible:outline-none focus-visible:shadow-focus',
        disabled && 'pointer-events-none opacity-40',
        className
      )}
      onClick={() => {
        onClick?.()
        ctx.close()
      }}
    >
      {children}
    </div>
  )
}

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  Item: DropdownItem,
})

export default Dropdown

if (import.meta.vitest) {

  describe('Dropdown', () => {
    it('renders trigger and opens menu on click', async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger>
            <button data-testid="trigger">Open</button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item onClick={vi.fn()}>Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      fireEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
        expect(screen.getByText('Item')).toBeInTheDocument()
      })
    })

    it('closes on second trigger click', async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger>
            <button data-testid="trigger">Open</button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item onClick={vi.fn()}>Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )

      fireEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())

      fireEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    })

    it('closes on outside click', async () => {
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <Dropdown>
            <Dropdown.Trigger>
              <button data-testid="trigger">Open</button>
            </Dropdown.Trigger>
            <Dropdown.Menu>
              <Dropdown.Item onClick={vi.fn()}>Item</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )

      fireEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())

      fireEvent.mouseDown(screen.getByTestId('outside'))
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    })

    it('closes on Escape', async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger>
            <button data-testid="trigger">Open</button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item onClick={vi.fn()}>Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )

      fireEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())

      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    })

    it('closes when item is clicked', async () => {
      const onClick = vi.fn()
      render(
        <Dropdown>
          <Dropdown.Trigger>
            <button data-testid="trigger">Open</button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item onClick={onClick}>Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )

      fireEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Item'))
      await waitFor(() => {
        expect(onClick).toHaveBeenCalled()
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })

    it('supports function-as-child trigger with isOpen state', async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger>
            {({ ref, onKeyDown, onClick }, { isOpen }) => (
              <button
                ref={ref}
                onKeyDown={onKeyDown}
                onClick={onClick}
                data-testid="trigger"
                data-open={isOpen}
              >
                {isOpen ? 'Close' : 'Open'}
              </button>
            )}
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item onClick={vi.fn()}>Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )

      const trigger = screen.getByTestId('trigger')
      expect(trigger).toHaveAttribute('data-open', 'false')
      expect(trigger).toHaveTextContent('Open')

      fireEvent.click(trigger)
      await waitFor(() => {
        expect(screen.getByTestId('trigger')).toHaveAttribute('data-open', 'true')
        expect(screen.getByTestId('trigger')).toHaveTextContent('Close')
      })
    })

    it('navigates items with ArrowDown', async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger>
            <button data-testid="trigger">Open</button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item onClick={vi.fn()}>First</Dropdown.Item>
            <Dropdown.Item onClick={vi.fn()}>Second</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )

      fireEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())

      const menu = screen.getByRole('menu')
      fireEvent.keyDown(menu, { key: 'ArrowDown' })
      expect(screen.getByText('First').closest('[role="menuitem"]')).toHaveFocus()
    })

    it('applies custom className to menu', async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger>
            <button data-testid="trigger">Open</button>
          </Dropdown.Trigger>
          <Dropdown.Menu className="custom-menu-class">
            <Dropdown.Item onClick={vi.fn()}>Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )

      fireEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => {
        expect(screen.getByRole('menu')).toHaveClass('custom-menu-class')
      })
    })
  })
}
