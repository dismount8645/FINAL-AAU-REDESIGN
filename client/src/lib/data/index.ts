import type {
  CoursesMap,
  CourseListItem,
  CourseSection,
  Forum,
  CalendarEvents,
  MessageThread,
  Notification,
  ForumActivity,
  ForumPostData,
  ForumReplyData
} from '@/lib/types'

import { Reply, MessageSquare, Book } from 'lucide-react'
import { registryJson } from '@/lib/mocks/registry'

// ── Mock forum data ──────────────────────────────────────────────────────────
export const mockForumActivities: ForumActivity[] = [
  {
    id: 1,
    titleDa: 'Spørgsmål til teksten',
    titleEn: 'Questions regarding the text',
    subtitle: 'Morten Jensen',
    snippetDa: 'Jeg har lagt de nye slides op nu...',
    snippetEn: 'I have uploaded the new slides now...',
    icon: Reply,
    color: 'var(--color-reply-icon, var(--color-primary))'
  },
  {
    id: 2,
    titleDa: 'Gruppesøgning',
    titleEn: 'Group Search',
    subtitle: 'Lærke Nielsen',
    snippetDa: 'Er der nogen der mangler en gruppe?',
    snippetEn: 'Is anyone missing a group?',
    icon: MessageSquare,
    color: 'var(--color-accent)'
  },
  {
    id: 3,
    titleDa: 'Pensumliste',
    titleEn: 'Syllabus',
    subtitle: 'Anders Nielsen',
    snippetDa: 'Husk at tjekke den opdaterede liste.',
    snippetEn: 'Remember to check the updated list.',
    icon: Book,
    color: 'var(--color-success)'
  },
]

export const mockForumPosts: ForumPostData[] = [
  { id: 1, titleDa: 'Spørgsmål til litteraturen i uge 2', titleEn: 'Questions regarding literature week 2', author: 'Mads Mikkelsen', timeDa: 'For 2 timer siden', timeEn: '2 hours ago', replies: 4, contentDa: 'Hej alle sammen. Jeg sidder og læser pensum for uge 2 og har et par spørgsmål til teksten. Kan nogen hjælpe mig med at forstå afsnittet om brugercentreret design?', contentEn: 'Hi everyone. I am reading the curriculum for week 2 and have a few questions about the text. Can anyone help me understand the section on user-centered design?' },
  { id: 2, titleDa: 'Søger gruppe til projekt 1', titleEn: 'Looking for group for project 1', author: 'Lærke Poulsen', timeDa: 'I går kl. 14:30', timeEn: 'Yesterday at 14:30', replies: 12, contentDa: 'Jeg søger 2-3 personer til projekt 1. Jeg har erfaring med HTML/CSS og lidt JavaScript. Skriv endelig hvis I mangler en gruppe.', contentEn: 'I am looking for 2-3 people for project 1. I have experience with HTML/CSS and some JavaScript. Please write if you are looking for a group.' },
  { id: 3, titleDa: 'Ændring af lokale til næste forelæsning', titleEn: 'Room change for next lecture', author: 'Morten Jensen', timeDa: 'I mandags', timeEn: 'Last Monday', replies: 0, contentDa: 'Kære studerende. Næste forelæsning er flyttet til lokale 4.109 på grund af tekniske problemer i det oprindelige lokale.', contentEn: 'Dear students. The next lecture has been moved to room 4.109 due to technical issues in the original room.', important: true },
]

export const mockForumReplies: ForumReplyData[] = [
  { id: 1, author: 'Anders Nielsen', roleDa: 'Studerende', roleEn: 'Student', timeDa: 'For 1 time siden', timeEn: '1 hour ago', contentDa: 'Godt spørgsmål! Jeg har også tænkt over det samme. Prøv at kigge på side 42 i pensumbogen.', contentEn: 'Great question! I have been thinking about the same thing. Try looking at page 42 in the textbook.' },
  { id: 2, author: 'Mette Jensen', roleDa: 'Studerende', roleEn: 'Student', timeDa: 'For 45 minutter siden', timeEn: '45 minutes ago', contentDa: 'Jeg kan også anbefale at se videoen fra uge 1 - den forklarer konceptet rigtig godt.', contentEn: 'I also recommend watching the video from week 1 - it explains the concept really well.' },
]

export const mockDashboardDeadlines = [
  { id: 204, category: 'deadlines', titleDa: 'To-Do App', titleEn: 'To-Do App', iconName: 'FileText', dateKey: 'deadline_monday', courseId: 2, deadlineHoursFromNow: 48 },
  { id: 105, category: 'deadlines', titleDa: 'Designskitse', titleEn: 'Design Sketch', iconName: 'PenTool', dateKey: 'deadline_friday', courseId: 1, deadlineHoursFromNow: 96 },
  { id: 303, category: 'deadlines', titleDa: 'Analyseopgave', titleEn: 'Analysis Assignment', iconName: 'FileText', dateKey: 'course_deadline_in_7_days', courseId: 3, deadlineHoursFromNow: 168 }
]

// ── Registry exports ─────────────────────────────────────────────────────────
interface CourseRaw {
  title: string
  titleEn: string
  code: string
  professor: string
  email: string
  img: string
  sections: CourseSection[]
}

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
export const participantsData = registryJson.participantsData as { name: string; role: 'student' | 'teacher'; email: string }[]
export const courseTabItems = registryJson.courseTabItems as { key: string; label: string }[]

export const supportLocations = registryJson.supportLocations
export const supportDeskHours = registryJson.supportDeskHours
export const supportNotes = registryJson.supportNotes

export const registryTools = registryJson.tools

if (import.meta.vitest) {
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

    it('notificationsData is an array', () => {
      expect(Array.isArray(notificationsData)).toBe(true)
    })
  })
}
