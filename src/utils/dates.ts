import { translations } from '@/data/translations'
import type { Lang } from '@/store/useStore'

export function localeForLang(lang: Lang): string {
  return lang === 'da' ? 'da-DK' : 'en-US'
}

export function hoursFromNow(hours: number, from = new Date()): string {
  const date = new Date(from)
  date.setHours(date.getHours() + hours)
  return date.toISOString()
}

export function getHoursUntil(date: string | Date, from = new Date()): number {
  return (new Date(date).getTime() - from.getTime()) / (1000 * 60 * 60)
}

export function formatShortDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(localeForLang(lang), { day: 'numeric', month: 'short' })
}

export function formatTime(date: Date, lang: Lang): string {
  return date.toLocaleTimeString(localeForLang(lang), { hour: '2-digit', minute: '2-digit' })
}

export function formatLongDateTime(date: Date, lang: Lang): string {
  return date.toLocaleString(localeForLang(lang), { dateStyle: 'long', timeStyle: 'short' })
}

export function formatRelativeDateGroup(date: Date, lang: Lang, now = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (target.getTime() === today.getTime()) {
    return translations[lang].today as string as string
  }

  if (target.getTime() === yesterday.getTime()) {
    return translations[lang].yesterday as string as string
  }

  return formatShortDate(date, lang)
}
