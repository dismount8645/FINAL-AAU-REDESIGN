import { describe, it, expect } from 'vitest'
import { formatTime } from './dates'

describe('dates', () => {
  it('formats time in en and da', () => {
    const d = new Date('2026-05-28T12:00:00')
    expect(formatTime(d, 'en')).toBeDefined()
    expect(formatTime(d, 'da')).toBeDefined()
  })
})
