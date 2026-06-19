import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className: _className, label, error, disabled, ...props }, ref) => {
    const id = useId();
    return (
      <label className="inline-flex items-center gap-[var(--space-sm)] cursor-pointer select-none text-sm font-medium text-main disabled:opacity-60 disabled:cursor-not-allowed">
        <input
          ref={ref}
          type="checkbox"
          id={props.id ?? id}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div className={cn(
          "flex items-center justify-center size-5 border-[1.5px] rounded-[var(--radius-sm)] border-[var(--border-color)] bg-bg-card transition duration-150 ease-[var(--transition-ease)]",
          "peer-focus-visible:shadow-focus peer-focus-visible:outline-none",
          "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white",
          "peer-checked:[&_svg]:opacity-100 peer-checked:[&_svg]:scale-100",
          error && "border-danger peer-checked:bg-danger peer-checked:border-danger",
          disabled && "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800"
        )}>
          <Check className="opacity-0 scale-50 transition-all duration-150 pointer-events-none" size={14} strokeWidth={3} />
        </div>
        {label && <span className="text-main">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export default Checkbox;
