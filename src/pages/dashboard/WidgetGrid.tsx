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
        // Proportional spans for responsive layout
        // Desktop: 24 columns
        // Tablet: 12 columns (50% of desktop)
        // Mobile: 6 columns (25% of desktop)
        const tabletSpan = WIDGET_CONFIG[widget.id]?.tabletSpan || Math.max(4, Math.ceil(widget.span / 2))
        const mobileSpan = 6 // Always full width on mobile for better readability
        return (
          <WidgetWrapper
            key={widget.id}
            widget={widget}
            x={widget.x}
            y={widget.y}
            tabletSpan={tabletSpan}
            mobileSpan={mobileSpan}
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
