import { describe, it, expect } from 'vitest'
import { ROUTES } from '@/constants/urls'

describe('urls', () => {
  it('should define ROUTES correctly', () => {
    expect(ROUTES.DASHBOARD).toBe('/')
    expect(ROUTES.CALENDAR).toBe('/calendar')
    expect(ROUTES.COURSES).toBe('/courses')
    expect(ROUTES.COURSE(123)).toBe('/course/123')
    expect(ROUTES.MESSAGES).toBe('/messages')
    expect(ROUTES.NOTIFICATIONS).toBe('/notifications')
    expect(ROUTES.RESOURCES).toBe('/resources')
    expect(ROUTES.SETTINGS).toBe('/settings')
    expect(ROUTES.SUBMISSION(1, 2)).toBe('/submission/1/2')
    expect(ROUTES.SUPPORT).toBe('/support')
  })
})
