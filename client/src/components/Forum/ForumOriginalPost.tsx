import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text } from '@/components/ui'
import { MessageSquare, User } from 'lucide-react'
import useStore from '@/store'

export interface Post {
  id: number
  titleDa: string
  titleEn: string
  author: string
  timeDa: string
  timeEn: string
  replies: number
  contentDa: string
  contentEn: string
  important?: boolean
}

interface ForumOriginalPostProps {
  post: Post
}

export default function ForumOriginalPost({ post }: ForumOriginalPostProps) {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  return (
    <Card className="mb-xl">
      <Card.Body>
        <Text size="md" className="leading-[1.7]">
          {localize(post, 'content')}
        </Text>
      </Card.Body>
      <Card.Footer className="border-t border-border">
        <Stack direction="row" gap="lg" align="center">
          <Stack direction="row" gap="xs" align="center">
            <MessageSquare size={14} strokeWidth={2} className="text-muted" />
            <Text size="sm" muted>
              {post.replies} {t('replies')}
            </Text>
          </Stack>
          <Stack direction="row" gap="xs" align="center">
            <User size={14} strokeWidth={2} className="text-muted" />
            <Text size="sm" muted>
              {post.author}
            </Text>
          </Stack>
        </Stack>
      </Card.Footer>
    </Card>
  )
}
