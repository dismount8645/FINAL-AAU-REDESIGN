import { memo, useCallback } from 'react';

import { ChevronRight, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card, MasterItem } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text, Heading } from '@/components/ui';
import { cn } from '@/lib/utils';
import { mockForumActivities } from '@/lib/data';
import useStore from '@/store';
import { PATHS } from '@/routes';

const ACTIVITY_COLOR_MAP: Record<string, string> = {
  'var(--color-reply-icon, var(--color-primary))': 'text-primary bg-primary/10',
  'var(--color-accent)': 'text-accent bg-accent/10',
  'var(--color-success)': 'text-success bg-success/10',
}

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
}

const ForumActivityWidget = ({ size = 'medium' }: WidgetProps) => {
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  const localize = useStore(state => state.localize)

  const handleViewAll = useCallback(() => {
    navigate(PATHS.COURSES)
  }, [navigate])

  const handleActivityClick = useCallback((id: number) => {
    navigate(PATHS.FORUM(id))
  }, [navigate])

  const limit = size === 'small' ? 1 : size === 'medium' ? 2 : 3

  return (
    <Card className="forum-activity-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <MessageCircle size={16} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('course.forum_activity')}
          </Heading>
        </Stack>

        {size !== 'small' && (
          <Button
            variant="ghost"
            size="sm"
            className="font-black uppercase tracking-widest text-primary"
            onClick={handleViewAll}
            iconRight={ChevronRight}
            aria-label={lang === 'da' ? 'Se alle forumindlæg' : 'See all forum posts'}
          >
            {lang === 'da' ? 'Se alle forumindlæg' : 'See all forum posts'}
          </Button>
        )}
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-xs)] flex-1 flex flex-col justify-center">
        <div className="w-full flex flex-col gap-[var(--space-4xs)]">
          {mockForumActivities.slice(0, limit).map((a) => (
            <div key={a.id} className="w-full">
              <MasterItem
                onClick={() => handleActivityClick(a.id)}
                className="w-full text-left p-[var(--space-2xs)] rounded-[var(--radius-md)] border-none"
                leading={a.icon}
                leadingClassName={cn(ACTIVITY_COLOR_MAP[a.color] ?? 'text-primary bg-primary/10')}
                title={localize(a, 'title')}
                subtitle={a.subtitle}
                meta={
                  size !== 'small' && (
                    <div className="relative mt-2xs">
                      <Text size="xs" muted className="forum-activity__snippet truncate block">
                        {localize(a, 'snippet')}
                      </Text>
                    </div>
                  )
                }
                trailing={
                  size === 'large' && (
                    <div className="mt-[var(--space-2xs)] flex items-center gap-[var(--space-2xs)] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-[var(--space-xs)] group-hover:translate-x-0">
                      <div className="h-px w-3 bg-primary/30" />
                      <Text size="xs" weight="black" className="text-primary dark:text-white uppercase tracking-widest">{t('read_more')}</Text>
                      <ArrowRight size={10} strokeWidth={3} className="text-primary dark:text-white" />
                    </div>
                  )
                }
              />
            </div>
          ))}
        </div>
      </Card.Body>

      {size !== 'small' && (
        <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center cursor-pointer hover:bg-bg-hover transition-colors" onClick={handleViewAll} role="button" tabIndex={0}>
          <Text size="xs" weight="medium" className="text-muted italic">
            {t('communication')}
          </Text>
          <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
            <Text size="xs" weight="bold" className="text-primary dark:text-white uppercase">{lang === 'da' ? 'Se alle forumindlæg' : 'See all forum posts'}</Text>
            <ChevronRight size={14} strokeWidth={2.5} className="text-primary dark:text-white" />
          </div>
        </Card.Footer>
      )}
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
      renderWithProviders(<ForumActivityWidget size="large" />)
      expect(screen.getByText('Forum aktivitet')).toBeInTheDocument()
      expect(screen.getByText('Spørgsmål til teksten')).toBeInTheDocument()
      expect(screen.getByText('Gruppesøgning')).toBeInTheDocument()
      expect(screen.getByText('Pensumliste')).toBeInTheDocument()
    })

    it('renders snippets for all items', () => {
      renderWithProviders(<ForumActivityWidget size="large" />)
      expect(screen.getByText(/Jeg har lagt de nye slides op nu/)).toBeInTheDocument()
    })

    it('navigates to courses when view all is clicked', () => {
      renderWithProviders(<ForumActivityWidget />)
      const btn = screen.getAllByText(/Se alle forumindlæg/i)[0]
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
