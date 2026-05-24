import SearchInput from '@/components/ui/SearchInput'
import Button from '@/components/ui/Button'
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
  return (
    <div className="flex flex-col md:flex-row gap-[var(--space-md)] mb-[var(--space-xl)]">
      <SearchInput
        placeholder={t('search_favorites_placeholder')}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onClear={() => onSearchChange('')}
      />
      <div className="flex gap-[var(--space-sm)] flex-wrap">
        {TYPE_FILTERS.map((f) => (
          <Button
            key={f.value}
            type="button"
            variant={typeFilter === f.value ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onTypeFilterChange(f.value)}
            pill
            className="text-xs font-semibold tracking-normal"
          >
            {f.label[lang]}
          </Button>
        ))}
      </div>
    </div>
  )
}
