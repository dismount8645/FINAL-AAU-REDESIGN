import { useState, useMemo } from 'react'

interface Participant {
  name: string
  role: string
}

interface UseParticipantFilterResult {
  searchQuery: string
  setSearchQuery: (val: string) => void
  roleFilter: string
  setRoleFilter: (val: string) => void
  filteredParticipants: Participant[]
}

export function useParticipantFilter(participantsData: Participant[]): UseParticipantFilterResult {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredParticipants = useMemo(() => {
    return participantsData.filter((p) => {
      if (roleFilter !== 'all' && p.role !== roleFilter) return false
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [participantsData, searchQuery, roleFilter])

  return { searchQuery, setSearchQuery, roleFilter, setRoleFilter, filteredParticipants }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest as unknown as typeof import('vitest')
  const { renderHook } = await import('@/test/test-utils')
  const { act } = await import('react')

  describe('useParticipantFilter', () => {
    const participants = [
      { name: 'Alice Andersen', role: 'student' },
      { name: 'Bob Børgesen', role: 'teacher' },
      { name: 'Charlie Christensen', role: 'student' },
      { name: 'Diana Dalsgaard', role: 'admin' },
    ]

    it('returns all participants by default', () => {
      const { result } = renderHook(() => useParticipantFilter(participants))
      expect(result.current.searchQuery).toBe('')
      expect(result.current.roleFilter).toBe('all')
      expect(result.current.filteredParticipants).toEqual(participants)
    })

    it('filters by search query case-insensitively', () => {
      const { result } = renderHook(() => useParticipantFilter(participants))
      act(() => { result.current.setSearchQuery('alice') })
      expect(result.current.filteredParticipants).toEqual([{ name: 'Alice Andersen', role: 'student' }])
    })

    it('filters by role', () => {
      const { result } = renderHook(() => useParticipantFilter(participants))
      act(() => { result.current.setRoleFilter('student') })
      expect(result.current.filteredParticipants).toEqual([
        { name: 'Alice Andersen', role: 'student' },
        { name: 'Charlie Christensen', role: 'student' },
      ])
    })

    it('combines search and role filter', () => {
      const { result } = renderHook(() => useParticipantFilter(participants))
      act(() => {
        result.current.setSearchQuery('bob')
        result.current.setRoleFilter('teacher')
      })
      expect(result.current.filteredParticipants).toEqual([{ name: 'Bob Børgesen', role: 'teacher' }])
    })

    it('returns empty when nothing matches', () => {
      const { result } = renderHook(() => useParticipantFilter(participants))
      act(() => { result.current.setSearchQuery('zzzz_nonexistent') })
      expect(result.current.filteredParticipants).toEqual([])
    })
  })
}
