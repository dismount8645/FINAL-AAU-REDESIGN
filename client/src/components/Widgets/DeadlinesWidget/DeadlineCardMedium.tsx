import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { getUrgencyIcon, getLabelClass, getColorClass } from './helpers';
import type { ProcessedDeadline } from './helpers';

interface DeadlineCardMediumProps {
  deadlines: ProcessedDeadline[];
  onDeadlineClick: (dl: ProcessedDeadline) => void;
  lang: string;
}

function DeadlineCardMedium({ deadlines, onDeadlineClick, lang }: DeadlineCardMediumProps) {
  return (
    <div className="flex flex-col gap-2xs flex-1 justify-center">
      {deadlines.map((dl, idx) => (
        <div
          key={dl.id}
          onClick={() => onDeadlineClick(dl)}
          className={`flex items-center justify-between py-sm px-sm border-b border-border/30 last:border-0 cursor-pointer transition-colors group/row min-h-[44px] ${
            dl.info.urgency === 'overdue' ? 'bg-danger/5' : ''
          } hover:bg-bg-hover`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onDeadlineClick(dl); }}
        >
          <div className="flex items-center gap-xs min-w-0 flex-1">
            <div className="shrink-0" style={{ color: dl.info.color }} title={dl.info.label}>
              {React.createElement(getUrgencyIcon(dl.info.urgency), { size: 14, strokeWidth: 2.5 })}
              <span className="sr-only">{dl.info.label}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-xs flex-wrap">
                <span className="text-sm font-bold text-main truncate block">{dl.title}</span>
                {idx === 0 && (
                  <span className="px-1.5 py-0.5 text-xs font-extrabold rounded-[var(--radius-xs)] leading-none shrink-0" style={{ color: dl.info.color, backgroundColor: `${dl.info.color}15` }}>
                    {lang === 'da' ? 'Vigtig aflevering' : 'Important assignment'}
                  </span>
                )}
                {dl.info.urgency === 'today' && (
                  <span 
                    className="px-1.5 py-0.5 text-xs font-bold rounded-[var(--radius-xs)] shrink-0 text-white leading-none" 
                    style={{ backgroundColor: 'var(--color-badge-urgent)' }}
                  >
                    {lang === 'da' ? 'Forfalder i dag' : 'Due today'}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-text-secondary truncate block mt-3xs leading-relaxed">{dl.courseTitle}</span>
              <Stack direction="row" gap="xs" align="center" className="mt-2xs flex-wrap">
                <span style={{ color: dl.info.color }} className={`${getLabelClass(dl.info.urgency)} ${getColorClass(dl.info.urgency)} text-xs font-bold`}>
                  {dl.info.relativeLabel}
                </span>
                <span className="text-border/60 text-xs hidden sm:inline">&bull;</span>
                <span className="text-xs text-text-secondary">
                  {dl.info.dateLabel}
                </span>
              </Stack>
            </div>
          </div>
          <div className="flex items-center gap-xs ml-sm shrink-0">
            <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 group-hover/row:translate-x-[2px] transition-all duration-200 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default DeadlineCardMedium
