import { memo, type DragEvent } from 'react'
import type { Widget, WidgetProps } from '@/types'
import Grid from '@/components/ui/Grid'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import { EyeOff, GripVertical } from 'lucide-react'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import ResizeCorner from '@/components/ui/ResizeCorner'
import { useResizeHandle } from '@/hooks/useResizeHandle'

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
}: WidgetWrapperProps) {
  const { handleResize: resizeWidth } = useResizeHandle(widget.id, widget.span, widget.rowSpan || 1, resizeWidget)
  const { handleResize: resizeHeight } = useResizeHandle(widget.id, widget.span, widget.rowSpan || 1, resizeWidget)

  return (
    <Grid.Item
      span={widget.span}
      rowSpan={widget.rowSpan || 1}
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
        className={`h-full w-full flex flex-col transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform ${
          isEditing
            ? 'scale-[0.98] ring-2 ring-primary/40 ring-offset-2 dark:ring-offset-slate-900 border-2 border-dashed border-primary/50 bg-primary/[0.01] hover:scale-[0.99] hover:ring-primary/70 hover:border-primary/80 rounded-[var(--radius-lg)] p-1.5'
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
            />
            <div
              className="absolute bottom-0 left-0 w-full h-[12px] cursor-ns-resize z-20 group-hover:bg-primary/5 active:bg-primary/15 transition-colors rounded-b-lg"
              title={t('resize_height') || 'Drag to resize height'}
              onMouseDown={(e) => resizeHeight(e, 'height')}
            />

            {/* Corner diagonal handle details for resize affordance */}
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity z-20 flex flex-col justify-end items-end">
              <ResizeCorner className="text-primary dark:text-sky-400" />
            </div>

            <Stack className="absolute top-[var(--space-xs)] right-[var(--space-md)] z-10 flex gap-[var(--space-2xs)] bg-[var(--bg-card)] p-[var(--space-2xs)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] dark:border dark:border-border">
              <div
                className="flex items-center cursor-grab active:cursor-grabbing text-muted hover:text-main p-[var(--space-2xs)]"
                title={t('drag_to_reorder') || 'Drag to reorder'}
              >
                <GripVertical size={14} strokeWidth={2} />
              </div>
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
          <div className="flex-1 flex flex-col min-h-0 w-full h-full isolate">
            <WidgetComponent span={widget.span} isEditing={isEditing} />
          </div>
        </ErrorBoundary>
      </div>
    </Grid.Item>
  )
})
