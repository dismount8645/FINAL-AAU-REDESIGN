/* eslint-disable react-refresh/only-export-components */
import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputVariantProps {
  variant?: "outlined" | "filled" | "ghost" | null;
  size?: "sm" | "md" | "lg" | null;
  error?: boolean | null;
}

function inputVariants({
  variant,
  size,
  error,
}: InputVariantProps = {}): string {
  const resolvedVariant = variant !== undefined ? variant : 'outlined';
  const resolvedSize = size !== undefined ? size : 'md';
  const resolvedError = error !== undefined ? error : false;

  return cn(
    "w-full rounded-[var(--radius-md)] font-[var(--font-family-base)] leading-[1.5] border-[1.5px] transition-[border-color,box-shadow,background-color] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-main focus-visible:outline-none focus:shadow-focus focus-visible:shadow-focus disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 placeholder:text-disabled h-10",
    resolvedVariant === 'outlined' && "border-[var(--border-color)] bg-bg-card focus:border-primary",
    resolvedVariant === 'filled' && "border-transparent bg-bg-highlight/50 focus:bg-bg-card focus:border-primary",
    resolvedVariant === 'ghost' && "border-transparent bg-transparent focus:bg-bg-highlight/50",
    resolvedSize === 'sm' && "px-[var(--space-sm)] py-[var(--space-xs)] text-sm",
    resolvedSize === 'md' && "px-[var(--space-md)] py-[var(--space-sm)] text-base",
    resolvedSize === 'lg' && "px-[var(--space-lg)] py-[var(--space-md)] text-lg rounded-[var(--radius-lg)]",
    resolvedError === true && "border-danger focus:border-danger focus-visible:shadow-[0_0_0_4px_rgba(204,68,91,0.35)] focus-visible:outline-none"
  );
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    InputVariantProps {
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
        id={props.id ?? generatedId}
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

export { Input };
export default Input;
