import React, { type ReactNode } from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DropdownProps {
  /** Elementet som udløser dropdown‑menuen */
  trigger: ReactNode;
  /** Indholdet af dropdown‑menuen */
  children?: ReactNode;
  /** Kontrolleret åben‑tilstand */
  isOpen?: boolean;
  /** Callback når brugeren toggler menuen */
  onToggle?: () => void;
  /** Callback når menuen lukkes */
  onClose?: () => void;
  /** Placering i forhold til trigger */
  align?: "left" | "right";
  /** Bredde på menuen */
  width?: string;
  /** Ekstra className til wrapper */
  className?: string;
}

/**
 * Tilgængelig dropdown‑komponent.
 *
 * Refactored to use @base-ui/react, framer-motion, and strict 44px hit areas.
 */
export default function Dropdown({
  trigger,
  children,
  isOpen,
  onToggle,
  onClose,
  align = "right",
  width = "200px",
  className = "",
}: DropdownProps) {
  const controlled = isOpen !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlled ? isOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!controlled) {
      setInternalOpen(newOpen);
    }
    if (newOpen && onToggle) onToggle();
    if (!newOpen && onClose) onClose();
    if (!newOpen && onToggle && !onClose) onToggle();
  };

  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return (
          <MenuPrimitive.Item
            render={
              React.cloneElement(child as React.ReactElement, {
                className: cn(
                  "min-h-[44px] flex items-center px-sm py-2 w-full text-left rounded-[var(--radius-md)] transition-colors outline-none cursor-pointer",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none hover:bg-muted focus-visible:bg-muted",
                  (child.props as any).className
                ),
              })
            }
          />
        );
      }
      return child;
    });
  };

  return (
    <MenuPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <MenuPrimitive.Trigger
        render={
          React.isValidElement(trigger) ? (
            React.cloneElement(trigger as React.ReactElement, {
              className: cn(
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm",
                (trigger.props as any).className
              ),
            })
          ) : (
            <button
              type="button"
              className="cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm"
            >
              {trigger}
            </button>
          )
        }
      />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner align={align === "right" ? "end" : "start"} sideOffset={8}>
          <MenuPrimitive.Popup
            render={
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                className={cn(
                  "bg-card border border-border rounded-[var(--radius-md)] p-sm z-[var(--z-dropdown)] shadow-[var(--shadow-xl)] outline-none flex flex-col gap-1",
                  className
                )}
                style={{ minWidth: width }}
              />
            }
          >
            {renderChildren()}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}
