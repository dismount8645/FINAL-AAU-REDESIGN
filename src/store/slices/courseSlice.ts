import type { StateCreator } from 'zustand';
import type { AppState } from '../index';
import { courseList as initialCourses } from '@/data/mockData';
import type { CourseListItem, CalendarEvents } from '@/lib/types';

export interface CourseWithStatus extends CourseListItem {
  status: 'active' | 'inactive' | 'upcoming'
  progress?: number
}

export interface CourseSlice {
  courses: CourseWithStatus[]
  toggleStar: (courseId: number) => void

  courseProgress: Record<string | number, number[]>
  toggleCourseItem: (courseId: string | number, itemId: number) => void
  getCourseProgress: (courseId: string | number, totalItems: number) => number

  calendarEvents: CalendarEvents
  updateCalendarEvents: (events: CalendarEvents) => void
}

function buildCourses(): CourseWithStatus[] {
  return initialCourses.map(course => ({
    ...course,
    status: course.tab === 'finished' ? 'inactive' : (course.tab === 'upcoming' ? 'upcoming' : 'active'),
  }))
}

export const createCourseSlice: StateCreator<AppState, [], [], CourseSlice> = (set, get) => ({
  courses: buildCourses(),
  toggleStar: (courseId) => {
    const { toggleFavorite } = get()
    toggleFavorite('course', courseId)
  },

  courseProgress: {},
  toggleCourseItem: (courseId, itemId) => {
    const { courseProgress } = get()
    const current = courseProgress[courseId] || []
    const updated = current.includes(itemId)
      ? current.filter((i) => i !== itemId)
      : [...current, itemId]
    set({ courseProgress: { ...courseProgress, [courseId]: updated } })
  },
  getCourseProgress: (courseId, totalItems) => {
    const { courseProgress } = get()
    const completed = (courseProgress[courseId] || []).length
    return totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0
  },

  calendarEvents: {},
  updateCalendarEvents: (events) => {
    set({ calendarEvents: events })
  },
})
