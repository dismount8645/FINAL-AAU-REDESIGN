import { useNavigate } from 'react-router-dom'
import { ChevronRight, Reply, MessageSquare, Book, MessageCircle, ArrowRight } from 'lucide-react'
import Stack from '@/components/ui/Stack'
import { Text, Heading } from '@/components/ui/Typography'
import StatusItem from '@/components/ui/StatusItem'
import Card from '@/components/ui/Card'
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
  const { t, localize } = useStore()

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
      "shadow-sm hover:shadow-md transition-all duration-300 border-border/60"
    )}>
      <Card.Header spacing="compact" className="border-b border-border/40 bg-bg-card/30 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-primary/5 rounded-lg text-primary">
            <MessageCircle size={18} strokeWidth={2.5} />
          </div>
          <Text weight="black" size="lg" className="tracking-tight uppercase text-xs sm:text-sm">
            {t('forum_activity')}
          </Text>
        </Stack>
        
        <button
          type="button"
          className="group/link text-[0.7rem] font-black uppercase tracking-[0.1em] text-primary hover:text-aau-blue inline-flex items-center gap-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
          onClick={handleViewAll}
        >
          {t('view_all')}
          <ChevronRight size={14} className="transition-transform group-hover/link:translate-x-1" />
        </button>
      </Card.Header>

      <Card.Body spacing="compact" className="p-2 flex-1">
        <Stack gap="xs" className="h-full">
          {activities.slice(0, itemsToShow).map((a) => (
            <div
              key={a.id}
              role="button"
              tabIndex={0}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all duration-200",
                "hover:bg-muted/40 cursor-pointer group/item outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset"
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
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40 group-hover/item:bg-primary/20 transition-colors" />
                    <Text size="xs" className="forum-activity__snippet text-text-muted leading-relaxed relative">
                      <span className="text-primary/40 mr-1 font-serif text-lg leading-none absolute -left-4 -top-1">&ldquo;</span>
                      <span className="italic">{localize(a, 'snippet')}</span>
                      <span className="text-primary/40 ml-0.5 font-serif text-lg leading-none">&rdquo;</span>
                    </Text>
                  </div>
                )}

                <div className="pl-10 mt-1 flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0">
                  <div className="h-px w-4 bg-primary/30" />
                  <Text size="2xs" weight="bold" className="text-primary uppercase tracking-widest">{t('read_more')}</Text>
                  <ArrowRight size={10} className="text-primary" />
                </div>
              </Stack>
            </div>
          ))}
        </Stack>
      </Card.Body>

      {/* Aesthetic Bottom Info */}
      <div className="px-6 py-3 bg-muted/5 border-t border-border/20 text-[0.65rem] text-text-muted flex items-center justify-between">
        <span className="font-medium">{t('communication')}</span>
        <span className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-opacity">
          {t('active_now')} <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        </span>
      </div>
    </Card>
  )
}

export default memo(ForumActivityWidget)

