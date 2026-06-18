import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { MasterItem } from '@/components/ui';
import { getUrgencyIcon, getLabelClass, getColorClass } from './helpers';
import type { ProcessedDeadline } from './helpers';

interface DeadlineCardLargeProps {
  deadlines: ProcessedDeadline[];
  onDeadlineClick: (dl: ProcessedDeadline) => void;
  lang: string;
  t: (key: string) => string;
}

function DeadlineCardLarge({ deadlines, onDeadlineClick, lang, t }: DeadlineCardLargeProps) {
  return (
    <div className="flex flex-col gap-2xs flex-1">
      {deadlines.map((dl, idx) => (
        <MasterItem
          key={dl.id}
          onClick={() => onDeadlineClick(dl)}
          className={`py-sm px-md border rounded-[var(--radius-md)] hover:bg-bg-hover hover:border-[var(--border-color)]/50 group/row ${
            idx === 0 ? 'bg-bg-highlight/40 border-primary/30' : 'bg-transparent border-transparent'
          }`}
          leading={
            <div className="shrink-0 flex items-center justify-center" style={{ color: dl.info.color }} title={dl.info.label}>
              {React.createElement(getUrgencyIcon(dl.info.urgency), { size: 16, strokeWidth: 2.5 })}
              <span className="sr-only">{dl.info.label}</span>
            </div>
          }
          title={
            <div className="flex items-center gap-xs flex-wrap">
              <span className="text-sm font-bold text-main truncate block">{dl.title}</span>
              {idx === 0 && (
                <span className="px-1.5 py-0.5 text-xs font-extrabold rounded-[var(--radius-xs)] leading-none shrink-0" style={{ color: dl.info.color, backgroundColor: `${dl.info.color}15` }}>
                  {lang === 'da' ? 'Vigtig' : 'Important'}
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
          }
          subtitle={
            <span className="truncate max-w-[120px] text-sm font-medium text-text-secondary mt-3xs leading-relaxed block">{dl.courseTitle}</span>
          }
          trailing={
            <div className="flex items-center gap-xs">
              <div className="flex flex-col items-end shrink-0 ml-sm text-right min-w-[120px]">
                <span style={{ color: dl.info.color }} className={`${getLabelClass(dl.info.urgency)} ${getColorClass(dl.info.urgency)} text-xs font-bold block`}>
                  {dl.info.relativeLabel}
                </span>
                <span className="text-xs text-text-secondary block mt-3xs">
                  {dl.info.dateLabel}
                </span>
              </div>
              <Button
                variant={idx === 0 ? "primary" : "ghost"}
                size="xs"
                className="font-bold text-xs normal-case tracking-normal h-8 min-h-[32px] px-sm shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeadlineClick(dl);
                }}
              >
                {t('go_to_assignment')}
              </Button>
              <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 group-hover/row:translate-x-[2px] transition-all duration-200 shrink-0" />
            </div>
          }
        />
      ))}
    </div>
  )
}

export default DeadlineCardLarge
