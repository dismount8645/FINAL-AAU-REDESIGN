import { z } from 'zod'

const FavoriteItemSchema = z.object({
  id: z.string(),
  type: z.enum(['course', 'tool', 'file', 'forum', 'link']),
  entityId: z.number(),
  addedAt: z.number(),
  order: z.number(),
})

const DashboardWidgetItemSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  visible: z.boolean().catch(true),
  span: z.number().catch(12),
  size: z.enum(['small', 'medium', 'large']).catch('medium'),
  allowedSizes: z.array(z.enum(['small', 'medium', 'large'])).optional(),
  defaultSize: z.enum(['small', 'medium', 'large']).catch('medium'),
  x: z.number().optional(),
  y: z.number().optional(),
  w: z.number().optional(),
  h: z.number().optional(),
  userModified: z.boolean().optional(),
  pinned: z.boolean().optional(),
})

export const PersistedStateSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).catch('system'),
  lang: z.enum(['da', 'en']).catch('da'),
  isCollapsed: z.boolean().catch(true),
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
  dashboardLayout: z.array(DashboardWidgetItemSchema).catch([
    { id: 'deadlines', title: 'Seneste afleveringer', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'messages', title: 'Beskeder', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'calendar', title: 'Kalender', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'favorites', title: 'Favoritter', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'courseProgress', title: 'Kursusprogress', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'forumActivity', title: 'Forum aktivitet', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'support', title: 'ITS Support', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
    { id: 'quickOverview', title: 'Dagens program', visible: false, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
  ]),
})

