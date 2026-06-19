import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: boolean;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className: _className, label, error, disabled, ...props }, ref) => {
    const id = useId();
    return (
      <label className="inline-flex items-center gap-[var(--space-sm)] cursor-pointer select-none text-sm font-medium text-main disabled:opacity-60 disabled:cursor-not-allowed">
        <input
          ref={ref}
          type="radio"
          id={props.id ?? id}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div className={cn(
          "flex items-center justify-center size-5 border-[1.5px] rounded-full border-[var(--border-color)] bg-bg-card transition duration-150 ease-[var(--transition-ease)]",
          "peer-focus-visible:shadow-focus peer-focus-visible:outline-none",
          "peer-checked:border-primary peer-checked:text-primary",
          "peer-checked:[&>div]:scale-100 peer-checked:[&>div]:opacity-100",
          error && "border-danger peer-checked:border-danger",
          disabled && "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800"
        )}>
          <div className="size-2.5 rounded-full bg-primary opacity-0 scale-50 transition-all duration-150 pointer-events-none" />
        </div>
        {label && <span className="text-main">{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
