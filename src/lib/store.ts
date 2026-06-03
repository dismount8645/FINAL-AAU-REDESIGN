import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CourseListItem, FavoriteItem, CalendarEvents, FavoriteType } from '@/types'
import { PersistedStateSchema } from '@/lib/schemas/store'
import { Theme, Lang, computeIsDarkMode } from '@/lib/theme'
import { translations } from '@/lib/translations'
import { courseList as initialCourses } from '@/lib/mockData'
import { DASHBOARD_CONFIG } from '@/lib/dashboard'

export type { Theme, Lang }
export { computeIsDarkMode }

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface CourseWithStatus extends CourseListItem {
  status: 'active' | 'inactive' | 'upcoming'
  progress?: number
}

export interface UISlice {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => void;

  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  localize: <T extends object>(obj: T, key?: string) => string;

  isCollapsed: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  setIsMobile: (mobile: boolean) => void;
  setIsMobileOpen: (open: boolean) => void;

  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (crumbs: BreadcrumbItem[] | undefined) => void;

  notificationCount: number;
  setNotificationCount: (count: number) => void;
  decrementNotificationCount: () => void;

  messageCount: number;
  setMessageCount: (count: number) => void;
  decrementMessageCount: () => void;
}

function applySidebarClasses(isCollapsed: boolean, isMobileOpen: boolean) {
  if (typeof window === 'undefined') return;
  document.body.classList.toggle('sidebar-collapsed', isCollapsed);
  document.body.classList.toggle('mobile-nav-open', isMobileOpen);
}

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set, get) => ({
  theme: 'system',
  isDarkMode: computeIsDarkMode('system'),
  setTheme: (theme) => {
    const isDark = computeIsDarkMode(theme);
    set({ theme, isDarkMode: isDark });
  },

  lang: 'da',
  setLang: (lang) => {
    set({ lang });
    if (typeof window !== 'undefined') {
      document.documentElement.lang = lang;
    }
  },
  t: (key) => {
    const { lang } = get();
    const keys = key.split('.');
    let result: unknown = translations[lang];
    for (const k of keys) {
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        result = (result as Record<string, unknown>)[k];
      } else {
        result = undefined;
        break;
      }
    }
    if (typeof result === 'string') return result;

    // Fallback: search across all top-level categories for flat keys
    if (keys.length === 1) {
      const langObj = translations[lang] as Record<string, unknown>;
      for (const catKey in langObj) {
        const category = langObj[catKey];
        if (category && typeof category === 'object' && !Array.isArray(category) && key in category) {
          const categoryObj = category as Record<string, unknown>;
          if (typeof categoryObj[key] === 'string') {
            return categoryObj[key] as string;
          }
        }
      }
    }

    return key;
  },
  localize: (obj: object, key?: string) => {
    const { lang } = get();
    const rec = obj as Record<string, unknown>;
    if (!rec) return '';

    const target = key ? rec[key] : rec;
    if (target && typeof target === 'object' && target !== null) {
      const tObj = target as Record<string, unknown>;
      if ('da' in tObj || 'en' in tObj) {
        return (tObj[lang] as string) || (tObj['da'] as string) || '';
      }
    }

    if (key) {
      const keyEn = `${key}En`;
      const keyDa = `${key}Da`;
      if (lang === 'en') {
        return (rec[keyEn] as string) || (rec[key] as string) || '';
      }
      return (rec[keyDa] as string) || (rec[key] as string) || '';
    }

    return '';
  },

  isCollapsed: false,
  isMobile: false,
  isMobileOpen: false,
  setCollapsed: (collapsed) => {
    set({ isCollapsed: collapsed });
    applySidebarClasses(collapsed, get().isMobileOpen);
  },
  toggleSidebar: () => {
    const { isCollapsed, isMobile, isMobileOpen } = get();
    if (isMobile) {
      const next = !isMobileOpen;
      set({ isMobileOpen: next });
      applySidebarClasses(isCollapsed, next);
    } else {
      const next = !isCollapsed;
      set({ isCollapsed: next });
      applySidebarClasses(next, isMobileOpen);
    }
  },
  closeSidebar: () => {
    set({ isMobileOpen: false });
    const { isCollapsed } = get();
    applySidebarClasses(isCollapsed, false);
  },
  setIsMobile: (mobile) => {
    set({ isMobile: mobile });
  },
  setIsMobileOpen: (open) => {
    const { isCollapsed } = get();
    set({ isMobileOpen: open });
    applySidebarClasses(isCollapsed, open);
  },

  breadcrumbs: [],
  setBreadcrumbs: (crumbs) => {
    set({ breadcrumbs: crumbs || [] });
  },

  notificationCount: 2,
  setNotificationCount: (count) => {
    set({ notificationCount: count });
  },
  decrementNotificationCount: () => {
    const { notificationCount } = get();
    set({ notificationCount: Math.max(0, notificationCount - 1) });
  },

  messageCount: 1,
  setMessageCount: (count) => {
    set({ messageCount: count });
  },
  decrementMessageCount: () => {
    const { messageCount } = get();
    set({ messageCount: Math.max(0, messageCount - 1) });
  },
});

export interface CourseSlice {
  courses: CourseWithStatus[]
  toggleStar: (courseId: number) => void

  courseProgress: Record<string | number, number[]>
  toggleCourseItem: (courseId: string | number, itemId: number) => void
  getCourseProgress: (courseId: string | number, totalItems: number) => number

  calendarEvents: CalendarEvents
  updateCalendarEvents: (events: CalendarEvents) => void
}

function buildCourses(): CourseWithStatus[] {
  return initialCourses.map(course => ({
    ...course,
    status: course.tab === 'finished' ? 'inactive' : (course.tab === 'upcoming' ? 'upcoming' : 'active'),
  }))
}

export const createCourseSlice: StateCreator<AppState, [], [], CourseSlice> = (set, get) => ({
  courses: buildCourses(),
  toggleStar: (courseId) => {
    const { toggleFavorite } = get()
    toggleFavorite('course', courseId)
  },

  courseProgress: {},
  toggleCourseItem: (courseId, itemId) => {
    const { courseProgress } = get()
    const current = courseProgress[courseId] || []
    const updated = current.includes(itemId)
      ? current.filter((i) => i !== itemId)
      : [...current, itemId]
    set({ courseProgress: { ...courseProgress, [courseId]: updated } })
  },
  getCourseProgress: (courseId, totalItems) => {
    const { courseProgress } = get()
    const completed = (courseProgress[courseId] || []).length
    return totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0
  },

  calendarEvents: {},
  updateCalendarEvents: (events) => {
    set({ calendarEvents: events })
  },
})

export interface FavoriteSlice {
  favorites: FavoriteItem[]
  favoritesLimit: number
  toggleFavorite: (type: FavoriteType, entityId: number) => void
  reorderFavorites: (fromIndex: number, toIndex: number) => void
  isFavorite: (type: FavoriteType, entityId: number) => boolean
  clearFavorites: () => void
}

export const createFavoriteSlice: StateCreator<AppState, [], [], FavoriteSlice> = (set, get) => ({
  favorites: [],
  favoritesLimit: DASHBOARD_CONFIG.FAVORITES_LIMIT,
  toggleFavorite: (type, entityId) => {
    const { favorites } = get()
    const id = `${type}-${entityId}`
    const existing = favorites.find(f => f.id === id)
    if (existing) {
      set({ favorites: favorites.filter(f => f.id !== id) })
    } else {
      if (favorites.length >= DASHBOARD_CONFIG.FAVORITES_LIMIT) return
      const maxOrder = favorites.reduce((max, f) => Math.max(max, f.order), -1)
      set({
        favorites: [...favorites, {
          id,
          type,
          entityId,
          addedAt: Date.now(),
          order: maxOrder + 1,
        }],
      })
    }
  },
  reorderFavorites: (fromIndex, toIndex) => {
    const { favorites } = get()
    const reordered = [...favorites]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    set({ favorites: reordered.map((f, i) => ({ ...f, order: i })) })
  },
  isFavorite: (type, entityId) => {
    const { favorites } = get()
    return favorites.some(f => f.type === type && f.entityId === entityId)
  },
  clearFavorites: () => {
    set({ favorites: [] })
  },
})

export interface AppState extends UISlice, CourseSlice, FavoriteSlice {}

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
    }),
    {
      name: 'aau-app-store',
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
          return state as unknown as AppState
        }
      },
    },
  ),
)

export default useStore
