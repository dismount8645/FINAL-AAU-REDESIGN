export const ROUTES = {
  DASHBOARD: '/',
  CALENDAR: '/calendar',
  COURSES: '/courses',
  COURSE: (id: string | number) => `/course/${id}`,
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  RESOURCES: '/resources',
  SETTINGS: '/settings',
  SUBMISSION: (courseId: string | number, assignmentId: string | number) => `/submission/${courseId}/${assignmentId}`,
  SUPPORT: '/support',
}
