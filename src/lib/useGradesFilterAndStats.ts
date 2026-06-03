import { useState, useMemo } from 'react';
import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { GradeRecord } from '@/components/gradesTypes';

export interface UseGradesFilterAndStatsOptions {
  gradesData: GradeRecord[]
  localize: <T extends object>(obj: T, key?: string) => string
}

export function useGradesFilterAndStats({ gradesData, localize }: UseGradesFilterAndStatsOptions) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSemester, setSelectedSemester] = useState<string>('all')

  const gradedRecords = useMemo(() => gradesData.filter(g => g.grade !== null), [gradesData])

  const gpa = useMemo(() => {
    if (gradedRecords.length === 0) return 0
    const totalWeighted = gradedRecords.reduce((sum, r) => sum + (r.grade || 0) * r.ects, 0)
    const totalEcts = gradedRecords.reduce((sum, r) => sum + r.ects, 0)
    return parseFloat((totalWeighted / totalEcts).toFixed(2))
  }, [gradedRecords])

  const completedEcts = useMemo(() => {
    return gradedRecords.reduce((sum, r) => sum + r.ects, 0)
  }, [gradedRecords])

  const semesterOptions = useMemo(() => {
    const list = gradesData.map(g => localize(g, 'semester'))
    return ['all', ...Array.from(new Set(list))]
  }, [gradesData, localize])

  const filteredRecords = useMemo(() => {
    return gradesData.filter(r => {
      const sem = localize(r, 'semester')
      const matchesSemester = selectedSemester === 'all' || sem === selectedSemester

      const title = localize(r, 'title')
      const matchesSearch = searchQuery.trim() === '' ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.instructor.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSemester && matchesSearch
    })
  }, [gradesData, searchQuery, selectedSemester, localize])

  return {
    searchQuery,
    setSearchQuery,
    selectedSemester,
    setSelectedSemester,
    gpa,
    completedEcts,
    semesterOptions,
    filteredRecords,
    gradedCount: gradedRecords.length,
    totalCount: gradesData.length
  }
}

const mockGrades: GradeRecord[] = [
  {
    id: 1,
    code: 'CS101',
    titleDa: 'Datalogi 101',
    titleEn: 'Computer Science 101',
    grade: 10,
    ects: 10,
    semesterDa: 'Efterår 2023',
    semesterEn: 'Autumn 2023',
    examDate: '2023-12-20',
    examTypeDa: 'Skriftlig',
    examTypeEn: 'Written',
    feedbackDa: 'Godt',
    feedbackEn: 'Good',
    instructor: 'John Doe',
  },
  {
    id: 2,
    code: 'MATH201',
    titleDa: 'Matematik 201',
    titleEn: 'Mathematics 201',
    grade: 7,
    ects: 5,
    semesterDa: 'Efterår 2023',
    semesterEn: 'Autumn 2023',
    examDate: '2023-12-22',
    examTypeDa: 'Skriftlig',
    examTypeEn: 'Written',
    feedbackDa: 'Udmærket',
    feedbackEn: 'Decent',
    instructor: 'Jane Smith',
  },
  {
    id: 3,
    code: 'ENG301',
    titleDa: 'Engelsk 301',
    titleEn: 'English 301',
    grade: null,
    ects: 15,
    semesterDa: 'Forår 2024',
    semesterEn: 'Spring 2024',
    examDate: 'TBA',
    examTypeDa: 'Mundtlig',
    examTypeEn: 'Oral',
    feedbackDa: 'TBA',
    feedbackEn: 'TBA',
    instructor: 'Bob Johnson',
  },
]

const mockLocalize = <T extends object>(obj: T, key?: string): string => {
  const typedObj = obj as any
  if (key === 'title') return typedObj.titleEn
  if (key === 'semester') return typedObj.semesterEn
  return ''
}

if (import.meta.vitest) {
  describe('useGradesFilterAndStats', () => {
    it('computes stats correctly', () => {
      const { result } = renderHook(() =>
        useGradesFilterAndStats({ gradesData: mockGrades, localize: mockLocalize })
      )
  
      expect(result.current.totalCount).toBe(3)
      expect(result.current.gradedCount).toBe(2)
      // CS101: 10 grade * 10 ECTS = 100
      // MATH201: 7 grade * 5 ECTS = 35
      // Total weighted: 135
      // Total ECTS: 15
      // GPA = 135 / 15 = 9.00
      expect(result.current.gpa).toBe(9.00)
      expect(result.current.completedEcts).toBe(15)
      expect(result.current.semesterOptions).toEqual(['all', 'Autumn 2023', 'Spring 2024'])
    })
  
    it('filters by search query and semester', () => {
      const { result } = renderHook(() =>
        useGradesFilterAndStats({ gradesData: mockGrades, localize: mockLocalize })
      )
  
      // Initial state
      expect(result.current.filteredRecords.length).toBe(3)
  
      // Filter by search query
      act(() => {
        result.current.setSearchQuery('Math')
      })
      expect(result.current.filteredRecords.length).toBe(1)
      expect(result.current.filteredRecords[0].code).toBe('MATH201')
  
      // Reset search, filter by semester
      act(() => {
        result.current.setSearchQuery('')
        result.current.setSelectedSemester('Spring 2024')
      })
      expect(result.current.filteredRecords.length).toBe(1)
      expect(result.current.filteredRecords[0].code).toBe('ENG301')
    })
  })
}
