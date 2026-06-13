import { useCallback, memo } from 'react';

import { ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text, Heading } from '@/components/ui';
import useStore from '@/store';
import { PATHS } from '@/routes';

interface OverviewEvent {
  time: string
  titleKey: string
  moduleKey?: string
  location?: string
}

const todayEvents: OverviewEvent[] = [
  { time: '08:15', titleKey: 'lecture', moduleKey: 'course_1_title', location: 'Fibigerstræde 15' },
  { time: '13:00', titleKey: 'study_group', moduleKey: 'course_2_title', location: 'Kroghstræde 3' },
  { time: '23:59', titleKey: 'project_report', moduleKey: 'course_4_title' },
]

const OverviewItem = memo(({
  event,
  onClick
}: {
  event: OverviewEvent,
  onClick: () => void
}) => {
  const t = useStore(state => state.t)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="flex items-center gap-md p-xs border border-[var(--border-color)]/40 rounded-[var(--radius-md)] bg-bg-card hover:bg-bg-hover cursor-pointer transition-colors min-h-[52px]"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <Text size="sm" weight="bold" className="text-primary font-mono shrink-0">
        {event.time}
      </Text>
      <div className="flex flex-col gap-4xs flex-1 min-w-0">
        <Text size="sm" weight="bold" className="text-main truncate">
          {t(event.titleKey)} {event.moduleKey && `· ${t(event.moduleKey)}`}
        </Text>
        {event.location && (
          <Text size="xs" muted className="truncate">
            {event.location}
          </Text>
        )}
      </div>
      <ChevronRight size={16} className="text-muted/60 shrink-0" />
    </div>
  )
})

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
}

const QuickOverviewWidget = ({ size: _size = 'medium' }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)

  const handleGoToCalendar = useCallback(() => {
    navigate(PATHS.CALENDAR)
  }, [navigate])

  const limit = 3

  return (
    <Card className="quick-overview-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('dashboard.widget_quickOverview')}
          </Heading>
        </Stack>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        <div className="w-full flex flex-col gap-[var(--space-2xs)]">
          <Text size="xs" weight="bold" className="text-text-muted uppercase tracking-wider mb-[2px]">
            {t('todays_schedule')}
          </Text>
          {todayEvents.slice(0, limit).map((event) => (
            <OverviewItem
              key={event.titleKey}
              event={event}
              onClick={handleGoToCalendar}
            />
          ))}
        </div>
      </Card.Body>

      <Card.Footer padding="none" className="border-t border-[var(--border-color)]/20 cursor-pointer hover:bg-bg-hover transition-colors" onClick={handleGoToCalendar} role="button" tabIndex={0}>
        <div className="w-full h-[44px] flex items-center justify-center gap-1">
          <Text size="xs" weight="bold" className="text-primary dark:text-white">{lang === 'da' ? 'Se kalender' : 'See calendar'}</Text>
          <ChevronRight size={14} strokeWidth={2.5} className="text-primary dark:text-white" />
        </div>
      </Card.Footer>
    </Card>
  )
}

export default memo(QuickOverviewWidget)

let mockNavigate: ReturnType<typeof vi.fn>
if (import.meta.vitest) {
  mockNavigate = vi.fn()
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: () => mockNavigate
    }
  })
  describe('QuickOverviewWidget', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })
    it('renders today events', () => {
      renderWithProviders(<QuickOverviewWidget />)
      expect(screen.getAllByText('Dagens program')[0]).toBeInTheDocument()
      expect(screen.getByText('08:15')).toBeInTheDocument()
      expect(screen.getByText(/Forelæsning/i)).toBeInTheDocument()
      expect(screen.getByText('23:59')).toBeInTheDocument()
      expect(screen.getByText(/Projektrapport/i)).toBeInTheDocument()
    })

    it('navigates to calendar when link is clicked', () => {
      renderWithProviders(<QuickOverviewWidget />)
      const link = screen.getByText(/Se kalender/i)
      fireEvent.click(link)
      expect(mockNavigate).toHaveBeenCalledWith('/calendar')
    })

    it('renders correct number of interactive items', () => {
      const { container } = renderWithProviders(<QuickOverviewWidget />)
      const items = container.querySelectorAll('[role="button"]')
      // 3 event items + 1 card footer = 4 total role=button elements
      expect(items.length).toBe(4)
    })
  })
}
