import { createContext, useContext, useState, type ReactNode, memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  openValues: string[];
  toggleValue: (val: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

export interface AccordionWrapperProps {
  children?: ReactNode;
  className?: string;
  defaultValue?: string[];
}

export const AccordionWrapper = memo(function AccordionWrapper({
  children,
  className,
  defaultValue = [],
}: AccordionWrapperProps) {
  const [openValues, setOpenValues] = useState<string[]>(defaultValue);

  const toggleValue = (val: string) => {
    setOpenValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  return (
    <AccordionContext.Provider value={{ openValues, toggleValue }}>
      <div className={cn("space-y-sm", className)}>{children}</div>
    </AccordionContext.Provider>
  );
});

export interface AccordionItemRowProps {
  value: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const AccordionItemRow = memo(function AccordionItemRow({
  value,
  title,
  children,
  className,
}: AccordionItemRowProps) {
  const context = useContext(AccordionContext);
  
  // Fallback state if item is used outside a wrapper
  const [localOpen, setLocalOpen] = useState(false);
  
  const isOpen = context ? context.openValues.includes(value) : localOpen;
  
  const handleToggle = () => {
    if (context) {
      context.toggleValue(value);
    } else {
      setLocalOpen(!localOpen);
    }
  };

  return (
    <details
      open={isOpen}
      className={cn(
        "border border-[var(--border-color)]/60 rounded-[var(--radius-lg)] bg-bg-card overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-150 px-md w-full",
        className
      )}
    >
      <summary
        onClick={(e) => {
          e.preventDefault();
          handleToggle();
        }}
        className={cn(
          "flex flex-1 items-center justify-between py-md px-sm min-h-[48px] list-none cursor-pointer select-none",
          "text-main font-bold text-sm leading-tight transition-all duration-150",
          "hover:bg-bg-hover hover:text-primary dark:hover:text-white group outline-none rounded-[var(--radius-sm)] focus-visible:shadow-focus"
        )}
      >
        <span className="text-left font-semibold text-main">{title}</span>
        <ChevronDown
          size={20}
          strokeWidth={2.5}
          className={cn(
            "shrink-0 text-muted group-hover:text-primary transition-transform duration-200 ease-[var(--transition-ease)]",
            isOpen && "rotate-180"
          )}
        />
      </summary>
      {isOpen && (
        <div className="overflow-hidden text-sm text-muted leading-relaxed pb-lg pt-sm px-sm border-t border-[var(--border-color)]/20">
          {children}
        </div>
      )}
    </details>
  );
});


