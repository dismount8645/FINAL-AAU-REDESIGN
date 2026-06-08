import { FileText } from 'lucide-react';
import { MemoryRouter } from 'react-router-dom';
import GradesOverview from '@/components/Grades/GradesOverview';
import GradeRow from '@/components/Grades/GradeRow';

import { Card } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import { Heading, SearchInput } from '@/components/ui';
import Select from '@/components/ui/Select';
import PageLayout from '@/components/Layout/PageLayout';
import { BACHELOR_TOTAL_ECTS } from '@/lib/data';
import useStore from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { selectGradesStats } from '@/store/selectors';
import { translations } from '@/lib/translations';
import { useFilteredCollection } from '@/hooks';

function Grades() {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  const { gpa, completedEcts, gradedCount, totalCount } = useStore(useShallow(selectGradesStats))
  const grades = useStore(state => state.grades)

  const {
    searchQuery,
    setSearchQuery,
    activeFilter: selectedSemester,
    setActiveFilter: setSelectedSemester,
    filterOptions: semesterOptions,
    items: filteredRecords,
  } = useFilteredCollection(grades, {
    searchKeys: r => [localize(r, 'title'), r.code, r.instructor],
    filterKey:  r => localize(r, 'semester'),
    filterDefault: 'all',
    filterOptions: items => ['all', ...Array.from(new Set(items.map(r => localize(r, 'semester'))))],
  })

  return (
    <PageLayout
      className="grades-page animate-fade-in"
      gap="none"
      title={t('grades_page_title')}
      subtitle={t('grades_page_subtitle')}
    >
      <div className="container pb-[var(--space-2xl)] mt-[var(--space-lg)] flex flex-col gap-[var(--space-lg)]">
        <GradesOverview
          gpa={gpa}
          completedEcts={completedEcts}
          totalPossibleEcts={BACHELOR_TOTAL_ECTS}
          gradedCount={gradedCount}
          totalCount={totalCount}
        />

        <Card className="p-0">
          <div className="border-b border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-[var(--space-md)] py-[var(--space-md)] px-[var(--space-lg)]">
            <Heading level={3} className="mb-0 text-lg font-bold text-main">
              {t('grade_transcripts')}
            </Heading>

            <div className="flex flex-col sm:flex-row items-stretch gap-[var(--space-sm)] shrink-0">
              <div className="min-w-[200px]">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={t('search_grades_placeholder')}
                  onClear={() => setSearchQuery('')}
                />
              </div>

              <label htmlFor="semester-filter" className="sr-only">{t('filter')}</label>
              <Select
                id="semester-filter"
                value={selectedSemester ?? 'all'}
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

          <Card.Body className="p-0">
            {filteredRecords.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredRecords.map((record) => (
                  <GradeRow key={record.id} record={record} />
                ))}
              </div>
            ) : (
              <div className="py-[var(--space-2xl)] text-center">
                <EmptyState
                  icon={FileText}
                  title={t('no_search_results')}
                  description={t('no_favorites_match')}
                />
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </PageLayout>
  )
}

export default Grades

let mockNavigate: ReturnType<typeof vi.fn>
if (import.meta.vitest) {
  mockNavigate = vi.fn()
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    }
  })

  const renderGrades = (lang: 'da' | 'en' = 'da') => {
    useStore.setState({
      lang,
      t: (key: string) => {
        const val = (translations as any)[lang]?.[key]
        return typeof val === 'string' ? val : key
      },
    })
    return render(
      <MemoryRouter>
        <Grades />
      </MemoryRouter>
    )
  }
  describe('Grades', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders in Danish', () => {
      renderGrades('da')
      expect(screen.getByText(/Karakterer/i)).toBeInTheDocument()
      expect(screen.getByText(/Vægtet GSN/i)).toBeInTheDocument()
    })

    it('renders in English', () => {
      renderGrades('en')
      expect(screen.getByText(/Grades/i)).toBeInTheDocument()
      expect(screen.getByText(/Weighted GPA/i)).toBeInTheDocument()
    })

    it('triggers searchKeys when typing in search', () => {
      renderGrades('da')
      const searchInput = screen.getByPlaceholderText(/søg/i)
      fireEvent.change(searchInput, { target: { value: 'Digital' } })
      expect(screen.getByText(/Digital Design og Kommunikation/)).toBeInTheDocument()
    })

    it('triggers filterKey when changing semester', () => {
      renderGrades('da')
      const select = screen.getByLabelText('Filter')
      fireEvent.change(select, { target: { value: 'Forår 2024' } })
      expect(screen.getByText(/Digital Design og Kommunikation/)).toBeInTheDocument()
    })

    it('shows empty state when search yields no results', () => {
      renderGrades('da')
      const searchInput = screen.getByPlaceholderText(/søg/i)
      fireEvent.change(searchInput, { target: { value: 'ZZZZNONEXISTENT' } })
      expect(screen.getByText('Ingen resultater')).toBeInTheDocument()
    })
  })
}
