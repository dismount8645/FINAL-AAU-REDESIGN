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

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest as unknown as typeof import('vitest')
  const { renderHook } = await import('@testing-library/react')
  
  describe('useFormat', () => {
    it('formats times and dates reactive to store language', () => {
      useStore.setState({ lang: 'en' })
      const { result } = renderHook(() => useFormat())
      
      const d = '2026-06-04T12:00:00'
      expect(result.current.formatTime(d)).toBeDefined()
      expect(result.current.formatLongDateTime(d)).toBeDefined()
      expect(result.current.formatRelativeDateGroup(d)).toBeDefined()
    })

    it('formats deadlines correctly in Danish and English', () => {
      // Overdue
      useStore.setState({ lang: 'en' })
      const { result: resEn } = renderHook(() => useFormat())
      const pastDate = new Date(Date.now() - 3600000) // 1 hour ago
      expect(resEn.current.formatDeadline(pastDate)).toBe('overdue')

      // Today
      expect(resEn.current.formatDeadline(new Date())).toBe('Today')

      // Tomorrow
      const tomorrowDate = new Date(Date.now() + 24 * 3600000)
      expect(resEn.current.formatDeadline(tomorrowDate)).toBe('Tomorrow')
      
      useStore.setState({ lang: 'da' })
      const { result: resDa } = renderHook(() => useFormat())
      expect(resDa.current.formatDeadline(tomorrowDate)).toBe('I morgen')

      // Future days
      useStore.setState({ lang: 'en' })
      const { result: resEn2 } = renderHook(() => useFormat())
      const futureDate = new Date(Date.now() + 4 * 24 * 3600000)
      expect(resEn2.current.formatDeadline(futureDate)).toBe('In 4 days')

      useStore.setState({ lang: 'da' })
      const { result: resDa2 } = renderHook(() => useFormat())
      expect(resDa2.current.formatDeadline(futureDate)).toBe('Om 4 dage')
    })

    it('gets course item metadata strings correctly', () => {
      useStore.setState({ lang: 'en' })
      const { result } = renderHook(() => useFormat())

      expect(result.current.getCourseItemMetadata({ id: 1, type: 'pdf', title: 'File', titleEn: 'File', size: '2 MB' })).toBe('PDF · 2 MB')
      expect(result.current.getCourseItemMetadata({ id: 1, type: 'video', title: 'Video', titleEn: 'Video', duration: '10 min' })).toBe('Video · 10 min')
      
      const futureDate = new Date(Date.now() + 4 * 24 * 3600000)
      expect(result.current.getCourseItemMetadata({ id: 1, type: 'assignment', title: 'Task', titleEn: 'Task', deadline: futureDate.toISOString() })).toContain('Assignment · In 4 days')
      
      expect(result.current.getCourseItemMetadata({ id: 1, type: 'link', title: 'Link', titleEn: 'Link' })).toBe('External resource')
    })
  })
}
