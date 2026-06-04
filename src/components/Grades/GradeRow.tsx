import { memo } from 'react'
import { Calendar, BookOpen, Hourglass, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui'
import { Heading, Text } from '@/components/ui'
import useStore from '@/store'
import type { GradeRecord } from '@/types'

interface GradeRowProps {
  record: GradeRecord
}

import { useFormat } from '@/hooks'

function GradeRow({ record }: GradeRowProps) {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  const { formatLongDateTime } = useFormat()

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-[var(--space-lg)] p-[var(--space-lg)] hover:bg-bg-hover transition-colors duration-150">
      {/* Left Column: Grade summary circle badge & General Details */}
      <div className="flex-1 flex gap-[var(--space-md)] items-start">
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

        <div className="flex-1 min-w-0">
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

          <Heading level={4} className="text-base text-main font-bold mt-[var(--space-xs)] mb-[var(--space-2xs)] truncate">
            {localize(record, 'title')}
          </Heading>

          <Text size="xs" muted className="font-medium">
            {t('examiner')}: <span className="text-main font-semibold">{record.instructor}</span>
          </Text>
        </div>
      </div>

      {/* Middle Column: Detailed assessment methods & parameters */}
      <div className="flex-1 flex flex-col gap-[var(--space-2xs)] justify-center">
        <div className="flex items-center gap-[var(--space-3xs)]">
          <BookOpen className="w-3.5 h-3.5 text-text-disabled shrink-0" strokeWidth={2} />
          <Text size="xs" className="font-medium text-text-muted">
            <span className="text-text-muted font-semibold">{t('exam_type')}:</span> {localize(record, 'examType')}
          </Text>
        </div>

        <div className="flex items-center gap-[var(--space-3xs)]">
          <Calendar className="w-3.5 h-3.5 text-text-disabled shrink-0" strokeWidth={2} />
          <Text size="xs" className="font-medium text-text-muted">
            <span className="font-semibold">{t('grading_date')}:</span> {formatLongDateTime(record.examDate)}
          </Text>
        </div>
      </div>

      {/* Right Column: Custom individual assessment comments */}
      <div className="flex-[1.5] bg-bg-highlight/40 dark:bg-white/[0.01] rounded-xl p-[var(--space-md)] border border-border/80 flex gap-[var(--space-sm)] items-start">
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
  )
}

export default memo(GradeRow)
