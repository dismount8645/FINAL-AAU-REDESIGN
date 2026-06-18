import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersistedStateSchema } from '@/lib/types/schemas';
import type { FavoriteItem } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/utils';

import { createUISlice } from './slices/uiSlice';
import { createCourseSlice } from './slices/courseSlice';
import { createFavoriteSlice } from './slices/favoriteSlice';
import { createUserSlice } from './slices/userSlice';
import { AppState } from './types';

export type { Theme, Lang, BreadcrumbItem, CourseWithStatus } from './types';

const lazyStorage = {
  getItem: (name: string) => storage.get(name, null),
  setItem: (name: string, value: unknown) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
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
      version: 3,
      storage: lazyStorage,
      onRehydrateStorage: () => (state) => {
        /* istanbul ignore next */
        if (!state || typeof window === 'undefined') return
        
        try {
          const validated = PersistedStateSchema.parse(state)
          Object.assign(state, validated)
        } catch (e) {
          console.warn('Store state validation failed, using fallback initial values', e)
          Object.assign(state, { theme: 'system', lang: 'da', isCollapsed: true, courseProgress: {}, calendarEvents: {}, favorites: [] })
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
        dashboardLayout: state.dashboardLayout,
      }),
      migrate: (persisted: unknown, version) => {
        if (!persisted || typeof persisted !== 'object') {
          console.warn('Storage migration failed validation')
          return {
            theme: 'system',
            lang: 'da',
            isCollapsed: true,
            courseProgress: {},
            calendarEvents: {},
            favorites: [],
          } as unknown as AppState
        }
        if (version === 3) {
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

        if (version <= 2) {
          const expectedVisibilities: Record<string, boolean> = {
            deadlines: true,
            quickOverview: true,
            favorites: true,
            support: true,
            forumActivity: true,
            messages: false,
            calendar: false,
            courseProgress: false,
          };
          const newDefaults = [
            { id: 'deadlines', title: 'Seneste afleveringer', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
            { id: 'messages', title: 'Beskeder', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
            { id: 'calendar', title: 'Kalender', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
            { id: 'favorites', title: 'Favoritter', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
            { id: 'courseProgress', title: 'Kursusprogress', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
            { id: 'forumActivity', title: 'Forum aktivitet', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
            { id: 'support', title: 'ITS Support', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
            { id: 'quickOverview', title: 'Dagens program', visible: false, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
          ];

          const layout = state.dashboardLayout;
          if (Array.isArray(layout)) {
            let matchesExactly = layout.length === 8;
            if (matchesExactly) {
              matchesExactly = layout.every(item => {
                if (!item || typeof item !== 'object') return false;
                const id = (item as any).id;
                if (typeof id !== 'string' || !(id in expectedVisibilities)) return false;
                return (item as any).visible === expectedVisibilities[id];
              });
            }

            if (matchesExactly) {
              state.dashboardLayout = newDefaults;
            } else {
              const layoutArray = [...layout];
              const existingIds = new Set(layoutArray.map(item => item && typeof item === 'object' ? (item as any).id : undefined).filter(Boolean));
              for (const widget of newDefaults) {
                if (!existingIds.has(widget.id)) {
                  layoutArray.push({
                    ...widget,
                    visible: false,
                  });
                }
              }
              state.dashboardLayout = layoutArray;
            }
          }
        }

        // Reset sidebar to collapsed default on migration
        if (state && typeof state === 'object') {
          state.isCollapsed = true;
        }

        try {
          return PersistedStateSchema.parse(state) as unknown as AppState
        } catch (e) {
          console.warn('Storage migration failed validation', e)
          return {
            theme: 'system',
            lang: 'da',
            isCollapsed: true,
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
