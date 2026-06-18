import useStore from '@/store';
import type { CourseSection } from '@/lib/types';

interface CourseModulesAnchorNavProps {
  courseId: string
  sections: CourseSection[]
}

function CourseModulesAnchorNav({
  courseId,
  sections,
}: CourseModulesAnchorNavProps) {
  const t = useStore((state) => state.t)
  
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-card-${sectionId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="sticky top-[73px] bg-bg-card/95 backdrop-blur-md z-20 py-sm px-md -mx-md sm:mx-0 rounded-xl border border-border/60 shadow-sm flex items-center gap-xs overflow-x-auto no-scrollbar mb-md">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => scrollToSection(section.id)}
          className="px-sm py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-bg-highlight/40 hover:bg-bg-highlight/85 text-text-secondary border border-border/40 hover:border-primary/50 transition-all duration-150"
        >
          {t(`course_${courseId}_${section.id}_title`)}
        </button>
      ))}
    </div>
  )
}

export default CourseModulesAnchorNav
