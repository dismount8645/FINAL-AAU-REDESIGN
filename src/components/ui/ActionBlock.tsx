import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { MouseEventHandler } from 'react'
import { Clock } from 'lucide-react'
import Button from '@/components/ui/Button'

const actionBlockVariants = cva(
  'flex items-center justify-between p-[var(--space-md)] rounded-[var(--radius-md)] border',
  {
    variants: {
      variant: {
        default: 'bg-card border-border',
        brand: 'bg-primary/5 border-primary/20',
        primary: 'bg-aau-blue/5 border-aau-blue/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ActionBlockProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof actionBlockVariants> {
  title?: string
  description?: string
  time?: string
  buttonText?: string
  onButtonClick?: MouseEventHandler<HTMLButtonElement>
}

export default function ActionBlock({
  title,
  description,
  time,
  buttonText,
  onButtonClick,
  variant,
  children,
  className,
  ...props
}: ActionBlockProps) {
  return (
    <div className={cn(actionBlockVariants({ variant }), className)} {...props}>
      <div className="flex flex-col gap-[var(--space-xs)] flex-1">
        {title ? <h4 className="font-bold">{title}</h4> : null}
        {description ? <p className="text-sm opacity-80">{description}</p> : null}
        {time ? <div className="flex items-center gap-[var(--space-xs)] text-xs mt-[var(--space-xs)]">
            <Clock size={14} strokeWidth={2} aria-hidden="true" />
            <span>{time}</span>
          </div> : null}
        {children}
      </div>
      {buttonText ? <Button
          variant="secondary"
          size="sm"
          className="ml-[var(--space-md)]"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button> : null}
    </div>
  )
}
