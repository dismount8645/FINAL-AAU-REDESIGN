import { createContext, useContext, isValidElement, cloneElement, type ReactNode, type ReactElement } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { useDropdown } from '@/hooks';
import { cn } from '@/lib/utils';

interface DropdownContextValue {
  isOpen: boolean
  close: () => void
  menuRef: React.RefObject<HTMLDivElement | null>
  buttonRef: React.RefObject<HTMLButtonElement | null>
  handleMenuKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
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

function DropdownTrigger({ children }: TriggerProps) {
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
        (children as any).props.onKeyDown?.(e)
        ctx.handleTriggerKeyDown(e)
      },
      onClick: (e: React.MouseEvent) => {
        (children as any).props.onClick?.(e)
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
          ref={ctx.menuRef as any}
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
