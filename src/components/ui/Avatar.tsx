"use client"

import { memo, useMemo, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Avatar - Senior UI/UX Architect refinement.
 * Enforces AAU brand tokens, 8pt grid logic, and high-performance rendering.
 */

export interface AvatarProps {
  /** Image source URL */
  src?: string
  /** Display name for initials and alt text */
  name?: string
  /** 
   * Size presets (8pt grid):
   * 2xs: 16px | xs: 24px | sm: 32px | md: 40px | lg: 48px | xl: 56px | 2xl: 64px 
   */
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number
  /** Availability status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy'
  /** Custom CSS classes */
  className?: string
  /** Click handler */
  onClick?: () => void
}

const sizeMap = {
  '2xs': 16,
  'xs': 24,
  'sm': 32,
  'md': 40,
  'lg': 48,
  'xl': 56,
  '2xl': 64,
}

const statusColorMap = {
  online: 'var(--color-success)',
  offline: 'var(--color-text-disabled)',
  away: 'var(--color-warning)',
  busy: 'var(--color-danger)',
}

/**
 * Avatar - Collaborative peer programmer version.
 */
const Avatar = memo(function Avatar({
  src,
  name,
  size = 'md',
  status,
  className = '',
  onClick,
}: AvatarProps) {
  const px = useMemo(() => {
    if (typeof size === 'number') return size
    return sizeMap[size] ?? sizeMap.md
  }, [size])

  const initials = useMemo(() => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [name])

  const { statusSize, borderWidth } = useMemo(() => ({
    statusSize: px <= 24 ? 6 : px <= 40 ? 10 : 14,
    borderWidth: px <= 32 ? 2 : 3
  }), [px])

  return (
    <motion.div
      role={onClick ? "button" : "img"}
      aria-label={name ?? 'Avatar'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
      whileHover={onClick ? { scale: 1.05, y: -4, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={cn(
        "relative rounded-[var(--radius-full)] shrink-0 overflow-visible transition-shadow duration-150 isolate",
        onClick && "cursor-pointer hover:shadow-[var(--shadow-md)]",
        className
      )}
      style={{ width: px, height: px }}
      onClick={onClick}
    >
      <div className="w-full h-full rounded-[var(--radius-full)] overflow-hidden border border-[var(--border-color)]/40 bg-bg-highlight flex items-center justify-center">
        <AnimatePresence mode="wait">
          {src ? (
            <motion.img
              key="image"
              src={src}
              alt={name ?? ''}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div 
              key="initials"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center text-main font-black tracking-tighter"
              style={{ fontSize: px * 0.4 }}
            >
              {initials}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {status && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -bottom-0.5 -right-0.5 rounded-[var(--radius-full)] bg-bg-card shadow-sm"
          style={{
            width: statusSize,
            height: statusSize,
            padding: borderWidth,
          }}
        >
          <div 
            className="w-full h-full rounded-[var(--radius-full)]"
            style={{ backgroundColor: statusColorMap[status] }}
          />
        </motion.div>
      )}
    </motion.div>
  )
})

export default Avatar
