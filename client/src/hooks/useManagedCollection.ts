import { useState, useMemo, useCallback, type MouseEvent } from 'react'
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
  const [view, setView] = useState<'active' | 'archive'>('active')
  const [items, setItems] = useState<T[]>(initialItems)

  const archiveItem = useCallback((id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setItems(prev => prev.map(i => i.id === id ? { ...i, archived: true } : i))
  }, [])

  const restoreItem = useCallback((id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setItems(prev => prev.map(i => i.id === id ? { ...i, archived: false } : i))
  }, [])

  const archivableFiltered = useMemo(() =>
    items.filter(i => view === 'active' ? !i.archived : i.archived),
    [items, view]
  )

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
