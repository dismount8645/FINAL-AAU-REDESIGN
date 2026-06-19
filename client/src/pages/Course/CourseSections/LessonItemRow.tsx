import { memo, useCallback } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { Check } from 'lucide-react';
import { MasterItem, Button } from '@/components/ui';
import { PATHS } from '@/routes';
import { cn, ITEM_TYPE_MAP } from '@/lib/utils';
import useStore from '@/store';
import { useFormat } from '@/hooks';
import type { CourseItem } from '@/lib/types';

interface LessonItemRowProps {
  item: CourseItem
  courseId: string
  sectionId: string
  completed: boolean
  onToggleItem: (id: number) => void
  navigate: NavigateFunction
}

const LessonItemRow = memo(function LessonItemRow({
  item,
  courseId,
  sectionId,
  completed,
  onToggleItem,
  navigate,
}: LessonItemRowProps) {
  const t = useStore((state) => state.t)

  const handleClick = item.type === 'assignment'
    ? () => navigate(PATHS.SUBMISSION(courseId, item.id))
    : () => {}

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleItem(item.id)
  }, [item.id, onToggleItem])

  const { getCourseItemMetadata } = useFormat()
  const metadata = getCourseItemMetadata(item)

  const isAutomatic = item.type === 'assignment'
  const themeConfig = ITEM_TYPE_MAP[item.type] || ITEM_TYPE_MAP.default
  const Icon = themeConfig.icon

  return (
    <MasterItem
      className="rounded-[var(--radius-md)] border-none bg-bg-highlight/20 hover:bg-bg-highlight/40"
      leading={Icon}
      leadingClassName={cn(themeConfig.bg, `text-${themeConfig.color}`)}
      title={
        <span className="font-bold text-sm leading-tight">
          {t(`course_${courseId}_${sectionId}_i${item.id}_title`)}
        </span>
      }
      subtitle={metadata}
      onClick={handleClick}
      trailing={
        <div className="flex items-center gap-xs shrink-0">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider hidden xs:inline-block",
            completed ? "text-success" : "text-text-secondary opacity-60"
          )}>
            {completed 
              ? t('course.completed') 
              : t('course.incomplete')}
          </span>
          <Button
            variant={completed ? 'primary' : 'ghost'}
            size="icon"
            className={`lesson-item__checkbox w-7 h-7 shrink-0 ${completed ? '' : isAutomatic ? 'border-dashed opacity-30 cursor-default border-border' : 'border-border hover:border-primary/50 dark:border-white/20'}`}
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
          </Button>
        </div>
      }
    />
  )
})

export default LessonItemRow
