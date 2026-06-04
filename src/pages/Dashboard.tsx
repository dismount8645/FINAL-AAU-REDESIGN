import { useState, useMemo } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit, Check } from 'lucide-react';
import { useLocation, MemoryRouter } from 'react-router-dom';
import { WidgetCustomizer } from '@/components/WidgetCustomizer';
import { WidgetGrid } from '@/components/WidgetGrid';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';
import { Stack } from '@/components/LayoutPrimitives';
import { DEFAULT_WIDGETS } from '@/lib/mockData';
import useStore from '@/lib/store';
import { useWidgetDrag } from '@/lib/useWidgetDrag';

function Dashboard() {
  const t = useStore((state) => state.t)
  const location = useLocation()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const {
    widgets,
    toggleVisibility,
    resizeWidget,
    resetWidgets,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    draggedItemId,
    moveWidget,
  } = useWidgetDrag(DEFAULT_WIDGETS)

  const hiddenWidgets = useMemo(
    () => DEFAULT_WIDGETS.filter((dw) => !widgets.find((w) => w.id === dw.id)?.visible),
    [widgets]
  )

  const widgetLabels = useMemo<Record<string, string>>(
    () => ({
      favorites: t('nav.favorites'),
      quickOverview: t('common.quick_overview'),
      deadlines: t('common.deadline'),
      recentGrades: t('grades.recent_grades'),
      forumActivity: t('course.forum_activity'),
    }),
    [t]
  )

  const visibleWidgets = useMemo(() => widgets.filter((w) => w.visible), [widgets])

  return (
    <Stack
      className={`dashboard-page relative ${
        isEditing
          ? "dashboard--editing before:content-[''] before:fixed before:inset-0 before:bg-[rgba(var(--aau-blue-rgb),0.03)] before:pointer-events-none before:z-[1]"
          : ''
      }`}
    >
      <PageHeader
        key={location.key}
        pageKey="dashboard"
        title={t('common.welcome')}
        subtitle={t('common.assignments_count')}
        actionsAlign="center"
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={isEditing ? Check : Edit}
            onClick={() => setIsEditing(!isEditing)}
            className="dashboard__edit-trigger transition-all duration-[var(--transition-fast)]"
          >
            {isEditing ? t('common.done') : t('dashboard.edit_dashboard')}
          </Button>
        }
      />

      <div className="w-full max-w-[var(--container-max-width)] mx-auto px-[var(--space-md)] pt-[var(--space-lg)] pb-[var(--space-2xl)]">
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <WidgetCustomizer
                hiddenWidgets={hiddenWidgets}
                widgetLabels={widgetLabels}
                toggleVisibility={toggleVisibility}
                resetWidgets={resetWidgets}
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <WidgetGrid
          isEditing={isEditing}
          visibleWidgets={visibleWidgets}
          draggedItemId={draggedItemId}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          toggleVisibility={toggleVisibility}
          resizeWidget={resizeWidget}
          t={t}
          moveWidget={moveWidget}
        />
      </div>
    </Stack>
  )
}

export default Dashboard

if (import.meta.vitest) {
  describe('Dashboard Page', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
    })
  
    const renderDashboard = () => {
      return render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      )
    }
  
    it('renders correctly', () => {
      renderDashboard()
      expect(screen.getByText('Velkommen tilbage, Jacob')).toBeInTheDocument()
      expect(screen.getByText('Rediger dashboard')).toBeInTheDocument()
    })
  
    it('toggles edit mode', () => {
      renderDashboard()
      const editBtn = screen.getByText('Rediger dashboard')
      fireEvent.click(editBtn)
      
      expect(screen.getByText('Redigeringstilstand aktiveret')).toBeInTheDocument()
      expect(screen.getByText('Færdig')).toBeInTheDocument()
      
      fireEvent.click(screen.getByText('Færdig'))
      expect(screen.queryByText('Redigeringstilstand aktiveret')).not.toBeInTheDocument()
    })
  
    it('hides a widget in edit mode', () => {
      renderDashboard()
      fireEvent.click(screen.getByText('Rediger dashboard'))
      
      const hideBtn = screen.getAllByLabelText(/skjul|hide/i)[0]
      fireEvent.click(hideBtn)
      
      expect(screen.queryByText('Favoritter')).not.toBeInTheDocument()
    })
  
    it('handles drag events', () => {
      renderDashboard()
      fireEvent.click(screen.getByText('Rediger dashboard'))
      
      const widget = screen.getByText('Favoritter').closest('.dashboard__widget')
      
      // Drag Start
      fireEvent.dragStart(widget!)
      // Drag Over
      fireEvent.dragOver(widget!)
      // Drag End
      fireEvent.dragEnd(widget!)
      
      // Just verify no errors occurred
      expect(screen.getByText('Favoritter')).toBeInTheDocument()
    })
  
      it('resets widgets via dialog', () => {
      renderDashboard()
      fireEvent.click(screen.getByText('Rediger dashboard'))
  
      // Hide a widget
      fireEvent.click(screen.getAllByLabelText(/skjul|hide/i)[0])
      expect(screen.queryByText('Favoritter')).not.toBeInTheDocument()
  
      // Open reset dialog
      fireEvent.click(screen.getByText('Nulstil'))
      expect(screen.getByText('Nulstil layout?')).toBeInTheDocument()
  
      // Confirm reset
      fireEvent.click(screen.getByText('Bekræft nulstilling'))
      expect(screen.getByText('Favoritter')).toBeInTheDocument()
      })
  
      it('hides and adds widget back', () => {
      renderDashboard()
      fireEvent.click(screen.getByText('Rediger dashboard'))
  
      // Hide Favorites
      const hideBtn = screen.getAllByLabelText(/skjul|hide/i)[0]
      fireEvent.click(hideBtn)
      expect(screen.queryByText('Favoritter')).not.toBeInTheDocument()
  
      // Add it back
      fireEvent.click(screen.getByText('Tilføj widget'))
      fireEvent.click(screen.getByText('Favoritter'))
      expect(screen.getByText('Favoritter')).toBeInTheDocument()
      })
  })
}
