import { useMemo, memo, useCallback, forwardRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Reply, MessageSquare, Book, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/Card';
import { Stack } from '@/components/LayoutPrimitives';
import StatusItem from '@/components/StatusItem';
import { Text, Heading } from '@/components/Typography';
import useStore from '@/lib/store';
import { renderWithProviders } from '@/lib/test-utils';
import type { WidgetProps } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Activity {
  id: number
  titleDa: string
  titleEn: string
  subtitle: string
  snippetDa: string
  snippetEn: string
  icon: typeof Reply
  color: string
}

const activities: Activity[] = [
  {
    id: 1,
    titleDa: 'Spørgsmål til teksten',
    titleEn: 'Questions regarding the text',
    subtitle: 'Morten Jensen',
    snippetDa: 'Jeg har lagt de nye slides op nu...',
    snippetEn: 'I have uploaded the new slides now...',
    icon: Reply,
    color: 'var(--color-reply-icon, var(--color-primary))'
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

/**
 * ActivityItem - Individual activity entry with refactored A11y and tokens.
 */
const ActivityItem = memo(forwardRef<HTMLButtonElement, { 
  activity: Activity, 
  showSnippet: boolean,
  onClick: (id: number) => void 
}>(({ activity, showSnippet, onClick }, ref) => {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  
  return (
    <motion.button
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      type="button"
      className={cn(
        "w-full text-left p-[var(--space-sm)] rounded-[var(--radius-xl)] transition-all duration-150",
        "hover:bg-bg-hover cursor-pointer group/item outline-none",
        "focus-visible:outline-none focus-visible:shadow-focus"
      )}
      onClick={() => onClick(activity.id)}
    >
      <Stack gap="xs">
        <StatusItem
          icon={activity.icon}
          iconColor={activity.color}
          title={localize(activity, 'title')}
          subtitle={activity.subtitle}
          className="!px-0 !py-0 !mx-0 hover:bg-transparent"
        />
        
        {showSnippet && (
          <div className="pl-[var(--space-xl)] relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border-color)]/40 group-hover/item:bg-primary/20 transition-colors" />
            <Text size="xs" className="forum-activity__snippet text-muted leading-relaxed relative">
              <span className="text-primary/40 dark:text-primary/70 mr-[var(--space-xs)] font-serif text-lg leading-none absolute -left-[var(--space-md)] -top-[var(--space-xs)]">&ldquo;</span>
              <span className="italic">{localize(activity, 'snippet')}</span>
              <span className="text-primary/40 dark:text-primary/70 ml-[var(--space-2xs)] font-serif text-lg leading-none">&rdquo;</span>
            </Text>
          </div>
        )}

        <div className="pl-[var(--space-xl)] mt-[var(--space-xs)] flex items-center gap-[var(--space-2xs)] opacity-0 group-hover/item:opacity-100 transition-all duration-300 -translate-x-[var(--space-sm)] group-hover/item:translate-x-0">
          <div className="h-px w-4 bg-primary/30" />
          <Text size="xs" weight="black" className="text-primary dark:text-white uppercase tracking-widest">{t('read_more')}</Text>
          <ArrowRight size={10} strokeWidth={3} className="text-primary dark:text-white" />
        </div>
      </Stack>
    </motion.button>
  )
}))

ActivityItem.displayName = 'ActivityItem'

/**
 * ForumActivityWidget - Stream of recent course communication.
 */
const ForumActivityWidget = ({ span, isEditing }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)

  const itemsToShow = useMemo(() => 
    span <= 4 ? 2 : (span <= 8 ? 2 : 3),
    [span]
  )

  const handleViewAll = useCallback(() => {
    if (!isEditing) navigate('/courses')
  }, [isEditing, navigate])

  const handleActivityClick = useCallback((id: number) => {
    if (!isEditing) navigate(`/forum/${id}`)
  }, [isEditing, navigate])

  return (
    <Card className={cn(
      "forum-activity-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <MessageCircle size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {span && span > 4 ? t('course.forum_activity') : t('course.forum')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size={span && span > 4 ? "xs" : "icon-xs"}
          className="font-black uppercase tracking-widest text-primary hover:bg-bg-card/50"
          onClick={handleViewAll}
          iconRight={ChevronRight}
          aria-label={t('view_all')}
        >
          {span && span > 4 ? t('view_all') : ''}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        <div className="h-full flex flex-col gap-[var(--space-2xs)]">
          <AnimatePresence mode="popLayout">
            {activities.slice(0, itemsToShow).map((a) => (
              <ActivityItem
                key={a.id}
                activity={a}
                showSnippet={span > 8}
                onClick={handleActivityClick}
              />
            ))}
          </AnimatePresence>
        </div>
      </Card.Body>

      {/* Aesthetic Bottom Info */}
      <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="xs" weight="medium" className="text-muted italic">
          {t('communication')}
        </Text>
        <div className="flex items-center gap-[var(--space-2xs)] opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300">
          <Text size="xs" weight="bold" className="text-success uppercase tracking-tighter">{t('active_now')}</Text>
          <div className="w-1.5 h-1.5 rounded-[var(--radius-full)] bg-success animate-pulse" />
        </div>
      </Card.Footer>
    </Card>
  )
}

export default memo(ForumActivityWidget)

let mockNavigate
if (import.meta.vitest) {
  const mockNavigate = vi.fn()
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    }
  })
  describe('ForumActivityWidget', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })
  
    it('renders correctly', () => {
      renderWithProviders(<ForumActivityWidget span={12} isEditing={false} />)
      expect(screen.getByText('Forum aktivitet')).toBeInTheDocument()
      expect(screen.getByText('Spørgsmål til teksten')).toBeInTheDocument()
      expect(screen.getByText('Gruppesøgning')).toBeInTheDocument()
      expect(screen.getByText('Pensumliste')).toBeInTheDocument()
    })
  
    it('renders limited number of items based on span', () => {
      renderWithProviders(<ForumActivityWidget span={4} isEditing={false} />)
      expect(screen.getByText('Spørgsmål til teksten')).toBeInTheDocument()
      expect(screen.queryByText('Pensumliste')).not.toBeInTheDocument()
    })
  
    it('renders 2 items for medium span (8) without snippets', () => {
      renderWithProviders(<ForumActivityWidget span={8} isEditing={false} />)
      expect(screen.getByText('Spørgsmål til teksten')).toBeInTheDocument()
      expect(screen.getByText('Gruppesøgning')).toBeInTheDocument()
      expect(screen.queryByText('Pensumliste')).not.toBeInTheDocument()
      expect(screen.queryByText(/Jeg har lagt de nye slides op nu/)).not.toBeInTheDocument()
    })
  
    it('shows snippets for large span', () => {
      renderWithProviders(<ForumActivityWidget span={12} isEditing={false} />)
      expect(screen.getByText(/Jeg har lagt de nye slides op nu/)).toBeInTheDocument()
    })
  
    it('navigates to courses when view all is clicked', () => {
      renderWithProviders(<ForumActivityWidget span={12} isEditing={false} />)
      const btn = screen.getByText('Se alle')
      fireEvent.click(btn)
      expect(mockNavigate).toHaveBeenCalledWith('/courses')
    })
  
    it('does not navigate when isEditing is true', () => {
      renderWithProviders(<ForumActivityWidget span={12} isEditing={true} />)
      const btn = screen.getByText('Se alle')
      fireEvent.click(btn)
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  
    it('navigates to forum post when activity item is clicked', () => {
      renderWithProviders(<ForumActivityWidget span={12} isEditing={false} />)
      const item = screen.getByText('Spørgsmål til teksten')
      fireEvent.click(item)
      expect(mockNavigate).toHaveBeenCalledWith('/forum/1')
    })
  
    it('does not navigate on activity item click when isEditing is true', () => {
      renderWithProviders(<ForumActivityWidget span={12} isEditing={true} />)
      const item = screen.getByText('Spørgsmål til teksten')
      fireEvent.click(item)
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
}
