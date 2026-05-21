import { Bell, ArrowRight, LucideIcon } from 'lucide-react'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'
import EmptyState from '@/components/ui/EmptyState'
import { formatLongDateTime } from '@/utils/dates'
import { NotificationItem } from './types'
import type { Lang } from '@/store/useStore'

interface NotificationDetailViewProps {
  selectedNotification: NotificationItem | null
  lang: Lang
  t: (key: string) => string
  getIcon: (type: string) => LucideIcon
  onNavigate: (link: string) => void
}

export default function NotificationDetailView({
  selectedNotification,
  lang,
  t,
  getIcon,
  onNavigate,
}: NotificationDetailViewProps) {
  if (!selectedNotification) {
    return (
      <div className="notification-detail-empty flex items-center justify-center h-full p-[var(--space-2xl)] text-center">
        <EmptyState
          icon={Bell}
          title={t('notif_select_notification')}
          message={t('notif_detail_hint')}
        />
      </div>
    )
  }

  const Icon = getIcon(selectedNotification.type)

  return (
    <>
      <Card.Header className="bg-[var(--bg-card)] border-b border-border p-lg">
        <Stack direction="row" gap="md" align="center">
          <div className={`notification-icon-wrapper notif-type--${selectedNotification.type.toLowerCase()} w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-border/60 bg-slate-50 dark:bg-white/5 shadow-inner`}>
            <Icon size={24} strokeWidth={2} className="text-primary" />
          </div>
          <Stack gap="xs">
            <Stack direction="row" align="center" gap="xs">
              <Text size="xs" weight="black" className="text-primary uppercase tracking-widest opacity-80">{selectedNotification.type}</Text>
              <Text size="xs" muted className="opacity-40">&bull;</Text>
              <Text size="xs" weight="bold" muted>{selectedNotification.course}</Text>
            </Stack>
            <Heading level={2} className="m-0 text-2xl font-black tracking-tight">{selectedNotification.text}</Heading>
            <Text size="xs" muted>{formatLongDateTime(selectedNotification.date, lang)}</Text>
          </Stack>
        </Stack>
      </Card.Header>
      <Card.Body className="bg-slate-50/50 dark:bg-[var(--bg-card)] p-[var(--space-lg)]">
        <div className="notification-detail-card bg-[var(--bg-card)] p-xl rounded-2xl shadow-[var(--shadow-xl)] border border-border flex flex-col min-h-[50vh]">
          <Text size="md" className="leading-relaxed text-main/90 mb-xl flex-1 whitespace-pre-wrap">{selectedNotification.content}</Text>
          <Button
            variant="primary"
            full
            size="lg"
            iconRight={ArrowRight}
            onClick={() => onNavigate(selectedNotification.link)}
            className="mt-auto shadow-[var(--shadow-lg)] hover:shadow-primary/20"
          >
            {t('go_to_content')}
          </Button>
        </div>
      </Card.Body>
    </>
  )
}
