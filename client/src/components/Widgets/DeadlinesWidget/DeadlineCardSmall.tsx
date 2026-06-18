import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MasterItem } from '@/components/ui';
import { getUrgencyIcon, getLabelClass, getColorClass } from './helpers';
import type { ProcessedDeadline } from './helpers';

interface DeadlineCardSmallProps {
  deadlines: ProcessedDeadline[];
  onDeadlineClick: (dl: ProcessedDeadline) => void;
  lang: string;
}

function DeadlineCardSmall({ deadlines, onDeadlineClick, lang }: DeadlineCardSmallProps) {
  const nextDl = deadlines[0]

  return (
    <div className="flex flex-col gap-2xs flex-1 justify-center">
      <MasterItem
        onClick={() => onDeadlineClick(nextDl)}
        className="py-sm px-md border rounded-[var(--radius-md)] border-[var(--border-color)]/60 bg-bg-highlight/40 hover:bg-bg-hover group/row"
        leading={
          <div className="shrink-0 flex items-center justify-center" style={{ color: nextDl.info.color }} title={nextDl.info.label}>
            {React.createElement(getUrgencyIcon(nextDl.info.urgency), { size: 14, strokeWidth: 2.5 })}
            <span className="sr-only">{nextDl.info.label}</span>
          </div>
        }
        title={
          <div className="flex items-center gap-xs flex-wrap">
            <span className="text-sm font-bold text-main truncate block">
              {nextDl.title}
            </span>
            {nextDl.info.urgency === 'today' && (
              <span 
                className="px-1.5 py-0.5 text-xs font-bold rounded-[var(--radius-xs)] shrink-0 text-white leading-none" 
                style={{ backgroundColor: 'var(--color-badge-urgent)' }}
              >
                {lang === 'da' ? 'Forfalder i dag' : 'Due today'}
              </span>
            )}
          </div>
        }
        subtitle={
          <span style={{ color: nextDl.info.color }} className={`${getLabelClass(nextDl.info.urgency)} ${getColorClass(nextDl.info.urgency)} text-xs block mt-3xs leading-relaxed`}>
            {nextDl.info.label}
          </span>
        }
        trailing={
          <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 group-hover/row:translate-x-[2px] transition-all duration-200 shrink-0" />
        }
      />
    </div>
  )
}

export default DeadlineCardSmall
