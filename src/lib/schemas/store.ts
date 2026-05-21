import { z } from 'zod'
import { FavoriteItemSchema } from './favorite'

export const PersistedStateSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).catch('system'),
  lang: z.enum(['da', 'en']).catch('da'),
  isCollapsed: z.boolean().catch(false),
  courseProgress: z.record(z.string(), z.array(z.number())).catch({}),
  calendarEvents: z.record(z.string(), z.any()).catch({}),
  favorites: z.array(FavoriteItemSchema).catch([]),
})

export type PersistedStateType = z.infer<typeof PersistedStateSchema>
