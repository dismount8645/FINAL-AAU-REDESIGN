"use client"

import { forwardRef, memo } from "react";
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button Variants - Senior UI/UX Architect refinement.
 * Enforces strict AAU brand tokens, 150ms physics, and 8pt grid sizing.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-[var(--space-xs)] relative overflow-visible select-none whitespace-nowrap",
    "font-black uppercase tracking-tighter transition-all duration-150 ease-[var(--transition-ease)] outline-none isolate",
    "focus-visible:shadow-focus focus-visible:outline-none",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "active:scale-[0.97]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-150",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:bg-accent hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
        secondary:
          "bg-bg-card text-primary dark:text-white border-2 border-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5",
        ghost:
          "bg-transparent text-primary dark:text-white hover:bg-primary/5",
        outline:
          "bg-transparent border border-[var(--border-color)] text-main hover:bg-bg-highlight hover:border-primary hover:text-primary",
        danger:
          "bg-[var(--aau-dark-pink)] text-white shadow-sm hover:bg-[var(--aau-dark-pink)]/90 hover:-translate-y-0.5",
        success:
          "bg-[var(--aau-dark-green)] text-white shadow-sm hover:bg-[var(--aau-dark-green)]/90 hover:-translate-y-0.5",
      },
      size: {
        xs: "h-8 px-[var(--space-sm)] text-[0.625rem] rounded-[var(--radius-sm)] before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
        sm: "h-10 px-[var(--space-md)] text-xs rounded-[var(--radius-md)] before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
        md: "h-12 px-[var(--space-lg)] text-sm rounded-[var(--radius-lg)]",
        icon: "size-12 p-0 rounded-[var(--radius-lg)]",
        "icon-sm": "size-10 p-0 rounded-[var(--radius-md)] before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
        "icon-xs": "size-8 p-0 rounded-[var(--radius-sm)] before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
      },
      full: {
        true: "w-full",
      },
      pill: {
        true: "rounded-[var(--radius-full)]",
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
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
}

/**
 * Button - High-performance AAU UI component.
 */
const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
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
    return (
      <BaseButton
        ref={ref}
        disabled={disabled || loading}
        focusableWhenDisabled={focusableWhenDisabled || loading}
        className={cn(buttonVariants({ variant, size, full, pill }), className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} aria-hidden="true" />
        ) : (
          <>
            {Icon && <Icon className="transition-transform group-hover:scale-110" size={18} strokeWidth={2.5} aria-hidden="true" />}
            {children && <span className="relative z-10">{children}</span>}
            {IconRight && <IconRight className="transition-transform group-hover:translate-x-0.5" size={18} strokeWidth={2.5} aria-hidden="true" />}
          </>
        )}
      </BaseButton>
    );
  }
));

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
