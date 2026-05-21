export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1100,
}

export const ANIMATION = {
  fadeSlide: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.3 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
}
