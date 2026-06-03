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
