import { api } from '@/api/index'
import { courses, courseList } from '@/data/mockData'
import type { CourseData, CourseListItem, CoursesMap } from '@/types'

export const coursesApi = {
  getAll() {
    return api.get<CourseListItem[]>('/courses', () =>
      Object.values(courseList)
    )
  },

  getById(id: number) {
    return api.get<CourseData>(`/courses/${id}`, () => {
      const course = courses[id]
      if (!course) throw new Error(`Course ${id} not found`)
      return course
    })
  },

  getAllMap() {
    return api.get<CoursesMap>('/courses/map', () => courses)
  },

  getSections(courseId: number) {
    return api.get<CourseData['sections']>(`/courses/${courseId}/sections`, () => {
      const course = courses[courseId]
      if (!course) throw new Error(`Course ${courseId} not found`)
      return course.sections
    })
  },
}
