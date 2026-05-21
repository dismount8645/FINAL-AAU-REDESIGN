import { forwardRef, type ButtonHTMLAttributes, KeyboardEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button‑variant‑definition med fuld typografisk og spacing‑harmoni.
 * Alle margin‑/padding‑værdier er baseret på design‑tokens (var(--space-*))
 * for at sikre matematisk konsistens på tværs af komponenter.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[var(--space-sm)] relative overflow-visible select-none whitespace-nowrap border-2 border-transparent font-semibold leading-normal transition-all duration-200 outline-none focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-[var(--primary-foreground,#ffffff)] shadow-[var(--shadow-sm)] hover:bg-aau-light-blue hover:shadow-[var(--shadow-md)] enabled:hover:-translate-y-px",
        secondary:
          "bg-transparent text-primary border-primary hover:bg-primary hover:text-white enabled:hover:-translate-y-px hover:shadow-[var(--shadow-sm)]",
        tertiary:
          "bg-muted/10 text-primary hover:bg-muted/20 enabled:hover:-translate-y-px hover:shadow-xs",
        negative:
          "bg-danger text-white shadow-[var(--shadow-sm)] hover:bg-aau-dark-pink hover:shadow-[var(--shadow-md)] enabled:hover:-translate-y-px",
        ghost:
          "bg-transparent text-primary font-medium hover:bg-primary/10 hover:text-primary hover:scale-[0.98]",
        outline:
          "bg-transparent border-border text-foreground hover:bg-muted/50",
      },
      size: {
        xs: "h-8 px-sm text-xs rounded-[var(--radius-sm)] after:absolute after:inset-y-[-6px] after:inset-x-0 after:content-['']",
        sm: "h-9 px-md text-[0.8125rem] rounded-[var(--radius-md)] after:absolute after:inset-y-[-4px] after:inset-x-0 after:content-['']",
        md: "h-10 px-lg text-sm rounded-[var(--radius-md)] after:absolute after:inset-y-[-2px] after:inset-x-0 after:content-['']",
        lg: "h-12 px-xl text-base rounded-[var(--radius-lg)]",
        icon: "h-10 w-10 rounded-[var(--radius-md)] after:absolute after:inset-[-2px] after:content-['']",
        "icon-sm": "h-9 w-9 rounded-[var(--radius-sm)] after:absolute after:inset-[-4px] after:content-['']",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Ikon som vises før tekst */
  icon?: LucideIcon;
  /** Ikon som vises efter tekst */
  iconRight?: LucideIcon;
  /** Visuel loading‑tilstand */
  loading?: boolean;
  /** Giver knappen en “pill” form */
  pill?: boolean;
  /** Gør knappen 100 % bred */
  full?: boolean;
}

/**
 * Forwarded ref‑button med fuld ARIA‑support.
 *
 * - Når kun et ikon vises (iconOnly) kræves en `aria-label`.
 * - `type` defaultes til "button" for at undgå utilsigtet form‑submission.
 * - Keyboard‑support er indbygget via native <button>.
 * - Simpel telemetry logning ved klik (kan udvides til analytics‑pipeline).
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon: Icon,
      iconRight: IconRight,
      loading,
      pill,
      full,
      children,
      type = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    const iconOnly = !children && (Icon || IconRight || loading);

    if (process.env.NODE_ENV === "development" && iconOnly && !props["aria-label"]) {
      console.warn(
        "Accessibility Warning: Icon‑only buttons MUST have an aria-label."
      );
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (props.disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.target as HTMLButtonElement).click();
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Simple telemetry – kan erstattes af en rigtig analytics‑service
      console.debug("Button clicked:", { variant, size, label: props["aria-label"] ?? children });
      onClick?.(e);
    };

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          pill && "rounded-pill",
          full && "w-full"
        )}
        ref={ref}
        type={type}
        disabled={props.disabled || loading}
        aria-busy={loading}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <Loader2
            className={cn("h-4 w-4 animate-spin", children && "mr-2xs")}
            aria-hidden="true"
          />
        )}
        {!loading && Icon && (
          <Icon className={cn("h-4 w-4", children && "mr-2xs")} aria-hidden="true" />
        )}
        {children}
        {!loading && IconRight && (
          <IconRight className={cn("h-4 w-4", children && "ml-2xs")} aria-hidden="true" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
