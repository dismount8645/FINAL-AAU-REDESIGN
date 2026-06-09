import { useMemo, useCallback, memo, forwardRef } from 'react';

import { Plus, MessageCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text, Heading } from '@/components/ui';
const dashboardForumPosts = [
  { id: 501, category: 'forumPosts', titleDa: 'Spørgsmål til litteraturen i uge 2', titleEn: 'Questions regarding literature week 2', iconName: 'MessageCircle', author: 'Jacob Andersen', timeDa: 'For 2 timer siden', timeEn: '2 hours ago', replies: 3, important: false },
  { id: 102, category: 'forumPosts', titleDa: 'Aflyst forelæsning i morgen', titleEn: 'Cancelled lecture tomorrow', iconName: 'AlertCircle', author: 'Morten Jensen', timeDa: 'I går', timeEn: 'Yesterday', replies: 12, important: true },
  { id: 103, category: 'forumPosts', titleDa: 'Læsegruppe søges', titleEn: 'Study group wanted', iconName: 'Users', timeDa: 'For 3 dage siden', timeEn: '3 days ago', replies: 5, important: false }
]
import useStore from '@/store';

interface ForumPost {
  id: number
  title: string
  author: string
  time: string
  replies: number
  important: boolean
}

interface ForumWidgetProps {
  professor: string
}

const PostItem = memo(forwardRef<HTMLButtonElement, {
  post: ForumPost,
  onClick: (id: number) => void
}>(({ post, onClick }, ref) => {
  const t = useStore(state => state.t)

  return (
    <button
      ref={ref}
      type="button"
      className="forum-list-item w-full text-left flex items-center gap-[var(--space-md)] p-[var(--space-sm)] rounded-[var(--radius-xl)] transition-all duration-150 hover:bg-bg-hover cursor-pointer group/item outline-none focus-visible:outline-none focus-visible:shadow-focus border border-transparent hover:border-[var(--border-color)]/40"
      onClick={() => onClick(post.id)}
    >
      <Stack gap="xs" className="forum-list-item__content flex-1 min-w-0">
        <div className="flex items-center gap-[var(--space-xs)]">
          {post.important && (
            <Badge variant="warning" pill className="text-[0.625rem] uppercase tracking-tighter px-1.5 h-4 flex items-center">
              {t('important')}
            </Badge>
          )}
          <Text weight="bold" size="sm" className="forum-list-item__title text-main group-hover/item:text-primary transition-colors truncate leading-tight">
            {post.title}
          </Text>
        </div>
        <Text size="sm" className="text-text-muted truncate">
          {t('by')} <span className="font-bold text-main">{post.author}</span> &bull; {post.time}
        </Text>
      </Stack>

      <div className="flex flex-col items-end gap-[var(--space-4xs)] shrink-0">
        <div className="forum-list-item__reply-count flex items-center gap-1.5 px-[var(--space-xs)] py-[var(--space-4xs)] bg-bg-highlight rounded-[var(--radius-md)] border border-[var(--border-color)]/40 group-hover/item:border-primary/30 transition-colors">
          <Text weight="black" size="xs" className="text-primary dark:text-indigo-200 leading-none">{post.replies}</Text>
          <MessageCircle size={12} strokeWidth={2.5} className="text-primary dark:text-indigo-200 opacity-60" />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all duration-300 -translate-x-1 group-hover/item:translate-x-0">
          <ArrowRight size={10} strokeWidth={3} className="text-primary" />
        </div>
      </div>
    </button>
  )
}))

PostItem.displayName = 'PostItem'

const ForumWidget = ({ professor }: ForumWidgetProps) => {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  const navigate = useNavigate()

  const itemsToShow = 3
  const visiblePosts = useMemo(() => (
    dashboardForumPosts.slice(0, itemsToShow).map((post) => ({
      ...post,
      title: localize(post, 'title'),
      author: post.author || professor,
      time: localize(post, 'time'),
      important: !!post.important,
    }))
  ), [itemsToShow, localize, professor])

  const handleNewPost = useCallback(() => {
    navigate('/forum/new')
  }, [navigate])

  const handlePostClick = useCallback((id: number) => {
    navigate(`/forum/${id}`)
  }, [navigate])

  const handleViewAll = useCallback(() => {
    navigate('/forum')
  }, [navigate])

  return (
    <Card className="forum-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <MessageCircle size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('forum')}
          </Heading>
        </Stack>

        <Button
          variant="ghost"
          size="xs"
          className="normal-case tracking-normal font-bold text-primary hover:bg-bg-card/50"
          onClick={handleNewPost}
          icon={Plus}
        >
          {t('new_post')}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        <div className="h-full w-full flex flex-col gap-[var(--space-xs)] forum-list">
          {visiblePosts.map((post) => (
            <PostItem
              key={post.id}
              post={post as ForumPost}
              onClick={handlePostClick}
            />
          ))}
        </div>
      </Card.Body>

      <Card.Footer padding="compact" className="bg-bg-highlight/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="xs" weight="semibold" className="text-text-muted">
          {visiblePosts.length} {t('active_discussions')}
        </Text>
        <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-300 translate-x-2 group-hover/widget:translate-x-0">
          <Button
            variant="ghost"
            size="xs"
            className="text-primary uppercase font-black tracking-tighter p-0 h-auto hover:bg-transparent"
            onClick={handleViewAll}
            iconRight={ChevronRight}
          >
            {t('view_all')}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default memo(ForumWidget)

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
  describe('ForumWidget', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({ lang: 'da' })
    })

    it('renders correctly', () => {
      renderWithProviders(<ForumWidget professor="Prof. Hansen" />)
      expect(screen.getByText('Kursusforum')).toBeInTheDocument()
      expect(screen.getByText('Spørgsmål til litteraturen i uge 2')).toBeInTheDocument()
      expect(screen.getByText('Prof. Hansen')).toBeInTheDocument()
    })

    it('renders correctly in English', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<ForumWidget professor="Prof. Hansen" />)
      expect(screen.getByText('Questions regarding literature week 2')).toBeInTheDocument()
      expect(screen.getByText('Prof. Hansen')).toBeInTheDocument()
    })

    it('renders 3 forum posts', () => {
      renderWithProviders(<ForumWidget professor="Prof. Hansen" />)
      const replyCounts = document.querySelectorAll('.forum-list-item__reply-count')
      expect(replyCounts.length).toBe(3)
    })

    it('shows important badge for important posts', () => {
      renderWithProviders(<ForumWidget professor="Prof. Hansen" />)
      expect(screen.getByText('Vigtigt')).toBeInTheDocument()
    })

    it('navigates to forum post when post is clicked', () => {
      renderWithProviders(<ForumWidget professor="Prof. Hansen" />)
      const item = screen.getByText('Spørgsmål til litteraturen i uge 2')
      fireEvent.click(item)
      expect(mockNavigate).toHaveBeenCalledWith('/forum/501')
    })

    it('navigates to new post when button is clicked', () => {
      renderWithProviders(<ForumWidget professor="Prof. Hansen" />)
      const btn = screen.getByRole('button', { name: /nyt indlæg/i })
      fireEvent.click(btn)
      expect(mockNavigate).toHaveBeenCalledWith('/forum/new')
    })

    it('navigates to forum page when "se_all" is clicked', () => {
      renderWithProviders(<ForumWidget professor="Prof. Hansen" />)
      const btn = screen.getByRole('button', { name: /se alle/i })
      fireEvent.click(btn)
      expect(mockNavigate).toHaveBeenCalledWith('/forum')
    })
  })
}
