import type {
  CoursesMap,
  CourseListItem,
  Forum,
  CalendarEvents,
  MessageThread,
  Notification,
  WidgetConfigMap,
  Widget,
  CourseItem,
  GradeRecord
} from '@/lib/types'
import registryJson from '@/data/registry.json'
import mockGradesJson from '@/data/mockGrades.json'

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

// Relocated from mockGrades.ts
export const BACHELOR_TOTAL_ECTS = 180
export const mockGradesData: GradeRecord[] = mockGradesJson as GradeRecord[]

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

// Support data relocated from registry.json
export const supportLocations = registryJson.supportLocations
export const supportDeskHours = registryJson.supportDeskHours
export const supportNotes = registryJson.supportNotes

// Tools data for lib/tools.ts
export const registryTools = registryJson.tools

// Dashboard widget data slices — field names mapped to match widget contracts
export const dashboardDeadlines = registryJson.dashboard
  .filter(d => d.category === 'deadlines')
  .map(d => ({
    id: d.id,
    category: d.category,
    titleDa: d.nameDa,
    titleEn: d.nameEn,
    iconName: d.iconName,
    dateKey: (d as any).dateKey as string,
    courseId: (d as any).courseId as number,
    deadlineHoursFromNow: (d as any).deadlineHoursFromNow as number,
  }))

export const dashboardGrades = registryJson.dashboard
  .filter(d => d.category === 'grades')
  .map(d => ({
    id: d.id,
    category: d.category,
    courseDa: d.nameDa,
    courseEn: d.nameEn,
    iconName: d.iconName,
    score: (d as any).score as number | null,
  }))

export const dashboardForumPosts = registryJson.dashboard
  .filter(d => d.category === 'forumPosts')
  .map(d => ({
    id: d.id,
    category: d.category,
    titleDa: d.nameDa,
    titleEn: d.nameEn,
    iconName: d.iconName,
    author: (d as any).author as string,
    timeDa: (d as any).timeDa as string,
    timeEn: (d as any).timeEn as string,
    replies: (d as any).replies as number,
    important: (d as any).important as boolean | undefined,
  }))
