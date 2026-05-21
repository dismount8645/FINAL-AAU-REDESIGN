import { memo } from 'react'
import SearchInput from '@/components/ui/SearchInput'
import { Heading } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

interface GradesFilterProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  selectedSemester: string
  setSelectedSemester: (val: string) => void
  semesterOptions: string[]
}

function GradesFilter({
  searchQuery,
  setSearchQuery,
  selectedSemester,
  setSelectedSemester,
  semesterOptions,
}: GradesFilterProps) {
  const { t } = useStore()

  return (
    <div className="border-b border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-[var(--space-md)] py-[var(--space-md)] px-[var(--space-lg)]">
      <Heading level={3} className="mb-0 text-lg font-bold text-main">
        {t('grade_transcripts')}
      </Heading>
      
      <div className="flex flex-col sm:flex-row items-stretch gap-[var(--space-sm)] shrink-0">
        <div className="min-w-[200px]">
          <SearchInput 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_grades_placeholder')}
            onClear={() => setSearchQuery('')}
          />
        </div>
        
        <label htmlFor="semester-filter" className="sr-only">{t('filter')}</label>
        <select
          id="semester-filter"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="px-[var(--space-sm)] py-[var(--space-sm)] border border-border bg-card text-main rounded-[var(--radius-lg)] text-sm focus-visible:ring-2 focus-visible:ring-primary focus:border-primary font-medium transition-colors"
        >
          {semesterOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'all' 
                ? t('all_semesters') 
                : opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default memo(GradesFilter)
