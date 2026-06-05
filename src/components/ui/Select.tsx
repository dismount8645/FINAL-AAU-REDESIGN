import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    const id = useId();
    return (
      <div className={cn("relative w-full", className)}>
        <select
          ref={ref}
          id={props.id ?? id}
          className={cn(
            "w-full appearance-none rounded-[var(--radius-lg)] border-[1.5px] border-[var(--border-color)] bg-bg-card text-main",
            "px-[var(--space-md)] py-[var(--space-sm)] pr-10 text-sm font-medium",
            "transition-all duration-150 ease-[var(--transition-ease)]",
            "focus-visible:outline-none focus-visible:shadow-focus focus:border-primary",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800",
            error && "border-danger focus:border-danger focus-visible:shadow-[0_0_0_4px_rgba(204,68,91,0.35)]"
          )}
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

export { Select };
export default Select;

if (import.meta.vitest) {
  describe('Select', () => {
    it('renders select with options', () => {
      render(
        <Select aria-label="Choose option">
          <option value="1">Option 1</option>
        </Select>
      )
      expect(screen.getByRole('combobox', { name: 'Choose option' })).toBeInTheDocument()
    })
  })
}
