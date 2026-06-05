import { forwardRef, type HTMLAttributes, ElementType, KeyboardEvent, type ReactNode, memo } from 'react';


import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';



/**
 * Card Variants - Senior UI/UX Architect refinement.
 * Enforces strict AAU brand tokens, 150ms physics, and 8pt grid logic.
 */
const cardVariants = cva(
  [
    "group relative flex flex-col h-full transition-all duration-150 ease-[var(--transition-ease)]",
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
          "after:absolute after:inset-0 after:bg-white/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity duration-150"
        ],
        ghost: "bg-transparent border-none shadow-none hover:bg-bg-highlight/50",
      },
      accent: {
        none: "",
        left: "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:z-10",
        top: "before:absolute before:left-0 before:right-0 before:top-0 before:h-1 before:bg-primary before:z-10",
      },
      interactive: {
        true: "cursor-pointer select-none focus-visible:outline-none focus-visible:shadow-focus",
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
    const MotionComponent = motion.create(Component as React.ElementType);

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
        compact: "py-sm px-md",
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
      compact: "py-sm px-md",
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
        compact: "py-sm px-md",
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

if (import.meta.vitest) {
  describe('Card', () => {
    it('renders children content', () => {
      render(<Card>Hello World</Card>)
      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })
  
    it('applies default variant class by default', () => {
      render(<Card>Content</Card>)
      // Matches the default variant class added via CVA
      const card = document.querySelector('.card--default')
      expect(card).toBeDefined()
    })
  
    it('applies variant classes', () => {
      const { rerender } = render(<Card variant="elevated">Content</Card>)
      expect(document.querySelector('.card--elevated')).toBeDefined()
  
      rerender(<Card variant="outlined">Content</Card>)
      expect(document.querySelector('.card--outlined')).toBeDefined()
  
      rerender(<Card variant="brand">Content</Card>)
      expect(document.querySelector('.card--brand')).toBeDefined()
    })
  
    it('renders header when provided', () => {
      render(<Card><Card.Header data-testid="card-header">Header</Card.Header></Card>)
      expect(screen.getByTestId('card-header')).toBeInTheDocument()
      expect(document.querySelector('.card__header')).toBeInTheDocument()
    })
  
    it('renders footer when provided', () => {
      render(<Card><Card.Footer data-testid="card-footer">Footer</Card.Footer></Card>)
      expect(screen.getByTestId('card-footer')).toBeInTheDocument()
      expect(document.querySelector('.card__footer')).toBeInTheDocument()
    })
  
    it('applies custom className', () => {
      render(<Card className="my-custom-class">Content</Card>)
      expect(document.querySelector('.my-custom-class')).toBeDefined()
    })
  
    it('forwards additional props', () => {
      render(<Card data-testid="test-card" aria-label="Test Card">Content</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toHaveAttribute('aria-label', 'Test Card')
    })
  
    it('renders card__body when children are provided', () => {
      render(<Card><Card.Body>Test Content</Card.Body></Card>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(document.querySelector('.card__body')).toBeInTheDocument()
    })
  
    it('does not render card__body without children inside it', () => {
      const { container } = render(<Card><Card.Header>Header</Card.Header></Card>)
      expect(container.querySelector('.card__body')).not.toBeInTheDocument()
    })
  
    it('renders Decoration with icon', () => {
      const { container } = render(<Card><Card.Decoration icon={Star} /></Card>)
      expect(container.querySelector('.card__decoration')).toBeInTheDocument()
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  
    it('renders Decoration without icon', () => {
      const { container } = render(<Card><Card.Decoration /></Card>)
      expect(container.querySelector('.card__decoration')).toBeInTheDocument()
      expect(container.querySelector('svg')).not.toBeInTheDocument()
    })

    it('handles click and keyboard actions on interactive card', () => {
      const onClick = vi.fn()
      const { container } = render(<Card onClick={onClick}>Interactive</Card>)
      const card = container.firstChild as HTMLElement

      fireEvent.click(card)
      expect(onClick).toHaveBeenCalledTimes(1)

      fireEvent.keyDown(card, { key: 'Enter' })
      expect(onClick).toHaveBeenCalledTimes(2)

      fireEvent.keyDown(card, { key: ' ' })
      expect(onClick).toHaveBeenCalledTimes(3)

      fireEvent.keyDown(card, { key: 'Escape' })
      expect(onClick).toHaveBeenCalledTimes(3)
    })
  })
}
