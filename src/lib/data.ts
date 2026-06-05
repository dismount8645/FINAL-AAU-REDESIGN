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
  acc[course.id] = {
    title: course.title,
    titleEn: course.titleEn,
    code: course.code,
    professor: course.professor,
    email: course.email,
    img: course.img,
    semester: course.semester,
    campus: course.campus,
    nextAssignment: course.nextAssignment || undefined,
    sections: course.sections as CourseSection[],
  };
  return acc;
}, {} as CoursesMap)

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
    sections: course.sections as CourseSection[],
  };
  return acc;
}, {} as Record<number, CourseRaw>)

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

interface DashboardEntry {
  id: number;
  category: string;
  nameDa?: string;
  nameEn?: string;
  iconName?: string;
  dateKey?: string;
  courseId?: number;
  deadlineHoursFromNow?: number;
  score?: number | null;
  author?: string;
  timeDa?: string;
  timeEn?: string;
  replies?: number;
  important?: boolean;
}

const dashboardEntries = registryJson.dashboard as DashboardEntry[]

// Dashboard widget data slices — field names mapped to match widget contracts
export const dashboardDeadlines = dashboardEntries
  .filter(d => d.category === 'deadlines')
  .map(d => ({
    id: d.id,
    category: d.category,
    titleDa: d.nameDa ?? '',
    titleEn: d.nameEn ?? '',
    iconName: d.iconName ?? '',
    dateKey: d.dateKey as string,
    courseId: d.courseId as number,
    deadlineHoursFromNow: d.deadlineHoursFromNow as number,
  }))

export const dashboardGrades = dashboardEntries
  .filter(d => d.category === 'grades')
  .map(d => ({
    id: d.id,
    category: d.category,
    courseDa: d.nameDa ?? '',
    courseEn: d.nameEn ?? '',
    iconName: d.iconName ?? '',
    score: d.score as number | null,
  }))

export const dashboardForumPosts = dashboardEntries
  .filter(d => d.category === 'forumPosts')
  .map(d => ({
    id: d.id,
    category: d.category,
    titleDa: d.nameDa ?? '',
    titleEn: d.nameEn ?? '',
    iconName: d.iconName ?? '',
    author: d.author as string,
    timeDa: d.timeDa as string,
    timeEn: d.timeEn as string,
    replies: d.replies as number,
    important: d.important as boolean | undefined,
  }))

if (import.meta.vitest) {
  const { describe, it, expect } = await import('vitest')
  describe('data', () => {
    it('courses is an object with at least 1 key', () => {
      expect(Object.keys(courses).length).toBeGreaterThan(0)
    })
    it('courseList is an array with length > 0', () => {
      expect(courseList.length).toBeGreaterThan(0)
    })
    it('forums is defined and has items', () => {
      expect(forums).toBeDefined()
      expect(forums.length).toBeGreaterThan(0)
    })
    it('BACHELOR_TOTAL_ECTS equals 180', () => {
      expect(BACHELOR_TOTAL_ECTS).toBe(180)
    })
    it('dashboardDeadlines only has entries with category deadlines', () => {
      dashboardDeadlines.forEach(d => expect(d.category).toBe('deadlines'))
    })
    it('dashboardGrades only has entries with category grades', () => {
      dashboardGrades.forEach(d => expect(d.category).toBe('grades'))
    })
    it('dashboardForumPosts is an array', () => {
      expect(Array.isArray(dashboardForumPosts)).toBe(true)
    })
    it('DEFAULT_WIDGETS is an array', () => {
      expect(Array.isArray(DEFAULT_WIDGETS)).toBe(true)
    })
    it('notificationsData is an array', () => {
      expect(Array.isArray(notificationsData)).toBe(true)
    })
  })
}
