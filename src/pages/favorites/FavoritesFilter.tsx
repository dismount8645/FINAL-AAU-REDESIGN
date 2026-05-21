import SearchInput from '@/components/ui/SearchInput'
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
          <button
            key={f.value}
            onClick={() => onTypeFilterChange(f.value)}
            className={`px-[var(--space-sm)] py-[var(--space-xs)] rounded-[var(--radius-lg)] text-sm font-medium transition-all border focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              typeFilter === f.value
                ? 'bg-primary text-white border-primary'
                : 'bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {f.label[lang]}
          </button>
        ))}
      </div>
    </div>
  )
}
