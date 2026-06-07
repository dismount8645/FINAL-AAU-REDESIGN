import { z } from 'zod'

const FavoriteItemSchema = z.object({
  id: z.string(),
  type: z.enum(['course', 'tool', 'file', 'forum', 'link']),
  entityId: z.number(),
  addedAt: z.number(),
  order: z.number(),
})

export const PersistedStateSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).catch('system'),
  lang: z.enum(['da', 'en']).catch('da'),
  isCollapsed: z.boolean().catch(false),
  courseProgress: z.record(z.string(), z.array(z.number())).catch({}),
  calendarEvents: z.record(z.string(), z.unknown()).catch({}),
  favorites: z.array(FavoriteItemSchema).catch([]),
  firstName: z.string().catch('Jacob Krarup'),
  lastName: z.string().catch('Madsen'),
  notifPrefs: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }).catch({ email: true, push: true, sms: false }),
  forumDigest: z.enum(['none', 'complete', 'subjects']).catch('complete'),
  forumTracking: z.boolean().catch(true),
  forumAutoSubscribe: z.boolean().catch(true),
  calendarStartDay: z.enum(['monday', 'sunday']).catch('monday'),
  calendarDefaultView: z.enum(['month', 'week', 'day']).catch('month'),
  messagePrivacy: z.enum(['contacts', 'courses', 'anyone']).catch('courses'),
  messageEmailOffline: z.boolean().catch(true),
})

type PersistedStateType = z.infer<typeof PersistedStateSchema>
