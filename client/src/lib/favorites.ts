
import { BookOpen, Wrench, FileText, MessageSquare, type LucideIcon } from 'lucide-react';
import { courses as coursesMap, forums } from '@/lib/data';
import type { CourseWithStatus, Lang } from '@/store';
import { allToolsList } from '@/lib/utils';
import { translations } from '@/lib/translations';
import type { FavoriteItem, FavoriteType } from '@/lib/types';

export interface ResolvedFavorite {
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
    /* istanbul ignore next */
    case 'link': return 'var(--aau-light-pink)'
  }
}

function getFavoriteBg(type: FavoriteType): string {
  switch (type) {
    case 'course': return 'rgba(59, 130, 246, 0.1)'
    case 'tool': return 'rgba(16, 185, 129, 0.1)'
    case 'file': return 'rgba(245, 158, 11, 0.1)'
    case 'forum': return 'rgba(6, 182, 212, 0.1)'
    /* istanbul ignore next */
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

/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  describe('favorites utility', () => {
    describe('getFavoriteLabel', () => {
      it('returns correct labels in Danish', () => {
        expect(getFavoriteLabel('course', 'da')).toBe('Kursus')
        expect(getFavoriteLabel('tool', 'da')).toBe('Værktøj')
        expect(getFavoriteLabel('file', 'da')).toBe('Fil')
        expect(getFavoriteLabel('forum', 'da')).toBe('Forum')
        expect(getFavoriteLabel('link', 'da')).toBe('Link')
      })
  
      it('returns correct labels in English', () => {
        expect(getFavoriteLabel('course', 'en')).toBe('Course')
        expect(getFavoriteLabel('tool', 'en')).toBe('Tool')
        expect(getFavoriteLabel('file', 'en')).toBe('File')
        expect(getFavoriteLabel('forum', 'en')).toBe('Forum')
        expect(getFavoriteLabel('link', 'en')).toBe('Link')
      })
  
      it('returns type if label is missing in translations', () => {
        expect(getFavoriteLabel('nonexistent' as any, 'da')).toBe('nonexistent')
      })
    })
  
    describe('sortFavorites', () => {
      it('sorts favorites by order property', () => {
        const favs: FavoriteItem[] = [
          { id: '1', type: 'course', entityId: 1, addedAt: 0, order: 2 },
          { id: '2', type: 'tool', entityId: 1, addedAt: 0, order: 1 },
          { id: '3', type: 'file', entityId: 1, addedAt: 0, order: 3 },
        ]
        const sorted = sortFavorites(favs)
        expect(sorted[0].id).toBe('2')
        expect(sorted[1].id).toBe('1')
        expect(sorted[2].id).toBe('3')
      })
  
      it('does not mutate original array', () => {
        const favs: FavoriteItem[] = [
          { id: '1', type: 'course', entityId: 1, addedAt: 0, order: 2 },
          { id: '2', type: 'tool', entityId: 1, addedAt: 0, order: 1 },
        ]
        sortFavorites(favs)
        expect(favs[0].id).toBe('1')
      })
    })
  
    describe('resolveFavorite', () => {
      const mockCourses: CourseWithStatus[] = [
        { id: 1, title: 'Dansk Titel', titleEn: 'English Title', label: 'L1', labelEn: 'L1E', img: '', code: 'C1' } as any
      ]
      const t = (key: string) => `translated_${key}`
  
      it('resolves course type', () => {
        const fav: FavoriteItem = { id: 'f1', type: 'course', entityId: 1, addedAt: 0, order: 0 }
        const resolved = resolveFavorite(fav, 'da', mockCourses, t)
        expect(resolved?.title).toBe('Dansk Titel')
        expect(resolved?.link).toBe('/course/1')
        
        const resolvedEn = resolveFavorite(fav, 'en', mockCourses, t)
        expect(resolvedEn?.title).toBe('English Title')
      })
  
      it('returns null if course not found', () => {
        const fav: FavoriteItem = { id: 'f1', type: 'course', entityId: 999, addedAt: 0, order: 0 }
        expect(resolveFavorite(fav, 'da', mockCourses, t)).toBeNull()
      })
  
      it('resolves tool type with titleKey', () => {
        const fav: FavoriteItem = { id: 'f1', type: 'tool', entityId: 1, addedAt: 0, order: 0 } // digital_exam
        const resolved = resolveFavorite(fav, 'da', mockCourses, t)
        expect(resolved?.title).toBe('translated_digital_exam')
        expect(resolved?.external).toBe(true)
      })
  
      it('resolves tool type with explicit titles', () => {
        const fav: FavoriteItem = { id: 'f1', type: 'tool', entityId: 5, addedAt: 0, order: 0 } // Outlook Mail
        const resolved = resolveFavorite(fav, 'da', mockCourses, t)
        expect(resolved?.title).toBe('Outlook Mail')
        
        const resolvedEn = resolveFavorite(fav, 'en', mockCourses, t)
        expect(resolvedEn?.title).toBe('Outlook Mail')
      })
  
      it('resolves tool with missing title fields to empty string', () => {
        const mockTool = { id: 9999, category: 'other', url: '', titleDa: '', titleEn: '' } as any
        allToolsList.push(mockTool)
        const fav: FavoriteItem = { id: 'f1', type: 'tool', entityId: 9999, addedAt: 0, order: 0 }
        const resolved = resolveFavorite(fav, 'da', mockCourses, t)
        expect(resolved?.title).toBe('')
        const idx = allToolsList.indexOf(mockTool)
        if (idx > -1) allToolsList.splice(idx, 1)
      })
  
      it('returns null if tool not found', () => {
        const fav: FavoriteItem = { id: 'f1', type: 'tool', entityId: 999, addedAt: 0, order: 0 }
        expect(resolveFavorite(fav, 'da', mockCourses, t)).toBeNull()
      })
  
      it('resolves forum type', () => {
        const fav: FavoriteItem = { id: 'f1', type: 'forum', entityId: 10, addedAt: 0, order: 0 }
        const resolved = resolveFavorite(fav, 'da', mockCourses, t)
        expect(resolved?.title).toBe('Studienævn for DDK')
        
        const resolvedEn = resolveFavorite(fav, 'en', mockCourses, t)
        expect(resolvedEn?.title).toBe('Study Board for DDK')
      })
  
      it('returns null if forum not found', () => {
        const fav: FavoriteItem = { id: 'f1', type: 'forum', entityId: 999, addedAt: 0, order: 0 }
        expect(resolveFavorite(fav, 'da', mockCourses, t)).toBeNull()
      })
  
      it('resolves file type', () => {
        const fav: FavoriteItem = { id: 'f1', type: 'file', entityId: 101, addedAt: 0, order: 0 }
        const resolved = resolveFavorite(fav, 'da', mockCourses, t)
        expect(resolved?.title).toBe('Kursusbeskrivelse og pensum')
        expect(resolved?.link).toBe('/course/1')
  
        const resolvedEn = resolveFavorite(fav, 'en', mockCourses, t)
        expect(resolvedEn?.title).toBe('Course Description and Syllabus')
      })
  
      it('returns null if file not found', () => {
        const fav: FavoriteItem = { id: 'f1', type: 'file', entityId: 999, addedAt: 0, order: 0 }
        expect(resolveFavorite(fav, 'da', mockCourses, t)).toBeNull()
      })
  
      it('returns null for link type', () => {
        const fav: FavoriteItem = { id: 'f1', type: 'link', entityId: 1, addedAt: 0, order: 0 }
        expect(resolveFavorite(fav, 'da', mockCourses, t)).toBeNull()
      })
    })
  })
}
