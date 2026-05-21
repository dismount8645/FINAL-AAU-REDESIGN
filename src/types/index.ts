export interface CourseItem {
  id: number;
  type: 'pdf' | 'video' | 'link' | 'assignment';
  title: string;
  titleEn: string;
  size?: string;
  duration?: string;
  deadline?: string;
  deadlineEn?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  titleEn: string;
  items: CourseItem[];
}

export interface NextAssignment {
  title: string;
  titleEn: string;
  deadline: string;
  deadlineEn: string;
  submissionId: string;
}

export interface CourseData {
  title: string;
  titleEn: string;
  code: string;
  professor: string;
  email: string;
  img: string;
  semester: string;
  campus: string;
  nextAssignment?: NextAssignment;
  sections: CourseSection[];
  group?: string;
  description?: string;
}

export interface CourseListItem {
  id: number;
  title: string;
  titleEn: string;
  label: string;
  labelEn: string;
  img: string;
  color?: string;
  tab?: string;
  code?: string;
}

export interface Forum {
  id: number;
  title: string;
  titleEn: string;
  label: string;
  labelEn: string;
  img: string;
  color: string;
}

export interface CalendarEvent {
  id: number;
  titleDa?: string;
  titleEn?: string;
  title?: string;
  color: string;
  location: string;
  time: string;
  host: string;
}

export type CalendarEvents = Record<string, CalendarEvent>;

export interface Message {
  id: number;
  type: 'in' | 'out';
  textDa: string;
  textEn: string;
}

export interface MessageThread {
  id: number;
  name?: string;
  nameDa?: string;
  nameEn?: string;
  roleDa: string;
  roleEn: string;
  msgDa: string;
  msgEn: string;
  timeDa: string;
  timeEn: string;
  unread: boolean;
  messages: Message[];
}

export interface Notification {
  id: number;
  type: string;
  textDa: string;
  textEn: string;
  dateDa: string;
  dateEn: string;
  isRead: boolean;
  courseDa: string;
  courseEn: string;
  contentDa: string;
  contentEn: string;
  link: string;
}

export interface WidgetConfig {
  allowedSpans: number[];
  tabletSpan?: number;
  rowSpan?: number;
}

export type WidgetConfigMap = Record<string, WidgetConfig>;

export interface Widget {
  id: string;
  span: number;
  rowSpan?: number;
  x?: number;
  y?: number;
  visible: boolean;
  [key: string]: unknown;
}

export type CoursesMap = Record<number, CourseData>;

export type FavoriteType = 'course' | 'tool' | 'file' | 'forum' | 'link'

export interface FavoriteItem {
  id: string
  type: FavoriteType
  entityId: number
  addedAt: number
  order: number
}

export interface WidgetProps {
  span: number;
  isEditing: boolean;
}

export interface SupportFormData {
  subject: string
  description: string
  email?: string
}

export interface SubmissionData {
  courseId?: string
  assignmentId?: string
  files?: string[]
  comment?: string
}

export interface SettingsData {
  language?: string
  theme?: string
  notifications?: Record<string, boolean>
  quietHours?: { start?: string; end?: string }
  forumPreferences?: Record<string, string>
}
