import { memo } from 'react';


import { AnimatePresence, motion } from 'framer-motion';
import { MemoryRouter } from 'react-router-dom';
import CourseModules from './CourseModules';
import CourseResources from './CourseResources';
import CourseInfo from './CourseInfo';
import CourseParticipants from './CourseParticipants';
import CoursePbl from './CoursePbl';
import CourseSidebar from './CourseSidebar';
import ForumWidget from '@/components/Widgets/ForumWidget';
import type { CourseItem } from '@/lib/types';

interface CourseTabContentProps {
  activeTab: string
  courseId: string
  progress: number
  completedItems: number[]
  expandedSections: string[]
  sections: { id: string; title: string; titleEn: string; items: CourseItem[] }[]
  toggleItem: (itemId: number) => void
  toggleSection: (sectionId: string) => void
  participantsData: { name: string; role: string }[]
  professor: string
}

function CourseTabContent({
  activeTab,
  courseId,
  progress,
  completedItems,
  expandedSections,
  sections,
  toggleItem,
  toggleSection,
  participantsData,
  professor,
}: CourseTabContentProps) {
  return (
    <div className="min-h-[300px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'modules' && (
            <CourseModules
              courseId={courseId}
              progress={progress}
              completedItems={completedItems}
              expandedSections={expandedSections}
              sections={sections}
              toggleItem={toggleItem}
              toggleSection={toggleSection}
            />
          )}

          {activeTab === 'forum' && (
            <ForumWidget professor={professor} span={8} isEditing={false} />
          )}

          {activeTab === 'resources' && (
            <CourseResources />
          )}

          {activeTab === 'info' && (
            <CourseInfo />
          )}

          {activeTab === 'participants' && (
            <CourseParticipants participantsData={participantsData} />
          )}

          {activeTab === 'pbl' && (
            <CoursePbl />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default memo(CourseTabContent)

if (import.meta.vitest) {
  describe('Course Tabs Subcomponents', () => {
    describe('CourseModules', () => {
      it('renders module items and triggers click and collapse', () => {
        const toggleItem = vi.fn()
        const toggleSection = vi.fn()
        const sections = [
          {
            id: 's1',
            title: 'Week 1',
            titleEn: 'Week 1',
            items: [
              { id: 101, type: 'pdf' as const, title: 'Syllabus', titleEn: 'Syllabus', size: '1 MB' }
            ]
          }
        ]
  
        const { container } = render(
          <MemoryRouter>
            <CourseModules
              courseId="1"
              progress={50}
              completedItems={[]}
              expandedSections={['s1']}
              sections={sections}
              toggleItem={toggleItem}
              toggleSection={toggleSection}
            />
          </MemoryRouter>
        )
  
        expect(screen.getByText('50%')).toBeInTheDocument()
        
        const checkbox = container.querySelector('.lesson-item__checkbox')!
        fireEvent.click(checkbox)
        expect(toggleItem).toHaveBeenCalledWith(101)
  
        const header = container.querySelector('[data-section-id="s1"]')!
        fireEvent.click(header)
        expect(toggleSection).toHaveBeenCalledWith('s1')
      })
    })
  
    describe('CourseResources', () => {
      it('renders all resource links', () => {
        render(<CourseResources />)
        expect(screen.getByText('Litteraturliste')).toBeInTheDocument()
        expect(screen.getByText('Pensumliste')).toBeInTheDocument()
        expect(screen.getByText('Eksamensplan')).toBeInTheDocument()
        expect(screen.getByText('PDF, 2.4 MB')).toBeInTheDocument()
        expect(screen.getByText('Excel, 150 KB')).toBeInTheDocument()
        expect(screen.getByText('Link')).toBeInTheDocument()
      })
    })
  
    describe('CourseInfo', () => {
      it('renders info section text', () => {
        render(<CourseInfo />)
        expect(screen.getByText('Læringsmål')).toBeInTheDocument()
      })
    })
  
    describe('CourseParticipants', () => {
      it('renders search and list of participants', () => {
        const participants = [
          { name: 'Alice Student', role: 'student' },
          { name: 'Bob Teacher', role: 'teacher' },
        ]
  
        render(<CourseParticipants participantsData={participants} />)
        expect(screen.getByText('Alice Student')).toBeInTheDocument()
        expect(screen.getByText('Bob Teacher')).toBeInTheDocument()
      })
  
      it('filters participants by role', () => {
        const participants = [
          { name: 'Alice Student', role: 'student' },
          { name: 'Bob Teacher', role: 'teacher' },
        ]
  
        render(<CourseParticipants participantsData={participants} />)
        expect(screen.getByText('Alice Student')).toBeInTheDocument()
        expect(screen.getByText('Bob Teacher')).toBeInTheDocument()
  
        const select = screen.getByRole('combobox')
        fireEvent.change(select, { target: { value: 'student' } })
        expect(screen.getByText('Alice Student')).toBeInTheDocument()
        expect(screen.queryByText('Bob Teacher')).not.toBeInTheDocument()
      })
    })
  
    describe('CoursePbl', () => {
      it('renders pbl group component', () => {
        render(<CoursePbl />)
        expect(screen.getByText('Gruppeprojekt (PBL)')).toBeInTheDocument()
      })
    })
  
    describe('CourseSidebar', () => {
      it('renders quick links and professor information', () => {
        const setActiveTab = vi.fn()
        render(
          <MemoryRouter>
            <CourseSidebar
              courseId="1"
              professor="Dr. Test"
              email="test@test.com"
              setActiveTab={setActiveTab}
            />
          </MemoryRouter>
        )
  
        expect(screen.getByText('Dr. Test')).toBeInTheDocument()
        expect(screen.getByText('test@test.com')).toBeInTheDocument()
  
        const forumLink = screen.getByText('Kursusforum')
        fireEvent.click(forumLink)
        expect(setActiveTab).toHaveBeenCalledWith('forum')
      })
    })
  })
}
