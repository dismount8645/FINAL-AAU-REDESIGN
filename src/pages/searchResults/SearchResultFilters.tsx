import Button from '@/components/ui/Button'
import Stack from '@/components/ui/Stack'
import useStore from '@/store/useStore'

interface SearchResultFiltersProps {
  categories: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function SearchResultFilters({
  categories,
  activeFilter,
  onFilterChange,
}: SearchResultFiltersProps) {
  const { t } = useStore()

  return (
    <Stack
      direction="row"
      gap="sm"
      align="center"
      className="search-filters overflow-x-auto pb-xs no-scrollbar"
    >
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={activeFilter === cat ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onFilterChange(cat)}
          pill
          className={
            activeFilter !== cat
              ? 'dark:text-text-muted dark:bg-bg-highlight/30'
              : 'shadow-[var(--shadow-md)]'
          }
        >
          {cat === 'all' ? t('all') : cat}
        </Button>
      ))}
    </Stack>
  )
}
