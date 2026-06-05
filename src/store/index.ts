import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersistedStateSchema } from '@/lib/types/schemas';
import { Theme, Lang, computeIsDarkMode } from '@/lib/theme';
import type { FavoriteItem } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

import { BreadcrumbItem, UISlice, createUISlice } from './slices/uiSlice';
import { CourseWithStatus, CourseSlice, createCourseSlice } from './slices/courseSlice';
import { FavoriteSlice, createFavoriteSlice } from './slices/favoriteSlice';
import { UserSlice, createUserSlice } from './slices/userSlice';

export type { Theme, Lang, BreadcrumbItem, CourseWithStatus, UISlice, CourseSlice, FavoriteSlice, UserSlice };
export { computeIsDarkMode };

export interface AppState extends UISlice, CourseSlice, FavoriteSlice, UserSlice {}

const lazyStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    try {
      const str = window.localStorage.getItem(name)
      return str ? JSON.parse(str) : null
    } catch {
      return null
    }
  },
  setItem: (name: string, newValue: any) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(name, JSON.stringify(newValue))
    } catch {}
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(name)
    } catch {}
  }
}

const useStore = create<AppState>()(
  persist(
    (set, get, store) => ({
      ...createUISlice(set, get, store),
      ...createCourseSlice(set, get, store),
      ...createFavoriteSlice(set, get, store),
      ...createUserSlice(set, get, store),
    }),
    {
      name: STORAGE_KEYS.APP_STORE,
      version: 2,
      storage: lazyStorage,
      onRehydrateStorage: () => (state) => {
        /* istanbul ignore next */
        if (!state || typeof window === 'undefined') return
        
        try {
          const validated = PersistedStateSchema.parse(state)
          Object.assign(state, validated)
        } catch (e) {
          console.warn('Store state validation failed, using fallback initial values', e)
        }

        document.documentElement.lang = state.lang
      },
      partialize: (state) => ({
        theme: state.theme,
        lang: state.lang,
        isCollapsed: state.isCollapsed,
        courseProgress: state.courseProgress,
        calendarEvents: state.calendarEvents,
        favorites: state.favorites,
        firstName: state.firstName,
        lastName: state.lastName,
        notifPrefs: state.notifPrefs,
        forumDigest: state.forumDigest,
        forumTracking: state.forumTracking,
        forumAutoSubscribe: state.forumAutoSubscribe,
        calendarStartDay: state.calendarStartDay,
        calendarDefaultView: state.calendarDefaultView,
        messagePrivacy: state.messagePrivacy,
        messageEmailOffline: state.messageEmailOffline,
      }),
      migrate: (persisted: unknown, version) => {
        if (version === 2) {
          return persisted as AppState
        }
        let state = persisted as Record<string, unknown>
        if (version === 0) {
          state = {
            ...state,
            courseProgress: state.courseProgress || {},
            calendarEvents: state.calendarEvents || {},
          }
        }
        if (version === 1) {
          const oldState = persisted as Record<string, unknown>
          const migrated: FavoriteItem[] = []
          const oldFavs = (oldState.toolFavorites as (string | number)[]) || []
          oldFavs.forEach((id: string | number, i: number) => {
            const numId = typeof id === 'number' ? id : parseInt(id, 10)
            migrated.push({
              id: `tool-${numId}`, type: 'tool', entityId: numId,
              addedAt: Date.now() - (oldFavs.length - i) * 1000,
              order: i,
            })
          })
          const oldCourses = (oldState.courses as { id: string | number; isStarred?: boolean }[]) || []
          const starredIds = oldCourses.filter(c => c.isStarred).map(c => c.id)
          starredIds.forEach((id, i) => {
            const numId = typeof id === 'number' ? id : parseInt(id, 10)
            if (!migrated.find(f => f.id === `course-${numId}`)) migrated.push({
              id: `course-${numId}`, type: 'course', entityId: numId,
              addedAt: Date.now() - (starredIds.length - i) * 1000,
              order: migrated.length + i,
            })
          })
          state = {
            ...state,
            favorites: migrated,
          }
        }

        try {
          return PersistedStateSchema.parse(state) as unknown as AppState
        } catch (e) {
          console.warn('Storage migration failed validation', e)
          return {
            theme: 'system',
            lang: 'da',
            isCollapsed: false,
            courseProgress: {},
            calendarEvents: {},
            favorites: [],
          } as unknown as AppState
        }
      },
    },
  ),
)

export default useStore;
