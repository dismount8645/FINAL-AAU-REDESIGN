import React, { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'

export interface DropdownProps {
  trigger: ReactNode
  children?: ReactNode
  isOpen?: boolean
  onToggle?: () => void
  onClose?: () => void
  align?: 'left' | 'right'
  width?: string
  className?: string
}

export default function Dropdown({
  trigger,
  children,
  isOpen,
  onToggle,
  onClose,
  align = 'right',
  width = '200px',
  className = '',
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const controlled = isOpen !== undefined
  const visible = controlled ? isOpen : open

  const toggle = useCallback(() => {
    if (controlled) onToggle?.()
    else setOpen((prev) => !prev)
  }, [controlled, onToggle])

  const close = useCallback(() => {
    if (controlled) onClose?.()
    else setOpen(false)
  }, [controlled, onClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && visible) close()
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) close()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [visible, close])

  const triggerElement = React.isValidElement(trigger) ? (
    React.cloneElement(trigger as React.ReactElement<React.HTMLAttributes<HTMLElement> & { onClick?: React.MouseEventHandler }>, {
      onClick: (e: React.MouseEvent) => {
        const originalOnClick = (trigger.props as { onClick?: React.MouseEventHandler }).onClick
        if (originalOnClick) originalOnClick(e)
        toggle()
      },
      'aria-haspopup': 'true',
      'aria-expanded': visible,
    })
  ) : (
    <div
      className="cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm"
      onClick={toggle}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-expanded={visible}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
    >
      {trigger}
    </div>
  )

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      {triggerElement}
      {visible && (
        <div
          className="dropdown-menu absolute top-full mt-sm bg-card border border-border rounded-[var(--radius-md)] p-sm z-[var(--z-dropdown)] min-w-[200px] shadow-[var(--shadow-xl)]"
          style={{
            width: width,
            right: align === 'right' ? 0 : undefined,
            left: align === 'left' ? 0 : undefined,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
