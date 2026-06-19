import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Badge, Text } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import type { CalendarEvent } from '@/lib/types';
import { isEventDeadline, getEventTypeText } from './calendar-utils';
import { cn } from '@/lib/utils';

interface EventBadgeProps {
  event: CalendarEvent;
  lang: string;
  className?: string;
}

export const EventBadge = ({ event, lang, className }: EventBadgeProps) => {
  const isDeadline = isEventDeadline(event);
  const eventType = getEventTypeText(event, lang);
  if (!eventType) return null;

  return (
    <Badge
      variant="default"
      className={cn(
        "text-[10px] font-black text-white flex items-center gap-1 leading-none shrink-0",
        isDeadline && "bg-orange-600 animate-pulse text-white",
        className
      )}
      style={isDeadline ? undefined : { background: event.color }}
    >
      {isDeadline && <AlertTriangle size={10} className="text-white shrink-0" />}
      {eventType}
    </Badge>
  );
};

interface EventInfoItemProps {
  label: string;
  icon: React.ComponentType<any>;
  value: string;
}

export const EventInfoItem = ({ label, icon: Icon, value }: EventInfoItemProps) => {
  return (
    <Stack gap="xs">
      <Text size="xs" weight="bold" className="text-text-muted/50">{label}</Text>
      <Stack direction="row" gap="sm" align="center" className="text-text-main">
        <Icon className="w-4 h-4 text-primary" />
        <Text size="sm" weight="bold" className="truncate">{value}</Text>
      </Stack>
    </Stack>
  );
};
