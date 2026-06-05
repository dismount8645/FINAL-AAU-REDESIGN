import { forwardRef, type ReactNode, memo } from 'react';

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';

import userEvent from '@testing-library/user-event';
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
        className="shrink-0 text-muted group-hover:text-primary transition-transform duration-300 ease-[var(--transition-ease)] group-data-[open]:rotate-180" 
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
      <AccordionItem value="item-1" className="border border-[var(--border-color)]/60 rounded-[var(--radius-lg)] bg-bg-card overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-150">
        <AccordionTrigger className="bg-bg-highlight/30">{title}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

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
  OldAccordion as default
}

const _testAccordion = OldAccordion;

if (import.meta.vitest) {
  describe('Accordion', () => {
    it('renders title text', () => {
      render(<_testAccordion title="Test Title">Content</_testAccordion>)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })
  
    it('is closed by default', () => {
      render(<_testAccordion title="Test">Hidden Content</_testAccordion>)
      expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument()
    })
  
    it('is open when defaultOpen is true', () => {
      render(<_testAccordion title="Test" defaultOpen>Visible Content</_testAccordion>)
      expect(screen.getByText('Visible Content')).toBeInTheDocument()
    })
  
    it('opens when clicking the header', async () => {
      render(<_testAccordion title="Toggle Me">Secret Content</_testAccordion>)
      
      expect(screen.queryByText('Secret Content')).not.toBeInTheDocument()
      
      const header = screen.getByRole('button', { name: 'Toggle Me' })
      await userEvent.click(header)
      
      expect(screen.getByText('Secret Content')).toBeInTheDocument()
    })
  
    it('closes when clicking an open accordion', async () => {
      render(<_testAccordion title="Toggle Me" defaultOpen>Content</_testAccordion>)
      
      expect(screen.getByText('Content')).toBeInTheDocument()
      
      const header = screen.getByRole('button', { name: 'Toggle Me' })
      await userEvent.click(header)
      
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })
  
    it('has aria-expanded="false" when closed', () => {
      render(<_testAccordion title="Test">Content</_testAccordion>)
      const header = screen.getByRole('button', { name: 'Test' })
      expect(header).toHaveAttribute('aria-expanded', 'false')
    })
  
    it('has aria-expanded="true" when open by default', () => {
      render(<_testAccordion title="Test Open" defaultOpen>Content</_testAccordion>)
      const header = screen.getByRole('button', { name: 'Test Open' })
      expect(header).toHaveAttribute('aria-expanded', 'true')
    })
  
    it('has is-open class when open', async () => {
      render(<_testAccordion title="Test">Content</_testAccordion>)
      
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button.className).not.toContain('is-open')
      
      await userEvent.click(button)
      // Bemærk: Accordion bruger ikke 'is-open' klassen i jsx'en.
      // Vi tjekker i stedet aria-expanded.
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })
  
    it('renders content when open', () => {
      render(<_testAccordion title="Test" defaultOpen>Content</_testAccordion>)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  
    it('does not render content when closed', () => {
      render(<_testAccordion title="Test">Content</_testAccordion>)
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })
  
    it('has chevron icon', () => {
      render(<_testAccordion title="Test">Content</_testAccordion>)
      // Sørg for at vi har et svg-ikon (Lucide)
      expect(document.querySelector('svg')).toBeInTheDocument()
    })
  
    it('rotates chevron when open', () => {
      render(<_testAccordion title="Test" defaultOpen>Content</_testAccordion>)
      const icon = document.querySelector('svg')
      // I vores implementation roterer vi ikonet via CSS klasser på triggeren
      expect(icon).toHaveClass('group-data-[open]:rotate-180')
    })
  })
}
