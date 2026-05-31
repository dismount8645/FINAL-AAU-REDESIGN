export const getWaveSrc = (page?: string) => {
  const base = '/assets/img/grafik/billeder/bølger/RGB/_media_2938_BLUE_RGB/BLUE_RGB'
  const variants: Record<string, string> = {
    dashboard: 'AAU_BOELGER_RGB-03.webp',
    courses: 'AAU_BOELGER_RGB-03.webp',
    calendar: 'AAU_BOELGER_RGB-01.webp',
    messages: 'AAU_BOELGER_RGB-01.webp',
    notifications: 'AAU_BOELGER_RGB-01.webp',
    resources: 'AAU_BOELGER_RGB-04.webp',
    support: 'AAU_BOELGER_RGB-01.webp',
  }
  const variant = (page && variants[page]) || 'AAU_BOELGER_RGB-01.webp'
  return `${base}/${variant}`
}
