export const getWaveSrc = (page?: string) => {
  const variants: Record<string, string> = {
    dashboard: 'aau-boelger-rgb-03.webp',
    courses: 'aau-boelger-rgb-03.webp',
    calendar: 'aau-boelger-rgb-01.webp',
    messages: 'aau-boelger-rgb-01.webp',
    notifications: 'aau-boelger-rgb-01.webp',
    resources: 'aau-boelger-rgb-04.webp',
    support: 'aau-boelger-rgb-01.webp',
  }
  const variant = (page && variants[page]) || 'aau-boelger-rgb-01.webp'
  return `/images/waves/${variant}`
}
