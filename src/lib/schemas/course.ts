import { z } from 'zod'

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
