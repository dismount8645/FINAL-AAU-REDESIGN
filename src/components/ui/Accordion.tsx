"use client"

import { forwardRef, type ReactNode, memo } from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

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
        "flex flex-1 items-center justify-between py-[var(--space-sm)] px-[var(--space-xs)]",
        "text-[var(--text-main)] font-bold text-sm leading-tight transition-all duration-150",
        "hover:bg-[var(--bg-hover)] hover:text-[var(--aau-blue)] group outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--aau-blue)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]",
        className
      )}
      {...props}
    >
      <span className="flex-1 text-left">{children}</span>
      <ChevronDown 
        size={16} 
        strokeWidth={2.5}
        className="shrink-0 text-[var(--text-muted)] group-hover:text-[var(--aau-blue)] transition-transform duration-300 ease-[var(--transition-ease)] group-data-[open]:rotate-180" 
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
    className="overflow-hidden text-sm text-[var(--text-muted)] leading-relaxed transition-all data-[starting-style]:animate-accordion-up data-[ending-style]:animate-accordion-up data-[open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-[var(--space-md)] pt-[var(--space-xs)] px-[var(--space-xs)]", className)}>
      {children}
    </div>
  </AccordionPrimitive.Panel>
)))
AccordionContent.displayName = "AccordionContent"

// Legacy compatibility wrapper
export interface LegacyAccordionProps {
  title: ReactNode
  defaultOpen?: boolean
  children?: ReactNode
  className?: string
}

/**
 * Default Export: Classic single-item Accordion wrapper.
 */
const OldAccordion = ({ title, defaultOpen = false, children, className }: LegacyAccordionProps) => {
  return (
    <Accordion defaultValue={defaultOpen ? ["item-1"] : []} className={className}>
      <AccordionItem value="item-1" className="border border-[var(--border-color)]/60 rounded-[var(--radius-lg)] bg-[var(--bg-card)] overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300">
        <AccordionTrigger className="bg-[var(--bg-highlight)]/30">{title}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  OldAccordion as default
}

