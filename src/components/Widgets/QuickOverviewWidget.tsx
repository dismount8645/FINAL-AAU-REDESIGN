import { useCallback, memo, forwardRef } from 'react';

import { ChevronRight, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text, Heading } from '@/components/ui';
import useStore from '@/store';

interface OverviewEvent {
  time: string
  titleKey: string
}

const todayEvents: OverviewEvent[] = [
  { time: '08:15', titleKey: 'lecture' },
  { time: '23:59', titleKey: 'project_report' },
]

const OverviewItem = memo(forwardRef<HTMLButtonElement, {
  event: OverviewEvent,
  onClick: () => void
}>(({ event, onClick }, ref) => {
  const t = useStore(state => state.t)
  const [hours, minutes] = event.time.split(':')

  return (
    <button
      ref={ref}
      type="button"
      className="w-full text-left flex items-center justify-start gap-[var(--space-md)] py-[var(--space-sm)] px-[var(--space-sm)] rounded-[var(--radius-lg)] transition-all duration-150 hover:bg-bg-highlight/50 border border-transparent hover:border-[var(--border-color)]/40 group/item outline-none focus-visible:outline-none focus-visible:shadow-focus"
      onClick={onClick}
    >
      <div className="flex flex-row items-center justify-center gap-[2px] min-w-[56px] py-[var(--space-2xs)] bg-bg-highlight rounded-[var(--radius-md)] border border-[var(--border-color)]/40 group-hover/item:border-primary/30 transition-colors">
        <Text size="xs" weight="black" className="text-primary leading-none">{hours}</Text>
        <span className="text-primary text-xs font-black leading-none">:</span>
        <Text size="xs" weight="bold" className="text-muted leading-none opacity-60 font-mono">{minutes}</Text>
      </div>
      <Text size="sm" weight="bold" className="text-main group-hover/item:text-primary transition-colors truncate">
        {t(event.titleKey)}
      </Text>
    </button>
  )
}))

OverviewItem.displayName = 'OverviewItem'

const QuickOverviewWidget = () => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)

  const handleGoToCalendar = useCallback(() => {
    navigate('/calendar')
  }, [navigate])

  return (
    <Card className="quick-overview-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('common.quick_overview')}
          </Heading>
        </Stack>

        <Button
          variant="ghost"
          size="xs"
          className="font-black uppercase tracking-widest text-primary hover:bg-bg-card/50"
          onClick={handleGoToCalendar}
          iconRight={ChevronRight}
          aria-label={t('calendar')}
        >
          {t('calendar')}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        <div className="h-full w-full flex flex-col gap-[var(--space-xs)]">
          <Text size="xs" weight="bold" className="text-text-muted uppercase tracking-wider mb-[2px]">
            {t('todays_schedule')}
          </Text>
          {todayEvents.map((event) => (
              <OverviewItem
              key={event.titleKey}
              event={event}
              onClick={handleGoToCalendar}
            />
          ))}
        </div>
      </Card.Body>

      <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-end items-center">
        <div className="flex items-center gap-[var(--space-xs)] opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-[var(--space-sm)] group-hover/widget:translate-x-0">
          <Button
            variant="ghost"
            size="xs"
            className="text-primary uppercase font-black tracking-tighter p-0 h-auto hover:bg-transparent"
            onClick={handleGoToCalendar}
            iconRight={Clock}
          >
            {t('open')}
          </Button>
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
      expect(screen.getByText('Hurtig oversigt')).toBeInTheDocument()
      expect(screen.getByText('08')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()
      expect(screen.getByText('Forelæsning')).toBeInTheDocument()
      expect(screen.getByText('23')).toBeInTheDocument()
      expect(screen.getByText('59')).toBeInTheDocument()
      expect(screen.getByText('Projektrapport')).toBeInTheDocument()
    })

    it('navigates to calendar when link is clicked', () => {
      renderWithProviders(<QuickOverviewWidget />)
      const link = screen.getByText('Kalender')
      fireEvent.click(link)
      expect(mockNavigate).toHaveBeenCalledWith('/calendar')
    })

    it('renders divider between events', () => {
      const { container } = renderWithProviders(<QuickOverviewWidget />)
      const items = container.querySelectorAll('.border-transparent')
      expect(items.length).toBe(2)
    })
  })
}
