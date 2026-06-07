
import type { Lang } from '@/store';
import { translations } from '@/lib/translations';

function localeForLang(lang: Lang): string {
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

export function formatTime(date: Date, lang: Lang): string {
  return date.toLocaleTimeString(localeForLang(lang), { hour: '2-digit', minute: '2-digit' })
}

export function formatLongDateTime(date: Date, lang: Lang): string {
  return date.toLocaleString(localeForLang(lang), { dateStyle: 'long', timeStyle: 'short' })
}

function formatShortDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(localeForLang(lang), { day: 'numeric', month: 'short' })
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

type UrgencyLevel = 'overdue' | 'critical' | 'soon' | 'normal'

export function calculateUrgency(deadlineDate: string): UrgencyLevel {
  const hoursLeft = getHoursUntil(deadlineDate)
  if (hoursLeft < 0) return 'overdue'
  if (hoursLeft < 24) return 'critical'
  if (hoursLeft < 72) return 'soon'
  return 'normal'
}


if (import.meta.vitest) {
  describe('dates', () => {
    it('formats time in en and da', () => {
      const d = new Date('2026-05-28T12:00:00')
      expect(formatTime(d, 'en')).toBeDefined()
      expect(formatTime(d, 'da')).toBeDefined()
    })

    it('formats long date time', () => {
      const d = new Date('2026-05-28T12:00:00')
      expect(formatLongDateTime(d, 'en')).toBeDefined()
      expect(formatLongDateTime(d, 'da')).toBeDefined()
    })

    it('calculates urgency correctly', () => {
      const now = new Date()
      const overdue = new Date(now.getTime() - 3600000).toISOString()
      const critical = new Date(now.getTime() + 3600000).toISOString()
      const soon = new Date(now.getTime() + 100000000).toISOString()
      const normal = new Date(now.getTime() + 500000000).toISOString()

      expect(calculateUrgency(overdue)).toBe('overdue')
      expect(calculateUrgency(critical)).toBe('critical')
      expect(calculateUrgency(soon)).toBe('soon')
      expect(calculateUrgency(normal)).toBe('normal')
    })

    it('formats relative date group', () => {
      const now = new Date('2026-05-28T12:00:00')
      const today = new Date('2026-05-28T10:00:00')
      const yesterday = new Date('2026-05-27T10:00:00')
      const other = new Date('2026-05-20T10:00:00')

      expect(formatRelativeDateGroup(today, 'en', now)).toBe('Today')
      expect(formatRelativeDateGroup(yesterday, 'en', now)).toBe('Yesterday')
      expect(formatRelativeDateGroup(other, 'en', now)).toContain('May')
    })

    it('gets hours until and hours from now', () => {
      const now = new Date()
      const target = hoursFromNow(5, now)
      expect(getHoursUntil(target, now)).toBeCloseTo(5, 5)
    })
  })
}
