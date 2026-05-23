"use client"

import { forwardRef, type HTMLAttributes, ElementType, KeyboardEvent, type ReactNode, memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Card Variants - Senior UI/UX Architect refinement.
 * Enforces strict AAU brand tokens, 150ms physics, and 8pt grid logic.
 */
const cardVariants = cva(
  [
    "group relative flex flex-col h-full transition-all duration-300 ease-[var(--transition-ease)]",
    "bg-[var(--bg-card)] border border-[var(--border-color)]/60 rounded-[var(--radius-xl)]",
    "isolate overflow-hidden"
  ],
  {
    variants: {
      variant: {
        default: "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        elevated: "shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-xl)]",
        outlined: "bg-transparent border-2 border-[var(--border-color)] hover:border-[var(--aau-blue)]",
        brand: [
          "bg-gradient-to-br from-[var(--aau-blue)] to-[var(--aau-light-blue)] text-white border-none shadow-[var(--shadow-lg)]",
          "after:absolute after:inset-0 after:bg-white/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity duration-300"
        ],
        ghost: "bg-transparent border-none shadow-none hover:bg-[var(--bg-highlight)]/50",
      },
      accent: {
        none: "",
        left: "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[var(--aau-blue)] before:z-10",
        top: "before:absolute before:left-0 before:right-0 before:top-0 before:h-1 before:bg-[var(--aau-blue)] before:z-10",
      },
      interactive: {
        true: "cursor-pointer select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--aau-blue)]/35 focus-visible:ring-offset-2",
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
 * CardRoot - High-performance AAU UI container.
 */
const CardRoot = memo(forwardRef<HTMLDivElement, CardProps>(
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
        className={cn("card", cardVariants({ variant, accent, interactive: isClickable }), className)}
        onClick={onClick}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? "button" : undefined}
        whileHover={isClickable ? { y: -4, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } } : undefined}
        whileTap={isClickable ? { scale: 0.98, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } } : undefined}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
));

CardRoot.displayName = "Card";

const headerVariants = cva(
  "flex items-center justify-between gap-[var(--space-md)] border-b border-[var(--border-color)]/40 transition-colors duration-150",
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

const CardHeader = memo(({ children, className, padding, ...props }: CardHeaderProps) => (
  <header className={cn("card__header", headerVariants({ padding }), className)} {...props}>
    {children}
  </header>
));

const bodyVariants = cva("flex-1 min-w-0", {
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

const CardBody = memo(({ children, className, padding, ...props }: CardBodyProps) => (
  <section className={cn("card__body", bodyVariants({ padding }), className)} {...props}>
    {children}
  </section>
));

const footerVariants = cva(
  "mt-auto flex items-center gap-[var(--space-xs)] border-t border-[var(--border-color)]/40",
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

const CardFooter = memo(({ children, className, padding, ...props }: CardFooterProps) => (
  <footer className={cn("card__footer", footerVariants({ padding }), className)} {...props}>
    {children}
  </footer>
));

interface CardDecorationProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ElementType;
}

const CardDecoration = memo(({ icon: Icon, className, ...props }: CardDecorationProps) => (
  <div
    className={cn(
      "card__decoration absolute -right-[var(--space-lg)] -bottom-[var(--space-lg)] opacity-[0.03] rotate-12 pointer-events-none z-0",
      className
    )}
    {...props}
  >
    {Icon && <Icon size={160} strokeWidth={1} aria-hidden="true" />}
  </div>
));

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Decoration: CardDecoration,
});

export default Card;
