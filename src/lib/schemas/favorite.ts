import { z } from 'zod'

export const FavoriteItemSchema = z.object({
  id: z.string(),
  type: z.enum(['course', 'tool', 'file', 'forum', 'link']),
  entityId: z.number(),
  addedAt: z.number(),
  order: z.number(),
})

export type FavoriteItemType = z.infer<typeof FavoriteItemSchema>
