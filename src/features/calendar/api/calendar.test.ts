import { describe, it, expect } from 'vitest'
import { calendarApi } from '@/features/calendar/api/calendar'

describe('calendarApi', () => {
  it('getAll returns calendar events', async () => {
    const events = await calendarApi.getAll()
    expect(events).toHaveProperty('2026-4-5')
    expect(events['2026-4-5']).toHaveProperty('location')
  })
})
