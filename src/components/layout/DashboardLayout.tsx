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
    <Stack className="w-full flex-1 gap-6 lg:gap-8">
      <Stack className="w-full mb-4 md:mb-8">
        <Heading level={2}>{title}</Heading>
      </Stack>

      <Grid columns={12} gap="md" className="w-full">
        {widgets.filter(w => w.visible).map((widget) => (
          <Grid.Item
            key={widget.id}
            span={widget.span}
            className="w-full transition-transform duration-150 ease-[0.4,0,0.2,1] hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-[rgba(33,26,82,0.35)] rounded-lg md:rounded-xl cursor-grab active:cursor-grabbing"
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
    <div className="w-full min-h-[160px] flex items-center justify-center rounded-md md:rounded-lg xl:rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30" aria-label={`Loading widget ${widgetId}`}>
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">Widget {widgetId}</p>
    </div>
  );
}
