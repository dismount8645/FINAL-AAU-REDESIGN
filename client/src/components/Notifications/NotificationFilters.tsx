import { Archive, CheckCheck } from 'lucide-react'
import { TabBar } from '@/components/ui'
import Button from '@/components/ui/Button'

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
          variant="outline"
          size="sm"
          icon={CheckCheck}
          onClick={onMarkAllRead}
          className="text-text-secondary hover:text-primary border border-border/80 hover:border-primary shadow-sm font-bold"
        >
          {t('mark_all_read')}
        </Button>
      ) : undefined}
    />
  )
}
