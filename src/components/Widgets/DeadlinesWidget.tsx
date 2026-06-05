import { useMemo, useCallback, memo } from 'react';


import { Calendar, ChevronRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';;
import { Text, Heading, MasterItem } from '@/components/ui';
import { dashboardDeadlines } from '@/lib/data';
import * as dates from '@/lib/dates';
import { hoursFromNow, calculateUrgency } from '@/lib/dates';
import useStore from '@/store';

import type { WidgetProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getWidgetDisplayLayout } from '@/config/widgetLayout';

// --- Helpers & Constants ---

type UrgencyLevel = 'overdue' | 'critical' | 'soon' | 'normal'

interface UrgencyConfig {
  level: UrgencyLevel
  color: string
  icon: typeof AlertCircle
  labelClass: string
}

const getUrgencyConfig = (deadlineDate: string): UrgencyConfig => {
  const level = calculateUrgency(deadlineDate)
  
  if (level === 'overdue') return { 
    level: 'overdue', 
    color: 'var(--color-aau-dark-pink)', 
    icon: AlertCircle,
    labelClass: 'text-danger font-black uppercase tracking-tighter' 
  }
  if (level === 'critical') return { 
    level: 'critical', 
    color: 'var(--color-aau-dark-pink)', 
    icon: Clock,
    labelClass: 'text-danger font-bold' 
  }
  if (level === 'soon') return { 
    level: 'soon', 
    color: 'var(--color-aau-dark-orange)', 
    icon: Clock,
    labelClass: 'text-warning font-semibold' 
  }
  return { 
    level: 'normal', 
    color: 'var(--color-text-main)', 
    icon: CheckCircle2,
    labelClass: 'text-primary dark:text-main' 
  }
}
interface ProcessedDeadline {
  id: number
  titleDa: string
  titleEn: string
  dateKey: string
  courseId: number
  deadlineHoursFromNow: number
  deadlineDate: string
  title: string
  urgency: UrgencyConfig
}

// --- Main Component ---

const DeadlinesWidget = ({ span, isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  const { itemsToShow, gridColumns } = useMemo(() => getWidgetDisplayLayout(span), [span])
  
  const deadlines = useMemo(() => (
    dashboardDeadlines.slice(0, itemsToShow).map((deadline) => {
      const deadlineDate = hoursFromNow(deadline.deadlineHoursFromNow)
      return {
        ...deadline,
        deadlineDate,
        title: localize(deadline, 'title'),
        urgency: getUrgencyConfig(deadlineDate),
      }
    })
  ), [itemsToShow, localize])

  const handleSeeAll = useCallback(() => {
    if (!isEditing) navigate('/calendar')
  }, [isEditing, navigate])

  const handleDeadlineClick = useCallback((dl: ProcessedDeadline) => {
    if (!isEditing) navigate(`/submission/${dl.courseId}/${dl.id}`)
  }, [isEditing, navigate])

  return (
    <Card className={cn(
      "deadlines-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {span && span > 4 ? t('next_assignment') : t('common.deadline')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size={span && span > 4 ? "xs" : "icon-xs"}
          className="font-black uppercase tracking-widest text-primary dark:text-white hover:bg-bg-card/50"
          onClick={handleSeeAll}
          iconRight={ChevronRight}
          aria-label={t('see_all_deadlines')}
        >
          {span && span > 4 ? t('see_all_deadlines') : ''}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        {deadlines.length > 0 ? (
          <div 
            className="grid gap-x-[var(--space-lg)] gap-y-[var(--space-xs)]" 
            style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
          >
            {deadlines.map((dl) => (
              <MasterItem
                key={dl.id}
                onClick={() => handleDeadlineClick(dl)}
                className={cn(
                  "p-[var(--space-2xs)] border border-transparent rounded-[var(--radius-lg)] hover:border-[var(--border-color)]/40",
                  dl.urgency.level === 'overdue' && "bg-danger/5 hover:bg-danger/10"
                )}
                leading={
                  <div className="shrink-0 flex items-center justify-center" style={{ color: dl.urgency.color }}>
                    <dl.urgency.icon size={20} strokeWidth={2} />
                  </div>
                }
                title={dl.title}
                subtitle={
                  <span className={cn(dl.urgency.labelClass, "text-xs mt-0.5")}>
                    {t(dl.dateKey)}
                  </span>
                }
              />
            ))}
          </div>
        ) : (
          <Stack align="center" justify="center" gap="md" className="h-full py-[var(--space-xl)] opacity-50 italic">
            <CheckCircle2 size={40} className="text-[var(--aau-dark-green)]/40" />
            <Text size="sm">{t('all_caught_up')}</Text>
          </Stack>
        )}
      </Card.Body>
      
      {/* Aesthetic Footer hint */}
      {deadlines.length > 0 && (
        <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center">
          <Text size="xs" weight="medium" className="text-muted italic">
            {deadlines.length} {t('upcoming')}
          </Text>
          <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
            <Text size="xs" weight="bold" className="text-primary dark:text-white uppercase tracking-tighter">{t('click_to_view')}</Text>
            <Clock size={10} strokeWidth={2.5} className="text-primary dark:text-white" />
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}

export default memo(DeadlinesWidget)

let mockNavigate: any
if (import.meta.vitest) {
  // Mock useNavigate
  mockNavigate = vi.fn()
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    }
  })

  vi.mock('@/lib/data', async (importOriginal) => {
    const actual = await importOriginal() as any
    const list: any[] = [...actual.dashboardDeadlines];
    (globalThis as any).__mockDeadlinesList = list
    return {
      ...actual,
      get dashboardDeadlines() {
        return (globalThis as any).__mockDeadlinesList
      }
    }
  })

  describe('DeadlinesWidget', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({ lang: 'da' })
    })
    it('renders correctly', () => {
      renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
      expect(screen.getByText('Næste aflevering')).toBeInTheDocument()
      expect(screen.getByText('To-Do App')).toBeInTheDocument()
      expect(screen.getByText('Designskitse')).toBeInTheDocument()
      expect(screen.getByText('Analyseopgave')).toBeInTheDocument()
    })
  
    it('navigates to submission when item is clicked', () => {
      renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
      const item = screen.getByText('To-Do App')
      fireEvent.click(item)
      expect(mockNavigate).toHaveBeenCalledWith('/submission/2/204')
    })
  
    it('navigates to calendar when footer button is clicked', () => {
      renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
      const btn = screen.getByText(/Se alle deadlines/i)
      fireEvent.click(btn)
      expect(mockNavigate).toHaveBeenCalledWith('/calendar')
    })
  
    it('renders correctly in English', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
      expect(screen.getByText('Monday 09:00')).toBeInTheDocument()
    })
  
    it('does not navigate when isEditing is true', () => {
      renderWithProviders(<DeadlinesWidget span={12} isEditing={true} />)
      fireEvent.click(screen.getByText('To-Do App'))
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  
    it('does not navigate from footer button when isEditing is true', () => {
      renderWithProviders(<DeadlinesWidget span={12} isEditing={true} />)
      fireEvent.click(screen.getByText(/Se alle deadlines/i))
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  
    it('renders only 1 item for small span (4)', () => {
      renderWithProviders(<DeadlinesWidget span={4} isEditing={false} />)
      expect(screen.getByText('To-Do App')).toBeInTheDocument()
      expect(screen.queryByText('Designskitse')).not.toBeInTheDocument()
      expect(screen.queryByText('Analyseopgave')).not.toBeInTheDocument()
    })
  
    it('renders 2 items for medium span (8)', () => {
      renderWithProviders(<DeadlinesWidget span={8} isEditing={false} />)
      expect(screen.getByText('To-Do App')).toBeInTheDocument()
      expect(screen.getByText('Designskitse')).toBeInTheDocument()
      expect(screen.queryByText('Analyseopgave')).not.toBeInTheDocument()
    })
  
    it('handles past deadline urgency color', () => {
      // Mock Date.now to be far in the future
      const now = new Date('2026-06-01').getTime()
      vi.spyOn(Date, 'now').mockReturnValue(now)
      
      renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
      // The items should now have the red color class
      // 'To-Do App' subtitle is 'Mandag 09:00'
      expect(screen.getByText('Mandag 09:00')).toHaveClass('text-danger')
      
      vi.restoreAllMocks()
    })
  
    it('handles overdue deadlines', () => {
      const spy = vi.spyOn(dates, 'calculateUrgency').mockReturnValue('overdue')
      
      renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
      const button = screen.getByRole('button', { name: /To-Do App/i })
      expect(button.className).toContain('bg-danger/5')
      
      spy.mockRestore()
    })
  
    it('supports keyboard focus and navigation', () => {
      renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
      const button = screen.getByRole('button', { name: /To-Do App/i })
      expect(button).toBeInTheDocument()
      button.focus()
      expect(button).toHaveFocus()
    })

    it('renders empty state when there are no deadlines', () => {
      useStore.setState({ lang: 'en' })
      const mockList = (globalThis as any).__mockDeadlinesList
      const original = [...mockList]
      mockList.length = 0
      renderWithProviders(<DeadlinesWidget span={12} isEditing={false} />)
      expect(screen.getByText(/caught up/i)).toBeInTheDocument()
      mockList.push(...original)
    })
  })
}
