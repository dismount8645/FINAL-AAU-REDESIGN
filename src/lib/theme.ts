import { env } from './env'

export type Theme = 'system' | 'light' | 'dark'
export type Lang = 'da' | 'en'

export function computeIsDarkMode(theme: Theme): boolean {
  if (typeof window === 'undefined') return false
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return env.matchMedia('(prefers-color-scheme: dark)').matches
}
