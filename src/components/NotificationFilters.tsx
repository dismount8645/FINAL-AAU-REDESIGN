import { Archive, CheckCheck } from 'lucide-react'
import TabBar from '@/components/TabBar'
import Button from '@/components/Button'

interface NotificationFiltersProps {
  view: 'active' | 'archive'
  onChangeView: (view: 'active' | 'archive') => void
  unreadCount: number
  onMarkAllRead: () => void
  t: (key: string) => string
}

export default function NotificationFilters({
  view,
  onChangeView,
  unreadCount,
  onMarkAllRead,
  t,
}: NotificationFiltersProps) {
  return (
    <TabBar
      tabs={[
        { id: 'active', label: t('active') },
        { id: 'archive', label: t('archive'), icon: Archive }
      ]}
      activeTab={view}
      onChange={(id) => onChangeView(id as 'active' | 'archive')}
      secondaryAction={view === 'active' && unreadCount > 0 ? (
        <Button
          variant="ghost"
          size="xs"
          icon={CheckCheck}
          onClick={onMarkAllRead}
          className="text-muted hover:text-primary transition-colors"
        >
          {t('mark_all_read')}
        </Button>
      ) : undefined}
    />
  )
}
