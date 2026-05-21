import { forwardRef } from "react";
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button Variants – strengt token‑baseret med dark‑mode og focus‑visible.
 * - 44 × 44 px touch‑mål via pseudo‑element.
 * - Hover‑lift: -4px med 150 ms ease.
 * - Fokus‑ring: 2 px aau‑blue.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-[var(--space-sm)] relative overflow-visible select-none whitespace-nowrap font-bold leading-none transition-all duration-150 ease-[var(--transition-ease)] outline-none isolate",
    "focus-visible:ring-2 focus-visible:ring-[var(--aau-blue)] focus-visible:ring-offset-2 focus-visible:shadow-focus",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "active:scale-[0.97] active:duration-75",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1.25em] [&_svg]:transition-transform [&_svg]:duration-150",
    "after:absolute after:inset-y-[-8px] after:inset-x-0 after:content-[''] after:rounded-[var(--radius-md)] after:bg-[var(--bg-card)] after:opacity-0 after:transition-opacity after:duration-150",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--aau-blue)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--aau-light-blue)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1",
        secondary:
          "bg-transparent text-[var(--aau-blue)] border-2 border-[var(--aau-blue)] hover:bg-[var(--aau-blue)] hover:text-white hover:shadow-[var(--shadow-sm)] hover:-translate-y-1",
        tertiary:
          "bg-[var(--bg-hover)] text-[var(--aau-blue)] hover:bg-[var(--bg-hover-active)] hover:-translate-y-1",
        danger:
          "bg-[var(--aau-dark-pink)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--aau-light-pink)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1",
        success:
          "bg-[var(--aau-dark-green)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--aau-light-green)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1",
        gold:
          "bg-[var(--aau-light-orange)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--aau-dark-orange)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1",
        ghost:
          "bg-transparent text-[var(--aau-blue)] hover:bg-[var(--bg-hover)]",
        outline:
          "bg-transparent border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-color-hover)]",
      },
      size: {
        xs: "h-8 px-[var(--space-xs)] text-xs rounded-[var(--radius-sm)]",
        sm: "h-9 px-[var(--space-sm)] text-[0.8125rem] rounded-[var(--radius-md)]",
        md: "h-11 px-[var(--space-md)] text-sm rounded-[var(--radius-md)]",
        lg: "h-14 px-[var(--space-lg)] text-base rounded-[var(--radius-lg)]",
        icon: "size-11 p-0 rounded-[var(--radius-md)]",
        "icon-sm": "size-9 p-0 rounded-[var(--radius-sm)]",
      },
      full: {
        true: "w-full",
      },
      pill: {
        true: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends BaseButtonProps,
    VariantProps<typeof buttonVariants> {
  /** Optional icon to display before children */
  icon?: LucideIcon;
  /** Optional icon to display after children */
  iconRight?: LucideIcon;
  /** Loading state with spinner and disabled behavior */
  loading?: boolean;
}

/**
 * Senior UI/UX Architect Refactored Button.
 * 
 * Features:
 * - Uses @base-ui/react for accessible unstyled primitives.
 * - Enforces 44x44px touch targets via pseudo‑element.
 * - Strict adherence to AAU design tokens and 8pt grid.
 * - Built‑in loading state and icon support.
 * - Polymorphic via 'render' prop (Base UI pattern).
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      full,
      pill,
      icon: Icon,
      iconRight: IconRight,
      loading,
      children,
      disabled,
      focusableWhenDisabled,
      ...props
    },
    ref
  ) => {
    const isIconOnly = !children && (Icon || IconRight || loading);

    if (process.env.NODE_ENV === "development" && isIconOnly && !props["aria-label"]) {
      console.warn("Button: Icon‑only buttons MUST have an aria-label for accessibility.");
    }

    return (
      <BaseButton
        ref={ref}
        disabled={disabled || loading}
        focusableWhenDisabled={focusableWhenDisabled || loading}
        className={cn(buttonVariants({ variant, size, full, pill }), className)}
        {...props}
      >
        {loading && (
          <Loader2 className="size-[1.2em] animate-spin" aria-hidden="true" />
        )}
        {!loading && Icon && (
          <Icon className="group-hover:scale-110" aria-hidden="true" />
        )}
        {children && <span className="truncate">{children}</span>}
        {!loading && IconRight && (
          <IconRight className="group-hover:translate-x-0.5" aria-hidden="true" />
        )}
      </BaseButton>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
