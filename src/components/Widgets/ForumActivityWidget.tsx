import { memo, useCallback } from 'react';

import { ChevronRight, Reply, MessageSquare, Book, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text, Heading } from '@/components/ui';
import useStore from '@/store';

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

import { MasterItem } from '@/components/ui'

const ForumActivityWidget = () => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  const handleViewAll = useCallback(() => {
    navigate('/courses')
  }, [navigate])

  const handleActivityClick = useCallback((id: number) => {
    navigate(`/forum/${id}`)
  }, [navigate])

  return (
    <Card className="forum-activity-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <MessageCircle size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('course.forum_activity')}
          </Heading>
        </Stack>

        <Button
          variant="ghost"
          size="xs"
          className="font-black uppercase tracking-widest text-primary hover:bg-bg-card/50"
          onClick={handleViewAll}
          iconRight={ChevronRight}
          aria-label={t('view_all')}
        >
          {t('view_all')}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        <div className="h-full flex flex-col gap-[var(--space-2xs)]">
          {activities.map((a) => (
            <div key={a.id} className="w-full">
              <MasterItem
                onClick={() => handleActivityClick(a.id)}
                className="w-full text-left p-[var(--space-sm)] rounded-[var(--radius-xl)] border-none"
                leading={a.icon}
                leadingClassName="text-[var(--color-primary)]"
                title={localize(a, 'title')}
                subtitle={a.subtitle}
                meta={
                  <div className="pl-[var(--space-xl)] relative mt-xs">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border-color)]/40 group-hover/item:bg-primary/20 transition-colors" />
                    <Text size="xs" className="forum-activity__snippet text-muted leading-relaxed relative">
                      <span className="text-primary/40 dark:text-primary/70 mr-[var(--space-xs)] font-serif text-lg leading-none absolute -left-[var(--space-md)] -top-[var(--space-xs)]">&ldquo;</span>
                      <span className="italic">{localize(a, 'snippet')}</span>
                      <span className="text-primary/40 dark:text-primary/70 ml-[var(--space-2xs)] font-serif text-lg leading-none">&rdquo;</span>
                    </Text>
                  </div>
                }
                trailing={
                  <div className="pl-[var(--space-xl)] mt-[var(--space-xs)] flex items-center gap-[var(--space-2xs)] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-[var(--space-sm)] group-hover:translate-x-0">
                    <div className="h-px w-4 bg-primary/30" />
                    <Text size="xs" weight="black" className="text-primary dark:text-white uppercase tracking-widest">{t('read_more')}</Text>
                    <ArrowRight size={10} strokeWidth={3} className="text-primary dark:text-white" />
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </Card.Body>

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

let mockNavigate: ReturnType<typeof vi.fn>
if (import.meta.vitest) {
  mockNavigate = vi.fn()
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
      renderWithProviders(<ForumActivityWidget />)
      expect(screen.getByText('Forum aktivitet')).toBeInTheDocument()
      expect(screen.getByText('Spørgsmål til teksten')).toBeInTheDocument()
      expect(screen.getByText('Gruppesøgning')).toBeInTheDocument()
      expect(screen.getByText('Pensumliste')).toBeInTheDocument()
    })

    it('renders snippets for all items', () => {
      renderWithProviders(<ForumActivityWidget />)
      expect(screen.getByText(/Jeg har lagt de nye slides op nu/)).toBeInTheDocument()
    })

    it('navigates to courses when view all is clicked', () => {
      renderWithProviders(<ForumActivityWidget />)
      const btn = screen.getByText('Se alle')
      fireEvent.click(btn)
      expect(mockNavigate).toHaveBeenCalledWith('/courses')
    })

    it('navigates to forum post when activity item is clicked', () => {
      renderWithProviders(<ForumActivityWidget />)
      const item = screen.getByText('Spørgsmål til teksten')
      fireEvent.click(item)
      expect(mockNavigate).toHaveBeenCalledWith('/forum/1')
    })
  })
}
