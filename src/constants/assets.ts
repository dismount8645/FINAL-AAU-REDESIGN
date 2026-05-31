export const ASSETS = {
  fallback: {
    searchThumbnail: '/assets/img/grafik/billeder/Bygninger og campus/_2WB3689.webp',
  },
  promo: {
    student: '/assets/img/grafik/billeder/Studerende og studieliv/_2WB5786.webp',
    instructor: '/assets/img/grafik/billeder/Studerende og studieliv/_2WB0351.webp',
  },
  waves: {
    light: (num: string) => `/assets/img/grafik/billeder/bølger/RGB/_media_2938_BLUE_RGB/BLUE_RGB/AAU_BOELGER_RGB-${num}.webp`,
    dark: (num: string) => `/assets/img/grafik/billeder/bølger/HVID/_media_2941_WHITE/WHITE/AAU_BOELGER_WHITE-${num}.webp`,
  },
}
