import { memo, type DragEvent } from 'react'
import type { Widget, WidgetProps } from '@/lib/types'
import Grid from '@/components/Grid'
import Stack from '@/components/Stack'
import Button from '@/components/Button'
import { EyeOff, GripVertical } from 'lucide-react'
import ErrorBoundary from '@/components/ErrorBoundary'
import ResizeCorner from '@/components/ResizeCorner'
import { useResizeHandle } from '@/lib/useResizeHandle'
import { WIDGET_CONFIG } from '@/lib/mockData'

interface WidgetWrapperProps {
  widget: Widget
  x?: number
  y?: number
  tabletSpan: number
  mobileSpan: number
  isEditing: boolean
  isDragged: boolean
  WidgetComponent: React.ComponentType<WidgetProps>
  onDragStart: (e: DragEvent<HTMLElement>, id: string, isEditing: boolean) => void
  onDragEnd: () => void
  onDragOver: (e: DragEvent<HTMLElement>, targetId?: string) => void
  onDrop: (e: DragEvent<HTMLElement>, x: number | string, y?: number) => void
  toggleVisibility: (id: string) => void
  resizeWidget: (id: string, newSpan: number, newRowSpan?: number) => void
  t: (key: string) => string
  moveWidget: (id: string, direction: 'left' | 'right') => void
}

export const WidgetWrapper = memo(function WidgetWrapper({
  widget,
  x,
  y,
  tabletSpan,
  mobileSpan,
  isEditing,
  isDragged,
  WidgetComponent,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  toggleVisibility,
  resizeWidget,
  t,
  moveWidget,
}: WidgetWrapperProps) {
  const defaultRowSpan = WIDGET_CONFIG[widget.id]?.rowSpan || 1
  const resolvedRowSpan = widget.rowSpan || defaultRowSpan

  const { handleResize: resizeWidth } = useResizeHandle(widget.id, widget.span, resolvedRowSpan, resizeWidget)
  const { handleResize: resizeHeight } = useResizeHandle(widget.id, widget.span, resolvedRowSpan, resizeWidget)

  return (
    <Grid.Item
      span={widget.span}
      rowSpan={resolvedRowSpan}
      x={x}
      y={y}
      tabletSpan={tabletSpan}
      mobileSpan={mobileSpan}
      key={widget.id}
      className={`dashboard__widget group relative h-full w-full ${isEditing ? 'z-10' : ''} ${
        isDragged
          ? 'opacity-40 border-2 border-dashed border-primary rounded-[var(--radius-lg)] bg-primary/5 transition-all'
          : ''
      }`}
      draggable={isEditing}
      onDragStart={(e: DragEvent<HTMLElement>) => onDragStart(e, widget.id, isEditing)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e: DragEvent<HTMLElement>) => onDrop(e, widget.id)}
    >
      <div
        className={`h-full w-full flex flex-col overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform ${
          isEditing
            ? 'scale-[0.98] ring-2 ring-primary/40 ring-offset-2 dark:ring-offset-bg-card border-2 border-dashed border-primary/50 bg-primary/[0.01] hover:scale-[0.99] hover:ring-primary/70 hover:border-primary/80 rounded-[var(--radius-lg)] p-sm md:p-lg'
            : 'scale-100'
        } ${isEditing ? 'is-editing' : ''}`}
      >
        {isEditing && (
          <>
            {/* Visual handle edge indicator overlays */}
            <div
              className="absolute top-0 right-0 w-[12px] h-full cursor-ew-resize z-20 group-hover:bg-primary/5 active:bg-primary/15 transition-colors rounded-r-lg"
              title={t('resize_width') || 'Drag to resize width'}
              onMouseDown={(e) => resizeWidth(e, 'width')}
              onTouchStart={(e) => resizeWidth(e, 'width')}
            />
            <div
              className="absolute bottom-0 left-0 w-full h-[12px] cursor-ns-resize z-20 group-hover:bg-primary/5 active:bg-primary/15 transition-colors rounded-b-lg"
              title={t('resize_height') || 'Drag to resize height'}
              onMouseDown={(e) => resizeHeight(e, 'height')}
              onTouchStart={(e) => resizeHeight(e, 'height')}
            />

            {/* Corner diagonal handle details for resize affordance */}
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity z-20 flex flex-col justify-end items-end">
              <ResizeCorner className="text-primary dark:text-accent" />
            </div>

            <Stack className="absolute top-[var(--space-xs)] right-[var(--space-md)] z-10 flex gap-[var(--space-2xs)] bg-bg-card p-[var(--space-2xs)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] dark:border dark:border-border">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center cursor-grab active:cursor-grabbing text-muted hover:text-main focus-visible:outline-none focus-visible:shadow-focus rounded-md border-none bg-transparent"
                title={t('drag_to_reorder') || 'Drag to reorder'}
                aria-label={t('drag_to_reorder') || 'Drag to reorder'}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    moveWidget(widget.id, 'left');
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    moveWidget(widget.id, 'right');
                  }
                }}
              >
                <GripVertical size={16} strokeWidth={2} />
              </button>
              <Button
                variant="ghost"
                size="sm"
                icon={EyeOff}
                onClick={() => toggleVisibility(widget.id)}
                aria-label={t('hide_widget')}
                className="w-[var(--space-2xl)] h-[var(--space-2xl)] p-0"
              />
            </Stack>
          </>
        )}
        <ErrorBoundary name={widget.id}>
          <div className="flex-1 flex flex-col min-h-0 w-full h-full isolate overflow-visible">
            <WidgetComponent span={widget.span} isEditing={isEditing} />
          </div>
        </ErrorBoundary>
      </div>
    </Grid.Item>
  )
})
