import { type RefObject } from 'react'
import { type LucideIcon } from 'lucide-react'

export interface StagedFile {
  name: string
  size: string
  id: string
}

export interface GradeRecord {
  id: number
  code: string
  titleDa: string
  titleEn: string
  grade: number | null
  ects: number
  semesterDa: string
  semesterEn: string
  examDate: string
  examTypeDa: string
  examTypeEn: string
  feedbackDa: string
  feedbackEn: string
  instructor: string
}

export interface ChatMessage {
  id: number
  type: 'in' | 'out'
  text: string
  timestamp?: string
}

export interface Contact {
  id: number
  name: string
  role: string
  msg: string
  time: string
  unread: boolean
  archived: boolean
  messages: ChatMessage[]
}

export interface CourseItem {
  id: number
  type: 'pdf' | 'video' | 'link' | 'assignment'
  title: string
  titleEn: string
  size?: string
  duration?: string
  deadline?: string
  deadlineEn?: string
}

export interface NotificationItem {
  id: number
  type: string
  text: string
  date: Date
  isRead: boolean
  archived: boolean
  course: string
  content: string
  link: string
}


export interface SubmissionDropzoneProps {
  onFilesAdded: (files: FileList) => void
  t: (key: string) => string
}

export interface ChatWindowProps {
  activeContact: Contact | undefined
  chatBodyRef: RefObject<HTMLDivElement>
  messageText: string
  setMessageText: (val: string) => void
  handleSend: () => void
  setShowChat: (val: boolean) => void
  t: (key: string) => string
}

// Additional interfaces from legacy types.ts
export interface CourseSection {
  id: string
  title: string
  titleEn: string
  items: CourseItem[]
}

export interface NextAssignment {
  title: string
  titleEn: string
  deadline: string
  deadlineEn: string
  submissionId: string
}

export interface CourseData {
  title: string
  titleEn: string
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
  description?: string;
}

export type CalendarEvents = Record<string, CalendarEvent>;

export interface Message {
  id: number;
  type: 'in' | 'out';
  textDa: string;
  textEn: string;
  timestamp?: string;
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
  archived?: boolean;
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
  archived?: boolean;
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

export interface ResourceTool {
  id: number
  icon: LucideIcon
  bg: string
  color: string
  titleKey?: string
  titleDa?: string
  titleEn?: string
  descDa: string
  descEn: string
  helpDa?: string
  helpEn?: string
  url: string
  sso?: boolean
}
