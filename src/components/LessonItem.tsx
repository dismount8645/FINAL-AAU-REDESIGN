import { forwardRef, type HTMLAttributes, type MouseEventHandler, memo } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { type LucideIcon, FileText, Play, Link2, Upload, File, Check } from 'lucide-react';
import useStore from '@/store';
import { cn } from '@/lib/utils';

type LessonType = 'pdf' | 'video' | 'link' | 'assignment' | 'file'

const lessonIconVariants = cva(
  "flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)] shrink-0 transition-colors",
  {
    variants: {
      type: {
        pdf: "text-danger bg-danger/10",
        video: "text-success bg-success/10",
        assignment: "text-accent bg-accent/10",
        link: "text-info bg-info/10",
        file: "text-muted bg-bg-highlight/50",
      }
    },
    defaultVariants: {
      type: "file"
    }
  }
)

const lessonItemVariants = cva(
  [
    "flex items-center p-sm sm:p-md gap-sm sm:gap-md rounded-[var(--radius-md)] border bg-bg-card transition duration-150 ease-[var(--transition-ease)] mb-sm",
    "focus-visible:shadow-focus focus-visible:outline-none"
  ],
  {
    variants: {
      interactive: {
        true: "cursor-pointer select-none hover:shadow-[var(--shadow-sm)] hover:border-primary/50",
        false: "cursor-default",
      }
    },
    defaultVariants: {
      interactive: false,
    }
  }
)

export interface LessonItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'title'>,
    VariantProps<typeof lessonItemVariants> {
  type?: LessonType
  title?: string
  metadata?: string
  completed?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  onToggle?: () => void
  isAutomatic?: boolean
}

const LessonItem = memo(forwardRef<HTMLDivElement, LessonItemProps>(
  ({
    type = 'file',
    title,
    metadata,
    completed,
    onClick,
    onToggle,
    className,
    isAutomatic = false,
    ...props
  }, ref) => {
    const t = useStore(state => state.t)
    
    const iconMap: Record<LessonType, LucideIcon> = {
      pdf: FileText,
      video: Play,
      link: Link2,
      assignment: Upload,
      file: File,
    }

    const handleCheckboxClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!isAutomatic) onToggle?.()
    }

    const isInteractive = !!onClick
    const IconComponent = iconMap[type] || iconMap.file

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(lessonItemVariants({ interactive: isInteractive }), className)}
        onClick={onClick}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        {...props}
      >
        <div className={lessonIconVariants({ type })}>
          <IconComponent size={18} strokeWidth={2.5} aria-hidden="true" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-bold text-main m-0 text-sm leading-tight">{title}</p>
          {metadata && <p className="text-xs text-muted m-0 mt-1">{metadata}</p>}
        </div>

        <button
          className={cn(
            "lesson-item__checkbox group/check flex items-center justify-center w-11 h-11 border rounded-[var(--radius-sm)] transition shrink-0 relative focus-visible:shadow-focus focus-visible:outline-none",
            completed 
              ? "bg-primary border-primary text-white" 
              : isAutomatic 
              ? "border-dashed opacity-30 cursor-default" 
              : "border-border bg-transparent hover:border-primary/50 dark:border-white/20"
          )}
          onClick={handleCheckboxClick}
          aria-label={completed ? t('mark_incomplete') : t('mark_complete')}
          type="button"
          disabled={isAutomatic}
        >
          {completed ? (
            <Check size={16} strokeWidth={2.5} aria-hidden="true" />
          ) : (
            !isAutomatic && (
              <Check 
                size={16} 
                strokeWidth={2.5} 
                aria-hidden="true" 
                className="opacity-0 group-hover/check:opacity-30 transition-opacity" 
              />
            )
          )}
        </button>
      </div>
    )
  }
))

LessonItem.displayName = "LessonItem"

export { LessonItem }
export default LessonItem

if (import.meta.vitest) {
  describe('LessonItem', () => {
    it('renders title', () => {
      render(<LessonItem title="Lesson" />)
      expect(screen.getByText('Lesson')).toBeInTheDocument()
    })
  
    it.each(['pdf', 'video', 'link', 'assignment', 'file'] as const)('renders type "%s" with correct icon', (type) => {
      const { container } = render(<LessonItem title="Lesson" type={type} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  
    it('falls back to file icon for invalid type', () => {
      const { container } = render(<LessonItem title="Lesson" type={'unknown' as any} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  
    it('renders completed state', () => {
      const { container } = render(<LessonItem title="Lesson" completed />)
      expect(container.querySelector('.lesson-item__checkbox svg')).toBeInTheDocument()
    })
  
    it('does not render check when not completed (by default)', () => {
      const { container } = render(<LessonItem title="Lesson" />)
      // The check icon for hover effect is present but has opacity-0
      const checkIcon = container.querySelector('.lucide-check')
      expect(checkIcon).toHaveClass('opacity-0')
    })
  
    it('calls onClick when clicked', () => {
      const onClick = vi.fn()
      render(<LessonItem title="Lesson" onClick={onClick} />)
      fireEvent.click(screen.getByText('Lesson').closest('div')!)
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  
    it('calls onToggle when checkbox area is clicked', () => {
      const onToggle = vi.fn()
      const { container } = render(<LessonItem title="Lesson" onToggle={onToggle} />)
      const checkbox = container.querySelector('.lesson-item__checkbox')!
      fireEvent.click(checkbox)
      expect(onToggle).toHaveBeenCalledTimes(1)
    })
  
    it('does not call onClick when checkbox is clicked', () => {
      const onClick = vi.fn()
      const onToggle = vi.fn()
      const { container } = render(<LessonItem title="Lesson" onClick={onClick} onToggle={onToggle} />)
      const checkbox = container.querySelector('.lesson-item__checkbox')!
      fireEvent.click(checkbox)
      expect(onToggle).toHaveBeenCalledTimes(1)
      expect(onClick).not.toHaveBeenCalled()
    })
  
    it('renders metadata text', () => {
      render(<LessonItem title="Lesson" metadata="3 pages" />)
      expect(screen.getByText('3 pages')).toBeInTheDocument()
    })
  
    it('handles isAutomatic prop', () => {
      const onToggle = vi.fn()
      const { container } = render(<LessonItem title="Lesson" isAutomatic onToggle={onToggle} />)
      const checkbox = container.querySelector('.lesson-item__checkbox')!
      expect(checkbox).toBeDisabled()
      expect(checkbox).toHaveClass('border-dashed')
      
      fireEvent.click(checkbox)
      expect(onToggle).not.toHaveBeenCalled()
    })
  
    it('clicking checkbox without onToggle does not crash', () => {
      const { container } = render(<LessonItem title="Lesson" />)
      const checkbox = container.querySelector('.lesson-item__checkbox')!
      fireEvent.click(checkbox)
      expect(container.querySelector('.lesson-item__checkbox')).toBeInTheDocument()
    })
  })
}
