import { z } from 'zod'

export const CalendarEventSchema = z.object({
  id: z.number(),
  titleDa: z.string().optional(),
  titleEn: z.string().optional(),
  title: z.string().optional(),
  color: z.string(),
  location: z.string(),
  time: z.string(),
  host: z.string(),
})

export const CalendarEventsSchema = z.record(z.string(), CalendarEventSchema)

export type CalendarEventType = z.infer<typeof CalendarEventSchema>
export type CalendarEventsType = z.infer<typeof CalendarEventsSchema>
