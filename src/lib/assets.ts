export const ASSETS = {
  fallback: {
    searchThumbnail: '/images/campus/2wb3689.webp',
  },
  promo: {
    student: '/images/student-life/2wb5786.webp',
    instructor: '/images/student-life/2wb0351.webp',
  },
  waves: {
    light: (num: string) => `/images/waves/aau-boelger-rgb-${num}.webp`,
    dark: (num: string) => `/images/waves/aau-boelger-white-${num}.webp`,
  },
}
