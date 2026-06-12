import { useState, useEffect } from 'react';
import { Grid } from '@/components/Layout/LayoutPrimitives';
import QuickOverviewWidget from './QuickOverviewWidget'
import ForumActivityWidget from './ForumActivityWidget'
import { DeadlinesWidget, FavoritesWidget, SupportWidget, MessagesWidget, CalendarWidget, CourseProgressWidget } from './DashboardWidgets'
import { GripVertical, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui';
import Button from '@/components/ui/Button';

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
}

const SIZE_TO_SPAN: Record<'small' | 'medium' | 'large', number> = {
  small: 4,
  medium: 8,
  large: 12,
}

function WidgetSkeleton({ size }: { size: 'small' | 'medium' | 'large' }) {
  const height = size === 'small' ? 'h-36' : size === 'medium' ? 'h-64' : 'h-96';
  return (
    <Card className={`w-full ${height} flex flex-col overflow-hidden border-[var(--border-color)]/60 shadow-[var(--shadow-sm)] animate-pulse`}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/20">
        <div className="flex items-center gap-xs w-full py-1">
          <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </Card.Header>
      <Card.Body padding="compact" className="p-sm flex-1 flex flex-col gap-xs">
        <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded mt-xs" />
        {size !== 'small' && (
          <>
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
          </>
        )}
      </Card.Body>
    </Card>
  );
}

function WidgetError({ title: _title, onRetry, lang }: { title: string; onRetry: () => void; lang: 'da' | 'en' }) {
  return (
    <Card className="w-full h-full min-h-[160px] flex flex-col justify-center items-center p-md text-center border-danger/30 bg-danger/5 shadow-[var(--shadow-sm)]">
      <AlertCircle className="text-danger mb-xs shrink-0" size={24} />
      <span className="text-xs font-bold text-main block mb-2xs">
        {lang === 'da' ? 'Kunne ikke hente data' : 'Could not fetch data'}
      </span>
      <span className="text-[10px] text-muted max-w-[200px] mb-xs block">
        {lang === 'da'
          ? 'Forbindelsen afbrød eller timeout blev nået.'
          : 'The connection timed out or failed.'}
      </span>
      <Button variant="outline" size="xs" onClick={onRetry} className="font-bold text-[10px]">
        {lang === 'da' ? 'Prøv igen' : 'Retry'}
      </Button>
    </Card>
  );
}

function WidgetPermissionDenied({ title: _title, lang }: { title: string; lang: 'da' | 'en' }) {
  return (
    <Card className="w-full h-full min-h-[160px] flex flex-col justify-center items-center p-md text-center border-warning/30 bg-warning/5 shadow-[var(--shadow-sm)]">
      <div className="p-xs bg-warning/10 rounded-full text-warning mb-xs shrink-0">
        <AlertCircle size={20} />
      </div>
      <span className="text-xs font-bold text-main block mb-2xs">
        {lang === 'da' ? 'Ingen adgang' : 'Access Denied'}
      </span>
      <span className="text-[10px] text-muted max-w-[200px] block">
        {lang === 'da'
          ? 'Du har ikke tilladelse til at se dette modul.'
          : 'You do not have permission to view this widget.'}
      </span>
    </Card>
  );
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

    const loadTimer = setTimeout(() => {
      setStatus('success');
    }, 400);

    const timeoutTimer = setTimeout(() => {
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

  if (status === 'loading') {
    return <WidgetSkeleton size={size} />;
  }
  if (status === 'error') {
    return <WidgetError title={id} onRetry={loadData} lang={lang} />;
  }
  if (status === 'permission_denied') {
    return <WidgetPermissionDenied title={id} lang={lang} />;
  }
  return <>{children}</>;
}

export function WidgetGrid({ widgets, isEditing = false, onLayoutChange }: WidgetGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const t = useStore((state) => state.t)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isEditing) return
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    
    const target = e.currentTarget as HTMLElement
    target.classList.add('widget-dragging')
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null)
    setDragOverIndex(null)
    const target = e.currentTarget as HTMLElement
    target.classList.remove('widget-dragging')
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!isEditing) return
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    if (!isEditing || draggedIndex === null || !onLayoutChange) return
    e.preventDefault()
    
    const updated = [...widgets]
    const [draggedItem] = updated.splice(draggedIndex, 1)
    updated.splice(index, 0, draggedItem)
    
    onLayoutChange(updated)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

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

  const renderWidgetContent = (id: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    switch (id) {
      case 'deadlines':
        return <DeadlinesWidget size={size} hideFirst={!isEditing} />
      case 'favorites':
        return <FavoritesWidget size={size} />
      case 'quickOverview':
        return <QuickOverviewWidget size={size} />
      case 'forumActivity':
        return <ForumActivityWidget size={size} />
      case 'support':
        return <SupportWidget size={size} />
      case 'messages':
        return <MessagesWidget size={size} />
      case 'calendar':
        return <CalendarWidget size={size} />
      case 'courseProgress':
        return <CourseProgressWidget size={size} />
      default:
        return null
    }
  }

  return (
    <Grid className="dashboard__grid relative animate-fade-in" style={{ '--grid-cols': 'var(--dashboard-grid-cols, 12)', gridAutoRows: 'minmax(80px, auto)' } as React.CSSProperties}>
      {widgets.map((widget, index) => {
        const isCurrentlyDragged = draggedIndex === index
        const isHoveredIndicator = dragOverIndex === index
        const widgetSize = widget.size || 'medium'
        const currentSpan = SIZE_TO_SPAN[widgetSize]
        
        return (
          <Grid.Item
            key={widget.id}
            span={currentSpan}
            draggable={isEditing}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              widget-${widget.id}
              widget-size-${widgetSize}
              relative transition-all duration-150 ease-out rounded-[var(--radius-md)] overflow-hidden
              ${isEditing ? 'cursor-grab active:cursor-grabbing border border-dashed border-[var(--border-color)] p-1 hover:border-primary/50' : ''}
              ${isCurrentlyDragged ? 'opacity-40 border border-solid border-primary' : ''}
              ${isHoveredIndicator ? 'scale-[1.01] shadow-[var(--shadow-md)] border border-solid border-primary bg-primary/5' : ''}
            `}
          >
            {isEditing && (
              <div className="absolute top-1.5 right-1.5 z-50 flex items-center gap-1.5">
                <select
                  value={widgetSize}
                  onChange={(e) => handleSizeChange(widget.id, e.target.value as 'small' | 'medium' | 'large')}
                  className="bg-bg-card/95 border border-[var(--border-color)] text-[10px] font-bold text-main px-1.5 py-0.5 rounded-[var(--radius-xs)] shadow-[var(--shadow-sm)] outline-none focus:border-primary cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="small">{t('dashboard.size_small')}</option>
                  <option value="medium">{t('dashboard.size_medium')}</option>
                  <option value="large">{t('dashboard.size_large')}</option>
                </select>
                <div className="bg-bg-card/95 border border-[var(--border-color)] px-1.5 py-0.5 rounded-[var(--radius-xs)] flex items-center gap-0.5 text-[9px] font-bold text-primary select-none shadow-[var(--shadow-sm)]">
                  <GripVertical className="size-2.5 text-primary" />
                  <span>TRÆK</span>
                </div>
              </div>
            )}
            <div className={isEditing ? 'pointer-events-none opacity-80' : ''}>
              <WidgetStateWrapper id={widget.id} size={widgetSize}>
                {renderWidgetContent(widget.id, widgetSize)}
              </WidgetStateWrapper>
            </div>
          </Grid.Item>
        )
      })}
    </Grid>
  )
}

if (import.meta.vitest) {
  const { describe, it, expect } = await import('vitest')
  const { renderWithProviders } = await import('@/test/test-utils')

  describe('WidgetGrid', () => {
    it('renders widgets', () => {
      const widgets = [
        { id: 'deadlines', span: 8 },
        { id: 'favorites', span: 8 },
        { id: 'support', span: 8 },
      ]
      const { container } = renderWithProviders(<WidgetGrid widgets={widgets} />)
      expect(container.querySelector('.dashboard__grid')).toBeInTheDocument()
    })
    it('handles unknown widget type gracefully', () => {
      const widgets = [{ id: 'nonexistent', span: 12 }]
      const { container } = renderWithProviders(<WidgetGrid widgets={widgets} />)
      expect(container.querySelector('.dashboard__grid')).toBeInTheDocument()
    })
    it('triggers drop callback and reorders widgets', () => {
      const widgets = [
        { id: 'deadlines', span: 8 },
        { id: 'favorites', span: 8 },
      ]
      const onLayoutChange = vi.fn()
      const { container } = renderWithProviders(
        <WidgetGrid widgets={widgets} isEditing={true} onLayoutChange={onLayoutChange} />
      )
      
      const gridItems = container.querySelectorAll('.dashboard__grid > div')
      expect(gridItems.length).toBe(2)

      const firstItem = gridItems[0]
      const secondItem = gridItems[1]

      const dataTransfer = {
        setData: vi.fn(),
        effectAllowed: 'none',
      }
      
      fireEvent.dragStart(firstItem, { dataTransfer })
      fireEvent.dragOver(secondItem)
      fireEvent.drop(secondItem)

      expect(onLayoutChange).toHaveBeenCalledWith([
        { id: 'favorites', span: 8 },
        { id: 'deadlines', span: 8 },
      ])
    })
  })
}
