import { useNavigate } from 'react-router-dom'
import { ChevronRight, Reply, MessageSquare, Book } from 'lucide-react'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import StatusItem from '@/components/ui/StatusItem'
import Card from '@/components/ui/Card'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'

const activities = [
  {
    id: 1,
    titleDa: 'Spørgsmål til teksten',
    titleEn: 'Questions regarding the text',
    subtitle: 'Morten Jensen',
    snippetDa: 'Jeg har lagt de nye slides op nu...',
    snippetEn: 'I have uploaded the new slides now...',
    icon: Reply,
  },
  {
    id: 2,
    titleDa: 'Gruppesøgning',
    titleEn: 'Group Search',
    subtitle: 'Lærke Nielsen',
    snippetDa: 'Er der nogen der mangler en gruppe?',
    snippetEn: 'Is anyone missing a group?',
    icon: MessageSquare,
  },
  {
    id: 3,
    titleDa: 'Pensumliste',
    titleEn: 'Syllabus',
    subtitle: 'Anders Nielsen',
    snippetDa: 'Husk at tjekke den opdaterede liste.',
    snippetEn: 'Remember to check the updated list.',
    icon: Book,
  },
]

export default function ForumActivityWidget({ span, isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const { t, localize } = useStore()

  const itemsToShow = span <= 4 ? 2 : (span <= 8 ? 2 : 3)

  return (
    <Card className="h-full w-full flex flex-col">
      <Card.Header spacing="compact">
        <Text weight="bold" size="lg" className="card__title">{t('forum_activity')}</Text>
        <button
          type="button"
          className="text-sm text-primary dark:text-slate-200 font-semibold hover:underline cursor-pointer inline-flex items-center gap-[var(--space-2xs)] whitespace-nowrap transition-all hover:opacity-80 bg-transparent border-none p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm"
          onClick={() => !isEditing && navigate('/courses')}
        >
          {t('view_all')}<ChevronRight size={14} strokeWidth={2} />
        </button>
      </Card.Header>

      <Card.Body spacing="compact">
        <div className="h-full w-full flex flex-col gap-[var(--space-xs)]">
          {activities.slice(0, itemsToShow).map((a) => (
            <button
              key={a.id}
              type="button"
              className="w-full text-left p-[var(--space-2xs)] rounded-[var(--radius-lg)] transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset cursor-pointer bg-transparent border-none"
              onClick={() => navigate(`/forum/${a.id}`)}
            >
              <Stack gap="xs">
                <StatusItem
                  icon={a.icon}
                  title={localize(a, 'title')}
                  subtitle={a.subtitle}
                />
                {span > 8 && (
                  <Text size="xs" muted className="forum-activity__snippet pl-[32px] italic">
                    &ldquo;{localize(a, 'snippet')}&rdquo;
                  </Text>
                )}
              </Stack>
            </button>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}
