import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectVariantProps {
  variant?: 'outlined' | 'filled' | null;
  size?: 'sm' | 'md' | 'lg' | null;
  error?: boolean | null;
}

function selectVariants({
  variant,
  size,
  error,
}: SelectVariantProps = {}): string {
  const resolvedVariant = variant !== undefined ? variant : 'outlined';
  const resolvedSize = size !== undefined ? size : 'md';
  const resolvedError = error !== undefined ? error : false;

  return cn(
    "w-full appearance-none rounded-[var(--radius-lg)] border-[1.5px] transition-all duration-150 ease-[var(--transition-ease)] text-main focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800 pr-10 font-medium h-10",
    resolvedVariant === 'outlined' && "border-[var(--border-color)] bg-bg-card focus:border-primary",
    resolvedVariant === 'filled' && "border-transparent bg-bg-highlight/50 focus:bg-bg-card focus:border-primary",
    resolvedSize === 'sm' && "px-[var(--space-sm)] py-[var(--space-xs)] text-xs",
    resolvedSize === 'md' && "px-[var(--space-md)] py-[var(--space-sm)] text-sm",
    resolvedSize === 'lg' && "px-[var(--space-lg)] py-[var(--space-md)] text-base",
    resolvedError === true && "border-danger focus:border-danger focus-visible:shadow-[0_0_0_4px_rgba(204,68,91,0.35)]"
  );
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
    SelectVariantProps {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, error, children, ...props }, ref) => {
    const id = useId();
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          id={props.id ?? id}
          className={cn(selectVariants({ variant, size, error }), className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none transition-transform duration-150" 
          size={16} 
          strokeWidth={2.5} 
        />
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
