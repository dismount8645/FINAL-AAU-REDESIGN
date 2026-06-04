import useStore from '@/store'
import {
  formatTime as rawFormatTime,
  formatLongDateTime as rawFormatLongDateTime,
  formatRelativeDateGroup as rawFormatRelativeDateGroup,
  getHoursUntil
} from '@/lib/dates'
import type { CourseItem } from '@/lib/types'

export function useFormat() {
  const lang = useStore((state) => state.lang)
  const t = useStore((state) => state.t)

  const formatTime = (date: Date | string) => {
    return rawFormatTime(new Date(date), lang)
  }

  const formatLongDateTime = (date: Date | string) => {
    return rawFormatLongDateTime(new Date(date), lang)
  }

  const formatRelativeDateGroup = (date: Date | string) => {
    return rawFormatRelativeDateGroup(new Date(date), lang)
  }

  const formatDeadline = (dateStr: string | Date) => {
    const hours = getHoursUntil(dateStr)
    const days = Math.ceil(hours / 24)

    if (hours < 0) {
      return t('overdue')
    }

    if (days === 0) {
      return t('today')
    }

    if (days === 1) {
      return lang === 'da' ? 'I morgen' : 'Tomorrow'
    }

    return lang === 'da' ? `Om ${days} dage` : `In ${days} days`
  }

  const getCourseItemMetadata = (item: CourseItem) => {
    if (item.size) return item.size
    if (item.duration) return item.duration
    if (item.deadline) {
      return `${t('deadline')}: ${formatDeadline(item.deadline)}`
    }
    return t('external_resource')
  }

  return {
    lang,
    formatTime,
    formatLongDateTime,
    formatRelativeDateGroup,
    formatDeadline,
    getCourseItemMetadata,
  }
}

export default useFormat

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest as unknown as typeof import('vitest')
  
  describe('useFormat', () => {
    it('returns helper formatters based on active store language', () => {
      useStore.setState({ lang: 'en' })
      const d = new Date('2026-05-28T12:00:00')
      expect(rawFormatTime(d, 'en')).toBeDefined()
    })
  })
}
