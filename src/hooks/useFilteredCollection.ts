import { useState, useMemo } from 'react'
/**
 * Configuration for useFilteredCollection.
 *
 * @template T  The item type in the collection.
 */
interface FilteredCollectionConfig<T> {
  /**
   * Return an array of strings to search against for each item.
   * All strings are lower-cased internally before comparison.
   */
  searchKeys: (item: T) => string[]

  /**
   * Return the filter-category string for an item (e.g. a label or semester).
   * When undefined, filter state is ignored.
   */
  filterKey?: (item: T) => string

  /**
   * The sentinel value meaning "no active filter / show all".
   * Defaults to `null`. Pass `'all'` to match the Grades convention.
   */
  filterDefault?: string | null

  /**
   * Derive the unique set of filter options from the collection.
   * When provided, the hook exposes a `filterOptions` array that
   * callers can pass to a dropdown / segmented control.
   */
  filterOptions?: (items: T[]) => string[]

  /**
   * Optional sort comparator. Receives both items and the current
   * direction so you don't have to repeat the direction flip inside.
   * When undefined the hook still exposes `sortDirection` / `setSortDirection`
   * but `sortedItems === filteredItems`.
   */
  sortComparator?: (a: T, b: T, direction: 'asc' | 'desc') => number

  /** Initial sort direction. Defaults to `'asc'`. */
  sortDefault?: 'asc' | 'desc'
}

interface FilteredCollectionResult<T> {
  // ── search ──────────────────────────────────────
  searchQuery: string
  setSearchQuery: (q: string) => void

  // ── filter ──────────────────────────────────────
  activeFilter: string | null
  setActiveFilter: (f: string | null) => void

  /** Derived option list from config.filterOptions, or [] if not provided. */
  filterOptions: string[]

  // ── sort ────────────────────────────────────────
  sortDirection: 'asc' | 'desc'
  setSortDirection: (d: 'asc' | 'desc') => void

  // ── output ──────────────────────────────────────
  /** Items that pass both the search and filter predicates, then sorted. */
  items: T[]
}

/**
 * Generic, stateful search → filter → sort pipeline.
 *
 * Usage (Grades example):
 * ```ts
 * const { searchQuery, setSearchQuery, activeFilter, setActiveFilter,
 *         filterOptions, items: filteredRecords } =
 *   useFilteredCollection(gradesData, {
 *     searchKeys: r => [localize(r,'title'), r.code, r.instructor],
 *     filterKey:  r => localize(r, 'semester'),
 *     filterDefault: 'all',
 *     filterOptions: items => ['all', ...new Set(items.map(r => localize(r,'semester')))],
 *   })
 * ```
 */
export function useFilteredCollection<T>(
  allItems: T[],
  config: FilteredCollectionConfig<T>
): FilteredCollectionResult<T> {
  const {
    searchKeys,
    filterKey,
    filterDefault = null,
    filterOptions: deriveFilterOptions,
    sortComparator,
    sortDefault = 'asc',
  } = config

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(filterDefault ?? null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(sortDefault)

  // ── derived filter option list ────────────────────────────────────────────
  const filterOptions = useMemo(
    () => (deriveFilterOptions ? deriveFilterOptions(allItems) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allItems]
  )

  // ── search + filter ───────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allItems.filter(item => {
      // search
      const matchesSearch =
        !q || searchKeys(item).some(k => k.toLowerCase().includes(q))

      // filter (skip if filterKey not configured, or if showing "all")
      const isAllFilter =
        !filterKey || activeFilter === null || activeFilter === filterDefault
      const matchesFilter =
        isAllFilter || filterKey!(item) === activeFilter

      return matchesSearch && matchesFilter
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems, searchQuery, activeFilter])

  // ── sort ──────────────────────────────────────────────────────────────────
  const sortedItems = useMemo(() => {
    if (!sortComparator) return filteredItems
    return [...filteredItems].sort((a, b) => sortComparator(a, b, sortDirection))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredItems, sortDirection])

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filterOptions,
    sortDirection,
    setSortDirection,
    items: sortedItems,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// In-file vitest suite
// ─────────────────────────────────────────────────────────────────────────────

interface SampleItem {
  id: number
  title: string
  code: string
  category: string
  weight: number
}

const SAMPLE: SampleItem[] = [
  { id: 1, title: 'Alpha Course', code: 'A001', category: 'Science', weight: 1 },
  { id: 2, title: 'Beta Course',  code: 'B002', category: 'Arts',    weight: 2 },
  { id: 3, title: 'Gamma Course', code: 'C003', category: 'Science', weight: 3 },
]

if (import.meta.vitest) {
  describe('useFilteredCollection', () => {
    const baseConfig: FilteredCollectionConfig<SampleItem> = {
      searchKeys: item => [item.title, item.code],
      filterKey:  item => item.category,
      filterDefault: null,
      filterOptions: items => Array.from(new Set(items.map(i => i.category))).sort(),
      sortComparator: (a, b, dir) =>
        dir === 'asc' ? a.weight - b.weight : b.weight - a.weight,
    }

    it('returns all items by default', () => {
      const { result } = renderHook(() => useFilteredCollection(SAMPLE, baseConfig))
      expect(result.current.items.map(i => i.id)).toEqual([1, 2, 3])
    })

    it('filters by searchQuery (title)', () => {
      const { result } = renderHook(() => useFilteredCollection(SAMPLE, baseConfig))
      act(() => { result.current.setSearchQuery('Alpha') })
      expect(result.current.items.map(i => i.id)).toEqual([1])
    })

    it('filters by searchQuery (code)', () => {
      const { result } = renderHook(() => useFilteredCollection(SAMPLE, baseConfig))
      act(() => { result.current.setSearchQuery('B002') })
      expect(result.current.items.map(i => i.id)).toEqual([2])
    })

    it('filters by activeFilter', () => {
      const { result } = renderHook(() => useFilteredCollection(SAMPLE, baseConfig))
      act(() => { result.current.setActiveFilter('Science') })
      expect(result.current.items.map(i => i.id)).toEqual([1, 3])
    })

    it('combines search and filter', () => {
      const { result } = renderHook(() => useFilteredCollection(SAMPLE, baseConfig))
      act(() => {
        result.current.setSearchQuery('Gamma')
        result.current.setActiveFilter('Science')
      })
      expect(result.current.items.map(i => i.id)).toEqual([3])
    })

    it('returns empty when nothing matches', () => {
      const { result } = renderHook(() => useFilteredCollection(SAMPLE, baseConfig))
      act(() => { result.current.setSearchQuery('ZZZNOMATCH') })
      expect(result.current.items).toEqual([])
    })

    it('sorts descending when sortDirection is desc', () => {
      const { result } = renderHook(() => useFilteredCollection(SAMPLE, baseConfig))
      act(() => { result.current.setSortDirection('desc') })
      expect(result.current.items.map(i => i.id)).toEqual([3, 2, 1])
    })

    it('exposes derived filterOptions', () => {
      const { result } = renderHook(() => useFilteredCollection(SAMPLE, baseConfig))
      expect(result.current.filterOptions).toEqual(['Arts', 'Science'])
    })

    it('works without filterKey (search-only mode)', () => {
      const cfg: FilteredCollectionConfig<SampleItem> = {
        searchKeys: item => [item.title],
      }
      const { result } = renderHook(() => useFilteredCollection(SAMPLE, cfg))
      act(() => { result.current.setSearchQuery('beta') })
      expect(result.current.items.map(i => i.id)).toEqual([2])
    })

    it('supports filterDefault all sentinel', () => {
      const cfg: FilteredCollectionConfig<SampleItem> = {
        searchKeys: item => [item.title],
        filterKey: item => item.category,
        filterDefault: 'all',
      }
      const { result } = renderHook(() => useFilteredCollection(SAMPLE, cfg))
      // 'all' is the default — everything shown
      expect(result.current.items.length).toBe(3)
      act(() => { result.current.setActiveFilter('Arts') })
      expect(result.current.items.map(i => i.id)).toEqual([2])
      // Reset to sentinel
      act(() => { result.current.setActiveFilter('all') })
      expect(result.current.items.length).toBe(3)
    })
  })
}
