import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CourseResources from './CourseResources'
import useStore from '@/store/useStore'

vi.mock('@/store/useStore', () => ({
  default: vi.fn(),
}))

beforeEach(() => {
  vi.mocked(useStore).mockImplementation((selector: any) => {
    const state = { t: (key: string) => key }
    return selector(state)
  })
})

it('renders heading with translated title', () => {
  render(<CourseResources />)
  expect(screen.getByText('tab_resources')).toBeInTheDocument()
})

it('renders three list items with translated labels', () => {
  render(<CourseResources />)
  expect(screen.getByText('syllabus')).toBeInTheDocument()
  expect(screen.getByText('reading_list')).toBeInTheDocument()
  expect(screen.getByText('exam_schedule')).toBeInTheDocument()
})
