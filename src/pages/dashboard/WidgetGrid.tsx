import { type DragEvent } from 'react'
import type { Widget, WidgetProps } from '@/types'
import Grid from '@/components/ui/Grid'
import { WIDGET_CONFIG } from '@/data/mockData'
import {
  FavoritesWidget,
  QuickOverviewWidget,
  DeadlinesWidget,
  RecentGradesWidget,
  ForumActivityWidget,
} from '@/widgets'
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
}: WidgetGridProps) {
  return (
    <Grid columns={24} tabletColumns={12} mobileColumns={6} className="dashboard__grid relative">
      {isEditing && (
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
                className="w-full aspect-square border border-dashed border-slate-200 dark:border-white/10 rounded-[var(--radius-md)]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, x, y)}
              />
            )
          })}
        </div>
      )}
      {visibleWidgets.map((widget) => {
        const WidgetComponent = WIDGET_COMPONENTS[widget.id]
        if (!WidgetComponent) return null
        
        // Strictly align with UI Architect's request:
        // lg: grid-cols-4 (24/4 = 6 span)
        // md: grid-cols-3 (12/3 = 4 span)
        // sm: grid-cols-1 (6/1 = 6 span)
        const lgSpan = widget.span || 6
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
          />
        )
      })}
    </Grid>
  )
}
