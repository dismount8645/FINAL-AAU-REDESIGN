import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

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
 * - `role="menu"` på selve menu‑containeren.
 * - `role="menuitem"` på hvert barn (forventes at være et klik‑element).
 * - Tastatur‑navigation (Enter/Space for at åbne/lukke, Escape for at lukke).
 * - ARIA‑attributter `aria-haspopup` og `aria-expanded` på trigger‑elementet.
 * - Fokus‑trap for at sikre at tastatur‑brugere kan navigere i menuen.
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
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const controlled = isOpen !== undefined;
  const visible = controlled ? isOpen : open;

  const toggle = useCallback(() => {
    if (controlled) {
      onToggle?.();
    } else {
      setOpen((prev) => !prev);
    }
  }, [controlled, onToggle]);

  const close = useCallback(() => {
    if (controlled) {
      onClose?.();
    } else {
      setOpen(false);
    }
  }, [controlled, onClose]);

  // Luk dropdown ved klik udenfor eller Escape‑tast
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && visible) {
        close();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [visible, close]);

  // Tastatur‑håndtering på trigger‑elementet
  const handleTriggerKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  // Giv trigger de nødvendige ARIA‑attributter
  const triggerElement = React.isValidElement(trigger) ? (
    React.cloneElement(
      trigger as React.ReactElement<
        React.HTMLAttributes<HTMLElement> & { onClick?: React.MouseEventHandler }
      >,
      {
        onClick: (e: React.MouseEvent) => {
          const originalOnClick = (trigger.props as { onClick?: React.MouseEventHandler }).onClick;
          if (originalOnClick) originalOnClick(e);
          toggle();
        },
        "aria-haspopup": "menu",
        "aria-expanded": visible,
        onKeyDown: handleTriggerKeyDown,
      }
    )
  ) : (
    <div
      className="cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm"
      onClick={toggle}
      tabIndex={0}
      role="button"
      aria-haspopup="menu"
      aria-expanded={visible}
      onKeyDown={handleTriggerKeyDown}
    >
      {trigger}
    </div>
  );

  // Tilføj role="menuitem" til hvert barn, hvis de er elementer
  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement, {
          role: "menuitem",
          tabIndex: -1,
        });
      }
      return child;
    });
  };

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      {triggerElement}
      {visible && (
        <div
          className="dropdown-menu absolute top-full mt-sm bg-card border border-border rounded-[var(--radius-md)] p-sm z-[var(--z-dropdown)] min-w-[200px] shadow-[var(--shadow-xl)]"
          style={{
            width,
            right: align === "right" ? 0 : undefined,
            left: align === "left" ? 0 : undefined,
          }}
          role="menu"
        >
          {renderChildren()}
        </div>
      )}
    </div>
  );
}
