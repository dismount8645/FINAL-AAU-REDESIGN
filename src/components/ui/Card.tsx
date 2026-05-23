import { forwardRef, type HTMLAttributes, ElementType, KeyboardEvent, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  [
    "group relative flex flex-col h-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
    "bg-white dark:bg-[#211a52] border border-gray-200 dark:border-white/10 rounded-2xl dark:text-white",
    "isolate"
  ],
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-md",
        elevated: "shadow-lg hover:shadow-xl",
        outlined: "bg-transparent border-2 border-gray-200 dark:border-white/20 hover:border-[#211a52] dark:hover:border-[#594fbf]",
        brand: [
          "bg-gradient-to-br from-[#211a52] to-[#594fbf] text-white border-none shadow-lg",
          "after:absolute after:inset-0 after:bg-white/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity duration-150"
        ],
        ghost: "bg-transparent dark:bg-transparent border-none shadow-none hover:bg-gray-100 dark:hover:bg-white/10",
      },
      accent: {
        none: "",
        left: "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#211a52] dark:before:bg-[#594fbf] before:z-10 overflow-hidden",
        top: "before:absolute before:left-0 before:right-0 before:top-0 before:h-1 before:bg-[#211a52] dark:before:bg-[#594fbf] before:z-10 overflow-hidden",
      },
      interactive: {
        true: "cursor-pointer select-none focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-[#211a52]/35 dark:focus-visible:ring-[#594fbf]/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#211a52]",
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
        whileHover={isClickable ? { y: -4, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } } : undefined}
        whileTap={isClickable ? { scale: 0.98, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } } : undefined}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

CardRoot.displayName = "Card";

const headerVariants = cva(
  "flex items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 transition-colors duration-150",
  {
    variants: {
      padding: {
        default: "p-4 lg:p-6",
        compact: "p-2",
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

const bodyVariants = cva("flex-1 min-w-0", {
  variants: {
    padding: {
      default: "p-4 lg:p-6",
      compact: "p-2",
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
  "mt-auto flex items-center gap-2 border-t border-gray-200 dark:border-white/10",
  {
    variants: {
      padding: {
        default: "p-4 lg:p-6",
        compact: "p-2",
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
      "absolute -right-4 -bottom-4 opacity-5 rotate-12 pointer-events-none z-0",
      className
    )}
    {...props}
  >
    {Icon && <Icon size={120} strokeWidth={1} aria-hidden="true" />}
  </div>
);

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Decoration: CardDecoration,
});

export default Card;
