import { useMemo, useCallback, memo, forwardRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';;
import { Text, Heading } from '@/components/ui';
import { dashboardForumPosts } from '@/data/registry';
import useStore from '@/store';
import { renderWithProviders } from '@/test/test-utils';
import type { WidgetProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getWidgetDisplayLayout } from '@/config/widgetLayout';

interface ForumPost {
  id: number
  title: string
  author: string
  time: string
  replies: number
  important: boolean
}

interface ForumWidgetProps extends WidgetProps {
  professor: string
}

/**
 * PostItem - Individual forum entry with refactored A11y and Motion.
 */
const PostItem = memo(forwardRef<HTMLButtonElement, { 
  post: ForumPost, 
  onClick: (id: number) => void 
}>(({ post, onClick }, ref) => {
  const t = useStore(state => state.t)
  
  return (
    <motion.button
      ref={ref}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.15 }}
      type="button"
      className={cn(
        "forum-list-item w-full text-left flex items-center gap-[var(--space-md)] p-[var(--space-sm)] rounded-[var(--radius-xl)] transition-all duration-150",
        "hover:bg-bg-hover cursor-pointer group/item outline-none",
        "focus-visible:outline-none focus-visible:shadow-focus border border-transparent hover:border-[var(--border-color)]/40"
      )}
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
        <Text size="xs" className="text-text-muted truncate">
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
    </motion.button>
  )
}))

PostItem.displayName = 'PostItem'

/**
 * ForumWidget - Collaborative course communication hub.
 */
const ForumWidget = ({ professor, span, isEditing }: ForumWidgetProps) => {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  const navigate = useNavigate()

  const { itemsToShow } = useMemo(() => getWidgetDisplayLayout(span), [span])
  const visiblePosts = useMemo(() => (
    dashboardForumPosts.slice(0, itemsToShow).map((post) => ({
      ...post,
      title: localize(post, 'title'),
      author: post.author || professor,
      time: localize(post, 'time'),
      important: 'important' in post ? post.important : false,
    }))
  ), [itemsToShow, localize, professor])

  const handleNewPost = useCallback(() => {
    if (!isEditing) navigate('/forum/new')
  }, [isEditing, navigate])

  const handlePostClick = useCallback((id: number) => {
    if (!isEditing) navigate(`/forum/${id}`)
  }, [isEditing, navigate])

  const handleViewAll = useCallback(() => {
    if (!isEditing) navigate('/forum')
  }, [isEditing, navigate])

  return (
    <Card className={cn(
      "forum-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60"
    )}>
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
          disabled={isEditing}
        >
          {t('new_post')}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        <div className="h-full w-full flex flex-col gap-[var(--space-xs)] forum-list">
          <AnimatePresence mode="popLayout">
            {visiblePosts.map((post) => (
              <PostItem
                key={post.id}
                post={post as ForumPost}
                onClick={handlePostClick}
              />
            ))}
          </AnimatePresence>
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
      renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
      expect(screen.getByText('Kursusforum')).toBeInTheDocument()
      expect(screen.getByText('Spørgsmål til litteraturen i uge 2')).toBeInTheDocument()
      expect(screen.getByText('Prof. Hansen')).toBeInTheDocument()
    })
  
    it('renders correctly in English', () => {
      useStore.setState({ lang: 'en' })
      
      renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
      expect(screen.getByText('Questions regarding literature week 2')).toBeInTheDocument()
      expect(screen.getByText('Prof. Hansen')).toBeInTheDocument()
    })
  
    it('renders medium number of items for span 8', () => {
      renderWithProviders(<ForumWidget span={8} isEditing={false} professor="Prof. Hansen" />)
      const replyCounts = document.querySelectorAll('.forum-list-item__reply-count')
      expect(replyCounts.length).toBe(2)
    })
  
    it('renders only 1 item for small span (4)', () => {
      renderWithProviders(<ForumWidget span={4} isEditing={false} professor="Prof. Hansen" />)
      const replyCounts = document.querySelectorAll('.forum-list-item__reply-count')
      expect(replyCounts.length).toBe(1)
    })
  
    it('shows important badge for important posts', () => {
      renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
      expect(screen.getByText('Vigtigt')).toBeInTheDocument()
    })
  
    it('button is disabled when isEditing is true', () => {
      renderWithProviders(<ForumWidget span={12} isEditing={true} professor="Prof. Hansen" />)
      const btn = screen.getByRole('button', { name: /nyt indlæg/i })
      expect(btn).toBeDisabled()
    })
  
    it('navigates to forum post when post is clicked', () => {
      renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
      const item = screen.getByText('Spørgsmål til litteraturen i uge 2')
      fireEvent.click(item)
      expect(mockNavigate).toHaveBeenCalledWith('/forum/501')
    })
  
    it('navigates to new post when button is clicked', () => {
      renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
      const btn = screen.getByRole('button', { name: /nyt indlæg/i })
      fireEvent.click(btn)
      expect(mockNavigate).toHaveBeenCalledWith('/forum/new')
    })
  
    it('navigates to forum page when "se_all" is clicked', () => {
      renderWithProviders(<ForumWidget span={12} isEditing={false} professor="Prof. Hansen" />)
      const btn = screen.getByRole('button', { name: /se alle/i })
      fireEvent.click(btn)
      expect(mockNavigate).toHaveBeenCalledWith('/forum')
    })
  
    it('does not navigate on se_all or post click when isEditing is true', () => {
      renderWithProviders(<ForumWidget span={12} isEditing={true} professor="Prof. Hansen" />)
      const item = screen.getByText('Spørgsmål til litteraturen i uge 2')
      fireEvent.click(item)
      expect(mockNavigate).not.toHaveBeenCalled()
  
      const btn = screen.getByRole('button', { name: /se alle/i })
      fireEvent.click(btn)
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
}
