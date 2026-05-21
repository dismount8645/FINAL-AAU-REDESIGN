export const WAVE_BASE = '/assets/img/grafik/billeder/bølger/RGB/_media_2938_BLUE_RGB/BLUE_RGB'

export const WAVE_VARIANTS = {
  dashboard: 'AAU_BOELGER_RGB-03.png',
  courses: 'AAU_BOELGER_RGB-03.png',
  calendar: 'AAU_BOELGER_RGB-01.png',
  messages: 'AAU_BOELGER_RGB-01.png',
  notifications: 'AAU_BOELGER_RGB-01.png',
  resources: 'AAU_BOELGER_RGB-04.png',
  support: 'AAU_BOELGER_RGB-01.png',
}

export const getWaveSrc = (page?: string) => {
  const variant = (page && (WAVE_VARIANTS as Record<string, string>)[page]) || 'AAU_BOELGER_RGB-01.png'
  return `${WAVE_BASE}/${variant}`
}
