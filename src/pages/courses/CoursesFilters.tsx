import { useState, useRef, useEffect, memo } from 'react'
import { Filter, ArrowDownZA, ArrowUpAZ } from 'lucide-react'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import useStore from '@/store/useStore'

interface CoursesFiltersProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (val: 'asc' | 'desc') => void
  sortBy: 'alpha' | 'status'
  setSortBy: (val: 'alpha' | 'status') => void
  activeFilter: string | null
  setActiveFilter: (val: string | null) => void
  labelFilters: string[]
}

function CoursesFilters({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  sortBy,
  setSortBy,
  activeFilter,
  setActiveFilter,
  labelFilters,
}: CoursesFiltersProps) {
  const t = useStore((state) => state.t)
  const [showFilters, setShowFilters] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilters(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allBtnClass = !activeFilter ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-bg-hover'
  const getLabelBtnClass = (label: string) => activeFilter === label ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-bg-hover'

  const handleSortToggle = () => {
    if (sortBy === 'status') {
      if (sortOrder === 'asc') {
        setSortOrder('desc')
      } else {
        setSortBy('alpha')
        setSortOrder('asc')
      }
    } else {
      if (sortOrder === 'asc') {
        setSortOrder('desc')
      } else {
        setSortBy('status')
        setSortOrder('asc')
      }
    }
  }

  return (
    <Stack className="flex-col md:flex-row md:items-center gap-md">
      <SearchInput
        placeholder={t('search_courses')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
        className="w-full md:min-w-[200px] md:max-w-[320px]"
      />
      <Stack direction="row" gap="xs" className="flex items-center gap-xs">
        <div className="relative flex-1" ref={filterRef}>
          <Button
            variant={activeFilter ? 'primary' : 'ghost'}
            size="sm"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            {t('filter')}
          </Button>
          {showFilters && (
            <div className="absolute top-full right-0 mt-xs min-w-[200px] bg-bg-elevated border border-border rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] z-50 p-sm animate-slide-in">
              <Stack gap="2xs">
                <button
                  type="button"
                  className={`w-full text-left px-md py-sm rounded-[var(--radius-md)] text-sm transition-colors ${allBtnClass}`}
                  onClick={() => {
                    setActiveFilter(null)
                    setShowFilters(false)
                  }}
                >
                  {t('all')}
                </button>
                {labelFilters.map(label => (
                  <button
                    key={label}
                    type="button"
                    className={`w-full text-left px-md py-sm rounded-[var(--radius-md)] text-sm transition-colors ${getLabelBtnClass(label)}`}
                    onClick={() => {
                      setActiveFilter(label)
                      setShowFilters(false)
                    }}
                  >
                    {label}
                  </button>
                ))}
              </Stack>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={sortOrder === 'asc' ? ArrowDownZA : ArrowUpAZ}
          className="flex-1"
          onClick={handleSortToggle}
        >
          {sortBy === 'status'
            ? (sortOrder === 'asc' ? t('active_first') : t('inactive_first'))
            : (sortOrder === 'asc' ? 'A-Å' : 'Å-A')}
        </Button>
      </Stack>
    </Stack>
  )
}

export default memo(CoursesFilters)
