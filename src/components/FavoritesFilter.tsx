import SearchInput from '@/components/SearchInput'
import SegmentedControl from '@/components/SegmentedControl'
import type { FavoriteType } from '@/types'

const TYPE_FILTERS: { label: Record<'da' | 'en', string>; value: FavoriteType | 'all' }[] = [
  { label: { da: 'Alle', en: 'All' }, value: 'all' },
  { label: { da: 'Kurser', en: 'Courses' }, value: 'course' },
  { label: { da: 'Værktøjer', en: 'Tools' }, value: 'tool' },
  { label: { da: 'Filer', en: 'Files' }, value: 'file' },
  { label: { da: 'Fora', en: 'Forums' }, value: 'forum' },
  { label: { da: 'Links', en: 'Links' }, value: 'link' },
]

interface FavoritesFilterProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  typeFilter: FavoriteType | 'all'
  onTypeFilterChange: (val: FavoriteType | 'all') => void
  lang: 'da' | 'en'
  t: (key: string) => string
}

export default function FavoritesFilter({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  lang,
  t,
}: FavoritesFilterProps) {
  const options = TYPE_FILTERS.map((f) => ({
    value: f.value,
    label: f.label[lang],
  }))

  return (
    <div className="flex flex-col md:flex-row gap-[var(--space-md)] items-stretch md:items-center">
      <div className="flex-1">
        <SearchInput
          placeholder={t('search_favorites_placeholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
        />
      </div>
      <div className="md:w-[480px] max-w-full">
        <SegmentedControl
          options={options}
          value={typeFilter}
          onChange={(val) => onTypeFilterChange(val as FavoriteType | 'all')}
          className="!my-0"
        />
      </div>
    </div>
  )
}
