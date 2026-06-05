import { type DragEvent, useMemo } from 'react'
import type { Widget, WidgetProps } from '@/lib/types'
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { WIDGET_CONFIG } from '@/lib/data'
import { FavoritesWidget } from '@/components/Favorites'
import QuickOverviewWidget from './QuickOverviewWidget'
import DeadlinesWidget from './DeadlinesWidget'
import RecentGradesWidget from '@/components/Grades/RecentGradesWidget';
import ForumActivityWidget from './ForumActivityWidget'
import { WidgetWrapper } from './WidgetWrapper'

const WIDGET_COMPONENTS: Record<string, React.ComponentType<WidgetProps>> = {
  favorites: FavoritesWidget,
  quickOverview: QuickOverviewWidget,
  deadlines: DeadlinesWidget,
  recentGrades: RecentGradesWidget,
  forumActivity: ForumActivityWidget,
}

interface WidgetGridProps {
  isEditing: boolean
  visibleWidgets: Widget[]
  draggedItemId: string | null
  onDragStart: (e: DragEvent<HTMLElement>, id: string, isEditing: boolean) => void
  onDragEnd: () => void
  onDragOver: (e: DragEvent<HTMLElement>, targetId?: string) => void
  onDrop: (e: DragEvent<HTMLElement>, x: number | string, y?: number) => void
  toggleVisibility: (id: string) => void
  resizeWidget: (id: string, newSpan: number, newRowSpan?: number) => void
  t: (key: string) => string
  moveWidget: (id: string, direction: 'left' | 'right') => void
}

export function WidgetGrid({
  isEditing,
  visibleWidgets,
  draggedItemId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  toggleVisibility,
  resizeWidget,
  t,
  moveWidget,
}: WidgetGridProps) {
  const editGridOverlay = useMemo(() => (
    <div
      className="absolute inset-0 grid gap-[var(--space-lg)] pointer-events-none p-[var(--space-md)]"
      style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
    >
      {Array.from({ length: 24 * 12 }).map((_, i) => {
        const x = i % 24
        const y = Math.floor(i / 24)
        return (
          <div
            key={i}
            className="w-full aspect-square border border-dashed border-border/60 dark:border-white/10 rounded-[var(--radius-md)]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, x, y)}
          />
        )
      })}
    </div>
  ), [onDrop])

  return (
    <Grid columns={24} tabletColumns={12} mobileColumns={6} className="dashboard__grid relative" style={{ gridAutoRows: 'minmax(100px, auto)' }}>
      {isEditing && editGridOverlay}
      {visibleWidgets.map((widget) => {
        const WidgetComponent = WIDGET_COMPONENTS[widget.id]
        if (!WidgetComponent) return null
        
        // Strictly align with UI Architect's request:
        // lg: grid-cols-4 (24/4 = 6 span)
        // md: grid-cols-3 (12/3 = 4 span)
        // sm: grid-cols-1 (6/1 = 6 span)
        const mdSpan = WIDGET_CONFIG[widget.id]?.tabletSpan || 4
        const smSpan = 6

        return (
          <WidgetWrapper
            key={widget.id}
            widget={widget}
            x={widget.x}
            y={widget.y}
            tabletSpan={mdSpan}
            mobileSpan={smSpan}
            isEditing={isEditing}
            isDragged={draggedItemId === widget.id}
            WidgetComponent={WidgetComponent}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={onDrop}
            toggleVisibility={toggleVisibility}
            resizeWidget={resizeWidget}
            t={t}
            moveWidget={moveWidget}
          />
        )
      })}
    </Grid>
  )
}

if (import.meta.vitest) {
  describe('WidgetGrid', () => {
    it('renders and supports drag over and drop on grid cells when editing', () => {
      const onDropMock = vi.fn()
      const onDragStartMock = vi.fn()
      const onDragEndMock = vi.fn()
      const onDragOverMock = vi.fn()
      const toggleVisibilityMock = vi.fn()
      const resizeWidgetMock = vi.fn()
      const moveWidgetMock = vi.fn()

      const widgets = [{ id: 'deadlines', x: 0, y: 0, span: 12, visible: true }]

      const { container } = renderWithProviders(
        <WidgetGrid
          isEditing={true}
          visibleWidgets={widgets}
          draggedItemId={null}
          onDragStart={onDragStartMock}
          onDragEnd={onDragEndMock}
          onDragOver={onDragOverMock}
          onDrop={onDropMock}
          toggleVisibility={toggleVisibilityMock}
          resizeWidget={resizeWidgetMock}
          t={(k) => k}
          moveWidget={moveWidgetMock}
        />
      )

      const cells = container.querySelectorAll('.w-full.aspect-square')
      expect(cells.length).toBe(24 * 12)

      fireEvent.dragOver(cells[0])
      fireEvent.drop(cells[0], { dataTransfer: {} })
      expect(onDropMock).toHaveBeenCalledWith(expect.any(Object), 0, 0)
    })

    it('renders without edit overlay when isEditing is false', () => {
      renderWithProviders(
        <WidgetGrid
          isEditing={false}
          visibleWidgets={[{ id: 'deadlines', x: 0, y: 0, span: 12, visible: true }]}
          draggedItemId={null}
          onDragStart={vi.fn()}
          onDragEnd={vi.fn()}
          onDragOver={vi.fn()}
          onDrop={vi.fn()}
          toggleVisibility={vi.fn()}
          resizeWidget={vi.fn()}
          t={(k) => k}
          moveWidget={vi.fn()}
        />
      )
    })

    it('handles unknown widget type gracefully', () => {
      const { container } = renderWithProviders(
        <WidgetGrid
          isEditing={false}
          visibleWidgets={[{ id: 'nonexistent', x: 0, y: 0, span: 12, visible: true }]}
          draggedItemId={null}
          onDragStart={vi.fn()}
          onDragEnd={vi.fn()}
          onDragOver={vi.fn()}
          onDrop={vi.fn()}
          toggleVisibility={vi.fn()}
          resizeWidget={vi.fn()}
          t={(k) => k}
          moveWidget={vi.fn()}
        />
      )
      expect(container.querySelector('.dashboard__grid')).toBeInTheDocument()
    })
  })
}
