/**
 * Centralized animation configurations and transitions.
 */

export const TRANSITIONS = {
  default: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 200, damping: 25 },
  fast: { type: "spring", stiffness: 500, damping: 40 },
  layout: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] },
};

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
};

export const ANIMATION_PRESETS = {
  fast: { duration: 150, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  normal: { duration: 200, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  slow: { duration: 300, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
} as const

export const TRANSITION_CLASSES = {
  fast: 'transition-all duration-150 ease-default',
  normal: 'transition-all duration-200 ease-default',
  slow: 'transition-all duration-300 ease-default',
} as const
