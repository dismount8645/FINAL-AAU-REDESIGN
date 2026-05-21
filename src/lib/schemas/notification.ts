import { z } from 'zod'

export const NotificationSchema = z.object({
  id: z.number(),
  type: z.string(),
  textDa: z.string(),
  textEn: z.string(),
  dateDa: z.string(),
  dateEn: z.string(),
  isRead: z.boolean(),
  courseDa: z.string(),
  courseEn: z.string(),
  contentDa: z.string(),
  contentEn: z.string(),
  link: z.string(),
})

export type NotificationType = z.infer<typeof NotificationSchema>
