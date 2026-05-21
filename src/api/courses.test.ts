import { describe, it, expect } from 'vitest'
import { coursesApi } from '@/api/courses'

describe('coursesApi', () => {
  it('getAll returns course list', async () => {
    const result = await coursesApi.getAll()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('title')
  })

  it('getById returns a single course', async () => {
    const course = await coursesApi.getById(1)
    expect(course.title).toBe('Digital Design og Kommunikation')
    expect(course.sections).toBeDefined()
  })

  it('getById throws for unknown course', async () => {
    await expect(coursesApi.getById(999)).rejects.toThrow('Course 999 not found')
  })

  it('getAllMap returns courses map', async () => {
    const map = await coursesApi.getAllMap()
    expect(map[1]).toBeDefined()
    expect(map[2]).toBeDefined()
  })

  it('getSections returns sections for a course', async () => {
    const sections = await coursesApi.getSections(1)
    expect(sections).toHaveLength(2)
  })

  it('getSections throws for unknown course', async () => {
    await expect(coursesApi.getSections(999)).rejects.toThrow('Course 999 not found')
  })
})
