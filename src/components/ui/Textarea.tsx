import { forwardRef, type TextareaHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex field-sizing-content min-h-[var(--topbar-height)] w-full rounded-[var(--radius-lg)] border-[1.5px] transition-[border-color,box-shadow,background] duration-150 text-[var(--text-main)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-transparent focus-visible:shadow-focus disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:text-slate-400 dark:disabled:text-slate-500 placeholder:text-[var(--text-disabled)]",
  {
    variants: {
      variant: {
        outlined:
          "border-border dark:border-slate-600 bg-[var(--bg-input)] focus:border-primary dark:placeholder:text-[var(--text-disabled)]",
        filled:
          "border-transparent bg-[var(--bg-body)] focus:bg-[var(--bg-card)] focus:border-primary",
        ghost:
          "border-transparent bg-transparent focus:bg-[var(--bg-input)]",
      },
      size: {
        sm: "px-sm py-xs text-[0.8125rem]",
        md: "px-md py-sm text-sm",
        lg: "px-lg py-md text-base rounded-[var(--radius-lg)]",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "md",
    },
  }
)

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /** Variant – default er "outlined" */
  variant?: "outlined" | "filled" | "ghost"
  /** Størrelse – default er "md" */
  size?: "sm" | "md" | "lg"
  /** Antal rækker */
  rows?: number
  /** Resize‑kontrol */
  resize?: "none" | "vertical" | "horizontal" | "both"
  /** Visuel fejl‑tilstand */
  error?: boolean
  /** Gør textarea 100 % bred */
  full?: boolean
}

/**
 * Textarea med token‑baseret spacing og fuld ARIA‑support.
 *
 * - `aria-invalid` sættes når `error` er true.
 * - `aria-describedby` kan bindes til en fejl‑ eller help‑tekst via `errorMessageId`.
 * - Resize‑klasser styres af `resize`‑prop.
 * - Simpel telemetry ved ændring (kun i produktion).
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = "outlined",
      size = "md",
      rows = 3,
      resize,
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

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        // Ingen default‑handling – lad forælder beslutte.
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      console.debug("Textarea changed:", { name: e.target.name, value: e.target.value })
      props.onChange?.(e)
    };

    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          textareaVariants({ variant, size }),
          error &&
            "border-danger focus:border-danger focus:shadow-[0_0_0_4px_rgba(204,68,91,0.35)]",
          resize === "none" && "resize-none",
          resize === "vertical" && "resize-y",
          resize === "horizontal" && "resize-x",
          resize === "both" && "resize",
          full && "w-full",
          className
        )}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea
