import { describe, it, expect } from 'vitest'
import {
  CourseSchema,
  CourseListItemSchema,
  CourseItemSchema,
} from '@/lib/schemas/course'
import {
  CalendarEventSchema,
  CalendarEventsSchema,
} from '@/lib/schemas/calendar'
import {
  NotificationSchema,
} from '@/lib/schemas/notification'
import {
  courses,
  courseList,
  defaultEvents,
  notificationsData,
} from '@/lib/mockData'

describe('CourseItemSchema', () => {
  it('validates a course item with all fields', () => {
    const item = { id: 1, type: 'pdf', title: 'Test', titleEn: 'Test', size: '1 MB' }
    expect(CourseItemSchema.parse(item)).toEqual(item)
  })

  it('validates a course item without optional fields', () => {
    const item = { id: 1, type: 'video', title: 'Test', titleEn: 'Test' }
    expect(CourseItemSchema.parse(item)).toEqual(item)
  })

  it('rejects unknown type', () => {
    expect(() => CourseItemSchema.parse({ id: 1, type: 'unknown', title: 'T', titleEn: 'T' })).toThrow()
  })
})

describe('CourseSchema', () => {
  it('validates all mock courses', () => {
    const parsed = CourseSchema.parse(courses[1])
    expect(parsed.title).toBe('Digital Design og Kommunikation')
    expect(parsed.sections).toHaveLength(2)
    expect(parsed.nextAssignment).toBeDefined()
  })

  it('validates course without nextAssignment', () => {
    const { nextAssignment: _nextAssignment, ...course } = courses[3]
    expect(() => CourseSchema.parse(course)).not.toThrow()
  })
})

describe('CourseListItemSchema', () => {
  it('validates all mock course list items', () => {
    courseList.forEach((item) => {
      expect(() => CourseListItemSchema.parse(item)).not.toThrow()
    })
  })
})

describe('CalendarEventSchema', () => {
  it('validates all mock calendar events', () => {
    Object.values(defaultEvents).forEach((event) => {
      expect(() => CalendarEventSchema.parse(event)).not.toThrow()
    })
  })
})

describe('CalendarEventsSchema', () => {
  it('validates the full mock calendar events map', () => {
    expect(() => CalendarEventsSchema.parse(defaultEvents)).not.toThrow()
  })
})

describe('NotificationSchema', () => {
  it('validates all mock notifications', () => {
    notificationsData.forEach((notification) => {
      expect(() => NotificationSchema.parse(notification)).not.toThrow()
    })
  })
})
