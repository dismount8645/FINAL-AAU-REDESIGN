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
    return translations[lang].today as string
  }

  if (target.getTime() === yesterday.getTime()) {
    return translations[lang].yesterday as string
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

export interface DeadlineInfo {
  label: string
  urgency: 'overdue' | 'today' | 'tomorrow' | 'soon' | 'later'
  color: string
  relativeLabel?: string
  dateLabel?: string
}

export function getDeadlineInfo(dateInput: string | Date, lang: Lang, now = new Date()): DeadlineInfo {
  const target = new Date(dateInput)
  const targetTime = target.getTime()
  const nowTime = now.getTime()

  const todayDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetDateObj = new Date(target.getFullYear(), target.getMonth(), target.getDate())

  const diffDays = Math.round((targetDateObj.getTime() - todayDateObj.getTime()) / (1000 * 60 * 60 * 24))

  const hoursUntil = (targetTime - nowTime) / (1000 * 60 * 60)

  let urgency: 'overdue' | 'today' | 'tomorrow' | 'soon' | 'later'
  if (targetTime < nowTime) {
    urgency = 'overdue'
  } else if (diffDays === 0) {
    urgency = 'today'
  } else if (diffDays === 1) {
    urgency = 'tomorrow'
  } else if (hoursUntil <= 48) {
    urgency = 'soon'
  } else {
    urgency = 'later'
  }

  const dayNameRaw = target.toLocaleDateString(lang === 'da' ? 'da-DK' : 'en-US', { weekday: 'long' })
  const dayName = dayNameRaw.charAt(0).toUpperCase() + dayNameRaw.slice(1)
  const hh = String(target.getHours()).padStart(2, '0')
  const mm = String(target.getMinutes()).padStart(2, '0')
  const timeStr = `${hh}:${mm}`

  const weekdayAndTime = lang === 'da' ? `${dayName} kl. ${timeStr}` : `${dayName} at ${timeStr}`
  const monthDay = target.toLocaleDateString(lang === 'da' ? 'da-DK' : 'en-US', { day: 'numeric', month: 'short' })
  const relativeLabel = urgency === 'overdue'
    ? (lang === 'da' ? 'Overskredet' : 'Overdue')
    : urgency === 'today'
    ? (lang === 'da' ? 'I dag' : 'Today')
    : urgency === 'tomorrow'
    ? (lang === 'da' ? 'I morgen' : 'Tomorrow')
    : (lang === 'da' ? `Om ${diffDays} dage` : `In ${diffDays} days`);

  const dateLabel = (urgency === 'today' || urgency === 'tomorrow')
    ? (lang === 'da' ? `kl. ${timeStr}` : `at ${timeStr}`)
    : (lang === 'da' ? `${dayName} ${monthDay} kl. ${timeStr}` : `${dayName}, ${monthDay} at ${timeStr}`);

  const label = urgency === 'overdue'
    ? (lang === 'da' ? `Overskredet · ${weekdayAndTime}` : `Overdue · ${weekdayAndTime}`)
    : `${relativeLabel} · ${dateLabel}`;

  let color = ''
  if (urgency === 'overdue') {
    color = 'var(--color-status-overdue)'
  } else if (urgency === 'today') {
    color = 'var(--color-status-urgent)'
  } else if (urgency === 'tomorrow' || urgency === 'soon') {
    color = 'var(--color-status-warning)'
  } else {
    color = 'var(--color-status-neutral)'
  }

  return { label, urgency, color, relativeLabel, dateLabel }
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

    it('getDeadlineInfo returns correct info for various periods', () => {
      const now = new Date('2026-06-11T12:00:00')

      const overdue = new Date('2026-06-11T11:00:00')
      const info1 = getDeadlineInfo(overdue, 'da', now)
      expect(info1.urgency).toBe('overdue')
      expect(info1.color).toBe('var(--color-status-overdue)')

      const today = new Date('2026-06-11T15:00:00')
      const info2 = getDeadlineInfo(today, 'da', now)
      expect(info2.urgency).toBe('today')
      expect(info2.label).toBe('I dag · kl. 15:00')
      expect(info2.color).toBe('var(--color-status-urgent)')

      const tomorrow = new Date('2026-06-12T10:00:00')
      const info3 = getDeadlineInfo(tomorrow, 'da', now)
      expect(info3.urgency).toBe('tomorrow')
      expect(info3.label).toBe('I morgen · kl. 10:00')
      expect(info3.color).toBe('var(--color-status-warning)')

      const soon = new Date('2026-06-13T09:00:00')
      const info4 = getDeadlineInfo(soon, 'da', now)
      expect(info4.urgency).toBe('soon')
      expect(info4.color).toBe('var(--color-status-warning)')

      const later = new Date('2026-06-15T09:00:00')
      const info5 = getDeadlineInfo(later, 'en', now)
      expect(info5.urgency).toBe('later')
      expect(info5.label).toBe('In 4 days · Monday, Jun 15 at 09:00')
      expect(info5.color).toBe('var(--color-status-neutral)')
    })
  })
}
