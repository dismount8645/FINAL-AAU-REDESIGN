import { forwardRef, type HTMLAttributes, ElementType, KeyboardEvent, type ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Card Variants - Senior UI/UX Architect refinement.
 * Enforces strict AAU brand tokens, 150ms physics, and 8pt grid logic.
 */
export interface CardVariantProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'brand' | 'ghost' | null;
  accent?: 'none' | 'left' | 'top' | null;
  interactive?: boolean | null;
}

export function cardVariants({
  variant,
  accent,
  interactive,
}: CardVariantProps = {}): string {
  const resolvedVariant = variant !== undefined ? variant : 'default';
  const resolvedAccent = accent !== undefined ? accent : 'none';
  const resolvedInteractive = interactive !== undefined ? interactive : false;

  return cn(
    "group relative flex flex-col h-full transition-all duration-150 ease-[var(--transition-ease)]",
    "bg-bg-card border border-border/60 rounded-xl",
    "isolate overflow-hidden",
    resolvedVariant === 'default' && "shadow-sm hover:shadow-md",
    resolvedVariant === 'elevated' && "shadow-md hover:shadow-xl",
    resolvedVariant === 'outlined' && "bg-transparent border-2 border-border hover:border-primary",
    resolvedVariant === 'brand' && "bg-gradient-to-br from-primary to-[var(--aau-light-blue)] text-white border-none shadow-lg after:absolute after:inset-0 after:bg-white/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity duration-150",
    resolvedVariant === 'ghost' && "bg-transparent border-none shadow-none hover:bg-bg-highlight/50",
    resolvedAccent === 'left' && "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:z-10",
    resolvedAccent === 'top' && "before:absolute before:left-0 before:right-0 before:top-0 before:h-1 before:bg-primary before:z-10",
    resolvedInteractive === true && "cursor-pointer select-none focus-visible:outline-none focus-visible:shadow-focus hover:-translate-y-1 active:scale-[0.98]"
  );
}

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onKeyDown">,
    CardVariantProps {
  as?: ElementType;
  children: ReactNode;
}

/**
 * CardRoot - High-performance AAU UI container.
 */
const CardRoot = memo(forwardRef<HTMLDivElement, CardProps>(
  ({ variant, accent, interactive, children, className, as: Component = "div" as any, onClick, ...props }, ref) => {
    const isClickable = interactive || !!onClick;

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.currentTarget as HTMLDivElement).click();
      }
    };

    return (
      <Component
        ref={ref}
        className={cn("card", cardVariants({ variant, accent, interactive: isClickable }), className)}
        onClick={onClick}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? "button" : undefined}
        {...props}
      >
        {children}
      </Component>
    );
  }
));

CardRoot.displayName = "Card";

export interface CardHeaderVariantProps {
  padding?: 'default' | 'compact' | 'none' | null;
}

export function headerVariants({ padding }: CardHeaderVariantProps = {}): string {
  const resolvedPadding = padding !== undefined ? padding : 'default';
  return cn(
    "flex items-center justify-between gap-md border-b border-border/40 transition-colors duration-150",
    resolvedPadding === 'default' && "p-md lg:p-lg",
    resolvedPadding === 'compact' && "py-sm px-md",
    resolvedPadding === 'none' && "p-0"
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement>, CardHeaderVariantProps {}

const CardHeader = memo(({ children, className, padding, ...props }: CardHeaderProps) => (
  <header className={cn("card__header", headerVariants({ padding }), className)} {...props}>
    {children}
  </header>
));

export interface CardBodyVariantProps {
  padding?: 'default' | 'compact' | 'none' | null;
}

export function bodyVariants({ padding }: CardBodyVariantProps = {}): string {
  const resolvedPadding = padding !== undefined ? padding : 'default';
  return cn(
    "flex-1 min-w-0",
    resolvedPadding === 'default' && "p-md lg:p-lg",
    resolvedPadding === 'compact' && "py-sm px-md",
    resolvedPadding === 'none' && "p-0"
  );
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement>, CardBodyVariantProps {}

const CardBody = memo(({ children, className, padding, ...props }: CardBodyProps) => (
  <section className={cn("card__body", bodyVariants({ padding }), className)} {...props}>
    {children}
  </section>
));

export interface CardFooterVariantProps {
  padding?: 'default' | 'compact' | 'none' | null;
}

export function footerVariants({ padding }: CardFooterVariantProps = {}): string {
  const resolvedPadding = padding !== undefined ? padding : 'default';
  return cn(
    "mt-auto flex items-center gap-xs border-t border-border/40",
    resolvedPadding === 'default' && "p-md lg:p-lg",
    resolvedPadding === 'compact' && "py-sm px-md",
    resolvedPadding === 'none' && "p-0"
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement>, CardFooterVariantProps {}

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
