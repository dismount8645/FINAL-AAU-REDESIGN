import { forwardRef, type TextareaHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex field-sizing-content min-h-[var(--topbar-height)] w-full rounded-[var(--radius-lg)] border-[1.5px] bg-transparent px-2.5 py-2xs text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
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
        sm: "px-2xs py-1.5 text-[0.8125rem]",
        md: "px-2.5 py-2xs text-sm",
        lg: "px-xs py-2.5 text-base rounded-[var(--radius-lg)]",
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
 * - Simpel telemetry ved ændring (kan fjernes i produktion).
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
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      console.debug("Textarea changed:", { name: e.target.name, value: e.target.value })
      props.onChange?.(e)
    }

    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={error ? true : undefined}
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
        onChange={handleChange}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea
