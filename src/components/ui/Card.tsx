import { type FC, type HTMLAttributes, ElementType, KeyboardEvent } from "react";
import { type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "bg-[var(--bg-card)] border border-border rounded-[var(--radius-xl)] flex flex-col relative h-full transition-all duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "card--default",
        elevated: "card--elevated shadow-[var(--shadow-md)]",
        outlined: "card--outlined",
        brand: "card--brand bg-gradient-to-br from-aau-blue to-primary text-white border-none shadow-[var(--shadow-md)] on-dark",
      },
      accentLeft: {
        true: "card--accent-left border-l-4 border-l-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Vises kun hvis Card har en header‑sektion */
  hasHeader?: boolean;
  /** Tillader indhold at flyde uden overflow‑skjulning */
  overflowVisible?: boolean;
  /** Tilføjer en farvet venstre kant */
  accentLeft?: boolean;
  /** Shortcut for variant="elevated" */
  elevated?: boolean;
  /** Gør Card klik‑bar (tilføjer role="button") */
  onClick?: () => void;
  /** Keyboard‑handler for klik‑bare Cards */
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  /** HTML‑tag som skal renderes (default: div) */
  as?: ElementType;
}

/**
 * Card‑komponent med:
 * - Konsistente variant‑klasser via CVA.
 * - Tilgængelighed: klik‑bare Cards får `role="button"` og er fokuserbare.
 * - Mulighed for at skifte HTML‑element via `as`‑prop (fx <section>).
 */
function Card({
  variant,
  accentLeft,
  children,
  className,
  hasHeader = true,
  overflowVisible = false,
  onClick,
  onKeyDown,
  elevated,
  as: Component = "div",
  ...props
}: CardProps) {
  const isClickable = !!onClick;
  const computedVariant = elevated ? "elevated" : variant;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Component
      className={cn(
        cardVariants({ variant: computedVariant, accentLeft }),
        !overflowVisible && "overflow-hidden",
        !hasHeader && "card--no-header",
        isClickable && "cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
        className
      )}
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : onKeyDown}
      tabIndex={isClickable ? 0 : props.tabIndex}
      role={isClickable ? "button" : props.role}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ---------- Sub‑components ---------- */

const cardHeaderVariants = cva(
  "card__header flex justify-between items-center flex-wrap gap-[var(--space-sm)]",
  {
    variants: {
      spacing: {
        default: "px-[var(--space-lg)] py-[var(--space-md)]",
        compact: "px-[var(--space-sm)] py-[var(--space-xs)]",
      },
    },
    defaultVariants: {
      spacing: "default",
    },
  }
);

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardHeaderVariants> {}

Card.Header = (({ children, className, spacing, ...props }: CardHeaderProps) => (
  <header
    className={cn(
      cardHeaderVariants({ spacing }),
      className
    )}
    {...props}
  >
    {children}
  </header>
)) as FC<CardHeaderProps>;

const cardBodyVariants = cva(
  "card__body flex-1",
  {
    variants: {
      spacing: {
        default: "px-[var(--space-lg)] py-[var(--space-md)]",
        compact: "p-[var(--space-xs)]",
        none: "p-0",
      },
    },
    defaultVariants: {
      spacing: "default",
    },
  }
);

interface CardBodyProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardBodyVariants> {}

Card.Body = (({ children, className, spacing, ...props }: CardBodyProps) => (
  <section
    className={cn(
      cardBodyVariants({ spacing }),
      "[.card--no-header_&]:pt-[var(--space-lg)]",
      className
    )}
    {...props}
  >
    {children}
  </section>
)) as FC<CardBodyProps>;

Card.Footer = (({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <footer
    className={cn(
      "card__footer px-[var(--space-lg)] py-[var(--space-md)] mt-auto",
      className
    )}
    {...props}
  >
    {children}
  </footer>
)) as FC<HTMLAttributes<HTMLDivElement>>;

Card.Decoration = (({ icon: Icon, className, ...props }: CardDecorationProps) => (
  <div
    className={cn(
      "card__decoration absolute -right-[var(--space-md)] -bottom-[var(--space-md)] pointer-events-none leading-none",
      className
    )}
    {...props}
  >
    {Icon ? (
      <Icon size={24} strokeWidth={2} className="opacity-10 -rotate-15" aria-hidden="true" />
    ) : null}
  </div>
)) as FC<CardDecorationProps>;

Card.Header.displayName = "Card.Header";
Card.Body.displayName = "Card.Body";
Card.Footer.displayName = "Card.Footer";
Card.Decoration.displayName = "Card.Decoration";

export default Card;
