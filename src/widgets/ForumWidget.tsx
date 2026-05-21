import { useMemo, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, MessageCircle, ArrowRight, ChevronRight } from 'lucide-react'
import Stack from '@/components/ui/Stack'
import { Text, Heading } from '@/components/ui/Typography'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'
import { dashboardForumPosts } from '@/data/dashboardWidgets'
import { getWidgetDisplayLayout } from '@/utils/widgetLayout'
import { cn } from '@/lib/utils'

interface ForumWidgetProps extends WidgetProps {
  professor: string;
}

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

  return (
    <Card className={cn(
      "forum-widget h-full w-full flex flex-col group/widget overflow-hidden",
      "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 border-[var(--border-color)]/60"
    )}>
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-[var(--bg-highlight)]/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-2 bg-[var(--aau-blue)] text-white rounded-[var(--radius-md)] shadow-sm">
            <MessageCircle size={18} strokeWidth={2} />
          </div>
          <Heading level={4} className="m-0 text-sm font-bold text-[var(--text-main)]">
            {t('course_forum')}
          </Heading>
        </Stack>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-[0.65rem] font-black uppercase tracking-widest text-[var(--aau-blue)]"
          onClick={handleNewPost}
          icon={Plus}
          disabled={isEditing}
        >
          {t('new_post')}
        </Button>
      </Card.Header>

      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1">
        <div className="h-full w-full flex flex-col gap-[var(--space-xs)] forum-list">
          {visiblePosts.map((post) => (
            <button
              key={post.id}
              type="button"
              className={cn(
                "forum-list-item w-full text-left flex items-center gap-[var(--space-md)] p-[var(--space-sm)] rounded-[var(--radius-xl)] transition-all duration-200",
                "hover:bg-[var(--bg-hover)] cursor-pointer group/item outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--aau-blue)]/50 border border-transparent hover:border-[var(--border-color)]/40"
              )}
              onClick={() => navigate(`/forum/${post.id}`)}
            >
              <Stack gap="xs" className="forum-list-item__content flex-1 min-w-0">
                <div className="flex items-center gap-sm">
                  {post.important && <Badge variant="warning" pill className="text-[10px] uppercase tracking-tighter">{t('important')}</Badge>}
                  <Text weight="bold" size="sm" className="forum-list-item__title text-[var(--text-main)] group-hover/item:text-[var(--aau-blue)] transition-colors truncate">
                    {post.title}
                  </Text>
                </div>
                <Text size="xs" muted className="opacity-70 truncate">
                  {t('by')} <span className="font-bold text-[var(--text-main)]">{post.author}</span> &bull; {post.time}
                </Text>
              </Stack>
              
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-highlight)] rounded-[var(--radius-md)] border border-[var(--border-color)]/40">
                  <Text weight="black" size="xs" className="text-[var(--aau-blue)]">{post.replies}</Text>
                  <MessageCircle size={12} className="text-[var(--aau-blue)] opacity-60" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-1 group-hover/item:translate-x-0">
                  <ArrowRight size={10} className="text-[var(--aau-blue)]" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card.Body>

      <Card.Footer padding="compact" className="bg-[var(--bg-highlight)]/30 border-t border-[var(--border-color)]/20 justify-between items-center">
        <Text size="xs" weight="medium" className="text-[var(--text-muted)] italic">
          {visiblePosts.length} {t('active_discussions')}
        </Text>
        <div className="flex items-center gap-1 opacity-0 group-hover/widget:opacity-100 transition-all duration-500 translate-x-2 group-hover/widget:translate-x-0">
          <Text size="xs" weight="bold" className="text-[var(--aau-blue)] uppercase tracking-tighter">{t('view_all')}</Text>
          <ChevronRight size={10} strokeWidth={2.5} className="text-[var(--aau-blue)]" />
        </div>
      </Card.Footer>
    </Card>
  )
}

export default memo(ForumWidget)

