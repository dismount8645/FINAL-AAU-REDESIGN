import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LessonItem from '@/components/LessonItem'

describe('LessonItem', () => {
  it('renders title', () => {
    render(<LessonItem title="Lesson" />)
    expect(screen.getByText('Lesson')).toBeInTheDocument()
  })

  it.each(['pdf', 'video', 'link', 'assignment', 'file'] as const)('renders type "%s" with correct icon', (type) => {
    const { container } = render(<LessonItem title="Lesson" type={type} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('falls back to file icon for invalid type', () => {
    const { container } = render(<LessonItem title="Lesson" type={'unknown' as any} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders completed state', () => {
    const { container } = render(<LessonItem title="Lesson" completed />)
    expect(container.querySelector('.lesson-item__checkbox svg')).toBeInTheDocument()
  })

  it('does not render check when not completed (by default)', () => {
    const { container } = render(<LessonItem title="Lesson" />)
    // The check icon for hover effect is present but has opacity-0
    const checkIcon = container.querySelector('.lucide-check')
    expect(checkIcon).toHaveClass('opacity-0')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<LessonItem title="Lesson" onClick={onClick} />)
    fireEvent.click(screen.getByText('Lesson').closest('div')!)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle when checkbox area is clicked', () => {
    const onToggle = vi.fn()
    const { container } = render(<LessonItem title="Lesson" onToggle={onToggle} />)
    const checkbox = container.querySelector('.lesson-item__checkbox')!
    fireEvent.click(checkbox)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when checkbox is clicked', () => {
    const onClick = vi.fn()
    const onToggle = vi.fn()
    const { container } = render(<LessonItem title="Lesson" onClick={onClick} onToggle={onToggle} />)
    const checkbox = container.querySelector('.lesson-item__checkbox')!
    fireEvent.click(checkbox)
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders metadata text', () => {
    render(<LessonItem title="Lesson" metadata="3 pages" />)
    expect(screen.getByText('3 pages')).toBeInTheDocument()
  })

  it('handles isAutomatic prop', () => {
    const onToggle = vi.fn()
    const { container } = render(<LessonItem title="Lesson" isAutomatic onToggle={onToggle} />)
    const checkbox = container.querySelector('.lesson-item__checkbox')!
    expect(checkbox).toBeDisabled()
    expect(checkbox).toHaveClass('border-dashed')
    
    fireEvent.click(checkbox)
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('clicking checkbox without onToggle does not crash', () => {
    const { container } = render(<LessonItem title="Lesson" />)
    const checkbox = container.querySelector('.lesson-item__checkbox')!
    fireEvent.click(checkbox)
    expect(container.querySelector('.lesson-item__checkbox')).toBeInTheDocument()
  })
})
