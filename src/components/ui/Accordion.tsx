"use client"

import { forwardRef, type ReactNode } from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.Item.Props
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-border last:border-0", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionPrimitive.Trigger.Props
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-sm font-semibold transition-all hover:underline group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[open]:rotate-180" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.Panel.Props
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Panel
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[starting-style]:animate-accordion-up data-[ending-style]:animate-accordion-up data-[open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-sm pt-0", className)}>{children}</div>
  </AccordionPrimitive.Panel>
))
AccordionContent.displayName = "AccordionContent"

// Legacy compatibility wrapper (optional, but good for keeping existing code working)
export interface LegacyAccordionProps {
  title: ReactNode
  defaultOpen?: boolean
  children?: ReactNode
}

function OldAccordion({ title, defaultOpen = false, children }: LegacyAccordionProps) {
  return (
    <Accordion defaultValue={defaultOpen ? ["item-1"] : []}>
      <AccordionItem value="item-1" className="border rounded-[var(--radius-md)] bg-card px-sm">
        <AccordionTrigger>{title}</AccordionTrigger>
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

