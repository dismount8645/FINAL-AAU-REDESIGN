import { forwardRef, useId, type TextareaHTMLAttributes, type ChangeEvent, type KeyboardEvent } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex min-h-[44px] w-full rounded-[var(--radius-lg)] border-[1.5px] transition-[border-color,box-shadow,background] duration-150 text-[var(--text-main)] focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:text-slate-400 dark:disabled:text-slate-500 placeholder:text-[var(--text-disabled)]",
  {
    variants: {
      variant: {
        outlined:
          "border-[var(--border-color)] dark:border-slate-600 bg-[var(--bg-input)] focus:border-[var(--color-primary)] dark:placeholder:text-[var(--text-disabled)]",
        filled:
          "border-transparent bg-[var(--bg-body)] focus:bg-[var(--bg-card)] focus:border-[var(--color-primary)]",
        ghost:
          "border-transparent bg-transparent focus:bg-[var(--bg-input)]",
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
)

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  variant?: "outlined" | "filled" | "ghost"
  size?: "sm" | "md" | "lg"
  resize?: "none" | "vertical" | "horizontal" | "both"
  error?: boolean
  full?: boolean
  errorMessageId?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = "outlined",
      size = "md",
      rows = 3,
      resize = "vertical",
      error,
      full,
      className,
      errorMessageId,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const ariaDescribedBy = error ? errorMessageId ?? generatedId : undefined

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e)
    }

    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          textareaVariants({ variant, size }),
          error && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:shadow-[0_0_0_4px_rgba(204,68,91,0.35)]",
          resize === "none" && "resize-none",
          resize === "vertical" && "resize-y",
          resize === "horizontal" && "resize-x",
          resize === "both" && "resize",
          full && "w-full",
          className
        )}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea
