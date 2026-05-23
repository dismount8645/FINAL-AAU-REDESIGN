import { forwardRef, type InputHTMLAttributes, useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full rounded-[var(--radius-md)] font-[var(--font-family-base)] leading-[1.5] border-[1.5px] transition-[border-color,box-shadow,background-color] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-[var(--text-main)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] dark:focus-visible:shadow-[0_0_0_4px_rgba(139,129,255,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 placeholder:text-[var(--text-disabled)] min-h-[44px]",
  {
    variants: {
      variant: {
        outlined:
          "border-[var(--border-color)] bg-[var(--bg-card)] focus:border-[var(--color-primary)]",
        filled:
          "border-transparent bg-[var(--bg-input)] focus:bg-[var(--bg-card)] focus:border-[var(--color-primary)]",
        ghost:
          "border-transparent bg-transparent focus:bg-[var(--bg-input)]",
      },
      size: {
        sm: "px-[var(--space-sm)] py-[var(--space-xs)] text-sm",
        md: "px-[var(--space-md)] py-[var(--space-sm)] text-base",
        lg: "px-[var(--space-lg)] py-[var(--space-md)] text-lg rounded-[var(--radius-lg)]",
      },
      error: {
        true: "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus-visible:shadow-[0_0_0_4px_rgba(204,68,91,0.35)] dark:focus-visible:shadow-[0_0_0_4px_rgba(252,165,165,0.35)]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "md",
      error: false,
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  variant?: "outlined" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  error?: boolean;
  full?: boolean;
  errorMessageId?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "outlined",
      size = "md",
      type = "text",
      error,
      full,
      className,
      errorMessageId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const ariaDescribedBy = error ? errorMessageId ?? generatedId : undefined;

    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          inputVariants({ variant, size, error }),
          full && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
