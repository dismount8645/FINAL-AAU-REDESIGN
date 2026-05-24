import { forwardRef, type HTMLAttributes, type MouseEventHandler, memo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

const feedbackCardVariants = cva(
  [
    "p-md rounded-[var(--radius-md)] bg-bg-card border-l-[3px] shadow-[var(--shadow-sm)] transition-all duration-200",
    "isolate overflow-hidden"
  ],
  {
    variants: {
      variant: {
        default: "border-l-primary",
        warning: "border-l-[var(--aau-dark-orange)]",
        danger: "border-l-[var(--aau-dark-pink)]",
        success: "border-l-[var(--aau-dark-green)]",
      },
      interactive: {
        true: "cursor-pointer select-none focus-visible:outline-none focus-visible:shadow-focus hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
    }
  }
)

export interface FeedbackCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'title'>,
    VariantProps<typeof feedbackCardVariants> {
  author?: string
  authorLabel?: string
  avatar?: string
  time?: string
  content?: string
  title?: React.ReactNode
  replies?: number
  important?: boolean
  importantLabel?: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

const FeedbackCard = memo(forwardRef<HTMLDivElement, FeedbackCardProps>(
  ({
    author,
    authorLabel,
    avatar,
    time,
    content,
    title,
    replies,
    important,
    importantLabel,
    onClick,
    variant,
    className,
    ...props
  }, ref) => {
    const isInteractive = !!onClick

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(feedbackCardVariants({ variant, interactive: isInteractive }), className)}
        onClick={onClick}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? "button" : undefined}
        {...props}
      >
        <div className="flex flex-col">
          {important && <Badge variant="warning" className="mb-sm">{importantLabel || 'Important'}</Badge>}
          {title && <h4 className="font-semibold mb-sm text-main">{title}</h4>}
          <div className="flex items-center gap-sm mb-md">
            {avatar && <img src={avatar} alt={author || ''} className="w-8 h-8 rounded-full object-cover" />}
            <span className="font-semibold text-main text-sm">{author}</span>
            {authorLabel && <span className="text-xs text-muted">{authorLabel}</span>}
          </div>
          {content && <p className="text-muted text-sm leading-relaxed">{content}</p>}
        </div>
        <div className="flex justify-between mt-md border-t border-border/20 pt-sm">
          {replies !== undefined ? (
            <div className="text-sm">
              <span className="font-bold text-main">{replies}</span>
              <span className="text-muted ml-xs">{replies === 1 ? 'Reply' : 'Replies'}</span>
            </div>
          ) : <div />}
          <span className="text-sm text-muted">{time}</span>
        </div>
      </div>
    )
  }
))

FeedbackCard.displayName = "FeedbackCard"

export default FeedbackCard
