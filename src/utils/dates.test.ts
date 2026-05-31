import { describe, it, expect } from 'vitest'
import { formatDate, formatFullDate, formatTime } from './dates'

describe('dates', () => {
  it('formats dates in en and da', () => {
    const d = new Date('2026-05-28T12:00:00')
    expect(formatDate(d, 'en')).toBeDefined()
    expect(formatDate(d, 'da')).toBeDefined()
    expect(formatFullDate(d, 'en')).toBeDefined()
    expect(formatTime(d, 'en')).toBeDefined()
  })
})
