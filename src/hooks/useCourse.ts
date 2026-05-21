import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { courses } from '@/data/mockData'
import type { CourseData } from '@/types'
import { storage } from '@/utils/storage'

interface UseCourseReturn {
  data: CourseData | undefined
  completedItems: number[]
  toggleItem: (itemId: number) => void
  totalItems: number
  progress: number
}

export function useCourse(courseId: string | number): UseCourseReturn {
  const navigate = useNavigate()
  const data = (courses as Record<string | number, CourseData>)[courseId]

  const [completedItems, setCompletedItems] = useState<number[]>(() => {
    return storage.get(`courseProgress_${courseId}`, [])
  })

  useEffect(() => {
    if (!data) navigate('/courses')
  }, [courseId, data, navigate])

  useEffect(() => {
    if (data) {
      storage.set(`courseProgress_${courseId}`, completedItems)
    }
  }, [completedItems, courseId, data])

  const toggleItem = useCallback((itemId: number) => {
    setCompletedItems((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    )
  }, [])

  const totalItems = data
    ? data.sections.reduce((acc: number, section) => acc + section.items.length, 0)
    : 0

  const progress = totalItems > 0
    ? Math.round((completedItems.length / totalItems) * 100)
    : 0

  return { data, completedItems, toggleItem, totalItems, progress }
}
