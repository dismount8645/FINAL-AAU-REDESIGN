import { MoreVertical, ArrowUp, ArrowDown, Trash2, GripVertical } from 'lucide-react';
import { Dropdown } from '@/components/ui';
import useStore from '@/store';
import QuickOverviewWidget from './QuickOverviewWidget'
import ForumActivityWidget from './ForumActivityWidget'
import { DeadlinesWidget, FavoritesWidget, SupportWidget, MessagesWidget, CalendarWidget, CourseProgressWidget, ShortcutsWidget } from './DashboardWidgets'
import { WidgetStateWrapper } from './WidgetSkeleton'
import { useWidgetGrid, WidgetItem } from './hooks/useWidgetGrid'

interface WidgetGridProps {
  widgets: WidgetItem[]
  isEditing?: boolean
  onLayoutChange?: (widgets: WidgetItem[]) => void
  onToggleWidget?: (id: string, visible: boolean) => void
  hideFirstDeadline?: boolean
  isMessagesElevated?: boolean
}

export function WidgetGrid({ widgets, isEditing = false, onLayoutChange, onToggleWidget, hideFirstDeadline = false, isMessagesElevated = false }: WidgetGridProps) {
  const lang = useStore((state) => state.lang)
  const { handleSizeChange, handleMoveUp, handleMoveDown } = useWidgetGrid(widgets, onLayoutChange)

  const renderWidgetContent = (id: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    switch (id) {
      case 'deadlines':
        return <DeadlinesWidget size={size} hideFirst={hideFirstDeadline} />
      case 'favorites':
        return <FavoritesWidget size={size} />
      case 'quickOverview':
        return <QuickOverviewWidget size={size} />
      case 'forumActivity':
        return <ForumActivityWidget size={size} />
      case 'support':
        return <SupportWidget size={size} />
      case 'messages':
        return <MessagesWidget size={size} isPriorityElevated={isMessagesElevated} />
      case 'calendar':
        return <CalendarWidget size={size} />
      case 'courseProgress':
        return <CourseProgressWidget size={size} />
      case 'shortcuts':
        return <ShortcutsWidget size={size} />
      default:
        return null
    }
  }

  // Split into left (medium/large/wide) and right (small/narrow) columns
  const leftWidgets = widgets.filter((widget) => {
    const widgetSize = widget.size || 'medium'
    return widget.span === 8 || widget.span === 12 || widgetSize === 'medium' || widgetSize === 'large'
  })
  const rightWidgets = widgets.filter((widget) => {
    const widgetSize = widget.size || 'medium'
    return widget.span === 4 || widgetSize === 'small'
  })

  return (
    <div
      className={`dashboard-columns flex flex-col lg:flex-row gap-md w-full animate-fade-in items-start ${isEditing ? 'is-editing' : ''}`}
      data-testid="dashboard-columns"
    >
      {/* Left column */}
      <div className="flex flex-col gap-md flex-1 w-full">
        {leftWidgets.map((widget) => {
          const widgetSize = widget.size || 'medium'
          const globalIndex = widgets.findIndex(w => w.id === widget.id)

          return (
            <div
              key={widget.id}
              className={`widget-${widget.id} widget-size-${widgetSize} relative ${isEditing ? 'ring-1 ring-[var(--border-color)] ring-offset-1 rounded-[var(--radius-lg)]' : ''}`}
            >
              {isEditing && (
                <>
                  <div className="absolute top-2 left-2 z-50 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-color)] bg-bg-card/95 text-muted/40 hover:text-muted cursor-grab shadow-sm opacity-50 hover:opacity-100 focus-within:opacity-100 transition-all duration-200" title={lang === 'da' ? 'Træk for at flytte' : 'Drag to move'}>
                    <GripVertical size={16} />
                  </div>
                  <div className="absolute top-2 right-2 z-50" onClick={e => e.stopPropagation()}>
                  <Dropdown>
                    <Dropdown.Trigger>
                      {({ ref, onClick, onKeyDown }, { isOpen }) => (
                        <button
                          ref={ref as any}
                          onClick={onClick}
                          onKeyDown={onKeyDown}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-color)] bg-bg-card/95 text-main hover:text-primary shadow-[var(--shadow-sm)] transition-all cursor-pointer focus-visible:outline-none focus-visible:shadow-focus"
                          aria-label={lang === 'da' ? 'Widget indstillinger' : 'Widget settings'}
                          aria-expanded={isOpen}
                          type="button"
                        >
                          <MoreVertical size={16} />
                        </button>
                      )}
                    </Dropdown.Trigger>
                    <Dropdown.Menu className="w-48">
                      <div className="p-xs text-[10px] font-extrabold text-muted uppercase tracking-wider select-none border-b border-border/40">
                        {lang === 'da' ? 'Størrelse' : 'Size'}
                      </div>
                      <Dropdown.Item onClick={() => handleSizeChange(widget.id, 'small')} className={widgetSize === 'small' ? 'text-primary bg-bg-highlight' : ''}>
                        {widgetSize === 'small' ? '✓ ' : ''}{lang === 'da' ? 'Lille' : 'Small'}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSizeChange(widget.id, 'medium')} className={widgetSize === 'medium' ? 'text-primary bg-bg-highlight' : ''}>
                        {widgetSize === 'medium' ? '✓ ' : ''}{lang === 'da' ? 'Medium' : 'Medium'}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSizeChange(widget.id, 'large')} className={widgetSize === 'large' ? 'text-primary bg-bg-highlight' : ''}>
                        {widgetSize === 'large' ? '✓ ' : ''}{lang === 'da' ? 'Stor' : 'Large'}
                      </Dropdown.Item>
                      
                      <div className="p-xs text-[10px] font-extrabold text-muted uppercase tracking-wider select-none border-t border-b border-border/40 mt-xs">
                        {lang === 'da' ? 'Rækkefølge' : 'Order'}
                      </div>
                      <Dropdown.Item onClick={() => handleMoveUp(globalIndex)} disabled={globalIndex === 0} className="flex items-center gap-xs">
                        <ArrowUp size={14} />
                        {lang === 'da' ? 'Flyt op' : 'Move up'}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleMoveDown(globalIndex)} disabled={globalIndex === widgets.length - 1} className="flex items-center gap-xs">
                        <ArrowDown size={14} />
                        {lang === 'da' ? 'Flyt ned' : 'Move down'}
                      </Dropdown.Item>

                      <div className="border-t border-border/40 mt-xs" />
                      <Dropdown.Item onClick={() => onToggleWidget && onToggleWidget(widget.id, false)} className="flex items-center gap-xs text-danger hover:bg-danger/10 hover:text-danger">
                        <Trash2 size={14} />
                        {lang === 'da' ? 'Skjul' : 'Hide'}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                </>
              )}
              <WidgetStateWrapper id={widget.id} size={widgetSize}>
                {renderWidgetContent(widget.id, widgetSize)}
              </WidgetStateWrapper>
            </div>
          )
        })}
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-md w-full lg:w-[340px] xl:w-[380px] shrink-0">
        {rightWidgets.map((widget) => {
          const widgetSize = widget.size || 'small'
          const globalIndex = widgets.findIndex(w => w.id === widget.id)

          return (
            <div
              key={widget.id}
              className={`widget-${widget.id} widget-size-${widgetSize} relative ${isEditing ? 'ring-1 ring-[var(--border-color)] ring-offset-1 rounded-[var(--radius-lg)]' : ''}`}
            >
              {isEditing && (
                <>
                  <div className="absolute top-2 left-2 z-50 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-color)] bg-bg-card/95 text-muted/40 hover:text-muted cursor-grab shadow-sm opacity-50 hover:opacity-100 focus-within:opacity-100 transition-all duration-200" title={lang === 'da' ? 'Træk for at flytte' : 'Drag to move'}>
                    <GripVertical size={16} />
                  </div>
                  <div className="absolute top-2 right-2 z-50" onClick={e => e.stopPropagation()}>
                  <Dropdown>
                    <Dropdown.Trigger>
                      {({ ref, onClick, onKeyDown }, { isOpen }) => (
                        <button
                          ref={ref as any}
                          onClick={onClick}
                          onKeyDown={onKeyDown}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-color)] bg-bg-card/95 text-main hover:text-primary shadow-[var(--shadow-sm)] transition-all cursor-pointer focus-visible:outline-none focus-visible:shadow-focus"
                          aria-label={lang === 'da' ? 'Widget indstillinger' : 'Widget settings'}
                          aria-expanded={isOpen}
                          type="button"
                        >
                          <MoreVertical size={16} />
                        </button>
                      )}
                    </Dropdown.Trigger>
                    <Dropdown.Menu className="w-48">
                      <div className="p-xs text-[10px] font-extrabold text-muted uppercase tracking-wider select-none border-b border-border/40">
                        {lang === 'da' ? 'Størrelse' : 'Size'}
                      </div>
                      <Dropdown.Item onClick={() => handleSizeChange(widget.id, 'small')} className={widgetSize === 'small' ? 'text-primary bg-bg-highlight' : ''}>
                        {widgetSize === 'small' ? '✓ ' : ''}{lang === 'da' ? 'Lille' : 'Small'}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSizeChange(widget.id, 'medium')} className={widgetSize === 'medium' ? 'text-primary bg-bg-highlight' : ''}>
                        {widgetSize === 'medium' ? '✓ ' : ''}{lang === 'da' ? 'Medium' : 'Medium'}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSizeChange(widget.id, 'large')} className={widgetSize === 'large' ? 'text-primary bg-bg-highlight' : ''}>
                        {widgetSize === 'large' ? '✓ ' : ''}{lang === 'da' ? 'Stor' : 'Large'}
                      </Dropdown.Item>
                      
                      <div className="p-xs text-[10px] font-extrabold text-muted uppercase tracking-wider select-none border-t border-b border-border/40 mt-xs">
                        {lang === 'da' ? 'Rækkefølge' : 'Order'}
                      </div>
                      <Dropdown.Item onClick={() => handleMoveUp(globalIndex)} disabled={globalIndex === 0} className="flex items-center gap-xs">
                        <ArrowUp size={14} />
                        {lang === 'da' ? 'Flyt op' : 'Move up'}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleMoveDown(globalIndex)} disabled={globalIndex === widgets.length - 1} className="flex items-center gap-xs">
                        <ArrowDown size={14} />
                        {lang === 'da' ? 'Flyt ned' : 'Move down'}
                      </Dropdown.Item>

                      <div className="border-t border-border/40 mt-xs" />
                      <Dropdown.Item onClick={() => onToggleWidget && onToggleWidget(widget.id, false)} className="flex items-center gap-xs text-danger hover:bg-danger/10 hover:text-danger">
                        <Trash2 size={14} />
                        {lang === 'da' ? 'Skjul' : 'Hide'}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                </>
              )}
              <WidgetStateWrapper id={widget.id} size={widgetSize}>
                {renderWidgetContent(widget.id, widgetSize)}
              </WidgetStateWrapper>
            </div>
          )
        })}
      </div>
    </div>
  )
}

