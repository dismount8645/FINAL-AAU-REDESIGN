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
  dashboardLayout: z.array(DashboardWidgetItemSchema).catch([
    { id: 'deadlines', title: 'Seneste afleveringer', visible: true, size: 'medium', span: 12, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'quickOverview', title: 'Hurtig oversigt', visible: true, size: 'small', span: 8, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
    { id: 'favorites', title: 'Favoritter', visible: true, size: 'small', span: 8, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'forumActivity', title: 'Forum aktivitet', visible: true, size: 'large', span: 24, defaultSize: 'large', allowedSizes: ['medium', 'large'] },
    { id: 'support', title: 'ITS Support', visible: true, size: 'medium', span: 12, defaultSize: 'medium', allowedSizes: ['small', 'medium'] },
    { id: 'messages', title: 'Beskeder', visible: false, size: 'small', span: 8, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'calendar', title: 'Kalender', visible: false, size: 'large', span: 24, defaultSize: 'large', allowedSizes: ['medium', 'large'] },
    { id: 'courseProgress', title: 'Kursusprogress', visible: false, size: 'medium', span: 12, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
  ]),
})

