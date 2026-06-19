import { useState, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui';
import useStore from '@/store';

const WIDGET_TITLES: Record<string, { da: string; en: string }> = {
  deadlines:      { da: 'afleveringer', en: 'assignments' },
  messages:       { da: 'beskeder', en: 'messages' },
  calendar:       { da: 'kalender', en: 'calendar' },
  favorites:      { da: 'favoritter', en: 'favorites' },
  courseProgress: { da: 'kursusfremskridt', en: 'course progress' },
  forumActivity:  { da: 'forumaktivitet', en: 'forum activity' },
  support:        { da: 'support', en: 'support' },
  quickOverview:  { da: 'dagens program', en: 'daily schedule' },
  shortcuts:      { da: 'genveje', en: 'shortcuts' },
}

function WidgetSkeletonBody() {
  return (
    <div className="flex flex-col gap-xs p-sm animate-pulse">
      <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded mt-xs" />
      <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  )
}

function WidgetSkeletonHeader() {
  return (
    <div className="flex items-center gap-xs py-1 animate-pulse">
      <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  )
}

function WidgetError({ widgetTitle, onRetry, lang }: { widgetTitle: string; onRetry: () => void; lang: 'da' | 'en' }) {
  const retryLabel = lang === 'da' ? `Prøv igen for ${widgetTitle}` : `Retry ${widgetTitle}`
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-sm py-lg px-md text-center"
    >
      <AlertCircle className="text-danger/60 shrink-0" size={20} aria-hidden="true" />
      <span className="text-sm font-semibold text-main">
        {lang === 'da'
          ? `Kunne ikke hente ${widgetTitle}`
          : `Could not load ${widgetTitle}`}
      </span>
      <span className="text-xs text-muted max-w-[200px] leading-relaxed">
        {lang === 'da'
          ? 'Forbindelsen afbrød eller timeout.'
          : 'Connection failed or timed out.'}
      </span>
      <button
        onClick={onRetry}
        className="min-h-[44px] px-md text-sm font-bold text-primary border border-primary/40 rounded-[var(--radius-md)] hover:bg-primary/5 transition-colors focus-visible:shadow-focus focus-visible:outline-none"
        aria-label={retryLabel}
      >
        {lang === 'da' ? 'Prøv igen' : 'Retry'}
      </button>
    </div>
  )
}

function WidgetPermissionDeniedBody({ lang }: { lang: 'da' | 'en' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-xs py-lg px-md text-center">
      <span className="text-xs font-semibold text-main">
        {lang === 'da' ? 'Ingen adgang' : 'Access Denied'}
      </span>
      <span className="text-xs text-muted max-w-[200px] leading-relaxed">
        {lang === 'da'
          ? 'Du har ikke tilladelse til at se dette modul.'
          : 'You do not have permission to view this widget.'}
      </span>
    </div>
  )
}

interface WidgetStateWrapperProps {
  id: string
  size: 'small' | 'medium' | 'large'
  children: React.ReactNode
}

export function WidgetStateWrapper({ id, size, children }: WidgetStateWrapperProps) {
  const lang = useStore(state => state.lang);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'permission_denied'>(() => {
    if (id === 'courseProgress') return 'permission_denied';
    return 'loading';
  });

  const loadData = useCallback(() => {
    if (id === 'courseProgress') {
      setStatus('permission_denied');
      return;
    }
    setStatus('loading');

    const timeoutTimer = setTimeout(() => {
      setStatus('error');
    }, 10000);

    const loadTimer = setTimeout(() => {
      setStatus('success');
      clearTimeout(timeoutTimer);
    }, 400);

    return { loadTimer, timeoutTimer };
  }, [id]);

  useEffect(() => {
    const timers = loadData();
    return () => {
      if (timers) {
        clearTimeout(timers.loadTimer);
        clearTimeout(timers.timeoutTimer);
      }
    };
  }, [id, loadData]);

  const widgetTitle = WIDGET_TITLES[id]?.[lang as 'da' | 'en'] ?? id;

  if (status === 'loading') {
    return (
      <Card className={`w-full flex flex-col overflow-hidden shadow-[var(--shadow-sm)] border-[var(--border-color)]/60 ${size === 'small' ? 'min-h-[140px]' : size === 'medium' ? 'min-h-[200px]' : 'min-h-[300px]'}`}>
        <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/20">
          <WidgetSkeletonHeader />
        </Card.Header>
        <Card.Body padding="compact" className="flex-1">
          <WidgetSkeletonBody />
        </Card.Body>
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Card className="w-full flex flex-col overflow-hidden shadow-[var(--shadow-sm)] border-[var(--border-color)]/60">
        <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/20">
          <WidgetSkeletonHeader />
        </Card.Header>
        <Card.Body padding="compact" className="flex-1">
          <WidgetError widgetTitle={widgetTitle} onRetry={loadData} lang={lang} />
        </Card.Body>
      </Card>
    )
  }

  if (status === 'permission_denied') {
    return (
      <Card className="w-full flex flex-col overflow-hidden shadow-[var(--shadow-sm)] border-[var(--border-color)]/60">
        <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/20">
          <WidgetSkeletonHeader />
        </Card.Header>
        <Card.Body padding="compact" className="flex-1">
          <WidgetPermissionDeniedBody lang={lang} />
        </Card.Body>
      </Card>
    )
  }

  return <>{children}</>
}
