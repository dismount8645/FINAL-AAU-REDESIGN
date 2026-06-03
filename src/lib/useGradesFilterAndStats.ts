import { useState, useMemo } from 'react'
import type { GradeRecord } from '@/components/gradesTypes'

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
