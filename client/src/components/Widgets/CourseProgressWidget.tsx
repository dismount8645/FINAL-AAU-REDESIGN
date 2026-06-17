import { Trophy } from 'lucide-react';
import { Card, Heading } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store';

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
}

interface MockCourseProgress {
  id: number
  title: string
  percentage: number
}

const mockCourseProgress: MockCourseProgress[] = [
  { id: 1, title: 'Digital Design og Kommunikation', percentage: 75 },
  { id: 2, title: 'Webudvikling og CMS', percentage: 40 },
  { id: 3, title: 'Videnskabsteori', percentage: 90 },
]

function CourseProgressWidget({ size = 'medium' }: WidgetProps) {
  const t = useStore(state => state.t)
  const limit = size === 'small' ? 1 : size === 'medium' ? 2 : 3

  return (
    <Card className="course-progress-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="text-primary shrink-0">
            <Trophy size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('common.your_progress')}
          </Heading>
        </Stack>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-xs w-full">
          {mockCourseProgress.slice(0, limit).map((course) => (
            <div key={course.id} className="flex flex-col gap-[2px]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-main truncate max-w-[80%]">{course.title}</span>
                <span className="text-xs text-text-muted font-bold">{course.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-highlight rounded-full overflow-hidden border border-[var(--border-color)]/20">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${course.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

export { CourseProgressWidget }
