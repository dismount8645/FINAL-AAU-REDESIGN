import { describe, it, expect } from 'vitest'
import { useResponsiveSize } from '@/hooks/useResponsiveSize'

describe('useResponsiveSize', () => {
  it('returns small value for span <= 4', () => {
    expect(useResponsiveSize(4, 'small', 'medium', 'large')).toBe('small')
    expect(useResponsiveSize(2, 'small', 'medium', 'large')).toBe('small')
  })

  it('returns medium value for span 5-7', () => {
    expect(useResponsiveSize(6, 'small', 'medium', 'large')).toBe('medium')
  })

  it('returns large value for span >= 8', () => {
    expect(useResponsiveSize(8, 'small', 'medium', 'large')).toBe('large')
    expect(useResponsiveSize(12, 'small', 'medium', 'large')).toBe('large')
  })

  it('falls back to small if medium/large not provided', () => {
    expect(useResponsiveSize(6, 'small')).toBe('small')
    expect(useResponsiveSize(10, 'small')).toBe('small')
  })
})
