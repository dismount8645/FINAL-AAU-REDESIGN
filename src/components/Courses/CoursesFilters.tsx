import { memo } from 'react'
import { Filter, ArrowDownZA, ArrowUpAZ } from 'lucide-react'
import { Stack } from '@/components/LayoutPrimitives'
import Button from '@/components/ui/Button'
import { SearchInput } from '@/components/FormControls'
import useStore from '@/lib/store'
import { cn } from '@/lib/utils'
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '@/components/Dropdown'

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
        <div className="relative flex-1">
          <Dropdown>
            <DropdownTrigger render={
              <Button
                variant={activeFilter ? 'primary' : 'ghost'}
                size="sm"
                icon={Filter}
              >
                {t('filter')}
              </Button>
            } />
            <DropdownContent align="end" className="min-w-[200px]">
              <DropdownItem
                onClick={() => setActiveFilter(null)}
                className={cn(
                  "cursor-pointer",
                  !activeFilter ? 'bg-primary/10 text-primary font-semibold' : ''
                )}
              >
                {t('all')}
              </DropdownItem>
              {labelFilters.map(label => (
                <DropdownItem
                  key={label}
                  onClick={() => setActiveFilter(label)}
                  className={cn(
                    "cursor-pointer",
                    activeFilter === label ? 'bg-primary/10 text-primary font-semibold' : ''
                  )}
                >
                  {label}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
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
