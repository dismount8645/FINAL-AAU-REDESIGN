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
    "bg-bg-card border border-border/60 rounded-xl",
    "isolate overflow-hidden"
  ],
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-md",
        elevated: "shadow-md hover:shadow-xl",
        outlined: "bg-transparent border-2 border-border hover:border-primary",
        brand: [
          "bg-gradient-to-br from-primary to-[var(--aau-light-blue)] text-white border-none shadow-lg",
          "after:absolute after:inset-0 after:bg-white/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity duration-300"
        ],
        ghost: "bg-transparent border-none shadow-none hover:bg-bg-highlight/50",
      },
      accent: {
        none: "",
        left: "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:z-10",
        top: "before:absolute before:left-0 before:right-0 before:top-0 before:h-1 before:bg-primary before:z-10",
      },
      interactive: {
        true: "cursor-pointer select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/35 focus-visible:ring-offset-2",
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
    const MotionComponent = motion.create(Component as React.ComponentType<any>);

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
  "flex items-center justify-between gap-md border-b border-border/40 transition-colors duration-150",
  {
    variants: {
      padding: {
        default: "p-md lg:p-lg",
        compact: "p-sm",
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
      default: "p-md lg:p-lg",
      compact: "p-sm",
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
  "mt-auto flex items-center gap-xs border-t border-border/40",
  {
    variants: {
      padding: {
        default: "p-md lg:p-lg",
        compact: "p-sm",
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
      "card__decoration absolute -right-lg -bottom-lg opacity-[0.03] rotate-12 pointer-events-none z-0",
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
