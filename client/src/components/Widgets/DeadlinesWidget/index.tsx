import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, Heading } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { mockDashboardDeadlines } from '@/lib/data';
import { PATHS } from '@/routes';
import { getDeadlineInfo } from '@/lib/utils';
import useStore from '@/store';
import { ProcessedDeadline } from './helpers';
import DeadlineCardSmall from './DeadlineCardSmall';
import DeadlineCardMedium from './DeadlineCardMedium';
import DeadlineCardLarge from './DeadlineCardLarge';
import DeadlineEmpty from './DeadlineEmpty';

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
  hideFirst?: boolean
  isPriorityElevated?: boolean
}

export type { ProcessedDeadline }

function DeadlinesWidget({ size = 'medium', hideFirst = false }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const localize = useStore(state => state.localize)
  const courses = useStore(state => state.courses)

  const limit = size === 'small' ? 1 : size === 'medium' ? 3 : 5

  const deadlines = useMemo(() => {
    const start = hideFirst ? 1 : 0
    const end = limit + (hideFirst ? 1 : 0)
    return mockDashboardDeadlines.slice(start, end).map((deadline) => {
      const deadlineDate = new Date()
      deadlineDate.setHours(deadlineDate.getHours() + deadline.deadlineHoursFromNow)
      const info = getDeadlineInfo(deadlineDate, lang)
      const course = courses.find(c => c.id === deadline.courseId)
      const courseTitle = course ? localize(course, 'title') : ''
      return {
        ...deadline,
        deadlineDate: deadlineDate.toISOString(),
        courseTitle,
        title: localize(deadline, 'title'),
        info,
      }
    })
  }, [localize, courses, limit, hideFirst, lang])

  const upcomingCount = useMemo(() => {
    return deadlines.filter(dl => dl.info.urgency !== 'overdue').length
  }, [deadlines])

  const handleSeeAll = useCallback(() => {
    navigate(PATHS.CALENDAR)
  }, [navigate])

  const handleDeadlineClick = useCallback((dl: ProcessedDeadline) => {
    navigate(PATHS.SUBMISSION(dl.courseId, dl.id))
  }, [navigate])

  return (
    <Card className="deadlines-widget w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="text-primary shrink-0">
            <Clock size={18} strokeWidth={2} />
          </div>
          <div>
            <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
              {lang === 'da'
                ? (deadlines.length === 1 ? 'Næste aflevering' : 'Næste afleveringer')
                : (deadlines.length === 1 ? 'Next assignment' : 'Next assignments')}
            </Heading>
            {size !== 'small' && (
              <span className="text-xs text-text-muted font-semibold block mt-3xs leading-relaxed">
                {lang === 'da' ? `${upcomingCount} kommende` : `${upcomingCount} upcoming`}
              </span>
            )}
          </div>
        </Stack>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-extrabold text-primary dark:text-white normal-case tracking-normal hover:underline h-[44px] min-h-[44px]"
          onClick={handleSeeAll}
          iconRight={ChevronRight}
          aria-label={lang === 'da' ? 'Se alle' : 'See all'}
        >
          {lang === 'da' ? 'Se alle' : 'See all'}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col gap-[var(--space-xs)]">
        {deadlines.length > 0 ? (
          size === 'small' ? (
            <DeadlineCardSmall deadlines={deadlines} onDeadlineClick={handleDeadlineClick} lang={lang} />
          ) : size === 'medium' ? (
            <DeadlineCardMedium deadlines={deadlines} onDeadlineClick={handleDeadlineClick} lang={lang} />
          ) : (
            <DeadlineCardLarge deadlines={deadlines} onDeadlineClick={handleDeadlineClick} lang={lang} t={t} />
          )
        ) : (
          <DeadlineEmpty t={t} />
        )}
      </Card.Body>
    </Card>
  )
}

export { DeadlinesWidget }
