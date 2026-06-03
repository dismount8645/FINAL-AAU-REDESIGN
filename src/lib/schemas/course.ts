import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { courses, courseList, defaultEvents, notificationsData } from '@/lib/mockData';
import { CalendarEventSchema, CalendarEventsSchema } from '@/lib/schemas/calendar';
import { NotificationSchema } from '@/lib/schemas/notification';

export const CourseItemSchema = z.object({
  id: z.number(),
  type: z.enum(['pdf', 'video', 'link', 'assignment']),
  title: z.string(),
  titleEn: z.string(),
  size: z.string().optional(),
  duration: z.string().optional(),
  deadline: z.string().optional(),
  deadlineEn: z.string().optional(),
})

export const NextAssignmentSchema = z.object({
  title: z.string(),
  titleEn: z.string(),
  deadline: z.string(),
  deadlineEn: z.string(),
  submissionId: z.string(),
})

export const CourseSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  titleEn: z.string(),
  items: z.array(CourseItemSchema),
})

export const CourseSchema = z.object({
  title: z.string(),
  titleEn: z.string(),
  code: z.string(),
  professor: z.string(),
  email: z.string(),
  img: z.string(),
  semester: z.string(),
  campus: z.string(),
  nextAssignment: NextAssignmentSchema.optional(),
  sections: z.array(CourseSectionSchema),
})

export const CourseListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  titleEn: z.string(),
  label: z.string().optional(),
  labelEn: z.string().optional(),
  img: z.string(),
  color: z.string().optional(),
  tab: z.string().optional(),
})

export const CoursesMapSchema = z.record(z.string(), CourseSchema)

export type CourseItemType = z.infer<typeof CourseItemSchema>
export type NextAssignmentType = z.infer<typeof NextAssignmentSchema>
export type CourseSectionType = z.infer<typeof CourseSectionSchema>
export type CourseType = z.infer<typeof CourseSchema>
export type CourseListItemType = z.infer<typeof CourseListItemSchema>

if (import.meta.vitest) {
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
}
