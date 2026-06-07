import { forwardRef, type ReactNode, memo } from 'react';

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Accordion - Refactored for AAU UI/UX standards.
 * Enforces 8pt grid, 150ms motion physics, and strict token usage.
 */

const Accordion = AccordionPrimitive.Root

const AccordionItem = memo(forwardRef<
  HTMLDivElement,
  AccordionPrimitive.Item.Props
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b border-[var(--border-color)]/40 last:border-0 transition-colors duration-150",
      className
    )}
    {...props}
  />
)))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = memo(forwardRef<
  HTMLButtonElement,
  AccordionPrimitive.Trigger.Props
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-[var(--space-sm)] px-[var(--space-xs)] min-h-[44px]",
        "text-main font-bold text-sm leading-tight transition-all duration-150",
        "hover:bg-bg-hover hover:text-primary dark:hover:text-white group outline-none",
        "focus-visible:shadow-focus focus-visible:outline-none rounded-[var(--radius-sm)]",
        className
      )}
      {...props}
    >
      <span className="flex-1 text-left">{children}</span>
      <ChevronDown 
        size={16} 
        strokeWidth={2.5}
        className="shrink-0 text-muted group-hover:text-primary transition-transform duration-200 ease-[var(--transition-ease)] group-data-[open]:rotate-180" 
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = memo(forwardRef<
  HTMLDivElement,
  AccordionPrimitive.Panel.Props
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Panel
    ref={ref}
    className="overflow-hidden text-sm text-muted leading-relaxed transition-all data-[starting-style]:animate-accordion-up data-[ending-style]:animate-accordion-up data-[open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-[var(--space-md)] pt-[var(--space-xs)] px-[var(--space-xs)]", className)}>
      {children}
    </div>
  </AccordionPrimitive.Panel>
)))
AccordionContent.displayName = "AccordionContent"

// Wrapper component matching FAQ/Local Desk layouts
export const AccordionWrapper = memo(function AccordionWrapper({ children, className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <Accordion className={cn("space-y-sm", className)} {...props}>
      {children}
    </Accordion>
  )
})

export interface AccordionItemRowProps extends Omit<AccordionPrimitive.Item.Props, 'title'> {
  title: ReactNode
}

export const AccordionItemRow = memo(function AccordionItemRow({ title, children, className, ...props }: AccordionItemRowProps) {
  return (
    <AccordionItem
      className={cn(
        "border border-[var(--border-color)]/60 rounded-[var(--radius-lg)] bg-bg-card overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-150 px-md",
        className
      )}
      {...props}
    >
      <AccordionTrigger className="bg-bg-highlight/30">
        <span className="text-left font-semibold text-main">{title}</span>
      </AccordionTrigger>
      <AccordionContent>
        {children}
      </AccordionContent>
    </AccordionItem>
  )
})

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}
