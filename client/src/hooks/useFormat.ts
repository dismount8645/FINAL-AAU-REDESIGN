import useStore from '@/store'
import {
  formatTime as rawFormatTime,
  formatLongDateTime as rawFormatLongDateTime,
  formatRelativeDateGroup as rawFormatRelativeDateGroup,
  getHoursUntil
} from '@/lib/utils'
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
    if (!dateStr) return '';
    const parsedDate = new Date(dateStr)
    if (isNaN(parsedDate.getTime())) {
      return '';
    }
    const hours = getHoursUntil(parsedDate)
    if (isNaN(hours)) {
      return '';
    }
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
    const typeLabel = (() => {
      switch (item.type) {
        case 'pdf': return 'PDF'
        case 'video': return 'Video'
        case 'link': return lang === 'da' ? 'Ekstern ressource' : 'External resource'
        case 'assignment': return lang === 'da' ? 'Aflevering' : 'Assignment'
        default: return ''
      }
    })()

    if (item.type === 'pdf' && item.size) {
      return `PDF · ${item.size}`
    }
    if (item.type === 'video' && item.duration) {
      return `Video · ${item.duration}`
    }
    if (item.type === 'assignment' && item.deadline) {
      const formattedDead = formatDeadline(item.deadline)
      const prefix = lang === 'da' ? 'Aflevering' : 'Assignment'
      return formattedDead ? `${prefix} · ${formattedDead}` : prefix
    }
    return typeLabel
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


