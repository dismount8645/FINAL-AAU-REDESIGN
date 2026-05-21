import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCourse } from '@/hooks/useCourse'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('useCourse', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('returns course data and progress', () => {
    const { result } = renderHook(() => useCourse(1))
    expect(result.current.data).toBeDefined()
    expect(result.current.progress).toBe(0)
  })

  it('navigates to /courses if data not found', () => {
    renderHook(() => useCourse(999))
    expect(mockNavigate).toHaveBeenCalledWith('/courses')
  })

  it('toggles completion items (add and remove)', () => {
    const { result } = renderHook(() => useCourse(1))
    
    // Add
    act(() => result.current.toggleItem(101))
    expect(result.current.completedItems).toContain(101)
    expect(localStorage.getItem('courseProgress_1')).toContain('101')
    
    // Remove
    act(() => result.current.toggleItem(101))
    expect(result.current.completedItems).not.toContain(101)
  })

  it('loads progress from localStorage', () => {
    localStorage.setItem('courseProgress_1', JSON.stringify([101]))
    const { result } = renderHook(() => useCourse(1))
    expect(result.current.completedItems).toContain(101)
  })

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useCourse(1))
    // We need to know how many items are in course 1
    const total = result.current.totalItems
    act(() => result.current.toggleItem(101))
    expect(result.current.progress).toBe(Math.round((1 / total) * 100))
  })
})
