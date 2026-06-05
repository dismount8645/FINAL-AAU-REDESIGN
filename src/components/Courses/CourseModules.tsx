import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { ProgressBar } from '@/components/ui'
import { Heading, Text } from '@/components/ui'
import useStore from '@/store'
import type { CourseItem } from '@/lib/types'

import { FileText, Play, Link2, Upload, File, Check } from 'lucide-react'
import { MasterItem } from '@/components/ui'
import { useFormat } from '@/hooks'

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

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleItem(item.id)
  }, [item.id, onToggleItem])

  const { getCourseItemMetadata } = useFormat()

  const metadata = getCourseItemMetadata(item)

  const iconMap = {
    pdf: FileText,
    video: Play,
    link: Link2,
    assignment: Upload,
    file: File,
  }

  const isAutomatic = item.type === 'assignment'
  const Icon = iconMap[item.type as keyof typeof iconMap] || File

  return (
    <MasterItem
      className="mb-sm rounded-[var(--radius-md)] border border-border/40"
      leading={
        <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)] shrink-0 transition-colors ${
          item.type === 'pdf' ? 'text-danger bg-danger/10' :
          item.type === 'video' ? 'text-success bg-success/10' :
          item.type === 'assignment' ? 'text-accent bg-accent/10' :
          item.type === 'link' ? 'text-info bg-info/10' :
          'text-muted bg-bg-highlight/50'
        }`}>
          <Icon size={18} strokeWidth={2.5} aria-hidden="true" />
        </div>
      }
      title={
        <p className="font-bold text-main m-0 text-sm leading-tight">
          {t(`course_${courseId}_${sectionId}_i${item.id}_title`)}
        </p>
      }
      subtitle={metadata}
      onClick={handleClick}
      trailing={
        <button
          className={`lesson-item__checkbox group/check flex items-center justify-center w-11 h-11 border rounded-[var(--radius-sm)] transition shrink-0 relative focus-visible:shadow-focus focus-visible:outline-none ${
            completed 
              ? "bg-primary border-primary text-white" 
              : isAutomatic 
              ? "border-dashed opacity-30 cursor-default" 
              : "border-border bg-transparent hover:border-primary/50 dark:border-white/20"
          }`}
          onClick={handleToggle}
          aria-label={completed ? t('mark_incomplete') : t('mark_complete')}
          type="button"
          disabled={isAutomatic}
        >
          {completed ? (
            <Check size={16} strokeWidth={2.5} aria-hidden="true" />
          ) : (
            !isAutomatic && (
              <Check 
                size={16} 
                strokeWidth={2.5} 
                aria-hidden="true" 
                className="opacity-0 group-hover/check:opacity-30 transition-opacity" 
              />
            )
          )}
        </button>
      }
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
                  className="w-full text-left p-md px-lg flex items-start justify-between transition-colors duration-150 hover:bg-bg-hover focus-visible:outline-none focus-visible:shadow-focus"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isExpanded}
                >
                  <Stack direction="row" align="start" gap="sm" className="flex-1 min-w-0 text-left">
                    <div className={`status-dot w-2 h-2 rounded-[var(--radius-pill)] shrink-0 mt-2 md:mt-2.5 ${progress > 50 ? 'active bg-success shadow-[0_0_6px_rgba(var(--color-success-rgb),0.3)]' : 'pending bg-[var(--color-border)] dark:bg-white/20'}`} />
                    <Heading level={4} as="h2" className="m-0 text-left">{t(`course_${courseId}_${section.id}_title`)}</Heading>
                  </Stack>
                  {isExpanded ? (
                    <ChevronUp size={18} strokeWidth={2} className="text-muted transition-transform duration-150 mt-1 md:mt-1.5 shrink-0" />
                  ) : (
                    <ChevronDown size={18} strokeWidth={2} className="text-muted transition-transform duration-150 mt-1 md:mt-1.5 shrink-0" />
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
