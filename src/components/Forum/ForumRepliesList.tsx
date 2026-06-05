import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Heading, Text } from '@/components/ui'
import { User, Clock } from 'lucide-react'
import useStore from '@/store'

export interface ReplyItem {
  id: number
  author: string
  roleDa: string
  roleEn: string
  timeDa: string
  timeEn: string
  contentDa: string
  contentEn: string
}

interface ForumRepliesListProps {
  replies: ReplyItem[]
}

export default function ForumRepliesList({ replies }: ForumRepliesListProps) {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

  return (
    <>
      <Heading level={3} className="mb-lg">
        {t('replies_title')}
      </Heading>

      {replies.length > 0 ? (
        <Stack gap="md">
          {replies.map((r) => (
            <Card key={r.id} variant="outlined">
              <Card.Body>
                <Stack gap="sm">
                  <Stack direction="row" align="center" gap="sm">
                    <User size={16} strokeWidth={2} className="text-primary" />
                    <Text weight="bold" size="sm">
                      {r.author}
                    </Text>
                    <Text size="xs" muted>
                      {localize(r, 'role')}
                    </Text>
                    <Clock size={14} strokeWidth={2} className="text-muted" />
                    <Text size="xs" muted>
                      {localize(r, 'time')}
                    </Text>
                  </Stack>
                  <Text size="sm" className="leading-[1.6]">
                    {localize(r, 'content')}
                  </Text>
                </Stack>
              </Card.Body>
            </Card>
          ))}
        </Stack>
      ) : (
        <Text muted>{t('no_replies_yet')}</Text>
      )}
    </>
  )
}

if (import.meta.vitest) {
  const mockReply = { id: 1, author: 'Test User', roleDa: 'Studerende', roleEn: 'Student', timeDa: 'For 1 time siden', timeEn: '1 hour ago', contentDa: 'Indhold', contentEn: 'Content' }

  describe('ForumRepliesList', () => {
    it('renders empty state when no replies', () => {
      render(<ForumRepliesList replies={[]} />)
      expect(screen.getByText('Ingen svar endnu.')).toBeInTheDocument()
    })

    it('renders replies when present', () => {
      render(<ForumRepliesList replies={[mockReply]} />)
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('Indhold')).toBeInTheDocument()
    })
  })
}
