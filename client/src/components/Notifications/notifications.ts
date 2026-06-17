import { FileUp, MessageSquare, Clock, Star, Bell } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { NotificationItem } from '@/lib/types'

const NOTIFICATION_ICON_MAP: Record<string, LucideIcon> = {
  AFLEVERING: FileUp,
  FORUM: MessageSquare,
  DEADLINE: Clock,
  FEEDBACK: Star,
}

/**
 * Pure fn: maps notification type string → LucideIcon.
 * Extracted from Notifications.tsx getIcon inline fn.
 */
export function getNotificationIcon(type: string): LucideIcon {
  return NOTIFICATION_ICON_MAP[type] ?? Bell
}

/**
 * Factory: creates seed notification data, parameterised by t() fn.
 * Keeps i18n reactive — call inside useMemo([t]).
 */
export function createMockNotifications(t: (key: string) => string): NotificationItem[] {
  return [
    {
      id: 1,
      type: 'AFLEVERING',
      text: t('notif_1_text'),
      date: new Date(),
      isRead: false,
      archived: false,
      course: 'Interaktionsdesign',
      content: t('notif_1_content'),
      link: '/course/1',
    },
    {
      id: 2,
      type: 'FORUM',
      text: t('notif_2_text'),
      date: new Date(Date.now() - 3600000 * 2),
      isRead: false,
      archived: false,
      course: 'Interaktionsdesign',
      content: t('notif_2_content'),
      link: '/course/1',
    },
    {
      id: 3,
      type: 'SYSTEM',
      text: t('notif_3_text'),
      date: new Date(Date.now() - 86400000),
      isRead: true,
      archived: false,
      course: 'System',
      content: t('notif_3_content'),
      link: '/',
    },
    {
      id: 4,
      type: 'DEADLINE',
      text: t('notif_4_text'),
      date: new Date(Date.now() - 86400000 * 2),
      isRead: true,
      archived: false,
      course: 'Administration',
      content: t('notif_4_content'),
      link: '/',
    },
    {
      id: 5,
      type: 'FEEDBACK',
      text: t('notif_5_text'),
      date: new Date(Date.now() - 86400000 * 5),
      isRead: true,
      archived: false,
      course: 'Webudvikling',
      content: t('notif_5_content'),
      link: '/course/2',
    },
  ]
}

