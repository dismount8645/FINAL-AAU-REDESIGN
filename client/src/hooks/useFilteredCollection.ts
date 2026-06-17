import { useState, useMemo } from 'react'
/**
 * Configuration for useFilteredCollection.
 *
 * @template T  The item type in the collection.
 */
export interface FilteredCollectionConfig<T> {
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


