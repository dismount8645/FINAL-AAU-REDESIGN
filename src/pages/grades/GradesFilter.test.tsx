import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GradesFilter from './GradesFilter'

vi.mock('@/store/useStore', () => ({
  default: (selector: any) => {
    const state = { t: (key: string) => key }
    return selector(state)
  },
}))

const mockSetSearchQuery = vi.fn()
const mockSetSelectedSemester = vi.fn()
const semesterOptions = ['all', '2024 Fall', '2025 Spring']

function renderFilter(searchQuery = '', selectedSemester = 'all') {
  return render(
    <GradesFilter
      searchQuery={searchQuery}
      setSearchQuery={mockSetSearchQuery}
      selectedSemester={selectedSemester}
      setSelectedSemester={mockSetSelectedSemester}
      semesterOptions={semesterOptions}
    />
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

it('renders heading with translated title', () => {
  renderFilter()
  expect(screen.getByText('grade_transcripts')).toBeInTheDocument()
})

it('renders search input with placeholder', () => {
  renderFilter()
  const input = screen.getByPlaceholderText('search_grades_placeholder')
  expect(input).toBeInTheDocument()
})

it('calls setSearchQuery on search input change', () => {
  renderFilter()
  const input = screen.getByPlaceholderText('search_grades_placeholder')
  fireEvent.change(input, { target: { value: 'test' } })
  expect(mockSetSearchQuery).toHaveBeenCalledWith('test')
})

it('renders semester filter select with options', () => {
  renderFilter()
  const select = screen.getByLabelText('filter')
  expect(select).toBeInTheDocument()
  expect(screen.getByRole('option', { name: 'all_semesters' })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: '2024 Fall' })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: '2025 Spring' })).toBeInTheDocument()
})

it('calls setSelectedSemester on select change', () => {
  renderFilter()
  const select = screen.getByLabelText('filter')
  fireEvent.change(select, { target: { value: '2024 Fall' } })
  expect(mockSetSelectedSemester).toHaveBeenCalledWith('2024 Fall')
})

it('renders raw option text when not "all"', () => {
  renderFilter('', '2024 Fall')
  const select = screen.getByLabelText('filter') as HTMLSelectElement
  expect(select.value).toBe('2024 Fall')
})

it('calls setSearchQuery with empty string on clear', () => {
  renderFilter('some query')
  const clearBtn = screen.getByLabelText('Clear search')
  fireEvent.click(clearBtn)
  expect(mockSetSearchQuery).toHaveBeenCalledWith('')
})
