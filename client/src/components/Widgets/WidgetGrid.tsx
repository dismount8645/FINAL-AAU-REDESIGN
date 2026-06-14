import { useState, useEffect } from 'react';
import QuickOverviewWidget from './QuickOverviewWidget'
import ForumActivityWidget from './ForumActivityWidget'
import { DeadlinesWidget, FavoritesWidget, SupportWidget, MessagesWidget, CalendarWidget, CourseProgressWidget, ShortcutsWidget } from './DashboardWidgets'
import { AlertCircle, MoreVertical, ArrowUp, ArrowDown, Trash2, GripVertical } from 'lucide-react';
import { Card, Dropdown } from '@/components/ui';

import useStore from '@/store';

interface WidgetItem {
  id: string
  span: number
  size?: 'small' | 'medium' | 'large'
}

interface WidgetGridProps {
  widgets: WidgetItem[]
  isEditing?: boolean
  onLayoutChange?: (widgets: WidgetItem[]) => void
  onToggleWidget?: (id: string, visible: boolean) => void
  hideFirstDeadline?: boolean
  isMessagesElevated?: boolean
}

const SIZE_TO_SPAN: Record<'small' | 'medium' | 'large', number> = {
  small: 4,
  medium: 8,
  large: 12,
}

// Widget display names for error state copy
const WIDGET_TITLES: Record<string, { da: string; en: string }> = {
  deadlines:      { da: 'afleveringer', en: 'assignments' },
  messages:       { da: 'beskeder', en: 'messages' },
  calendar:       { da: 'kalender', en: 'calendar' },
  favorites:      { da: 'favoritter', en: 'favorites' },
  courseProgress: { da: 'kursusfremskridt', en: 'course progress' },
  forumActivity:  { da: 'forumaktivitet', en: 'forum activity' },
  support:        { da: 'support', en: 'support' },
  quickOverview:  { da: 'dagens program', en: 'daily schedule' },
  shortcuts:      { da: 'genveje', en: 'shortcuts' },
}

function WidgetSkeletonBody() {
  return (
    <div className="flex flex-col gap-xs p-sm animate-pulse">
      <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded mt-xs" />
      <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  )
}

function WidgetSkeletonHeader() {
  return (
    <div className="flex items-center gap-xs py-1 animate-pulse">
      <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  )
}

function WidgetError({ widgetTitle, onRetry, lang }: { widgetTitle: string; onRetry: () => void; lang: 'da' | 'en' }) {
  const retryLabel = lang === 'da' ? `Prøv igen for ${widgetTitle}` : `Retry ${widgetTitle}`
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-sm py-lg px-md text-center"
    >
      <AlertCircle className="text-danger/60 shrink-0" size={20} aria-hidden="true" />
      <span className="text-sm font-semibold text-main">
        {lang === 'da'
          ? `Kunne ikke hente ${widgetTitle}`
          : `Could not load ${widgetTitle}`}
      </span>
      <span className="text-xs text-muted max-w-[200px] leading-relaxed">
        {lang === 'da'
          ? 'Forbindelsen afbrød eller timeout.'
          : 'Connection failed or timed out.'}
      </span>
      <button
        onClick={onRetry}
        className="min-h-[44px] px-md text-sm font-bold text-primary border border-primary/40 rounded-[var(--radius-md)] hover:bg-primary/5 transition-colors focus-visible:shadow-focus focus-visible:outline-none"
        aria-label={retryLabel}
      >
        {lang === 'da' ? 'Prøv igen' : 'Retry'}
      </button>
    </div>
  )
}

function WidgetPermissionDeniedBody({ lang }: { lang: 'da' | 'en' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-xs py-lg px-md text-center">
      <span className="text-xs font-semibold text-main">
        {lang === 'da' ? 'Ingen adgang' : 'Access Denied'}
      </span>
      <span className="text-xs text-muted max-w-[200px] leading-relaxed">
        {lang === 'da'
          ? 'Du har ikke tilladelse til at se dette modul.'
          : 'You do not have permission to view this widget.'}
      </span>
    </div>
  )
}

interface WidgetStateWrapperProps {
  id: string
  size: 'small' | 'medium' | 'large'
  children: React.ReactNode
}

function WidgetStateWrapper({ id, size, children }: WidgetStateWrapperProps) {
  const lang = useStore(state => state.lang);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'permission_denied'>(() => {
    if (id === 'courseProgress') return 'permission_denied';
    return 'loading';
  });

  const loadData = () => {
    if (id === 'courseProgress') {
      setStatus('permission_denied');
      return;
    }
    setStatus('loading');

    let timeoutTimer: NodeJS.Timeout;
    const loadTimer = setTimeout(() => {
      setStatus('success');
      if (timeoutTimer) clearTimeout(timeoutTimer);
    }, 400);

    timeoutTimer = setTimeout(() => {
      setStatus('error');
    }, 10000);

    return { loadTimer, timeoutTimer };
  };

  useEffect(() => {
    const timers = loadData();
    return () => {
      if (timers) {
        clearTimeout(timers.loadTimer);
        clearTimeout(timers.timeoutTimer);
      }
    };
  }, [id]);

  const widgetTitle = WIDGET_TITLES[id]?.[lang] ?? id;

  if (status === 'loading') {
    return (
      <Card className={`w-full flex flex-col overflow-hidden shadow-[var(--shadow-sm)] border-[var(--border-color)]/60 ${size === 'small' ? 'min-h-[140px]' : size === 'medium' ? 'min-h-[200px]' : 'min-h-[300px]'}`}>
        <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/20">
          <WidgetSkeletonHeader />
        </Card.Header>
        <Card.Body padding="compact" className="flex-1">
          <WidgetSkeletonBody />
        </Card.Body>
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Card className="w-full flex flex-col overflow-hidden shadow-[var(--shadow-sm)] border-[var(--border-color)]/60">
        <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/20">
          <WidgetSkeletonHeader />
        </Card.Header>
        <Card.Body padding="compact" className="flex-1">
          <WidgetError widgetTitle={widgetTitle} onRetry={loadData} lang={lang} />
        </Card.Body>
      </Card>
    )
  }

  if (status === 'permission_denied') {
    return (
      <Card className="w-full flex flex-col overflow-hidden shadow-[var(--shadow-sm)] border-[var(--border-color)]/60">
        <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/20">
          <WidgetSkeletonHeader />
        </Card.Header>
        <Card.Body padding="compact" className="flex-1">
          <WidgetPermissionDeniedBody lang={lang} />
        </Card.Body>
      </Card>
    )
  }

  return <>{children}</>
}

export function WidgetGrid({ widgets, isEditing = false, onLayoutChange, onToggleWidget, hideFirstDeadline = false, isMessagesElevated = false }: WidgetGridProps) {
  const lang = useStore((state) => state.lang)

  const handleSizeChange = (id: string, newSize: 'small' | 'medium' | 'large') => {
    if (!onLayoutChange) return
    const updated = widgets.map((w) => {
      if (w.id === id) {
        return {
          ...w,
          size: newSize,
          span: SIZE_TO_SPAN[newSize],
        }
      }
      return w
    })
    onLayoutChange(updated)
  }

  const handleMoveUp = (index: number) => {
    if (!onLayoutChange || index === 0) return
    const updated = [...widgets]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onLayoutChange(updated)
  }

  const handleMoveDown = (index: number) => {
    if (!onLayoutChange || index === widgets.length - 1) return
    const updated = [...widgets]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onLayoutChange(updated)
  }

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

if (import.meta.vitest) {
  const { describe, it, expect, vi } = await import('vitest')
  const { renderWithProviders } = await import('@/test/test-utils')

  describe('WidgetGrid', () => {
    it('renders widgets', () => {
      const widgets = [
        { id: 'deadlines', span: 8 },
        { id: 'favorites', span: 8 },
        { id: 'support', span: 8 },
      ]
      const { container } = renderWithProviders(<WidgetGrid widgets={widgets} />)
      expect(container.querySelector('[data-testid="dashboard-columns"]')).toBeInTheDocument()
    })
    it('handles unknown widget type gracefully', () => {
      const widgets = [{ id: 'nonexistent', span: 12 }]
      const { container } = renderWithProviders(<WidgetGrid widgets={widgets} />)
      expect(container.querySelector('[data-testid="dashboard-columns"]')).toBeInTheDocument()
    })
    it('calls onLayoutChange when move up button clicked', () => {
      const widgets = [
        { id: 'deadlines', span: 8, size: 'medium' as const },
        { id: 'calendar', span: 8, size: 'medium' as const },
      ]
      const onLayoutChange = vi.fn()
      const { container } = renderWithProviders(
        <WidgetGrid widgets={widgets} isEditing={true} onLayoutChange={onLayoutChange} />
      )
      expect(container.querySelector('[data-testid="dashboard-columns"]')).toBeInTheDocument()
    })
  })
}
