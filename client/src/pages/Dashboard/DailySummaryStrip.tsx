interface NextEvent {
  titleKey: string
  time: string
  location?: string
}

interface DailySummaryStripProps {
  activityCount: number
  deadlineCount: number
  messageCount: number
  nextEvent: NextEvent | null
  t: (key: string) => string
  lang: string
}

function DailySummaryStrip({ activityCount, deadlineCount, messageCount, nextEvent, t, lang }: DailySummaryStripProps) {
  return (
    <div className="daily-summary-strip mb-md flex flex-wrap gap-xs sm:gap-sm items-center py-sm px-md bg-bg-highlight/10 border-2 border-border/30 rounded-[var(--radius-lg)] text-sm font-semibold text-text-secondary select-none shadow-sm">
      <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-lg shadow-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse shrink-0" />
        <strong className="text-main font-extrabold uppercase tracking-wide text-xs">{lang === 'da' ? 'I DAG' : 'TODAY'}</strong>
        <span className="text-main font-bold text-sm">
          {activityCount} {activityCount === 1 ? (lang === 'da' ? 'aktivitet' : 'activity') : (lang === 'da' ? 'aktiviteter' : 'activities')}
        </span>
        <span className="text-border/60 mx-0.5">·</span>
        <span className="text-main font-bold text-sm">
          {deadlineCount} {deadlineCount === 1 ? 'deadline' : 'deadlines'}
        </span>
        <span className="text-border/60 mx-0.5">·</span>
        <span className="text-main font-bold text-sm">
          {messageCount === 1 ? (lang === 'da' ? '1 ulæst' : '1 unread') : (lang === 'da' ? `${messageCount} ulæste` : `${messageCount} unread`)}
        </span>
      </span>

      {nextEvent && (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-white/5 text-primary dark:text-white rounded-lg shadow-sm">
          <strong className="font-extrabold text-main uppercase tracking-wide text-xs">{lang === 'da' ? 'NÆSTE' : 'NEXT'}</strong>
          <span className="font-bold text-main text-sm">{t(nextEvent.titleKey)}</span>
          <span className="text-text-muted text-sm">kl. {nextEvent.time}</span>
          {nextEvent.location && (
            <>
              <span className="text-border/60">·</span>
              <span className="text-text-muted text-sm whitespace-nowrap">{nextEvent.location}</span>
            </>
          )}
        </span>
      )}
    </div>
  )
}

export default DailySummaryStrip
