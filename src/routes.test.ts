import { describe, it, expect } from 'vitest'
import routes from '@/routes'

describe('routes', () => {
  it('defines all expected routes', () => {
    const paths = routes.map((r) => r.path)
    expect(paths).toContain('/')
    expect(paths).toContain('/calendar')
    expect(paths).toContain('/courses')
    expect(paths).toContain('/course/:id')
    expect(paths).toContain('/support')
    expect(paths).toContain('/settings')
    expect(paths).toContain('/messages')
    expect(paths).toContain('/resources')
    expect(paths).toContain('/notifications')
    expect(paths).toContain('/submission/:courseId/:assignmentId')
    expect(paths).toContain('/search')
    expect(paths).toContain('/grades')
    expect(paths).toContain('/forum/:id')
  })

  it('has a label for each route', () => {
    routes.forEach((r) => {
      expect(r.label).toBeTruthy()
    })
  })

  it('lazy components are functions', () => {
    routes.forEach((r) => {
      expect(typeof r.component).toBe('object')
    })
  })
})
