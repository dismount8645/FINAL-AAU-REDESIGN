export const STORAGE_KEYS = {
  CALENDAR_EVENTS: 'aauCalendarEvents',
  COURSE_PROGRESS_PREFIX: 'courseProgress_',
  EXPANDED_SECTIONS_PREFIX: 'expandedSections_',
  USER_FIRST_NAME: 'userFirstName',
  USER_LAST_NAME: 'userLastName',
  USER_STORE: 'aau-user-store',
  APP_STORE: 'aau-app-store',
} as const;

export const API_RETRY_BACKOFF = [500, 1500, 3000] as const;
