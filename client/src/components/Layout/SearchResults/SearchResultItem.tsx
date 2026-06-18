import React from 'react';
import { GraduationCap, ClipboardList, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResultItemProps {
  type: string;
  id: string | number;
  index: number;
  activeSearchIndex: number;
  title: string;
  subtitle?: string;
  onClick: () => void;
  onHover: () => void;
}

const TYPE_ICONS: Record<string, { icon: React.ComponentType<any>; bg: string; color: string }> = {
  course: { icon: GraduationCap, bg: 'bg-primary/10', color: 'text-primary' },
  assignment: { icon: ClipboardList, bg: 'bg-success/10', color: 'text-success' },
  message: { icon: MessageSquare, bg: 'bg-info/10', color: 'text-info' },
  calendar: { icon: Calendar, bg: 'bg-warning/10', color: 'text-warning' },
}

function SearchResultItem({ type, id, index, activeSearchIndex, title, subtitle, onClick, onHover }: SearchResultItemProps) {
  const config = TYPE_ICONS[type]
  const Icon = config?.icon || GraduationCap
  const iconBg = config?.bg || 'bg-primary/10'
  const iconColor = config?.color || 'text-primary'

  return (
    <div
      id={`search-item-${id}`}
      className={cn(
        "search-dropdown-item flex items-center justify-between p-xs px-md cursor-pointer transition-colors group/row",
        index === activeSearchIndex ? "bg-bg-hover" : "hover:bg-bg-hover"
      )}
      onClick={onClick}
      onMouseEnter={onHover}
      role="option"
      aria-selected={index === activeSearchIndex}
    >
      <div className="flex items-center gap-md min-w-0 flex-1">
        <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-main truncate">{title}</span>
          {subtitle && <span className="text-xs text-text-muted font-medium truncate">{subtitle}</span>}
        </div>
      </div>
      <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 shrink-0 ml-xs" />
    </div>
  )
}

export default SearchResultItem
