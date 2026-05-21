import Grid from '@/components/ui/Grid';
import Stack from '@/components/ui/Stack';
import { Heading } from '@/components/ui/Typography';
import { useWidgetDrag } from '@/hooks/useWidgetDrag';
import { DEFAULT_WIDGETS } from '@/data/mockData';
import type { Widget } from '@/types';

/**
 * DashboardLayout Component
 * AI-Note: Layout-komponent med drag-and-drop logik via useWidgetDrag hook.
 */
export interface DashboardLayoutProps {
  title: string;
  widgets?: Widget[];
}

export default function DashboardLayout({ title, widgets: initialWidgets }: DashboardLayoutProps) {
  const { widgets, onDragStart, onDragEnd, onDragOver } = useWidgetDrag(initialWidgets || DEFAULT_WIDGETS);

  return (
    <Stack className="dashboard-layout">
      <Stack className="dashboard-layout__header">
        <Heading level={2}>{title}</Heading>
      </Stack>

      <Grid columns={12} gap="md" className="dashboard-layout__grid">
        {widgets.filter(w => w.visible).map((widget) => (
          <Grid.Item
            key={widget.id}
            span={widget.span}
            className="dashboard-layout__widget"
            draggable="true"
            role="button"
            tabIndex={0}
            aria-label={`Widget: ${widget.id}`}
            onDragStart={(e) => onDragStart(e, widget.id, true)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => onDragOver(e, widget.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Keyboard events shouldn't trigger drag start directly with event object cast
                // Logic should be handled by a dedicated move function if applicable
              }
            }}
          >
            {widget.content ? (widget.content as React.ReactNode) : <WidgetPlaceholder widgetId={widget.id} />}
          </Grid.Item>
        ))}
      </Grid>
    </Stack>
  );
}

function WidgetPlaceholder({ widgetId }: { widgetId: string }) {
  return (
    <div className="dashboard-layout__widget-placeholder" aria-label={`Loading widget ${widgetId}`}>
      <p className="text-muted">Widget {widgetId}</p>
    </div>
  );
}
