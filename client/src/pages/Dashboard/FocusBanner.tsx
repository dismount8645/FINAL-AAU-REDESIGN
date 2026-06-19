import { memo } from 'react';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface UrgentItem {
  id: number
  type: 'assignment' | 'calendar'
  title: string
  courseId: number
  courseTitle: string
  info: {
    urgency: string
    color: string
    relativeLabel?: string
    dateLabel?: string
  }
}

interface FocusBannerProps {
  urgentItem: UrgentItem
  extraUrgentCount: number
  firstName: string
  onNavigate: (target: { type: 'calendar' | 'submission'; courseId?: number; submissionId?: number }) => void
  t: (key: string) => string
  lang: string
}

function FocusBanner({ urgentItem, extraUrgentCount, firstName, onNavigate, t, lang }: FocusBannerProps) {
  const handleNavigate = () => {
    if (urgentItem.type === 'calendar') {
      onNavigate({ type: 'calendar' })
    } else {
      onNavigate({ type: 'submission', courseId: urgentItem.courseId, submissionId: urgentItem.id })
    }
  }

  return (
    <div
      className="focus-banner animate-fade-in border-l-4 p-md sm:p-lg sm:px-xl flex flex-col md:flex-row md:items-center justify-between gap-md md:gap-lg cursor-pointer hover:brightness-[1.02] transition-all"
      style={{
        borderLeftColor: urgentItem.info.color,
        backgroundColor: (urgentItem.info.urgency === 'overdue' || urgentItem.info.urgency === 'today') ? 'var(--color-bg-danger-tint)' : 'var(--color-bg-warning-tint)'
      }}
      data-testid="focus-banner"
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleNavigate()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-col items-start min-w-0 md:max-w-xs lg:max-w-md w-full md:w-auto flex-1">
        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-sm" style={{ backgroundColor: urgentItem.info.color, color: (urgentItem.info.urgency === 'tomorrow' || urgentItem.info.urgency === 'soon') ? '#211a52' : '#ffffff' }}>
          {urgentItem.type === 'calendar'
            ? (lang === 'da' ? 'Vigtig begivenhed' : 'Important event')
            : (lang === 'da' ? 'Vigtig aflevering' : 'Important assignment')}
        </span>
        <span className="text-xs font-semibold text-text-secondary block mt-xs">{urgentItem.courseTitle}</span>
        <h3 className="text-lg sm:text-xl font-extrabold text-main mt-2xs mb-0 truncate leading-snug w-full">{urgentItem.title}</h3>
        <span className="sr-only">Hej {firstName}</span>
      </div>

      <div className="flex flex-col items-start md:items-end justify-center gap-xs w-full md:w-auto shrink-0 mt-sm md:mt-0 pointer-events-none">
        <div className="flex flex-col items-start md:items-end gap-3xs leading-none">
          <span className="font-black text-sm sm:text-base tracking-wide uppercase" style={{ color: urgentItem.info.color }}>
            {lang === 'da' ? 'Frist' : 'Due'} {urgentItem.info.relativeLabel ?? urgentItem.info.dateLabel}
          </span>
          <span className="text-xs sm:text-sm font-bold text-text-secondary">
                  {urgentItem.info.dateLabel ?? ''}
          </span>
        </div>
        <div className="flex items-center gap-md shrink-0 flex-wrap min-h-[44px] w-full md:w-auto justify-start md:justify-end mt-xs">
          {extraUrgentCount > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNavigate({ type: 'calendar' }); }}
              className="text-xs font-bold text-primary hover:underline cursor-pointer min-h-[44px] flex items-center pointer-events-auto"
            >
              {t('dashboard.more_urgent_assignments').replace('{count}', String(extraUrgentCount))}
            </button>
          )}
          <Button
            variant="primary"
            size="sm"
            iconRight={ArrowRight}
            className="font-bold shrink-0 min-h-[44px] whitespace-nowrap px-md text-sm pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation()
              handleNavigate()
            }}
          >
            {urgentItem.type === 'calendar'
              ? (lang === 'da' ? 'Åbn kalender' : 'Open calendar')
              : (lang === 'da' ? 'Åbn aflevering' : 'Open submission')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default memo(FocusBanner);
