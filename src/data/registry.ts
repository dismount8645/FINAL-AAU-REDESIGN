import type {
  CoursesMap,
  CourseListItem,
  Forum,
  CalendarEvents,
  MessageThread,
  Notification,
  WidgetConfigMap,
  Widget,
  CourseItem
} from '@/lib/types'
import registryJson from '@/data/registry.json'

interface CourseSection {
  id: string
  title: string
  titleEn: string
  items: CourseItem[]
}

interface CourseRaw {
  title: string
  titleEn: string
  code: string
  professor: string
  email: string
  img: string
  sections: CourseSection[]
}

// Reconstruct courses map
export const courses: CoursesMap = registryJson.courses.reduce((acc, course) => {
  acc[course.id.toString()] = {
    title: course.title,
    titleEn: course.titleEn,
    code: course.code,
    professor: course.professor,
    email: course.email,
    img: course.img,
    semester: course.semester,
    campus: course.campus,
    nextAssignment: course.nextAssignment || undefined,
    sections: course.sections,
  };
  return acc;
}, {} as any)

// Reconstruct courseList
export const courseList: CourseListItem[] = registryJson.courses.map(course => ({
  id: course.id,
  title: course.title,
  titleEn: course.titleEn,
  label: course.label,
  labelEn: course.labelEn,
  code: course.code,
  img: course.img,
  color: course.color,
  tab: course.tab
}))

// Reconstruct raw courseData (Record<number, CourseRaw>)
export const courseData: Record<number, CourseRaw> = registryJson.courses.reduce((acc, course) => {
  acc[course.id] = {
    title: course.title,
    titleEn: course.titleEn,
    code: course.code,
    professor: course.professor,
    email: course.email,
    img: course.img,
    sections: course.sections
  };
  return acc;
}, {} as any)

export const forums: Forum[] = registryJson.forums as Forum[]
export const defaultEvents: CalendarEvents = registryJson.defaultEvents as CalendarEvents
export const messagesData: MessageThread[] = registryJson.messagesData as MessageThread[]
export const notificationsData: Notification[] = registryJson.notificationsData as Notification[]
export const WIDGET_CONFIG: WidgetConfigMap = registryJson.widgetConfig as WidgetConfigMap
export const DEFAULT_WIDGETS: Widget[] = registryJson.defaultWidgets as Widget[]

export const participantsData = registryJson.participantsData as { name: string; role: 'student' | 'teacher' }[]
export const courseTabItems = registryJson.courseTabItems as { key: string; label: string }[]
