import React, { type ReactNode, memo, forwardRef, useState } from 'react';

import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { motion } from 'framer-motion';
import { AllProviders, render, screen, userEvent, waitFor } from '@/test/test-utils';
import { cn } from '@/lib/utils';

"use client"






/**
 * Dropdown (Menu) - High-performance AAU UI component.
 * Enforces 8pt grid, 150ms motion physics, and strict brand token usage.
 */

const DropdownRoot = MenuPrimitive.Root;

const DropdownTrigger = forwardRef<HTMLButtonElement, MenuPrimitive.Trigger.Props>(
  ({ className, ...props }, ref) => (
    <MenuPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center outline-none transition-all duration-150",
        "focus-visible:shadow-focus focus-visible:outline-none rounded-[var(--radius-sm)]",
        className
      )}
      {...props}
    />
  )
);
DropdownTrigger.displayName = "DropdownTrigger";

const DropdownPortal = MenuPrimitive.Portal;

const DropdownItem = forwardRef<HTMLDivElement, MenuPrimitive.Item.Props>(
  ({ className, ...props }, ref) => (
    <MenuPrimitive.Item
      ref={ref}
      className={cn(
        "min-h-[44px] flex items-center px-[var(--space-sm)] py-[var(--space-2xs)] w-full text-left",
        "rounded-[var(--radius-md)] transition-colors duration-150 outline-none cursor-pointer",
        "text-sm font-bold text-main",
        "hover:bg-bg-highlight hover:text-primary",
        "focus-visible:bg-bg-highlight focus-visible:text-primary",
        "data-[disabled]:opacity-40 data-[disabled]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
);
DropdownItem.displayName = "DropdownItem";

const DropdownContent = memo(forwardRef<HTMLDivElement, MenuPrimitive.Popup.Props & {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}>(({ className, children, align = "end", sideOffset = 8, ...props }, ref) => (
  <DropdownPortal>
    <MenuPrimitive.Positioner align={align} sideOffset={sideOffset}>
      <MenuPrimitive.Popup
        ref={ref}
        data-slot="dropdown-content"
        render={
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "z-[var(--z-dropdown)] min-w-[200px] flex flex-col gap-[var(--space-4xs)]",
              "bg-bg-card border border-[var(--border-color)]/60 rounded-[var(--radius-lg)] p-[var(--space-2xs)]",
              "shadow-[var(--shadow-xl)] outline-none isolate",
              className
            )}
          />
        }
        {...props}
      >
        {children}
      </MenuPrimitive.Popup>
    </MenuPrimitive.Positioner>
  </DropdownPortal>
)));
DropdownContent.displayName = "DropdownContent";

// Legacy compatibility wrapper
export interface DropdownProps {
  trigger: ReactNode;
  children?: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  align?: "left" | "right";
  width?: string;
  className?: string;
}

/**
 * Dropdown - Legacy Compatibility Wrapper.
 * For new code, prefer the composable Dropdown.* components.
 */
const DropdownWrapper = ({
  trigger,
  children,
  isOpen,
  onToggle,
  onClose,
  align = "right",
  width,
  className,
}: DropdownProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isOpen === undefined) setInternalOpen(newOpen);
    if (newOpen && onToggle) onToggle();
    if (!newOpen && onClose) onClose();
    if (!newOpen && onToggle && !onClose) onToggle();
  };

  const isTriggerElement = React.isValidElement(trigger);

  return (
    <DropdownRoot open={open} onOpenChange={handleOpenChange}>
      <DropdownTrigger 
        render={isTriggerElement ? (trigger as React.ReactElement) : undefined}
      >
        {!isTriggerElement ? trigger : undefined}
      </DropdownTrigger>
      <DropdownContent 
        align={align === "right" ? "end" : "start"} 
        className={cn("dropdown-menu", className)}
        style={{ minWidth: width }}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const isButton = typeof child.type === "string" && child.type === "button";
            return (
              <DropdownItem render={child} nativeButton={isButton} />
            );
          }
          return child;
        })}
      </DropdownContent>
    </DropdownRoot>
  );
};

export {
  DropdownRoot as Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownWrapper as default
};

const _testDropdown = DropdownWrapper;

if (import.meta.vitest) {
  describe('Dropdown', () => {
    const trigger = <button data-testid="trigger">Open</button>
  
    it('renders trigger element', () => {
      render(<_testDropdown trigger={trigger}>Content</_testDropdown>, { wrapper: AllProviders })
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
    })
  
    it('is closed by default', () => {
      render(<_testDropdown trigger={trigger}>Content</_testDropdown>, { wrapper: AllProviders })
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  
    it('opens when clicking trigger', async () => {
      render(<_testDropdown trigger={trigger}>Content</_testDropdown>, { wrapper: AllProviders })
      
      await userEvent.click(screen.getByTestId('trigger'))
      
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })
    })
  
    it('closes when clicking trigger again', async () => {
      render(<_testDropdown trigger={trigger}>Content</_testDropdown>, { wrapper: AllProviders })
      
      await userEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
      
      await userEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    })
  
    it('closes when clicking outside', async () => {
      render(
        <AllProviders>
          <div>
            <_testDropdown trigger={trigger}>Content</_testDropdown>
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
      render(<_testDropdown trigger={trigger}>Content</_testDropdown>, { wrapper: AllProviders })
      
      await userEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
      
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    })
  
    it('supports controlled mode with isOpen', async () => {
      const { rerender } = render(<_testDropdown trigger={trigger} isOpen={false}>Content</_testDropdown>, { wrapper: AllProviders })
      
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      
      rerender(<_testDropdown trigger={trigger} isOpen>Content</_testDropdown>)
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
    })
  
    it('calls onToggle in controlled mode when clicking trigger', async () => {
      const onToggle = vi.fn()
      render(<_testDropdown trigger={trigger} isOpen={false} onToggle={onToggle}>Content</_testDropdown>, { wrapper: AllProviders })
      
      await userEvent.click(screen.getByTestId('trigger'))
      await waitFor(() => expect(onToggle).toHaveBeenCalled())
    })
  
    it('calls onClose in controlled mode when clicking outside', async () => {
      const onClose = vi.fn()
      render(
        <AllProviders>
          <div>
            <_testDropdown trigger={trigger} isOpen onClose={onClose}>Content</_testDropdown>
            <button data-testid="outside">Outside</button>
          </div>
        </AllProviders>
      )
      
      await userEvent.click(screen.getByTestId('outside'))
      await waitFor(() => expect(onClose).toHaveBeenCalled())
    })
  
    it('applies custom width when provided', async () => {
      render(<_testDropdown trigger={trigger} isOpen width="300px">Content</_testDropdown>, { wrapper: AllProviders })
      await waitFor(() => {
        const menu = screen.getByRole('menu')
        expect(menu.style.minWidth).toBe('300px')
      })
    })
  
    it('applies custom className', async () => {
      render(<_testDropdown trigger={trigger} isOpen className="my-dropdown">Content</_testDropdown>, { wrapper: AllProviders })
      await waitFor(() => {
        const menu = screen.getByRole('menu')
        expect(menu).toHaveClass('my-dropdown')
      })
    })
  
    it('calls onClose in controlled mode when pressing Escape', async () => {
      const onClose = vi.fn()
      render(<_testDropdown trigger={trigger} isOpen onClose={onClose}>Content</_testDropdown>, { wrapper: AllProviders })
  
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(onClose).toHaveBeenCalled())
    })

    it('renders with a string trigger', () => {
      render(<_testDropdown trigger="String Trigger">Content</_testDropdown>, { wrapper: AllProviders })
      expect(screen.getByText('String Trigger')).toBeInTheDocument()
    })

    it('calls onToggle when closed in controlled mode without onClose', async () => {
      const onToggle = vi.fn()
      render(
        <AllProviders>
          <div>
            <_testDropdown trigger={trigger} isOpen onToggle={onToggle}>Content</_testDropdown>
            <button data-testid="outside">Outside</button>
          </div>
        </AllProviders>
      )
      await userEvent.click(screen.getByTestId('outside'))
      await waitFor(() => expect(onToggle).toHaveBeenCalled())
    })
  })
}
