import { memo } from 'react';

import ErrorBoundary from '@/components/Layout/ErrorBoundary';

interface WidgetWrapperProps {
  widgetId: string
}

export const WidgetWrapper = memo(function WidgetWrapper({
  widgetId,
}: WidgetWrapperProps) {
  return (
    <ErrorBoundary name={widgetId}>
      <div className="dashboard__widget group relative h-full w-full">
        <div className="h-full w-full flex flex-col overflow-y-auto scale-100" />
      </div>
    </ErrorBoundary>
  )
})

