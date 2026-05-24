import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import ProgressBar from '@/components/ui/ProgressBar'
import LessonItem from '@/components/ui/LessonItem'
import { Heading, Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import type { CourseItem } from '@/types'

const LessonItemRow = memo(function LessonItemRow({
  item,
  courseId,
  sectionId,
  completed,
  onToggleItem,
}: {
  item: CourseItem
  courseId: string
  sectionId: string
  completed: boolean
  onToggleItem: (id: number) => void
}) {
  const t = useStore((state) => state.t)
  const navigate = useNavigate()

  const handleClick = item.type === 'assignment'
    ? () => navigate(`/submission/${courseId}/${item.id}`)
    : undefined

  const handleToggle = useCallback(() => onToggleItem(item.id), [item.id, onToggleItem])

  const metadata = item.size || item.duration || (item.deadline
    ? `${t('deadline')}: ${t(`course_deadline_${item.id === 105 ? 'fri_12' : 'mon_09'}`)}`
    : '') || t('external_resource')

  return (
    <LessonItem
      type={item.type}
      title={t(`course_${courseId}_${sectionId}_i${item.id}_title`)}
      metadata={metadata}
      completed={completed}
      onClick={handleClick}
      onToggle={handleToggle}
      isAutomatic={item.type === 'assignment'}
    />
  )
})

interface CourseModulesProps {
  courseId: string
  progress: number
  completedItems: number[]
  expandedSections: string[]
  sections: { id: string; title: string; titleEn: string; items: CourseItem[] }[]
  toggleItem: (itemId: number) => void
  toggleSection: (sectionId: string) => void
}

function CourseModules({
  courseId,
  progress,
  completedItems,
  expandedSections,
  sections,
  toggleItem,
  toggleSection,
}: CourseModulesProps) {
  const t = useStore((state) => state.t)

  const getProgressMessage = (pct: number) => {
    if (pct === 0) return t('progress_0')
    if (pct < 50) return t('progress_25')
    if (pct < 75) return t('progress_50')
    if (pct < 100) return t('progress_75')
    return t('progress_100')
  }

  return (
    <Stack gap="md">
      <Card variant="elevated" accent="left" className="mb-xl">
        <Card.Header>
          <Stack gap="2xs">
            <Text weight="bold" size="lg" className="card__title">{t('your_progress')}</Text>
            <Text size="sm" muted>{getProgressMessage(progress)}</Text>
          </Stack>
          <div className="progress-stat text-right">
            <Text size="md" weight="bold" className="progress-value text-[var(--color-primary)] block leading-[1]">
              {progress}%
            </Text>
            <Text size="xs" muted className="text-uppercase tracking-[0.05em]">
              {t('completed_short')}
            </Text>
          </div>
        </Card.Header>
        <Card.Body>
          <ProgressBar value={progress} />
        </Card.Body>
      </Card>

      <Stack gap="lg">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id)
          return (
            <Card key={section.id} variant="elevated" className="course-section mb-md overflow-hidden shadow-[var(--shadow-md)]">
              <Card.Header className="section-header p-0 bg-bg-card overflow-hidden">
                <button
                  type="button"
                  data-section-id={section.id}
                  className="w-full text-left p-md px-lg flex items-center justify-between transition-colors duration-200 hover:bg-bg-hover focus-visible:outline-none focus-visible:shadow-focus"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isExpanded}
                >
                  <Stack direction="row" align="center" gap="sm" className="flex-1 min-w-0 text-left">
                    <div className={`status-dot w-2 h-2 rounded-[var(--radius-pill)] shrink-0 ${progress > 50 ? 'active bg-success shadow-[0_0_6px_rgba(var(--color-success-rgb),0.3)]' : 'pending bg-[var(--color-border)] dark:bg-white/20'}`} />
                    <Heading level={4} className="m-0 truncate text-left">{t(`course_${courseId}_${section.id}_title`)}</Heading>
                  </Stack>
                  {isExpanded ? (
                    <ChevronUp size={18} strokeWidth={2} className="text-muted transition-transform duration-200" />
                  ) : (
                    <ChevronDown size={18} strokeWidth={2} className="text-muted transition-transform duration-200" />
                  )}
                </button>
              </Card.Header>
              {isExpanded && (
                <Card.Body className="section-content p-md">
                  <Stack gap="xs">
                    {section.items.map((item) => (
                      <LessonItemRow
                        key={item.id}
                        item={item}
                        courseId={courseId}
                        sectionId={section.id}
                        completed={completedItems.includes(item.id)}
                        onToggleItem={toggleItem}
                      />
                    ))}
                  </Stack>
                </Card.Body>
              )}
            </Card>
          )
        })}
      </Stack>
    </Stack>
  )
}

export default memo(CourseModules)
