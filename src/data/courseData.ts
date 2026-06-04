import type { CourseItem } from '@/lib/types'
import courseDataJson from '@/data/courseData.json'

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

export const courseData = courseDataJson.rawCourseData as unknown as Record<number, CourseRaw>

export const participantsData = courseDataJson.participantsData as { name: string; role: 'student' | 'teacher' }[]

export const courseTabItems = courseDataJson.courseTabItems as { key: string; label: string }[]

