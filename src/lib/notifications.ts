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

/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  const { describe, it, expect } = await import('vitest')

  describe('getNotificationIcon', () => {
    it('returns FileUp for AFLEVERING', () => {
      expect(getNotificationIcon('AFLEVERING')).toBe(FileUp)
    })

    it('returns MessageSquare for FORUM', () => {
      expect(getNotificationIcon('FORUM')).toBe(MessageSquare)
    })

    it('returns Clock for DEADLINE', () => {
      expect(getNotificationIcon('DEADLINE')).toBe(Clock)
    })

    it('returns Star for FEEDBACK', () => {
      expect(getNotificationIcon('FEEDBACK')).toBe(Star)
    })

    it('returns Bell for unknown type (fallback)', () => {
      expect(getNotificationIcon('UNKNOWN')).toBe(Bell)
    })
  })

  describe('createMockNotifications', () => {
    it('returns array of length 5', () => {
      const items = createMockNotifications((k) => k)
      expect(items).toHaveLength(5)
    })

    it('each item has expected properties', () => {
      const items = createMockNotifications((k) => k)
      items.forEach((item) => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('type')
        expect(item).toHaveProperty('text')
        expect(item).toHaveProperty('date')
        expect(item).toHaveProperty('isRead')
        expect(item).toHaveProperty('archived')
        expect(item).toHaveProperty('course')
        expect(item).toHaveProperty('content')
        expect(item).toHaveProperty('link')
      })
    })

    it('items 0 and 1 have isRead false', () => {
      const items = createMockNotifications((k) => k)
      expect(items[0].isRead).toBe(false)
      expect(items[1].isRead).toBe(false)
    })

    it('items 2, 3, 4 have isRead true', () => {
      const items = createMockNotifications((k) => k)
      expect(items[2].isRead).toBe(true)
      expect(items[3].isRead).toBe(true)
      expect(items[4].isRead).toBe(true)
    })

    it('text is a string', () => {
      const items = createMockNotifications((k) => k)
      items.forEach((item) => {
        expect(typeof item.text).toBe('string')
      })
    })

    it('date is a Date object', () => {
      const items = createMockNotifications((k) => k)
      items.forEach((item) => {
        expect(item.date).toBeInstanceOf(Date)
      })
    })
  })
}
