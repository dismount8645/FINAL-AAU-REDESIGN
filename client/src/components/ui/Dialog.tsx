import { type ComponentProps, memo, forwardRef } from 'react';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';


import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Dialog - High-performance AAU UI component.
 * Enforces 8pt grid, 150ms motion physics, and strict brand token usage.
 */

const Dialog = DialogPrimitive.Root

const DialogTrigger = forwardRef<HTMLButtonElement, DialogPrimitive.Trigger.Props>(
  (props, ref) => <DialogPrimitive.Trigger ref={ref} data-slot="dialog-trigger" {...props} />
)
DialogTrigger.displayName = "DialogTrigger"

const DialogPortal = DialogPrimitive.Portal

const DialogClose = forwardRef<HTMLButtonElement, DialogPrimitive.Close.Props>(
  (props, ref) => <DialogPrimitive.Close ref={ref} data-slot="dialog-close" {...props} />
)
DialogClose.displayName = "DialogClose"

const DialogOverlay = memo(forwardRef<HTMLDivElement, DialogPrimitive.Backdrop.Props>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Backdrop
      ref={ref}
      data-slot="dialog-overlay"
      render={<div />}
      className={cn(
        "fixed inset-0 isolate z-[var(--z-dialog)] bg-primary/45 backdrop-blur-[2px]",
        className
      )}
      {...props}
    />
  )
))
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = memo(forwardRef<HTMLDivElement, DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <div className="fixed inset-0 z-[var(--z-dialog)] flex items-center justify-center p-4 pointer-events-none">
      <DialogPrimitive.Popup
        ref={ref}
        data-slot="dialog-content"
        render={<div />}
        className={cn(
          "pointer-events-auto relative flex flex-col w-[calc(100dvw-2rem)] sm:w-full max-w-[480px] min-w-[280px]",
          "rounded-[var(--radius-xl)] bg-bg-card p-[var(--space-md)] lg:p-[var(--space-lg)]",
          "border-2 border-[var(--border-color)]/60 shadow-[var(--shadow-xl)] outline-none max-h-[90dvh] overflow-y-auto",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                pill
                render={<span />}
                className="absolute top-[var(--space-sm)] right-[var(--space-sm)] z-10"
              />
            }
          >
            <XIcon size={20} strokeWidth={2.5} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </div>
  </DialogPortal>
)))
DialogContent.displayName = "DialogContent"

const DialogHeader = memo(({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="dialog-header"
    className={cn("flex flex-col gap-[var(--space-xs)] mb-[var(--space-md)]", className)}
    {...props}
  />
))
DialogHeader.displayName = "DialogHeader"

const DialogFooter = memo(({
  className,
  showCloseButton = false,
  children,
  ...props
}: ComponentProps<"div"> & {
  showCloseButton?: boolean
}) => (
  <div
    data-slot="dialog-footer"
    className={cn(
      "-mx-[var(--space-md)] lg:-mx-[var(--space-lg)] -mb-[var(--space-md)] lg:-mb-[var(--space-lg)] mt-[var(--space-md)] lg:mt-[var(--space-lg)]",
      "flex flex-col-reverse gap-[var(--space-sm)] sm:flex-row sm:justify-end items-center",
      "p-[var(--space-md)] lg:p-[var(--space-lg)] bg-bg-highlight/30 border-t border-[var(--border-color)]/20",
      className
    )}
    {...props}
  >
    {children}
    {showCloseButton && (
      <DialogPrimitive.Close render={<Button variant="outline" size="md" render={<span />} />}>
        Close
      </DialogPrimitive.Close>
    )}
  </div>
))
DialogFooter.displayName = "DialogFooter"

const DialogTitle = memo(forwardRef<HTMLHeadingElement, DialogPrimitive.Title.Props>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn(
        "font-black tracking-tight text-[1.5rem] leading-[1.1] text-main",
        className
      )}
      {...props}
    />
  )
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = memo(forwardRef<HTMLParagraphElement, DialogPrimitive.Description.Props>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="dialog-description"
      className={cn(
        "text-sm leading-relaxed text-muted mt-[var(--space-xs)]",
        className
      )}
      {...props}
    />
  )
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
