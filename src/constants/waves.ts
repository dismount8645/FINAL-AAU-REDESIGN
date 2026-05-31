export const WAVE_BASE = '/assets/img/grafik/billeder/bølger/RGB/_media_2938_BLUE_RGB/BLUE_RGB'

export const WAVE_VARIANTS = {
  dashboard: 'AAU_BOELGER_RGB-03.webp',
  courses: 'AAU_BOELGER_RGB-03.webp',
  calendar: 'AAU_BOELGER_RGB-01.webp',
  messages: 'AAU_BOELGER_RGB-01.webp',
  notifications: 'AAU_BOELGER_RGB-01.webp',
  resources: 'AAU_BOELGER_RGB-04.webp',
  support: 'AAU_BOELGER_RGB-01.webp',
}

export const getWaveSrc = (page?: string) => {
  const variant = (page && (WAVE_VARIANTS as Record<string, string>)[page]) || 'AAU_BOELGER_RGB-01.webp'
  return `${WAVE_BASE}/${variant}`
}
