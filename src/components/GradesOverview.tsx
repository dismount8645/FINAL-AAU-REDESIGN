import { memo } from 'react'
import { GraduationCap, TrendingUp } from 'lucide-react'
import Grid from '@/components/Grid'
import Card from '@/components/Card'
import { Heading, Text } from '@/components/Typography'
import ProgressBar from '@/components/ProgressBar'
import useStore from '@/lib/store'

interface GradesOverviewProps {
  gpa: number
  completedEcts: number
  totalPossibleEcts: number
  gradedCount: number
  totalCount: number
}

function GradesOverview({
  gpa,
  completedEcts,
  totalPossibleEcts,
  gradedCount,
  totalCount,
}: GradesOverviewProps) {
  const t = useStore(state => state.t)

  return (
    <Grid columns={12} gap="md" className="w-[100%]">
      {/* Total GPA Card */}
      <Grid.Item span={4} tabletSpan={6} mobileSpan={12}>
        <Card variant="brand" className="h-[100%] overflow-visible p-[var(--space-sm)] relative">
          <Card.Body className="p-[var(--space-sm)] flex flex-col justify-between">
            <div>
              <Text size="xs" weight="black" className="uppercase tracking-widest text-white/60 text-xs">
                {t('weighted_gpa')}
              </Text>
              <Heading level={2} className="text-white text-5xl font-black mt-[var(--space-2xs)] leading-none">
                {gpa}
              </Heading>
              <Text size="xs" className="mt-[var(--space-2xs)] text-white/80 flex items-center gap-[var(--space-3xs)] font-medium">
                <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
                {t('danish_grading_scale')}
              </Text>
            </div>
            <Card.Decoration icon={GraduationCap} />
          </Card.Body>
        </Card>
      </Grid.Item>

      {/* ECTS Progress Card */}
      <Grid.Item span={4} tabletSpan={6} mobileSpan={12}>
        <Card className="h-[100%] p-[var(--space-sm)]">
          <Card.Body className="p-[var(--space-sm)] flex flex-col justify-between">
            <div>
              <Text size="xs" weight="extrabold" muted className="uppercase tracking-widest text-text-disabled">
                {t('passed_ects')}
              </Text>
              <Heading level={2} className="text-main text-5xl mt-[var(--space-2xs)] font-black leading-none flex items-baseline gap-[var(--space-3xs)]">
                {completedEcts} <Text size="md" tag="span" muted className="font-semibold text-text-disabled">/ {totalPossibleEcts} ECTS</Text>
              </Heading>
            </div>
            <div className="w-[100%] mt-[var(--space-md)]">
              <ProgressBar value={Math.round((completedEcts / totalPossibleEcts) * 100)} height={8} color="var(--aau-light-blue)" />
              <div className="flex justify-between items-center mt-[var(--space-2xs)]">
                <Text size="2xs" muted>{Math.round((completedEcts / totalPossibleEcts) * 100)}% {t('of_degree_completed')}</Text>
                <Text size="2xs" muted className="font-semibold">33.3%</Text>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Grid.Item>

      {/* Completed Modules Ratio */}
      <Grid.Item span={4} tabletSpan={12} mobileSpan={12}>
        <Card className="h-[100%] p-[var(--space-sm)]">
          <Card.Body className="p-[var(--space-sm)] flex flex-col justify-between">
            <div>
              <Text size="xs" weight="extrabold" muted className="uppercase tracking-widest text-text-disabled">
                {t('graded_modules')}
              </Text>
              <Heading level={2} className="text-main text-5xl mt-[var(--space-2xs)] font-black leading-none">
                {gradedCount} <Text size="md" tag="span" muted className="font-semibold text-text-disabled">/ {totalCount}</Text>
              </Heading>
              <Text size="xs" muted className="mt-[var(--space-2xs)] text-text-muted">
                {t('grades_summary_hint')}
              </Text>
            </div>
          </Card.Body>
        </Card>
      </Grid.Item>
    </Grid>
  )
}

export default memo(GradesOverview)
