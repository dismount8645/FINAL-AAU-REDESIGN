import { useMemo } from 'react'
import { FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Stack from '@/components/Stack'
import Card from '@/components/Card'
import useStore from '@/lib/store'
import EmptyState from '@/components/EmptyState'
import PageHeader from '@/components/PageHeader'
import { GradesOverview, GradesFilter, GradeRow } from '@/components'
import { useGradesFilterAndStats } from '@/lib/useGradesFilterAndStats'
import { mockGradesData, BACHELOR_TOTAL_ECTS } from '@/lib/mockGrades'

function Grades() {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  const {
    searchQuery,
    setSearchQuery,
    selectedSemester,
    setSelectedSemester,
    gpa,
    completedEcts,
    semesterOptions,
    filteredRecords,
    gradedCount,
    totalCount
  } = useGradesFilterAndStats({ gradesData: mockGradesData, localize })

  const dashboardLabel = useMemo(
    () => t('dashboard') === 'dashboard' ? 'Dashboard' : t('dashboard'),
    [t]
  )

  return (
    <Stack className="grades-page animate-fade-in" gap="none">
      <PageHeader
        title={t('grades_page_title')}
        subtitle={t('grades_page_subtitle')}
        breadcrumbs={[
          { label: dashboardLabel, href: '/' },
          { label: t('grades_page_title') },
        ]}
      />

      <div className="container pb-[var(--space-2xl)] mt-[var(--space-lg)] flex flex-col gap-[var(--space-lg)]">
        <GradesOverview
          gpa={gpa}
          completedEcts={completedEcts}
          totalPossibleEcts={BACHELOR_TOTAL_ECTS}
          gradedCount={gradedCount}
          totalCount={totalCount}
        />

        <Card className="p-0">
          <GradesFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSemester={selectedSemester}
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
    </Stack>
  )
}

export default Grades
