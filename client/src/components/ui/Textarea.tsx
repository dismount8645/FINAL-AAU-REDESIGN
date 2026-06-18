/* eslint-disable react-refresh/only-export-components */
import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  "flex min-h-[44px] w-full rounded-[var(--radius-lg)] border-[1.5px] transition-[border-color,box-shadow,background] duration-150 text-main focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:text-slate-400 dark:disabled:text-slate-500 placeholder:text-disabled",
  {
    variants: {
      variant: {
        outlined:
          "border-[var(--border-color)] bg-bg-card focus:border-primary",
        filled:
          "border-transparent bg-bg-highlight/50 focus:bg-bg-card focus:border-primary",
        ghost:
          "border-transparent bg-transparent focus:bg-bg-highlight/50",
      },
      size: {
        sm: "px-sm py-xs text-[0.8125rem]",
        md: "px-md py-sm text-sm",
        lg: "px-lg py-md text-base",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "md",
    },
  }
);

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  variant?: "outlined" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  resize?: "none" | "vertical" | "horizontal" | "both";
  error?: boolean;
  full?: boolean;
  errorMessageId?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    props,
    ref
  ) => {
    const {
      variant = "outlined",
      size = "md",
      rows = 3,
      resize = "vertical",
      error,
      full,
      className,
      errorMessageId,
      ...restProps
    } = props;
    const generatedId = useId();
    const ariaDescribedBy = error ? errorMessageId ?? generatedId : undefined;

    return (
      <textarea
        ref={ref}
        rows={rows}
        id={props.id ?? generatedId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          textareaVariants({ variant, size }),
          error && "border-danger focus:border-danger focus:shadow-[0_0_0_4px_rgba(204,68,91,0.35)]",
          resize === "none" && "resize-none",
          resize === "vertical" && "resize-y",
          resize === "horizontal" && "resize-x",
          resize === "both" && "resize",
          full && "w-full",
          className
        )}
        {...restProps}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
