import { forwardRef } from "react";
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 relative overflow-visible select-none whitespace-nowrap font-bold leading-none transition-all duration-150 ease-[0.4,0,0.2,1] outline-none isolate",
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:shadow-focus dark:focus-visible:ring-accent",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "active:scale-[0.97] active:duration-75",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1.25em] [&_svg]:transition-transform [&_svg]:duration-150",
    "after:absolute after:inset-y-[-8px] after:inset-x-0 after:content-[''] after:rounded-md",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:shadow-md hover:-translate-y-1",
        secondary:
          "bg-transparent text-primary dark:text-primary-foreground border-2 border-primary dark:border-primary-foreground hover:bg-primary dark:hover:bg-primary-foreground dark:hover:text-primary hover:text-primary-foreground hover:shadow-sm hover:-translate-y-1",
        tertiary:
          "bg-secondary/10 text-primary dark:text-primary-foreground hover:bg-secondary/20 hover:-translate-y-1",
        danger:
          "bg-destructive text-white dark:text-gray-950 shadow-sm hover:bg-destructive/80 hover:shadow-md hover:-translate-y-1",
        success:
          "bg-success text-white dark:text-gray-950 shadow-sm hover:bg-success/80 hover:shadow-md hover:-translate-y-1",
        gold:
          "bg-warning text-white dark:text-gray-950 shadow-sm hover:bg-warning/80 hover:shadow-md hover:-translate-y-1",
        ghost:
          "bg-transparent text-primary dark:text-primary-foreground hover:bg-secondary/10",
        outline:
          "bg-transparent border border-border text-foreground hover:bg-secondary/10 hover:border-primary dark:hover:border-primary-foreground",
      },
      size: {
        xs: "h-8 px-3 text-xs rounded-sm",
        sm: "h-9 px-4 text-[0.8125rem] rounded-md",
        md: "h-11 px-6 text-sm rounded-md",
        lg: "h-14 px-8 text-base rounded-lg",
        icon: "size-11 p-0 rounded-md",
        "icon-sm": "size-9 p-0 rounded-sm",
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
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
}

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
    return (
      <BaseButton
        ref={ref}
        disabled={disabled || loading}
        focusableWhenDisabled={focusableWhenDisabled || loading}
        className={cn(buttonVariants({ variant, size, full, pill }), className)}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
        {!loading && Icon && <Icon className="group-hover:scale-110" aria-hidden="true" />}
        {children && <span>{children}</span>}
        {!loading && IconRight && <IconRight className="group-hover:translate-x-0.5" aria-hidden="true" />}
      </BaseButton>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
