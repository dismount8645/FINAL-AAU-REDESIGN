import { memo } from 'react'
import { Calendar, BookOpen, Hourglass, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui'
import { MasterItem } from '@/components/ui'
import { Text } from '@/components/ui'
import useStore from '@/store'
import type { GradeRecord } from '@/lib/types'

interface GradeRowProps {
  record: GradeRecord
}

import { useFormat } from '@/hooks'

function GradeRow({ record }: GradeRowProps) {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  const { formatLongDateTime } = useFormat()

  return (
    <MasterItem
      leading={
        <div
          className={`w-[52px] h-[52px] rounded-[var(--radius-pill)] flex flex-col items-center justify-center shrink-0 border-2 font-black text-xl shadow-[var(--shadow-sm)] md:w-[60px] md:h-[60px] ${
            record.grade !== null
              ? 'bg-primary border-primary text-white dark:border-primary'
              : 'bg-bg-placeholder border-dashed border-border/60 text-text-disabled dark:bg-bg-highlight/30 dark:border-border/40'
          }`}
          title={record.grade !== null ? `${t('my_grades')}: ${record.grade}` : t('not_graded')}
        >
          {record.grade !== null ? record.grade : <Hourglass className="w-5 h-5" strokeWidth={2} />}
        </div>
      }
      title={
        <Text size="base" weight="bold" className="text-main truncate">
          {localize(record, 'title')}
        </Text>
      }
      subtitle={
        <div className="flex flex-col gap-[var(--space-2xs)]">
          <div className="flex items-center gap-[var(--space-xs)] flex-wrap">
            <Badge variant="default" className="font-mono text-[10px] bg-bg-placeholder border border-border px-[var(--space-2xs)] py-[var(--space-3xs)] whitespace-nowrap">
              {record.code}
            </Badge>
            <Badge variant={record.grade !== null ? 'success' : 'default'} className="text-[10px] whitespace-nowrap">
              {record.ects} ECTS
            </Badge>
            <Text size="xs" muted className="font-semibold flex items-center gap-[var(--space-2xs)] whitespace-nowrap">
              <Calendar className="w-3 h-3" strokeWidth={2} />
              {localize(record, 'semester')}
            </Text>
          </div>
          <Text size="xs" muted className="font-medium">
            {t('examiner')}: <Text tag="span" weight="semibold" className="text-main">{record.instructor}</Text>
          </Text>
        </div>
      }
      trailing={
        <div className="flex items-start gap-[var(--space-md)]">
          <div className="flex flex-col gap-[var(--space-2xs)]">
            <div className="flex items-center gap-[var(--space-3xs)]">
              <BookOpen className="w-3.5 h-3.5 text-text-disabled shrink-0" strokeWidth={2} />
              <Text size="xs" className="font-medium text-text-muted">
                <Text tag="span" weight="semibold" className="text-text-muted">{t('exam_type')}:</Text> {localize(record, 'examType')}
              </Text>
            </div>
            <div className="flex items-center gap-[var(--space-3xs)]">
              <Calendar className="w-3.5 h-3.5 text-text-disabled shrink-0" strokeWidth={2} />
              <Text size="xs" className="font-medium text-text-muted">
                <Text tag="span" weight="semibold">{t('grading_date')}:</Text> {formatLongDateTime(record.examDate)}
              </Text>
            </div>
          </div>
          <div className="bg-bg-highlight/40 dark:bg-white/[0.01] rounded-xl p-[var(--space-md)] border border-border/80 flex gap-[var(--space-sm)] items-start max-w-[200px]">
            {record.grade !== null ? (
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" strokeWidth={2} />
            ) : (
              <AlertCircle className="w-4 h-4 text-text-disabled shrink-0 mt-0.5 animate-pulse" strokeWidth={2} />
            )}
            <div className="min-w-0">
              <Text size="xs" weight="bold" className="text-main">
                {t('feedback_comments')}
              </Text>
              <Text size="xs" muted className="mt-[var(--space-3xs)] leading-relaxed italic">
                &ldquo;{localize(record, 'feedback')}&rdquo;
              </Text>
            </div>
          </div>
        </div>
      }
    />
  )
}

export default memo(GradeRow)
