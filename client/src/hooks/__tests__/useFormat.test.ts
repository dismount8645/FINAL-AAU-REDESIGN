import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormat } from '@/hooks/useFormat';
import useStore from '@/store';

describe('useFormat', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats times and dates reactive to store language', () => {
    useStore.setState({ lang: 'en' })
    const { result } = renderHook(() => useFormat())
    
    const d = '2026-06-04T12:00:00'
    expect(result.current.formatTime(d)).toBeDefined()
    expect(result.current.formatLongDateTime(d)).toBeDefined()
    expect(result.current.formatRelativeDateGroup(d)).toBeDefined()
  })

  it('formats deadlines correctly in Danish and English', () => {
    const now = new Date('2026-06-11T12:00:00')
    vi.setSystemTime(now)

    useStore.setState({ lang: 'en' })
    const { result: resEn } = renderHook(() => useFormat())
    const pastDate = new Date(now.getTime() - 3600000)
    expect(resEn.current.formatDeadline(pastDate)).toBe('Overdue')

    expect(resEn.current.formatDeadline(now)).toBe('Today')

    const tomorrowDate = new Date(now.getTime() + 24 * 3600000)
    expect(resEn.current.formatDeadline(tomorrowDate)).toBe('Tomorrow')
    
    useStore.setState({ lang: 'da' })
    const { result: resDa } = renderHook(() => useFormat())
    expect(resDa.current.formatDeadline(tomorrowDate)).toBe('I morgen')

    useStore.setState({ lang: 'en' })
    const { result: resEn2 } = renderHook(() => useFormat())
    const futureDate = new Date(now.getTime() + 4 * 24 * 3600000)
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
