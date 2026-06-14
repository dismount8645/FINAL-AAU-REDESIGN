import React, { useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, ChevronRight, Clock, AlertCircle, CheckCircle2,
  Star, Trophy, Headphones, ExternalLink, MessageSquare, Link2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, Text, Heading, MasterItem } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { mockDashboardDeadlines, courses as dataCourses } from '@/lib/data';
import { PATHS } from '@/routes';
import { getDeadlineInfo } from '@/lib/utils';
import { DASHBOARD_CONFIG } from '@/lib/dashboard';
import { env } from '@/lib/env';
import { resolveFavorite, sortFavorites } from '@/lib/favorites';
import type { ResolvedFavorite } from '@/lib/favorites';
import useStore from '@/store';

// --- Helpers ---

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
            // Large 2x2 variant layout: Shows up to 5 items with list row layout and extra action tags/status labels
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

const getFavoriteMetadata = (item: ResolvedFavorite, lang: 'da' | 'en') => {
  if (item.type === 'course') {
    const course = dataCourses[item.entityId]
    if (course?.nextAssignment) {
      return lang === 'da'
        ? `Næste aflevering: ${course.nextAssignment.deadline}`
        : `Next assignment: ${course.nextAssignment.deadlineEn}`
    }
    return lang === 'da' ? 'Opdateret i går' : 'Updated yesterday'
  }
  if (item.type === 'file') {
    for (const course of Object.values(dataCourses)) {
      for (const section of course.sections) {
        const fileItem = section.items.find(i => i.id === item.entityId)
        if (fileItem) {
          const ext = (fileItem.type || 'PDF').toUpperCase()
          return lang === 'da'
            ? `${ext} · Opdateret 10. jun`
            : `${ext} · Updated Jun 10`
        }
      }
    }
    return lang === 'da' ? 'PDF · Opdateret nyligt' : 'PDF · Recently updated'
  }
  if (item.type === 'tool') {
    return lang === 'da' ? 'Eksternt værktøj' : 'External tool'
  }
  if (item.type === 'forum') {
    return lang === 'da' ? 'Forum · Aktivt' : 'Forum · Active'
  }
  return ''
}

function FavoritesWidgetInner({ size = 'medium' }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const favorites = useStore(state => state.favorites)
  const courses = useStore(state => state.courses)
  const resolved = useMemo(() => {
    const sorted = sortFavorites(favorites)
    return sorted
      .map(fav => resolveFavorite(fav, lang, courses, t))
      .filter(Boolean) as ResolvedFavorite[]
  }, [favorites, lang, courses, t])

  const limit = size === 'small' ? 2 : size === 'medium' ? 6 : DASHBOARD_CONFIG.FAVORITES_LIMIT
  const overflow = favorites.length - limit
  const display = resolved.slice(0, limit)

  const handleSeeAll = useCallback(() => {
    navigate(PATHS.FAVORITES)
  }, [navigate])

  return (
    <Card className="widget-card h-full w-full favorites-widget shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
      <Card.Header padding="compact" className="bg-bg-highlight/50 border-b border-[var(--border-color)]">
        <Stack direction="row" align="center" gap="sm">
          <div className="text-primary shrink-0">
            <Star size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('dashboard.widget_favorites')}
          </Heading>
        </Stack>
        <Button variant="ghost" size="sm" className="text-sm font-extrabold text-primary dark:text-white normal-case tracking-normal hover:underline h-[44px] min-h-[44px]" onClick={handleSeeAll} iconRight={ChevronRight} aria-label={lang === 'da' ? 'Se alle favoritter' : 'See all favorites'}>
          {lang === 'da' ? 'Se alle' : 'See all'}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="overflow-visible p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        {display.length > 0 ? (
          <div className="flex flex-col gap-2xs w-full">
            {display.map((item) => {
              const metadata = getFavoriteMetadata(item, lang)
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.external) {
                      env.open(item.link)
                    } else {
                      navigate(item.link)
                    }
                  }}
                  className="flex items-center justify-between py-sm px-sm border-b border-border/30 last:border-0 cursor-pointer transition-colors group/row hover:bg-bg-hover"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (item.external) {
                        env.open(item.link)
                      } else {
                        navigate(item.link)
                      }
                    }
                  }}
                >
                  <div className="flex items-center gap-xs min-w-0 flex-1">
                    <div className="shrink-0" style={{ color: item.iconColor }}>
                      <item.icon size={16} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-xs">
                        <span className="text-sm font-bold text-main truncate block">{item.title}</span>
                        {item.external && <ExternalLink size={14} className="text-text-secondary shrink-0" />}
                      </div>
                      <span className="text-sm font-medium text-text-secondary truncate block mt-3xs leading-relaxed">{metadata}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-xs ml-sm shrink-0">
                    <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 group-hover/row:translate-x-[2px] transition-all duration-200 shrink-0" />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center py-xs gap-[var(--space-2xs)]">
            <div className="text-primary/40 shrink-0">
              <Star size={24} strokeWidth={1.5} />
            </div>
            <Heading level={3} as="h3" className="text-xs font-bold text-main mt-xs">
              {lang === 'da' ? 'Ingen favoritter endnu' : 'No favorites yet'}
            </Heading>
            <Text size="xs" className="text-center max-w-[200px] text-text-muted italic">
              {lang === 'da' ? 'Markér kurser som favoritter for at vise dem her.' : 'Mark courses as favorites to show them here.'}
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(PATHS.COURSES)}
              className="mt-xs font-bold text-xs h-[32px] min-h-[32px] flex items-center px-sm"
            >
              {lang === 'da' ? 'Gå til kurser' : 'Go to courses'}
            </Button>
          </div>
        )}
        {overflow > 0 && size !== 'small' && (
          <div className="mt-[var(--space-xs)] text-center pb-[var(--space-xs)]">
            <Text size="xs" weight="bold" className="text-primary uppercase tracking-widest opacity-60">
              {`+${overflow} ${t('more_favorites')}`}
            </Text>
          </div>
        )}
      </Card.Body>
      {display.length > 0 && size !== 'small' && (
        <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center cursor-pointer hover:bg-bg-hover transition-colors" onClick={handleSeeAll} role="button" tabIndex={0}>
          <Text size="xs" weight="medium" className="text-muted font-medium">{favorites.length} {favorites.length === 1 ? (lang === 'da' ? 'favorit' : 'favorite') : (lang === 'da' ? 'favoritter' : 'favorites')}</Text>
          <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
            <Text size="xs" weight="bold" className="text-primary dark:text-white uppercase">{lang === 'da' ? 'Se alle favoritter' : 'See all favorites'}</Text>
            <ChevronRight size={14} strokeWidth={2.5} className="text-primary dark:text-white" />
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}

const FavoritesWidget = memo(FavoritesWidgetInner)

// --- SupportWidget ---

function SupportWidget({ size = 'medium' }: WidgetProps) {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  return (
    <Card className="support-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="text-primary shrink-0">
            <Headphones size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('contact_its_support')}
          </Heading>
        </Stack>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex flex-col justify-center gap-[var(--space-2xs)]">
        {size !== 'small' && (
          <Text size="xs" className="text-text-muted leading-relaxed">
            {t('aau_it_services')}
          </Text>
        )}
        
        {size === 'large' && (
          <div className="flex flex-col gap-[2px] text-[11px] text-muted border-y border-[var(--border-color)]/40 py-[var(--space-2xs)] my-[var(--space-2xs)]">
            <div className="flex justify-between">
              <span className="font-bold">{lang === 'da' ? 'Telefon:' : 'Phone:'}</span>
              <span>+45 9940 2020</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">{lang === 'da' ? 'Åbningstider:' : 'Hours:'}</span>
              <span>{lang === 'da' ? 'Man-Fre 08:00–15:30' : 'Mon-Fri 08:00–15:30'}</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => env.open('https://support.its.aau.dk/')}
          className="inline-flex items-center gap-xs text-xs text-primary hover:text-primary/80 font-semibold transition-colors group/support-btn self-start"
        >
          <ExternalLink size={12} strokeWidth={2} className="shrink-0" />
          <span className="group-hover/support-btn:underline underline-offset-2">{t('contact_support')}</span>
        </button>
      </Card.Body>
    </Card>
  )
}

// --- MessagesWidget ---

interface MockMessage {
  id: number
  sender: string
  subject: string
  time: string
  unread: boolean
}

const mockMessages: MockMessage[] = [
  { id: 1, sender: 'Mette Frederiksen', subject: 'Gruppemøde i morgen kl. 10', time: '10:45', unread: true },
  { id: 2, sender: 'Lars Poulsen (Underviser)', subject: 'Feedback på aflevering 2 er klar', time: 'I går', unread: false },
  { id: 3, sender: 'Studievejledningen', subject: 'Bekræftelse af tid til vejledning', time: '8. jun', unread: false },
]

function MessagesWidget({ size = 'medium', isPriorityElevated = false }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)

  // Sort messages: unread first
  const sortedMessages = useMemo(() => {
    return [...mockMessages].sort((a, b) => {
      if (a.unread && !b.unread) return -1
      if (!a.unread && b.unread) return 1
      return 0 // keep original order (which is most recent first)
    })
  }, [])

  const limit = size === 'small' ? 2 : 3
  const displayMessages = useMemo(() => {
    return sortedMessages.slice(0, limit)
  }, [sortedMessages, limit])

  return (
    <Card className="messages-widget w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="text-primary shrink-0">
            <MessageSquare size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('nav.messages')}
          </Heading>
          {isPriorityElevated && (
            <span className="px-1.5 py-[2px] text-[10px] font-bold text-primary bg-primary/10 rounded-sm leading-none shrink-0">
              {lang === 'da' ? 'Prioriteret' : 'Priority'}
            </span>
          )}
          {mockMessages.filter(m => m.unread).length > 0 && (
            <span className="px-1.5 py-[2px] text-[10px] font-bold text-primary bg-primary/10 rounded-sm leading-none shrink-0">
              {mockMessages.filter(m => m.unread).length} {lang === 'da' ? 'ulæst' : 'unread'}
            </span>
          )}
        </Stack>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-extrabold text-primary dark:text-white normal-case tracking-normal hover:underline h-[44px] min-h-[44px] px-md flex items-center"
          onClick={() => navigate(PATHS.MESSAGES)}
          iconRight={ChevronRight}
          aria-label={lang === 'da' ? 'Se alle' : 'See all'}
        >
          {lang === 'da' ? 'Se alle' : 'See all'}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        {displayMessages.length > 0 ? (
          <div className="flex flex-col gap-2xs w-full">
            {displayMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => navigate(PATHS.MESSAGES)}
                className={`flex items-start justify-between py-sm px-sm border-b border-border/30 last:border-0 hover:bg-bg-hover cursor-pointer transition-colors gap-xs group/row ${
                  msg.unread ? 'bg-primary/5 dark:bg-primary/10' : ''
                }`}
                role="button"
                tabIndex={0}
                aria-label={msg.unread ? (lang === 'da' ? `Ulæst besked fra ${msg.sender}: ${msg.subject}` : `Unread message from ${msg.sender}: ${msg.subject}`) : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(PATHS.MESSAGES)
                  }
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-xs">
                    {msg.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mr-1 animate-pulse" aria-hidden="true" />}
                    <span className="text-sm font-bold text-main truncate block">
                      {msg.sender}
                    </span>
                    {msg.unread && (
                      <span className="px-2 py-[3px] text-xs font-bold text-primary bg-primary/10 rounded-sm leading-none shrink-0">
                        {lang === 'da' ? 'Ulæst' : 'Unread'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-text-secondary truncate block mt-3xs leading-relaxed">
                    {msg.subject}
                  </span>
                </div>
                <div className="flex items-center gap-xs ml-sm shrink-0">
                  <span className="text-xs text-text-muted leading-relaxed">{msg.time}</span>
                  <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 group-hover/row:translate-x-[2px] transition-all duration-200 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-text-muted italic py-xs text-center leading-relaxed">
            {lang === 'da' ? 'Ingen beskeder' : 'No messages'}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

// --- CalendarWidget ---

interface MockCalendarEvent {
  id: number
  title: string
  time: string
  location?: string
}

const mockCalendarEvents: MockCalendarEvent[] = [
  { id: 1, title: 'Forelæsning: UX & Interaktionsdesign', time: 'I dag, 08:15 - 12:00', location: 'Fibigerstræde 15' },
  { id: 2, title: 'Gruppearbejde: Semesterprojekt', time: 'I morgen, 10:00 - 15:00', location: 'Kroghstræde 3' },
  { id: 3, title: 'Workshop: CSS & Advanced Grid', time: 'Fredag, 12:30 - 14:00', location: 'Online' },
]

function CalendarWidget({ size: _size = 'medium' }: WidgetProps) {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)

  // Filter events (mockCalendarEvents)
  const todayEvents = useMemo(() => {
    return mockCalendarEvents.filter(e => 
      e.time.toLowerCase().includes('i dag') || e.time.toLowerCase().includes('today')
    )
  }, [])

  // Find next upcoming event (first event that is not today)
  const upcomingEvent = useMemo(() => {
    if (todayEvents.length > 0) return null
    return mockCalendarEvents.find(e => 
      !e.time.toLowerCase().includes('i dag') && !e.time.toLowerCase().includes('today')
    ) || null
  }, [todayEvents])

  const handleSeeAll = useCallback(() => {
    navigate(PATHS.CALENDAR)
  }, [navigate])

  return (
    <Card className="calendar-widget w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="text-primary shrink-0">
            <Calendar size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('nav.calendar')}
          </Heading>
        </Stack>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs font-medium text-primary dark:text-white normal-case tracking-normal hover:underline h-[44px] min-h-[44px] px-md flex items-center" 
          onClick={handleSeeAll} 
          iconRight={ChevronRight}
          aria-label={lang === 'da' ? 'Åbn kalender' : 'Open calendar'}
        >
          {lang === 'da' ? 'Åbn kalender' : 'Open calendar'}
        </Button>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col gap-sm overflow-y-auto">
        {/* Section 1: Dagens program */}
        <div className="flex flex-col gap-2xs">
          <div className="text-xs font-semibold text-text-secondary mb-xs">
            {lang === 'da' ? 'Dagens program' : "Today's Schedule"}
          </div>
          {todayEvents.length > 0 ? (
            <div className="flex flex-col gap-2xs">
              {todayEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={handleSeeAll}
                  className="flex items-center justify-between py-sm px-md border border-[var(--border-color)]/60 bg-bg-highlight/20 rounded-[var(--radius-md)] hover:bg-bg-hover cursor-pointer transition-colors min-h-[52px] group/row"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-main truncate block">{evt.title}</span>
                    <div className="text-xs text-text-secondary mt-[2px] leading-relaxed font-medium">
                      {evt.time} {evt.location && `· ${evt.location}`}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 group-hover/row:translate-x-[2px] transition-all duration-200 shrink-0" />
                </div>
              ))}
            </div>
          ) : upcomingEvent ? (
            <div className="flex flex-col gap-2xs">
              <div className="text-xs text-text-secondary italic pl-xs mb-xs leading-relaxed">
                {lang === 'da' ? 'Ingen planlagte aktiviteter i dag. Næste aftale:' : 'No activities today. Next appointment:'}
              </div>
              <div className="flex flex-col gap-2xs">
                <div
                  key={upcomingEvent.id}
                  onClick={handleSeeAll}
                  className="flex items-center justify-between py-sm px-md border border-[var(--border-color)]/60 bg-bg-highlight/20 rounded-[var(--radius-md)] hover:bg-bg-hover cursor-pointer transition-colors min-h-[52px] group/row"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-main truncate block">{upcomingEvent.title}</span>
                    <div className="text-xs text-text-secondary mt-[2px] leading-relaxed font-medium">
                      {upcomingEvent.time} {upcomingEvent.location && `· ${upcomingEvent.location}`}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-muted opacity-40 group-hover/row:opacity-100 group-hover/row:translate-x-[2px] transition-all duration-200 shrink-0" />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-text-secondary italic py-2xs pl-xs leading-relaxed">
              {lang === 'da' ? 'Ingen kalenderaftaler' : 'No calendar appointments'}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

// --- CourseProgressWidget ---

interface MockCourseProgress {
  id: number
  title: string
  percentage: number
}

const mockCourseProgress: MockCourseProgress[] = [
  { id: 1, title: 'Digital Design og Kommunikation', percentage: 75 },
  { id: 2, title: 'Webudvikling og CMS', percentage: 40 },
  { id: 3, title: 'Videnskabsteori', percentage: 90 },
]

function CourseProgressWidget({ size = 'medium' }: WidgetProps) {
  const t = useStore(state => state.t)
  const limit = size === 'small' ? 1 : size === 'medium' ? 2 : 3

  return (
    <Card className="course-progress-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="text-primary shrink-0">
            <Trophy size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('common.your_progress')}
          </Heading>
        </Stack>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-xs w-full">
          {mockCourseProgress.slice(0, limit).map((course) => (
            <div key={course.id} className="flex flex-col gap-[2px]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-main truncate max-w-[80%]">{course.title}</span>
                <span className="text-xs text-text-muted font-bold">{course.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-highlight rounded-full overflow-hidden border border-[var(--border-color)]/20">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${course.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

// --- ShortcutsWidget ---
function ShortcutsWidget({ size = 'small' }: WidgetProps) {
  const lang = useStore(state => state.lang)
  
  const shortcuts = useMemo(() => [
    { name: 'Moodle', url: 'https://www.moodle.aau.dk' },
    { name: 'Digital Eksamen', url: 'https://eksamen.aau.dk' },
    { name: 'STADS Self-Service', url: 'https://stads.aau.dk' },
    { name: 'AAU Card', url: 'https://aaucard.aau.dk' },
    { name: 'AAU Webmail', url: 'https://mail.aau.dk' },
  ], [])

  const limit = size === 'small' ? 3 : size === 'medium' ? 4 : 5

  return (
    <Card className="shortcuts-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="text-primary shrink-0">
            <Link2 size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {lang === 'da' ? 'Genveje' : 'Shortcuts'}
          </Heading>
        </Stack>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex flex-col gap-[var(--space-2xs)] justify-center">
        <div className="flex flex-col gap-2xs">
          {shortcuts.slice(0, limit).map((s, idx) => (
            <a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2xs hover:bg-bg-hover rounded-md text-xs font-semibold text-main transition-colors group/shortcut-link"
            >
              <span>{s.name}</span>
              <ExternalLink size={12} className="text-muted opacity-40 group-hover/shortcut-link:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

const ShortcutsWidgetMemo = memo(ShortcutsWidget)

export { DeadlinesWidget, FavoritesWidget, SupportWidget, MessagesWidget, CalendarWidget, CourseProgressWidget, ShortcutsWidgetMemo as ShortcutsWidget }


