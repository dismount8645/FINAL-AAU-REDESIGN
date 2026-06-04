import type {
  CoursesMap,
  CourseListItem,
  Forum,
  CalendarEvents,
  MessageThread,
  Notification,
  WidgetConfigMap,
  Widget,
} from '@/lib/types'
import mockDataJson from '@/data/mockData.json'

export const courses: CoursesMap = mockDataJson.courses as unknown as CoursesMap
export const courseList: CourseListItem[] = mockDataJson.courseList as CourseListItem[]
export const forums: Forum[] = mockDataJson.forums as Forum[]
export const defaultEvents: CalendarEvents = mockDataJson.defaultEvents as CalendarEvents
export const messagesData: MessageThread[] = mockDataJson.messagesData as MessageThread[]
export const notificationsData: Notification[] = mockDataJson.notificationsData as Notification[]
export const WIDGET_CONFIG: WidgetConfigMap = mockDataJson.widgetConfig as WidgetConfigMap
export const DEFAULT_WIDGETS: Widget[] = mockDataJson.defaultWidgets as Widget[]
