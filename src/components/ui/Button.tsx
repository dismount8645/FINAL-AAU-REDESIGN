/* eslint-disable react-refresh/only-export-components */
import { forwardRef, memo } from 'react';
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, type LucideIcon, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Button Variants - Senior UI/UX Architect refinement.
 * Enforces strict AAU brand tokens, 150ms physics, and 8pt grid sizing.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-[var(--space-xs)] relative overflow-visible select-none whitespace-nowrap",
    "font-black uppercase tracking-tighter transition-all duration-150 ease-[var(--transition-ease)] outline-none isolate",
    "focus-visible:shadow-focus focus-visible:outline-none",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "active:scale-[0.97]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-150",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:bg-accent hover:shadow-[var(--shadow-md)] hover:-translate-y-1",
        secondary:
          "bg-bg-card text-primary dark:text-white border-2 border-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-1",
        ghost:
          "bg-transparent text-primary dark:text-white hover:bg-primary/5",
        outline:
          "bg-transparent border border-[var(--border-color)] text-main hover:bg-bg-highlight hover:border-primary hover:text-primary",
        danger:
          "bg-[var(--aau-dark-pink)] text-white shadow-sm hover:bg-[var(--aau-dark-pink)]/90 hover:-translate-y-1",
        success:
          "bg-[var(--aau-dark-green)] text-white shadow-sm hover:bg-[var(--aau-dark-green)]/90 hover:-translate-y-1",
      },
      size: {
        xs: "h-[30px] px-[var(--space-xs)] text-[11px] rounded-[var(--radius-xs)]",
        sm: "h-[34px] px-[var(--space-sm)] text-[13px] rounded-[var(--radius-sm)]",
        md: "h-[38px] px-[var(--space-md)] text-[14px] rounded-[var(--radius-md)]",
        icon: "size-[38px] p-0 rounded-[var(--radius-md)]",
        "icon-sm": "size-[34px] p-0 rounded-[var(--radius-sm)]",
        "icon-xs": "size-[30px] p-0 rounded-[var(--radius-xs)]",
      },
      full: {
        true: "w-full",
      },
      pill: {
        true: "rounded-[var(--radius-full)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends BaseButtonProps,
    VariantProps<typeof buttonVariants> {
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
}

const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      full,
      pill,
      icon: Icon,
      iconRight: IconRight,
      loading,
      children,
      disabled,
      focusableWhenDisabled,
      ...props
    },
    ref
  ) => {
    return (
      <BaseButton
        ref={ref}
        disabled={disabled || loading}
        focusableWhenDisabled={focusableWhenDisabled || loading}
        className={cn(buttonVariants({ variant, size, full, pill }), className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} aria-hidden="true" />
        ) : (
          <>
            {Icon && <Icon className="transition-transform group-hover:scale-110" size={16} strokeWidth={2.5} aria-hidden="true" />}
            {children && <span className="relative z-10">{children}</span>}
            {IconRight && <IconRight className="transition-transform group-hover:translate-x-0.5" size={16} strokeWidth={2.5} aria-hidden="true" />}
          </>
        )}
      </BaseButton>
    );
  }
));

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;

if (import.meta.vitest) {
  describe('Button', () => {
    it('renders with default props', () => {
      render(<Button>Test</Button>)
      expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument()
    })
  
    it('renders with icon only', () => {
      const { container } = render(<Button icon={Plus} aria-label="Add" />)
      expect(screen.getByLabelText('Add')).toBeInTheDocument()
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  
    it('renders with icon and text', () => {
      render(<Button icon={Plus}>Add</Button>)
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
    })
  
    it('renders with iconRight', () => {
      render(<Button iconRight={Check}>Done</Button>)
      expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument()
    })
  
    it('renders in loading state', () => {
      render(<Button loading>Submit</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'true')
      expect(button.querySelector('.animate-spin')).toBeInTheDocument()
    })
  
    it('applies pill and full classes', () => {
      const { rerender } = render(<Button pill>Pill</Button>)
      expect(screen.getByRole('button')).toHaveClass('rounded-[var(--radius-full)]')
  
      rerender(<Button full>Full</Button>)
      expect(screen.getByRole('button')).toHaveClass('w-full')
    })
  })
}
