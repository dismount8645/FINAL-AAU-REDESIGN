import type { NavigateFunction } from 'react-router-dom';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store';
import type { CourseSection } from '@/lib/types';
import CourseSectionCard from './CourseSectionCard';
import CourseModulesAnchorNav from './CourseModulesAnchorNav';

interface CourseModulesProps {
  courseId: string
  progress: number
  completedItems: number[]
  expandedSections: string[]
  sections: CourseSection[]
  toggleItem: (itemId: number) => void
  toggleSection: (sectionId: string) => void
  navigate: NavigateFunction
}

export function CourseModules({
  courseId,
  progress: _progress,
  completedItems,
  expandedSections,
  sections,
  toggleItem,
  toggleSection,
  navigate,
}: CourseModulesProps) {
  const t = useStore((state) => state.t)
  const lang = useStore((state) => state.lang)

  return (
    <Stack gap="lg">
      <CourseModulesAnchorNav courseId={courseId} sections={sections} />
      {sections.map((section) => (
        <CourseSectionCard
          key={section.id}
          section={section}
          courseId={courseId}
          completedItems={completedItems}
          isExpanded={expandedSections.includes(section.id)}
          toggleSection={toggleSection}
          toggleItem={toggleItem}
          lang={lang}
          t={t}
          navigate={navigate}
        />
      ))}
    </Stack>
  )
}
