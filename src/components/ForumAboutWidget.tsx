import Card from '@/components/Card'
import Stack from '@/components/Stack'
import { Text } from '@/components/Typography'
import useStore from '@/lib/store'
import type { Post } from './ForumOriginalPost'

interface ForumAboutWidgetProps {
  post: Post
}

export default function ForumAboutWidget({ post }: ForumAboutWidgetProps) {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  return (
    <Card>
      <Card.Header>
        <Text weight="bold" size="lg" className="card__title">
          {t('about_this_post')}
        </Text>
      </Card.Header>
      <Card.Body>
        <Stack gap="md">
          <Stack gap="2xs">
            <Text size="xs" weight="bold" muted className="text-uppercase">
              {t('author_label')}
            </Text>
            <Text size="sm">{post.author}</Text>
          </Stack>
          <Stack gap="2xs">
            <Text size="xs" weight="bold" muted className="text-uppercase">
              {t('time_label')}
            </Text>
            <Text size="sm">{localize(post, 'time')}</Text>
          </Stack>
          <Stack gap="2xs">
            <Text size="xs" weight="bold" muted className="text-uppercase">
              {t('replies')}
            </Text>
            <Text size="sm">{post.replies}</Text>
          </Stack>
        </Stack>
      </Card.Body>
    </Card>
  )
}
