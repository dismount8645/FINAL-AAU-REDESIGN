import { type MouseEvent } from 'react'
import { useArchivableCollection } from './useArchivableCollection'
import { useFilteredCollection, type FilteredCollectionConfig } from './useFilteredCollection'

interface ManagedCollectionConfig<T> extends FilteredCollectionConfig<T> {
  searchKeys: (item: T) => string[]
}

interface ManagedCollectionResult<T> {
  items: T[]
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  view: 'active' | 'archive'
  setView: (v: 'active' | 'archive') => void
  archiveItem: (id: number, e: MouseEvent) => void
  restoreItem: (id: number, e: MouseEvent) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  activeFilter: string | null
  setActiveFilter: (f: string | null) => void
  filterOptions: string[]
  sortDirection: 'asc' | 'desc'
  setSortDirection: (d: 'asc' | 'desc') => void
  filteredItems: T[]
}

export function useManagedCollection<T extends { id: number; archived: boolean }>(
  initialItems: T[],
  config: ManagedCollectionConfig<T>
): ManagedCollectionResult<T> {
  const {
    items,
    setItems,
    view,
    setView,
    filtered: archivableFiltered,
    archiveItem,
    restoreItem,
  } = useArchivableCollection<T>(initialItems)

  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filterOptions,
    sortDirection,
    setSortDirection,
    items: filteredItems,
  } = useFilteredCollection(archivableFiltered, config)

  return {
    items,
    setItems,
    view,
    setView,
    archiveItem,
    restoreItem,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filterOptions,
    sortDirection,
    setSortDirection,
    filteredItems,
  }
}
