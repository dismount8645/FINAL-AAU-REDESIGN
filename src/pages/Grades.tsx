import { useMemo } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import { MemoryRouter } from 'react-router-dom';
import GradesOverview from '@/components/Grades/GradesOverview';
import GradesFilter from '@/components/Grades/GradesFilter';
import GradeRow from '@/components/Grades/GradeRow';;


import { Card } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import PageLayout from '@/components/Layout/PageLayout';;
import { mockGradesData, BACHELOR_TOTAL_ECTS } from '@/lib/data';
import useStore from '@/store';
import { translations } from '@/lib/translations';
import { useFilteredCollection } from '@/hooks';

function Grades() {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  // ── stats (computed from full dataset, not filtered) ─────────────────────
  const gradedRecords = useMemo(
    () => mockGradesData.filter(g => g.grade !== null),
    []
  )
  const gpa = useMemo(() => {
    if (gradedRecords.length === 0) return 0
    const totalWeighted = gradedRecords.reduce((sum, r) => sum + (r.grade || 0) * r.ects, 0)
    const totalEcts     = gradedRecords.reduce((sum, r) => sum + r.ects, 0)
    return parseFloat((totalWeighted / totalEcts).toFixed(2))
  }, [gradedRecords])
  const completedEcts = useMemo(
    () => gradedRecords.reduce((sum, r) => sum + r.ects, 0),
    [gradedRecords]
  )

  // ── search + filter via generic hook ─────────────────────────────────────
  const {
    searchQuery,
    setSearchQuery,
    activeFilter: selectedSemester,
    setActiveFilter: setSelectedSemester,
    filterOptions: semesterOptions,
    items: filteredRecords,
  } = useFilteredCollection(mockGradesData, {
    searchKeys: r => [localize(r, 'title'), r.code, r.instructor],
    filterKey:  r => localize(r, 'semester'),
    filterDefault: 'all',
    filterOptions: items => ['all', ...Array.from(new Set(items.map(r => localize(r, 'semester'))))],
  })

  const dashboardLabel = useMemo(
    () => t('dashboard') === 'dashboard' ? 'Dashboard' : t('dashboard'),
    [t]
  )

  return (
    <PageLayout
      className="grades-page animate-fade-in"
      gap="none"
      title={t('grades_page_title')}
      subtitle={t('grades_page_subtitle')}
      breadcrumbs={[
        { label: dashboardLabel, href: '/' },
        { label: t('grades_page_title') },
      ]}
    >
      <div className="container pb-[var(--space-2xl)] mt-[var(--space-lg)] flex flex-col gap-[var(--space-lg)]">
        <GradesOverview
          gpa={gpa}
          completedEcts={completedEcts}
          totalPossibleEcts={BACHELOR_TOTAL_ECTS}
          gradedCount={gradedRecords.length}
          totalCount={mockGradesData.length}
        />

        <Card className="p-0">
          <GradesFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSemester={selectedSemester ?? 'all'}
            setSelectedSemester={setSelectedSemester}
            semesterOptions={semesterOptions}
          />

          <Card.Body className="p-0">
            <AnimatePresence mode="wait">
              {filteredRecords.length > 0 ? (
                <motion.div
                  key="grades-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="divide-y divide-border"
                >
                  {filteredRecords.map((record) => (
                    <GradeRow key={record.id} record={record} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="grades-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="py-[var(--space-2xl)] text-center"
                >
                  <EmptyState 
                    icon={FileText} 
                    title={t('no_search_results')} 
                    description={t('no_favorites_match')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
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
  
  function renderGrades(lang: 'da' | 'en' = 'da') {
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
  
    it('renders breadcrumb with dashboard link', () => {
      renderGrades('da')
      const breadcrumbs = useStore.getState().breadcrumbs
      expect(breadcrumbs).toEqual([
        { label: 'Dashboard', href: '/' },
        { label: 'Karakterer' },
      ])
    })
  })
}
