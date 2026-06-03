import { useMemo, useCallback, memo, forwardRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, Hourglass, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import Stack from '@/components/Stack';
import StatusItem from '@/components/StatusItem';
import { Text, Heading } from '@/components/Typography';
import { dashboardGrades } from '@/lib/dashboardWidgets';
import useStore from '@/lib/store';
import { renderWithProviders } from '@/lib/test-utils';
import type { WidgetProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getWidgetDisplayLayout } from '@/lib/widgetLayout';

interface Grade {
  id: number
  course: string
  title: string
  score: string | number | null
  date: string
}

/**
 * GradeItem - Individual grade entry with refactored A11y and tokens.
 */
const GradeItem = memo(forwardRef<HTMLDivElement, { 
  grade: Grade 
}>(({ grade }, ref) => {
  const t = useStore(state => state.t)
  
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="group/item"
    >
      <StatusItem
        icon={grade.score !== null ? Star : Hourglass}
        iconColor={grade.score !== null ? 'var(--color-warning)' : 'var(--color-text-disabled)'}
        title={grade.title}
        className="bg-transparent hover:bg-bg-hover px-[var(--space-2xs)] rounded-[var(--radius-lg)] transition-colors duration-150"
        right={
          <AnimatePresence mode="wait">
            {grade.score !== null ? (
              <motion.div
                key="score"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="recent-grades__score flex items-center justify-center w-8 h-8 bg-primary text-white rounded-[var(--radius-full)] text-[0.75rem] font-black shadow-sm group-hover/item:scale-110 transition-transform"
              >
                {grade.score}
              </motion.div>
            ) : (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Badge variant="default" pill className="text-[0.625rem] uppercase tracking-tighter h-[1.25rem] px-[var(--space-2xs)] flex items-center">
                  {t('not_graded')}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        }
      />
    </motion.div>
  )
}))

GradeItem.displayName = 'GradeItem'

/**
 * RecentGradesWidget - Performance overview and academic results.
 */
const RecentGradesWidget = ({ span, isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  const { itemsToShow, gridColumns } = useMemo(() => getWidgetDisplayLayout(span, 3, 2), [span])
  const visibleGrades = useMemo(() => (
    dashboardGrades.slice(0, itemsToShow).map((grade, index) => ({
      id: index + 1,
      course: grade.courseEn,
      title: localize(grade, 'course'),
      score: grade.score,
      date: '',
    }))
  ), [itemsToShow, localize])

  const handleViewAll = useCallback(() => {
    if (!isEditing) navigate('/grades')
  }, [isEditing, navigate])

  return (
    <Card className={cn(
      "recent-grades-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Trophy size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {span && span > 4 ? t('grades.recent_grades') : t('grades.page_title')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size={span && span > 4 ? "xs" : "icon-xs"}
          className="font-black uppercase tracking-widest text-primary hover:bg-bg-card/50"
          onClick={handleViewAll}
          iconRight={ChevronRight}
          aria-label={t('view_all')}
        >
          {span && span > 4 ? t('view_all') : ''}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        {visibleGrades.length > 0 ? (
          <div className="grid gap-[var(--space-xs)]" style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}>
            <AnimatePresence mode="popLayout">
              {visibleGrades.map((g) => (
                <GradeItem
                  key={g.id || g.title}
                  grade={g as Grade}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-[var(--space-md)]">
            <EmptyState
              icon={Trophy}
              title={t('no_recent_grades')}
              message={t('no_grades_message')}
              className="bg-transparent border-none p-0"
            />
          </div>
        )}
      </Card.Body>

      <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="xs" weight="medium" className="text-muted italic">
          {t('academic_results')}
        </Text>
        <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
          <Button 
            variant="ghost" 
            size="xs" 
            className="text-primary uppercase font-black tracking-tighter p-0 h-auto hover:bg-transparent"
            onClick={handleViewAll}
            iconRight={ChevronRight}
          >
            {t('details')}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}

RecentGradesWidget.displayName = 'RecentGradesWidget'

export default memo(RecentGradesWidget)

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

if (import.meta.vitest) {
  describe('RecentGradesWidget', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })
  
    it('renders correctly for large span (12)', () => {
      renderWithProviders(<RecentGradesWidget span={12} isEditing={false} />)
      expect(screen.getByText(/Seneste karakterer/i)).toBeInTheDocument()
      expect(screen.getByText('Digital Design')).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  
    it('renders correctly for small span (4)', () => {
      renderWithProviders(<RecentGradesWidget span={4} isEditing={false} />)
      // Should show 2 items
      expect(screen.getByText('Digital Design')).toBeInTheDocument()
      expect(screen.getByText('Videnskabsteori')).toBeInTheDocument()
      expect(screen.queryByText('Webudvikling')).not.toBeInTheDocument()
    })
  
    it('navigates to grades when footer button is clicked', () => {
      renderWithProviders(<RecentGradesWidget span={12} isEditing={false} />)
      const btn = screen.getByText(/Se alle/i)
      fireEvent.click(btn)
      expect(mockNavigate).toHaveBeenCalledWith('/grades')
    })
  
    it('does not navigate when isEditing is true', () => {
      renderWithProviders(<RecentGradesWidget span={12} isEditing={true} />)
      const btn = screen.getByText(/Se alle/i)
      fireEvent.click(btn)
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  
    it('shows "not graded" badge for ungraded courses', () => {
      renderWithProviders(<RecentGradesWidget span={12} isEditing={false} />)
      expect(screen.getByText('Ikke bedømt')).toBeInTheDocument()
    })
  
    it('renders 2 items for medium span (8)', () => {
      renderWithProviders(<RecentGradesWidget span={8} isEditing={false} />)
      expect(screen.getByText('Digital Design')).toBeInTheDocument()
      expect(screen.getByText('Videnskabsteori')).toBeInTheDocument()
      expect(screen.queryByText('Webudvikling')).not.toBeInTheDocument()
    })
  })
}
