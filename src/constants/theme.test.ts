import { describe, it, expect } from 'vitest'
import { BREAKPOINTS, ANIMATION } from '@/constants/theme'

describe('theme', () => {
  it('should have correct constants', () => {
    expect(BREAKPOINTS).toBeDefined()
    expect(ANIMATION).toBeDefined()
    expect(BREAKPOINTS.mobile).toBe(768)
  })
})
