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
})

export type PersistedStateType = z.infer<typeof PersistedStateSchema>
