import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, Heading } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { PATHS } from '@/routes';
import useStore from '@/store';

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
  hideFirst?: boolean
  isPriorityElevated?: boolean
}

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

  const sortedMessages = useMemo(() => {
    return [...mockMessages].sort((a, b) => {
      if (a.unread && !b.unread) return -1
      if (!a.unread && b.unread) return 1
      return 0
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

export { MessagesWidget }
