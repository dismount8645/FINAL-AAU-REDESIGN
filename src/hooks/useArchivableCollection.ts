import { useState, useMemo, useCallback, type MouseEvent } from 'react'

interface Archivable {
  id: number
  archived: boolean
}

export function useArchivableCollection<T extends Archivable>(initialItems: T[]) {
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

  const filtered = useMemo(() =>
    items.filter(i => view === 'active' ? !i.archived : i.archived),
    [items, view]
  )

  return { items, setItems, view, setView, filtered, archiveItem, restoreItem }
}
