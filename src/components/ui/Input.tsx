import {
  forwardRef,
  type InputHTMLAttributes,
  KeyboardEvent,
  useId,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full rounded-[var(--radius-md)] font-[var(--font-family-base)] leading-normal border-[1.5px] transition-[border-color,box-shadow,background] duration-150 text-[var(--text-main)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-transparent focus-visible:shadow-focus disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:text-slate-400 dark:disabled:text-slate-500 placeholder:text-[var(--text-disabled)]",
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
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Variant – default er "outlined" */
  variant?: "outlined" | "filled" | "ghost";
  /** Størrelse – default er "md" */
  size?: "sm" | "md" | "lg";
  /** Visuel fejl‑tilstand */
  error?: boolean;
  /** Gør input 100 % bred */
  full?: boolean;
  /** ID på fejl‑besked (valgfri) */
  errorMessageId?: string;
}

/**
 * Input‑komponent med:
 * - Konsistente spacing‑tokens.
 * - ARIA‑support for fejlmeddelelser.
 * - Keyboard‑håndtering for Enter (valgfri, men kan udvides).
 * - Simpel telemetry ved ændring.
 */
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

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        // Ingen default‑handling – lad forælder beslutte.
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.debug("Input changed:", { name: e.target.name, value: e.target.value })
      props.onChange?.(e)
    };

    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          inputVariants({ variant, size }),
          error &&
            "border-danger focus:border-danger focus:shadow-[0_0_0_4px_rgba(204,68,91,0.35)]",
          full && "w-full",
          className
        )}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
