import { useNavigate } from 'react-router-dom'
import { ChevronRight, Reply, MessageSquare, Book, MessageCircle, ArrowRight } from 'lucide-react'
import Stack from '@/components/ui/Stack'
import { Text, Heading } from '@/components/ui/Typography'
import StatusItem from '@/components/ui/StatusItem'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'
import { useMemo, memo, useCallback } from 'react'
import { cn } from '@/lib/utils'

const activities = [
  {
    id: 1,
    titleDa: 'Spørgsmål til teksten',
    titleEn: 'Questions regarding the text',
    subtitle: 'Morten Jensen',
    snippetDa: 'Jeg har lagt de nye slides op nu...',
    snippetEn: 'I have uploaded the new slides now...',
    icon: Reply,
    color: 'var(--color-primary)'
  },
  {
    id: 2,
    titleDa: 'Gruppesøgning',
    titleEn: 'Group Search',
    subtitle: 'Lærke Nielsen',
    snippetDa: 'Er der nogen der mangler en gruppe?',
    snippetEn: 'Is anyone missing a group?',
    icon: MessageSquare,
    color: 'var(--color-accent)'
  },
  {
    id: 3,
    titleDa: 'Pensumliste',
    titleEn: 'Syllabus',
    subtitle: 'Anders Nielsen',
    snippetDa: 'Husk at tjekke den opdaterede liste.',
    snippetEn: 'Remember to check the updated list.',
    icon: Book,
    color: 'var(--color-success)'
  },
]

const ForumActivityWidget = ({ span, isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  const itemsToShow = useMemo(() => 
    span <= 4 ? 2 : (span <= 8 ? 2 : 3),
    [span]
  )

  const handleViewAll = useCallback(() => {
    if (!isEditing) navigate('/courses')
  }, [isEditing, navigate])

  return (
    <Card className={cn(
      "forum-activity-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-[var(--bg-highlight)]/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-[var(--aau-blue)] text-white rounded-[var(--radius-md)] shadow-sm">
            <MessageCircle size={18} strokeWidth={2} />
          </div>
          <Heading level={4} className="m-0 text-sm font-bold text-[var(--text-main)]">
            {t('forum_activity')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-[0.65rem] font-black uppercase tracking-widest text-[var(--aau-blue)]"
          onClick={handleViewAll}
          iconRight={ChevronRight}
        >
          {t('view_all')}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        <Stack gap="xs" className="h-full">
          {activities.slice(0, itemsToShow).map((a) => (
            <div
              key={a.id}
              role="button"
              tabIndex={0}
              className={cn(
                "w-full text-left p-[var(--space-sm)] rounded-[var(--radius-xl)] transition-all duration-200",
                "hover:bg-[var(--bg-hover)] cursor-pointer group/item outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--aau-blue)]/50 focus-visible:ring-inset"
              )}
              onClick={() => !isEditing && navigate(`/forum/${a.id}`)}
              onKeyDown={(e) => {
                if (!isEditing && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  navigate(`/forum/${a.id}`)
                }
              }}
            >
              <Stack gap="xs">
                <StatusItem
                  icon={a.icon}
                  iconColor={a.color}
                  title={localize(a, 'title')}
                  subtitle={a.subtitle}
                  className="!px-0 !py-0 !mx-0 hover:bg-transparent"
                />
                
                {span > 8 && (
                  <div className="pl-10 relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border-color)]/40 group-hover/item:bg-[var(--aau-blue)]/20 transition-colors" />
                    <Text size="xs" className="forum-activity__snippet text-[var(--text-muted)] leading-relaxed relative">
                      <span className="text-[var(--aau-blue)]/40 mr-1 font-serif text-lg leading-none absolute -left-4 -top-1">&ldquo;</span>
                      <span className="italic">{localize(a, 'snippet')}</span>
                      <span className="text-[var(--aau-blue)]/40 ml-0.5 font-serif text-lg leading-none">&rdquo;</span>
                    </Text>
                  </div>
                )}

                <div className="pl-10 mt-1 flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0">
                  <div className="h-px w-4 bg-[var(--aau-blue)]/30" />
                  <Text size="2xs" weight="bold" className="text-[var(--aau-blue)] uppercase tracking-widest">{t('read_more')}</Text>
                  <ArrowRight size={10} className="text-[var(--aau-blue)]" />
                </div>
              </Stack>
            </div>
          ))}
        </Stack>
      </Card.Body>

      {/* Aesthetic Bottom Info */}
      <Card.Footer padding="compact" className="bg-[var(--bg-highlight)]/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="xs" weight="medium" className="text-[var(--text-muted)] italic">
          {t('communication')}
        </Text>
        <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-opacity">
          <Text size="xs" weight="bold" className="text-[var(--aau-dark-green)] uppercase tracking-tighter">{t('active_now')}</Text>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--aau-dark-green)] animate-pulse" />
        </div>
      </Card.Footer>
    </Card>
  )
}

export default memo(ForumActivityWidget)

