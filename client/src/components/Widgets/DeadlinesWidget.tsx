import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, AlertCircle, CheckCircle2, ChevronRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, Text, Heading, MasterItem } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { mockDashboardDeadlines } from '@/lib/data';
import { PATHS } from '@/routes';
import { getDeadlineInfo } from '@/lib/utils';
import useStore from '@/store';

export interface ProcessedDeadline {
  id: number
  titleDa: string
  titleEn: string
  dateKey: string
  courseId: number
  deadlineHoursFromNow: number
  deadlineDate: string
  title: string
  courseTitle: string
  info: {
    label: string
    urgency: 'overdue' | 'today' | 'tomorrow' | 'soon' | 'later'
    color: string
  }
}

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
  hideFirst?: boolean
  isPriorityElevated?: boolean
}

const getUrgencyIcon = (urgency: string) => {
  if (urgency === 'overdue') return AlertCircle
  return Clock
}

const getLabelClass = (urgency: string) => {
  if (urgency === 'overdue') return 'font-black tracking-tight'
  if (urgency === 'today') return 'font-bold'
  if (urgency === 'tomorrow' || urgency === 'soon') return 'font-semibold'
  return 'font-normal'
}

const getColorClass = (urgency: string) => {
  if (urgency === 'overdue' || urgency === 'today') return 'text-danger'
  if (urgency === 'tomorrow' || urgency === 'soon') return 'text-warning'
  return 'text-muted'
}

function DeadlinesWidget({ size = 'medium', hideFirst = false }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const localize = useStore(state => state.localize)
  const courses = useStore(state => state.courses)

  const limit = size === 'small' ? 1 : size === 'medium' ? 3 : 5

  const deadlines = useMemo(() => {
    const start = hideFirst ? 1 : 0
    const end = limit + (hideFirst ? 1 : 0)
    return mockDashboardDeadlines.slice(start, end).map((deadline) => {
      const deadlineDate = new Date()
      deadlineDate.setHours(deadlineDate.getHours() + deadline.deadlineHoursFromNow)
      const info = getDeadlineInfo(deadlineDate, lang)
      const course = courses.find(c => c.id === deadline.courseId)
      const courseTitle = course ? localize(course, 'title') : ''
      return {
        ...deadline,
        deadlineDate: deadlineDate.toISOString(),
        courseTitle,
        title: localize(deadline, 'title'),
        info,
      }
    })
  }, [localize, courses, limit, hideFirst, lang])

  const upcomingCount = useMemo(() => {
    return deadlines.filter(dl => dl.info.urgency !== 'overdue').length
  }, [deadlines])

  const handleSeeAll = useCallback(() => {
    navigate(PATHS.CALENDAR)
  }, [navigate])

  const handleDeadlineClick = useCallback((dl: ProcessedDeadline) => {
    navigate(PATHS.SUBMISSION(dl.courseId, dl.id))
  }, [navigate])

  const nextDl = deadlines[0]

  return (
    <Card className="deadlines-widget w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="text-primary shrink-0">
            <Clock size={18} strokeWidth={2} />
          </div>
          <div>
            <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
              {lang === 'da'
                ? (deadlines.length === 1 ? 'Næste aflevering' : 'Næste afleveringer')
                : (deadlines.length === 1 ? 'Next assignment' : 'Next assignments')}
            </Heading>
            {size !== 'small' && (
              <span className="text-xs text-text-muted font-semibold block mt-3xs leading-relaxed">
                {lang === 'da' ? `${upcomingCount} kommende` : `${upcomingCount} upcoming`}
              </span>
            )}
          </div>
        </Stack>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-extrabold text-primary dark:text-white normal-case tracking-normal hover:underline h-[44px] min-h-[44px]"
          onClick={handleSeeAll}
          iconRight={ChevronRight}
          aria-label={lang === 'da' ? 'Se alle' : 'See all'}
        >
          {lang === 'da' ? 'Se alle' : 'See all'}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col gap-[var(--space-xs)]">
        {deadlines.length > 0 ? (
          size === 'small' ? (
            <div className="flex flex-col gap-2xs flex-1 justify-center">
              <MasterItem
                onClick={() => handleDeadlineClick(nextDl)}
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
          ) : size === 'medium' ? (
            <div className="flex flex-col gap-2xs flex-1 justify-center">
              {deadlines.map((dl, idx) => (
                <div
                  key={dl.id}
                  onClick={() => handleDeadlineClick(dl)}
                  className={`flex items-center justify-between py-sm px-sm border-b border-border/30 last:border-0 cursor-pointer transition-colors group/row min-h-[44px] ${
                    dl.info.urgency === 'overdue' ? 'bg-danger/5' : ''
                  } hover:bg-bg-hover`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDeadlineClick(dl); }}
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
          ) : (
            <div className="flex flex-col gap-2xs flex-1">
              {deadlines.map((dl, idx) => (
                <MasterItem
                  key={dl.id}
                  onClick={() => handleDeadlineClick(dl)}
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
                          handleDeadlineClick(dl);
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
        ) : (
          <Stack align="center" justify="center" gap="sm" className="h-full py-[var(--space-lg)] opacity-50 italic">
            <CheckCircle2 size={32} className="text-[var(--aau-dark-green)]/40" />
            <Text size="xs">{t('all_caught_up')}</Text>
          </Stack>
        )}
      </Card.Body>
    </Card>
  )
}

export { DeadlinesWidget }
