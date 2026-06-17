// Re-export all public lib modules
export { api, saveSettings, submitAssignment, submitSupportTicket } from '@/lib/api'
export { ASSETS } from '@/lib/assets'
export { getAutomaticBreadcrumbs } from '@/lib/breadcrumbs'
export { STORAGE_KEYS, API_RETRY_BACKOFF } from '@/lib/constants'
export { DASHBOARD_CONFIG } from '@/lib/dashboard'
export {
  courses,
  courseList,
  courseData,
  forums,
  defaultEvents,
  messagesData,
  notificationsData,
  participantsData,
  courseTabItems,
  supportLocations,
  supportDeskHours,
  supportNotes,
  registryTools,
  mockForumActivities,
  mockForumPosts,
  mockForumReplies,
  mockDashboardDeadlines,
} from '@/lib/data'
export { env } from '@/lib/env'
export { sortFavorites, resolveFavorite, getFavoriteLabel } from '@/lib/favorites'
export type { ResolvedFavorite } from '@/lib/favorites'
export { type Theme, type Lang, computeIsDarkMode, ITEM_TYPE_MAP, UI_PALETTE } from '@/lib/theme'
export { translations } from '@/lib/translations'
export {
  cn,
  getFileTypeConfig,
  processFileMetadata,
  linkifyText,
  storage,
  hoursFromNow,
  getHoursUntil,
  formatTime,
  formatLongDateTime,
  formatRelativeDateGroup,
  calculateUrgency,
  getDeadlineInfo,
  allTools,
  allEssentials,
  allToolsList,
} from '@/lib/utils'
export type { DeadlineInfo } from '@/lib/utils'
