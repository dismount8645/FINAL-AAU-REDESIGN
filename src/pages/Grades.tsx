import { FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Stack from '@/components/ui/Stack'
import Card from '@/components/ui/Card'
import useStore from '@/store/useStore'
import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import { GradesOverview, GradesFilter, GradeRow, type GradeRecord } from './grades/index'
import { useGradesFilterAndStats } from '@/hooks/useGradesFilterAndStats'

const mockGradesData: GradeRecord[] = [
  {
    id: 1,
    code: 'DD101',
    titleDa: 'Digital Design og Kommunikation',
    titleEn: 'Digital Design and Communication',
    grade: 10,
    ects: 15,
    semesterDa: 'Forår 2024',
    semesterEn: 'Spring 2024',
    examDate: '2024-06-12',
    examTypeDa: 'Mundtlig u. forberedelse (Portfoliopræsentation)',
    examTypeEn: 'Oral without prep (Portfolio Presentation)',
    feedbackDa: 'Særdeles velskrevet designrapport og overbevisende mundtligt forsvar med stærk teoretisk kobling.',
    feedbackEn: 'Extremely well-written design report and persuasive oral defense with strong theoretical ties.',
    instructor: 'Morten Jensen',
  },
  {
    id: 2,
    code: 'WEB202',
    titleDa: 'Webudvikling og CMS',
    titleEn: 'Web Development and CMS',
    grade: 10,
    ects: 10,
    semesterDa: 'Forår 2024',
    semesterEn: 'Spring 2024',
    examDate: '2024-06-18',
    examTypeDa: 'Skriftlig projektrapport og praktisk demo',
    examTypeEn: 'Written project report and hands-on demonstration',
    feedbackDa: 'Teknisk imponerende React-arkitektur. Mindre mangler i API-fejlhåndtering forhindrer topkarakter.',
    feedbackEn: 'Technically impressive React architecture. Minor shortcomings in API error handling prevented a top grade.',
    instructor: 'Lise Sørensen',
  },
  {
    id: 3,
    code: 'VT303',
    titleDa: 'Videnskabsteori',
    titleEn: 'Philosophy of Science',
    grade: 7,
    ects: 5,
    semesterDa: 'Forår 2024',
    semesterEn: 'Spring 2024',
    examDate: '2024-06-22',
    examTypeDa: 'Skriftlig hjemmeopgave (72 timer)',
    examTypeEn: 'Written home assignment (72 hours)',
    feedbackDa: 'God forståelse for de videnskabsteoretiske strømninger. Argumentationen savner momentvist dybde.',
    feedbackEn: 'Good understanding of the paradigm schools of thought. Argumentation occasionally lacked depth.',
    instructor: 'Anders Nielsen',
  },
  {
    id: 4,
    code: 'PBL404',
    titleDa: 'Problembaseret Læring (PBL)',
    titleEn: 'Problem Based Learning (PBL)',
    grade: 12,
    ects: 30,
    semesterDa: 'Efterår 2023',
    semesterEn: 'Autumn 2023',
    examDate: '2023-12-18',
    examTypeDa: 'Gruppeeksamen med individuelt forsvar',
    examTypeEn: 'Group examination with individual defense',
    feedbackDa: 'Fremragende anvendelse af den Aalborgensiske PBL-model. Fremragende empirisk og teoretisk syntese.',
    feedbackEn: 'Outstanding application of the Aalborg PBL model. Exemplary synthesis of empirical and theoretical methods.',
    instructor: 'Helene Østergaard',
  },
  {
    id: 5,
    code: 'BP505',
    titleDa: 'Bachelorprojekt',
    titleEn: 'Bachelor Project',
    grade: null,
    ects: 30,
    semesterDa: 'Kommende (Efterår 2024)',
    semesterEn: 'Upcoming (Autumn 2024)',
    examDate: 'TBA',
    examTypeDa: 'Bachelorafhandling med individuel mundtlig eksamen',
    examTypeEn: 'Bachelor Thesis with individual oral examination',
    feedbackDa: 'Karakter endnu ikke tilgængelig. Modul starter i kommende semester.',
    feedbackEn: 'Grade not available. Module starts in the upcoming semester.',
    instructor: 'TBA',
  }
]

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

  const dashboardLabel = t('dashboard') === 'dashboard' ? 'Dashboard' : t('dashboard')
  const totalPossibleEcts = 180 // European Standard Bachelor is 180 ECTS

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
          totalPossibleEcts={totalPossibleEcts}
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
