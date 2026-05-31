import { BookOpen, Wrench, FileText, MessageSquare, type LucideIcon } from 'lucide-react'
import type { FavoriteItem, FavoriteType } from '@/types'
import type { CourseWithStatus, Lang } from '@/store/useStore'
import { courses as coursesMap } from '@/data/mockData'
import { forums } from '@/data/mockData'
import { allToolsList } from '@/data/tools'
import { translations } from '@/data/translations'

interface ResolvedFavorite {
  id: string
  type: FavoriteType
  entityId: number
  title: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  link: string
  external?: boolean
}

function getFavoriteColor(type: FavoriteType): string {
  switch (type) {
    case 'course': return 'var(--color-primary)'
    case 'tool': return 'var(--color-success)'
    case 'file': return 'var(--color-warning)'
    case 'forum': return 'var(--color-info)'
    case 'link': return 'var(--aau-light-pink)'
  }
}

function getFavoriteBg(type: FavoriteType): string {
  switch (type) {
    case 'course': return 'rgba(59, 130, 246, 0.1)'
    case 'tool': return 'rgba(16, 185, 129, 0.1)'
    case 'file': return 'rgba(245, 158, 11, 0.1)'
    case 'forum': return 'rgba(6, 182, 212, 0.1)'
    case 'link': return 'rgba(219, 39, 119, 0.1)'
  }
}

export function getFavoriteLabel(type: FavoriteType, lang: Lang): string {
  return (translations[lang]?.[`fav_${type}`] as string) || type
}

export function resolveFavorite(
  fav: FavoriteItem,
  lang: Lang,
  courses: CourseWithStatus[],
  t: (key: string) => string,
): ResolvedFavorite | null {
  switch (fav.type) {
    case 'course': {
      const course = courses.find(c => c.id === fav.entityId)
      if (!course) return null
      return {
        id: fav.id,
        type: fav.type,
        entityId: fav.entityId,
        title: lang === 'da' ? course.title : course.titleEn,
        icon: BookOpen,
        iconBg: getFavoriteBg('course'),
        iconColor: getFavoriteColor('course'),
        link: `/course/${course.id}`,
      }
    }
    case 'tool': {
      const tool = allToolsList.find(t => t.id === fav.entityId)
      if (!tool) return null
      return {
        id: fav.id,
        type: fav.type,
        entityId: fav.entityId,
        title: (tool.titleKey ? t(tool.titleKey) : (lang === 'da' ? tool.titleDa : tool.titleEn)) || '',
        icon: Wrench,
        iconBg: getFavoriteBg('tool'),
        iconColor: getFavoriteColor('tool'),
        link: tool.url,
        external: true,
      }
    }
    case 'forum': {
      const forum = forums.find(f => f.id === fav.entityId)
      if (!forum) return null
      return {
        id: fav.id,
        type: fav.type,
        entityId: fav.entityId,
        title: lang === 'da' ? forum.title : forum.titleEn,
        icon: MessageSquare,
        iconBg: getFavoriteBg('forum'),
        iconColor: getFavoriteColor('forum'),
        link: '/courses',
      }
    }
    case 'file': {
      let foundTitle: string | null = null
      let foundLink = '/courses'
      for (const courseId in coursesMap) {
        const course = coursesMap[courseId]
        for (const section of course.sections) {
          const item = section.items.find(i => i.id === fav.entityId)
          if (item) {
            foundTitle = lang === 'da' ? item.title : item.titleEn
            foundLink = `/course/${courseId}`
            break
          }
        }
        if (foundTitle) break
      }
      if (!foundTitle) return null
      return {
        id: fav.id,
        type: fav.type,
        entityId: fav.entityId,
        title: foundTitle,
        icon: FileText,
        iconBg: getFavoriteBg('file'),
        iconColor: getFavoriteColor('file'),
        link: foundLink,
      }
    }
    case 'link': {
      return null
    }
  }
}

export function sortFavorites(favorites: FavoriteItem[]): FavoriteItem[] {
  return [...favorites].sort((a, b) => a.order - b.order)
}
