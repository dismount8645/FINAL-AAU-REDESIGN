import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ForumWidget } from '@/widgets'
import { CourseModules, CourseResources, CourseInfo, CourseParticipants, CoursePbl } from './index'
import type { CourseItem } from '@/types'

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
