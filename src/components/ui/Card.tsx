import { forwardRef, type HTMLAttributes, ElementType, KeyboardEvent, type MouseEventHandler, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Card Variants - Defining the structural DNA of the component.
 * Uses strict token adherence for padding and shadows.
 */
const cardVariants = cva(
  [
    "group relative flex flex-col h-full transition-all duration-300 ease-[var(--transition-ease)]",
    "bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-xl)]",
    "isolate"
  ],
  {
    variants: {
      variant: {
        default: "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        elevated: "shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] -translate-y-px",
        outlined: "bg-transparent border-2 border-[var(--border-color)] hover:border-[var(--aau-blue)]",
        brand: [
          "bg-gradient-to-br from-[var(--aau-blue)] to-[var(--aau-light-blue)] text-white border-none shadow-[var(--shadow-lg)]",
          "after:absolute after:inset-0 after:bg-white/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
        ],
        ghost: "bg-transparent border-none shadow-none hover:bg-[var(--bg-hover)]",
      },
      accent: {
        none: "",
        left: "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[var(--aau-blue)] before:z-10",
        top: "before:absolute before:left-0 before:right-0 before:top-0 before:h-1 before:bg-[var(--aau-blue)] before:z-10",
      },
      interactive: {
        true: "cursor-pointer select-none focus-within:ring-2 focus-within:ring-[var(--aau-blue)] focus-within:ring-offset-2",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      accent: "none",
      interactive: false,
    },
  }
);

export interface CardProps
  extends Omit<HTMLMotionProps<"div">, "onKeyDown">,
    VariantProps<typeof cardVariants> {
  as?: ElementType;
  children: ReactNode;
}

/**
 * Card Component - The foundation for all container-based UI elements.
 */
const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ variant, accent, interactive, children, className, as: Component = "div", onClick, ...props }, ref) => {
    const isClickable = interactive || !!onClick;
    const MotionComponent = motion(Component as any);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.currentTarget as HTMLDivElement).click();
      }
    };

    return (
      <MotionComponent
        ref={ref}
        className={cn(cardVariants({ variant, accent, interactive: isClickable }), className)}
        onClick={onClick}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? "button" : undefined}
        whileHover={isClickable ? { y: -4 } : undefined}
        whileTap={isClickable ? { scale: 0.98 } : undefined}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

CardRoot.displayName = "Card";

/* ---------- Sub-components with legacy class support ---------- */

const headerVariants = cva(
  "card__header flex items-center justify-between gap-[var(--space-md)] border-b border-[var(--border-color)] transition-colors",
  {
    variants: {
      padding: {
        default: "p-[var(--space-md)] lg:p-[var(--space-lg)]",
        compact: "p-[var(--space-sm)]",
        none: "p-0",
      },
    },
    defaultVariants: {
      padding: "default",
    },
  }
);

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof headerVariants> {}

const CardHeader = ({ children, className, padding, ...props }: CardHeaderProps) => (
  <header className={cn(headerVariants({ padding }), className)} {...props}>
    {children}
  </header>
);

const bodyVariants = cva("card__body flex-1 min-w-0", {
  variants: {
    padding: {
      default: "p-[var(--space-md)] lg:p-[var(--space-lg)]",
      compact: "p-[var(--space-sm)]",
      none: "p-0",
    },
  },
  defaultVariants: {
    padding: "default",
  },
});

interface CardBodyProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof bodyVariants> {}

const CardBody = ({ children, className, padding, ...props }: CardBodyProps) => (
  <section className={cn(bodyVariants({ padding }), className)} {...props}>
    {children}
  </section>
);

const footerVariants = cva(
  "card__footer mt-auto flex items-center gap-[var(--space-sm)] border-t border-[var(--border-color)]",
  {
    variants: {
      padding: {
        default: "p-[var(--space-md)] lg:p-[var(--space-lg)]",
        compact: "p-[var(--space-sm)]",
        none: "p-0",
      },
    },
    defaultVariants: {
      padding: "default",
    },
  }
);

interface CardFooterProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof footerVariants> {}

const CardFooter = ({ children, className, padding, ...props }: CardFooterProps) => (
  <footer className={cn(footerVariants({ padding }), className)} {...props}>
    {children}
  </footer>
);

interface CardDecorationProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ElementType;
}

const CardDecoration = ({ icon: Icon, className, ...props }: CardDecorationProps) => (
  <div
    className={cn(
      "card__decoration absolute -right-[var(--space-md)] -bottom-[var(--space-md)] opacity-[0.03] rotate-12 pointer-events-none z-0",
      className
    )}
    {...props}
  >
    {Icon && <Icon size={120} strokeWidth={1} aria-hidden="true" />}
  </div>
);

// Namespace assignment
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Decoration: CardDecoration,
});

export default Card;
