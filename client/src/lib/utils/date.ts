import type { Lang } from '@/store';
import { translations } from '@/translations';

function localeForLang(lang: Lang): string {
  return lang === 'da' ? 'da-DK' : 'en-US'
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


interface DeadlineInfo {
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
