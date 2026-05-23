"use client"

import React, { type ReactNode, memo, forwardRef, useState } from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Dropdown (Menu) - High-performance AAU UI component.
 * Enforces 8pt grid, 150ms motion physics, and strict brand token usage.
 */

const DropdownRoot = MenuPrimitive.Root;

const DropdownTrigger = forwardRef<HTMLButtonElement, MenuPrimitive.Trigger.Props>(
  ({ className, ...props }, ref) => (
    <MenuPrimitive.Trigger
      ref={ref}
      asChild
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
        "text-sm font-bold text-[var(--text-main)]",
        "hover:bg-[var(--bg-highlight)] hover:text-[var(--aau-blue)]",
        "focus-visible:bg-[var(--bg-highlight)] focus-visible:text-[var(--aau-blue)]",
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
              "bg-[var(--bg-card)] border border-[var(--border-color)]/60 rounded-[var(--radius-lg)] p-[var(--space-2xs)]",
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

  return (
    <DropdownRoot open={open} onOpenChange={handleOpenChange}>
      <DropdownTrigger asChild>
        {React.isValidElement(trigger) ? trigger : <button type="button">{trigger}</button>}
      </DropdownTrigger>
      <DropdownContent 
        align={align === "right" ? "end" : "start"} 
        className={cn("dropdown-menu", className)}
        style={{ minWidth: width }}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return (
              <DropdownItem asChild>
                {child}
              </DropdownItem>
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
