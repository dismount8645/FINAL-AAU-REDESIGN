import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'
import { dashboardForumPosts } from '@/data/dashboardWidgets'
import { getWidgetDisplayLayout } from '@/utils/widgetLayout'

interface ForumWidgetProps extends WidgetProps {
  professor: string;
}

export default function ForumWidget({ professor, span, isEditing }: ForumWidgetProps) {
  const { t, localize } = useStore()
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

  return (
    <Card className="widget-card h-full w-full flex flex-col forum-widget">
      <Card.Header spacing="compact">
        <Text weight="bold" size="lg" className="card__title">{t('course_forum')}</Text>
        <button
          disabled={isEditing}
          className="widget-action text-primary dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => !isEditing && navigate('/forum/new')}
        >
          {t('new_post')}<Plus size={14} strokeWidth={2} />
        </button>
      </Card.Header>

      <Card.Body spacing="compact">
        <div className="h-full w-full flex flex-col gap-[var(--space-xs)] forum-list">
          {visiblePosts.map((post) => (
            <button
              key={post.id}
              type="button"
              className="forum-list-item w-full text-left flex items-center gap-[var(--space-xs)] p-[var(--space-xs)] rounded-[var(--radius-md)] transition-colors hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-primary/40"
              onClick={() => navigate(`/forum/${post.id}`)}
            >
              <Stack gap="xs" className="forum-list-item__content flex-1">
                {post.important ? <Badge variant="warning">{t('important')}</Badge> : null}
                <Text weight="semibold" className="forum-list-item__title text-[var(--color-accent)]">{post.title}</Text>
                <Text size="sm" muted>
                  {t('by')} <Text weight="bold" tag="strong">{post.author}</Text> &bull; {post.time}
                </Text>
              </Stack>
              <Stack align="center" gap="2xs" className="forum-list-item__replies shrink-0">
                <Text weight="bold" className="forum-list-item__reply-count text-[var(--color-accent)]">{post.replies}</Text>
                <Text size="xs" muted className="text-uppercase">{t('replies')}</Text>
              </Stack>
            </button>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}
