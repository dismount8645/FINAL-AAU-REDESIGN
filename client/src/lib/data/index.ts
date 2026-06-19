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
  ForumReplyData,
  OverviewEvent
} from '@/lib/types'

import { Reply, MessageSquare, Book } from 'lucide-react'
import {
  coursesJson,
  forumsJson,
  defaultEventsJson,
  messagesJson,
  notificationsJson,
  supportLocationsJson,
  supportDeskHoursJson,
  supportNotesJson,
  participantsJson,
  courseTabItemsJson,
  toolsJson
} from '@/lib/mocks'

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
export const courses: CoursesMap = coursesJson.reduce((acc, course) => {
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

export const courseList: CourseListItem[] = coursesJson.map(course => ({
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

export const forums: Forum[] = forumsJson as Forum[]
export const defaultEvents: CalendarEvents = defaultEventsJson as CalendarEvents
export const messagesData: MessageThread[] = messagesJson as MessageThread[]
export const notificationsData: Notification[] = notificationsJson as Notification[]
export const participantsData = participantsJson as { name: string; role: 'student' | 'teacher'; email: string }[]
export const courseTabItems = courseTabItemsJson as { key: string; label: string }[]

export const supportLocations = supportLocationsJson
export const supportDeskHours = supportDeskHoursJson
export const supportNotes = supportNotesJson

export const registryTools = toolsJson

export const todayEvents: OverviewEvent[] = [
  { time: '08:15', titleKey: 'lecture', moduleKey: 'course_1_title', location: 'Fibigerstræde 15' },
  { time: '13:00', titleKey: 'study_group', moduleKey: 'course_2_title', location: 'Kroghstræde 3' },
  { time: '23:59', titleKey: 'project_report', moduleKey: 'course_4_title' },
]
