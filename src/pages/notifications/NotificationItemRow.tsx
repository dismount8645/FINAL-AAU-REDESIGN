import { type MouseEvent } from 'react'
import { Check, Archive, Undo2 } from 'lucide-react'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import { formatTime } from '@/utils/dates'
import { NotificationItem } from './types'
import { LucideIcon } from 'lucide-react'
import type { Lang } from '@/store/useStore'

interface NotificationItemRowProps {
  notif: NotificationItem
  isSelected: boolean
  view: 'active' | 'archive'
  lang: Lang
  t: (key: string) => string
  getIcon: (type: string) => LucideIcon
  onSelect: () => void
  onMarkRead: (id: number, e: MouseEvent) => void
  onArchive: (id: number, e: MouseEvent) => void
  onRestore: (id: number, e: MouseEvent) => void
}

export default function NotificationItemRow({
  notif,
  isSelected,
  view,
  lang,
  t,
  getIcon,
  onSelect,
  onMarkRead,
  onArchive,
  onRestore,
}: NotificationItemRowProps) {
  const Icon = getIcon(notif.type)
  
  return (
    <Stack
      direction="row"
      align="center"
      gap="md"
      className={`notification-item group p-md border-b border-border/40 transition-all duration-200 relative bg-bg-card cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset focus-visible:outline-none ${!notif.isRead ? 'is-unread' : ''} ${isSelected ? 'is-selected bg-primary/5 dark:bg-primary/10' : ''}`}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      {isSelected && (
        <div className="panel-active-indicator" />
      )}
      
      <div className={`notification-icon-wrapper notif-type--${notif.type.toLowerCase()} w-11 h-11 rounded-[var(--radius-xl)] flex items-center justify-center shrink-0 transition-all duration-300 shadow-[var(--shadow-sm)] border border-border/50 ${notif.isRead ? 'opacity-60 grayscale' : 'scale-105'}`}>
        <Icon size={20} strokeWidth={2} className={notif.isRead ? 'text-muted' : 'text-primary'} />
      </div>

      <Stack gap="none" className="notification-content flex-1 min-w-0">
        <Stack direction="row" align="center" gap="xs" className="mb-0.5">
          <Text size="2xs" weight="black" className="text-primary uppercase tracking-tighter opacity-80">{notif.type}</Text>
          <Text size="2xs" muted className="opacity-40">&bull;</Text>
          <Text size="2xs" weight="bold" muted className="truncate">{notif.course}</Text>
        </Stack>
        <Text weight={notif.isRead ? 'medium' : 'black'} size="sm" className={`truncate ${notif.isRead ? 'text-muted' : 'text-main'}`}>{notif.text}</Text>
        <Text size="2xs" muted className="mt-[var(--space-2xs)] opacity-60">
          {formatTime(notif.date, lang)}
        </Text>
      </Stack>

      <div className="notification-meta flex items-center gap-sm shrink-0">
        {!notif.isRead && (
          <div className="w-2 h-2 rounded-[var(--radius-pill)] bg-primary shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.5)]" />
        )}
        <div className="notification-actions flex gap-3xs opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          {!notif.isRead && (
            <Button
              variant="ghost"
              size="icon-sm"
              pill
              icon={Check}
              onClick={(e) => onMarkRead(notif.id, e)}
              title={t('mark_as_read')}
              aria-label={t('mark_as_read')}
              className="bg-white dark:bg-slate-800 border border-border shadow-[var(--shadow-sm)] hover:border-primary"
            />
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            pill
            icon={view === 'active' ? Archive : Undo2}
            onClick={(e) => (view === 'active' ? onArchive(notif.id, e) : onRestore(notif.id, e))}
            title={view === 'active' ? t('archive') : t('restore')}
            aria-label={view === 'active' ? t('archive') : t('restore')}
            className="bg-white dark:bg-slate-800 border border-border shadow-[var(--shadow-sm)] hover:border-primary"
          />
        </div>
      </div>
    </Stack>
  )
}
