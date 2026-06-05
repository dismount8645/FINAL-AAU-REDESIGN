import { memo } from 'react';


import { SearchInput } from '@/components/ui';
import { Heading } from '@/components/ui';
import useStore from '@/store';
import Select from '@/components/ui/Select';

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
  const t = useStore(state => state.t)

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
        <Select
          id="semester-filter"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="sm:w-[180px]"
        >
          {semesterOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'all' 
                ? t('all_semesters') 
                : opt}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}

export default memo(GradesFilter)


if (import.meta.vitest) {
  const mockSetSearchQuery = vi.fn()
  const mockSetSelectedSemester = vi.fn()
  const semesterOptions = ['all', '2024 Fall', '2025 Spring']
  
  const renderFilter = (searchQuery = '', selectedSemester = 'all') => {
    return render(
      <GradesFilter
        searchQuery={searchQuery}
        setSearchQuery={mockSetSearchQuery}
        selectedSemester={selectedSemester}
        setSelectedSemester={mockSetSelectedSemester}
        semesterOptions={semesterOptions}
      />
    )
  }
  beforeEach(() => {
    vi.clearAllMocks()
    useStore.setState({ lang: 'da' })
  })

  it('renders heading with translated title', () => {
    renderFilter()
    expect(screen.getByText('Karakterblade og Eksamensbevis')).toBeInTheDocument()
  })
  
  it('renders search input with placeholder', () => {
    renderFilter()
    const input = screen.getByPlaceholderText('Søg efter mængde, kode...')
    expect(input).toBeInTheDocument()
  })
  
  it('calls setSearchQuery on search input change', () => {
    renderFilter()
    const input = screen.getByPlaceholderText('Søg efter mængde, kode...')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(mockSetSearchQuery).toHaveBeenCalledWith('test')
  })
  
  it('renders semester filter select with options', () => {
    renderFilter()
    const select = screen.getByLabelText('Filter')
    expect(select).toBeInTheDocument()
  })
  
  it('renders semester filter options', () => {
    renderFilter()
    const allOption = screen.getByText('Alle semestre')
    expect(allOption).toBeInTheDocument()
  })

  it('calls setSearchQuery on clear button click', () => {
    renderFilter('test')
    const clearBtn = screen.getByLabelText('Clear search')
    fireEvent.click(clearBtn)
    expect(mockSetSearchQuery).toHaveBeenCalledWith('')
  })

  it('renders non-all semester options without translation', () => {
    renderFilter()
    expect(screen.getByText('2024 Fall')).toBeInTheDocument()
    expect(screen.getByText('2025 Spring')).toBeInTheDocument()
  })

  it('calls setSelectedSemester when select changes', () => {
    renderFilter()
    const select = screen.getByLabelText('Filter')
    fireEvent.change(select, { target: { value: '2025 Spring' } })
    expect(mockSetSelectedSemester).toHaveBeenCalledWith('2025 Spring')
  })
}
