import { describe, it, expect } from 'vitest'
import {
  getFavoriteIcon,
  getFavoriteColor,
  getFavoriteBg,
  getFavoriteLabel,
  sortFavorites,
  resolveFavorite
} from '@/utils/favorites'
import { BookOpen, Wrench, FileText, MessageSquare, Link } from 'lucide-react'
import type { FavoriteItem } from '@/types'
import type { CourseWithStatus } from '@/store/useStore'

describe('favorites utility', () => {
  describe('getFavoriteIcon', () => {
    it('returns correct icon for each type', () => {
      expect(getFavoriteIcon('course')).toBe(BookOpen)
      expect(getFavoriteIcon('tool')).toBe(Wrench)
      expect(getFavoriteIcon('file')).toBe(FileText)
      expect(getFavoriteIcon('forum')).toBe(MessageSquare)
      expect(getFavoriteIcon('link')).toBe(Link)
    })
  })

  describe('getFavoriteColor', () => {
    it('returns correct CSS variable for each type', () => {
      expect(getFavoriteColor('course')).toBe('var(--color-primary)')
      expect(getFavoriteColor('tool')).toBe('var(--color-success)')
      expect(getFavoriteColor('file')).toBe('var(--color-warning)')
      expect(getFavoriteColor('forum')).toBe('var(--color-info)')
      expect(getFavoriteColor('link')).toBe('var(--aau-light-pink)')
    })
  })

  describe('getFavoriteBg', () => {
    it('returns correct rgba for each type', () => {
      expect(getFavoriteBg('course')).toBe('rgba(59, 130, 246, 0.1)')
      expect(getFavoriteBg('tool')).toBe('rgba(16, 185, 129, 0.1)')
      expect(getFavoriteBg('file')).toBe('rgba(245, 158, 11, 0.1)')
      expect(getFavoriteBg('forum')).toBe('rgba(6, 182, 212, 0.1)')
      expect(getFavoriteBg('link')).toBe('rgba(219, 39, 119, 0.1)')
    })
  })

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
