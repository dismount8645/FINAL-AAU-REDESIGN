import { describe, it, expect, beforeEach, vi } from 'vitest';
import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { DASHBOARD_CONFIG } from '@/lib/dashboard';
import { courseList as initialCourses } from '@/lib/mockData';
import { PersistedStateSchema } from '@/lib/schemas/store';
import { Theme, Lang, computeIsDarkMode } from '@/lib/theme';
import { translations } from '@/lib/translations';
import type { CourseListItem, FavoriteItem, CalendarEvents, FavoriteType } from '@/lib/types';

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

// @ts-ignore - tests below
if (import.meta.vitest) {
  describe('useStore', () => {
    beforeEach(() => {
      useStore.setState({
        theme: 'system',
        isDarkMode: false,
        lang: 'da',
        isCollapsed: false,
        isMobile: false,
        isMobileOpen: false,
        courseProgress: {},
        calendarEvents: {},
        favorites: [],
      })
    })
  
    it('updates theme correctly', () => {
      useStore.getState().setTheme('dark')
      expect(useStore.getState().theme).toBe('dark')
    })
  
    it('updates language correctly', () => {
      useStore.getState().setLang('en')
      expect(useStore.getState().lang).toBe('en')
    })
  
    it('toggles sidebar state', () => {
      const store = useStore.getState()
      store.toggleSidebar()
      expect(useStore.getState().isCollapsed).toBe(true)
      store.toggleSidebar()
      expect(useStore.getState().isCollapsed).toBe(false)
    })
  
    it('updates course progress', () => {
      useStore.getState().toggleCourseItem('c1', 1)
      expect(useStore.getState().courseProgress['c1']).toContain(1)
      useStore.getState().toggleCourseItem('c1', 1)
      expect(useStore.getState().courseProgress['c1']).not.toContain(1)
    })
  
    it('calculates course progress percentage', () => {
      useStore.getState().toggleCourseItem('c1', 1)
      const progress = useStore.getState().getCourseProgress('c1', 2)
      expect(progress).toBe(50)
      expect(useStore.getState().getCourseProgress('c1', 0)).toBe(0)
    })
  
    it('translates keys using t function', () => {
      const store = useStore.getState()
      expect(store.t('welcome')).toBe('Velkommen tilbage, Jacob')
      store.setLang('en')
      expect(useStore.getState().t('welcome')).toBe('Welcome back, Jacob')
      expect(useStore.getState().t('non_existent')).toBe('non_existent')
    })
  
    it('sets sidebar collapsed state directly', () => {
      useStore.getState().setCollapsed(true)
      expect(useStore.getState().isCollapsed).toBe(true)
    })
  
    it('updates calendar events', () => {
      const events = { '2026-05-14': { id: 1, title: 'Event', color: '', location: '', time: '', host: '' } }
      useStore.getState().updateCalendarEvents(events)
      expect(useStore.getState().calendarEvents).toEqual(events)
    })
  
    it('sets theme with system preference', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: true,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })
  
      const store = useStore.getState()
      store.setTheme('system')
      expect(useStore.getState().isDarkMode).toBe(true)
    })
  
    it('migrates version 0 to 1', () => {
      const options = useStore.persist.getOptions()
      if (!options.migrate) throw new Error('No migrate function')
      const legacyState = { courseProgress: null, calendarEvents: null, favorites: [] }
      const migrated = options.migrate(legacyState, 0) as any
      expect(migrated.courseProgress).toEqual({})
      expect(migrated.calendarEvents).toEqual({})
    })
  
    it('migrates version 1 to 2 (favorites)', () => {
      const options = useStore.persist.getOptions()
      if (!options.migrate) throw new Error('No migrate function')
      const oldState = {
        toolFavorites: [1, '5', 6],
        courses: [
          { id: '1', isStarred: true },
          { id: 2, isStarred: false },
          { id: 3, isStarred: true },
        ],
      }
      const migrated = options.migrate(oldState, 1) as any
      expect(migrated.favorites.length).toBe(5)
      const types = migrated.favorites.map((f: any) => f.type)
      const ids = migrated.favorites.map((f: any) => f.entityId)
      expect(types.filter((t: string) => t === 'tool')).toHaveLength(3)
      expect(types.filter((t: string) => t === 'course')).toHaveLength(2)
      expect(ids).toContain(1)
      expect(ids).toContain(5)
      expect(ids).toContain(6)
    })
  
    it('returns 0 for getCourseProgress with non-existent course', () => {
      expect(useStore.getState().getCourseProgress('nonexistent', 10)).toBe(0)
    })
  
    it('sets document language attribute when language changes', () => {
      useStore.getState().setLang('en')
      expect(document.documentElement.lang).toBe('en')
    })
  
    it('handles SSR: initial theme and lang fallback to defaults when window is undefined', async () => {
      vi.stubGlobal('window', undefined)
      vi.resetModules()
      const mod = await import('./store.ts')
      expect(mod.default.getState().theme).toBe('system')
      expect(mod.default.getState().lang).toBe('da')
      vi.unstubAllGlobals()
    })
  
    it('handles SSR: sidebar actions skip DOM when window is undefined', async () => {
      vi.stubGlobal('window', undefined)
      vi.resetModules()
      const mod = await import('./store.ts')
      mod.default.getState().toggleSidebar()
      expect(mod.default.getState().isCollapsed).toBe(true)
      vi.unstubAllGlobals()
    })
  
    it('handles SSR: setTheme and setLang skip DOM manipulation when window is undefined', async () => {
      vi.stubGlobal('window', undefined)
      vi.resetModules()
      const mod = await import('./store.ts')
      mod.default.getState().setTheme('dark')
      expect(mod.default.getState().theme).toBe('dark')
      mod.default.getState().setLang('en')
      expect(mod.default.getState().lang).toBe('en')
      vi.unstubAllGlobals()
    })
  
    it('sets isDarkMode based on theme', () => {
      useStore.getState().setTheme('dark')
      expect(useStore.getState().isDarkMode).toBe(true)
      useStore.getState().setTheme('light')
      expect(useStore.getState().isDarkMode).toBe(false)
    })
  
    it('toggles a course favorite', () => {
      const courseId = useStore.getState().courses[0].id
      const wasFav = useStore.getState().isFavorite('course', courseId)
      useStore.getState().toggleFavorite('course', courseId)
      expect(useStore.getState().isFavorite('course', courseId)).toBe(!wasFav)
      useStore.getState().toggleFavorite('course', courseId)
      expect(useStore.getState().isFavorite('course', courseId)).toBe(wasFav)
    })
  
    it('enforces favorites limit', () => {
      const { toggleFavorite } = useStore.getState()
      for (let i = 0; i < 12; i++) toggleFavorite('tool', 100 + i)
      expect(useStore.getState().favorites.length).toBe(12)
      toggleFavorite('tool', 200)
      expect(useStore.getState().favorites.length).toBe(12)
    })
  
    it('reorders favorites', () => {
      useStore.setState({ favorites: [] })
      const { toggleFavorite, reorderFavorites } = useStore.getState()
      toggleFavorite('course', 1)
      toggleFavorite('course', 2)
      toggleFavorite('course', 3)
      expect(useStore.getState().favorites.map(f => f.entityId)).toEqual([1, 2, 3])
      reorderFavorites(2, 0)
      expect(useStore.getState().favorites.map(f => f.entityId)).toEqual([3, 1, 2])
    })
  
    it('toggles sidebar in mobile mode', () => {
      useStore.setState({ isMobile: true, isMobileOpen: false })
      useStore.getState().toggleSidebar()
      expect(useStore.getState().isMobileOpen).toBe(true)
    })
  
    it('closes sidebar', () => {
      useStore.setState({ isCollapsed: false, isMobileOpen: true })
      useStore.getState().closeSidebar()
      expect(useStore.getState().isCollapsed).toBe(false)
      expect(useStore.getState().isMobileOpen).toBe(false)
    })
  
    it('sets mobile open state and applies sidebar classes', () => {
      useStore.setState({ isCollapsed: true, isMobileOpen: false })
      useStore.getState().setIsMobileOpen(true)
      expect(useStore.getState().isMobileOpen).toBe(true)
      expect(document.body.classList.contains('mobile-nav-open')).toBe(true)
      useStore.getState().setIsMobileOpen(false)
      expect(useStore.getState().isMobileOpen).toBe(false)
    })
  
    it('manages counts correctly', () => {
      const store = useStore.getState()
      store.setNotificationCount(10)
      expect(useStore.getState().notificationCount).toBe(10)
      store.decrementNotificationCount()
      expect(useStore.getState().notificationCount).toBe(9)
      
      store.setNotificationCount(0)
      store.decrementNotificationCount()
      expect(useStore.getState().notificationCount).toBe(0)
  
      store.setMessageCount(5)
      expect(useStore.getState().messageCount).toBe(5)
      store.decrementMessageCount()
      expect(useStore.getState().messageCount).toBe(4)
      
      store.setMessageCount(0)
      store.decrementMessageCount()
      expect(useStore.getState().messageCount).toBe(0)
    })
  
    it('manages breadcrumbs', () => {
      const crumbs = [{ label: 'Home', href: '/' }]
      useStore.getState().setBreadcrumbs(crumbs)
      expect(useStore.getState().breadcrumbs).toEqual(crumbs)
      
      useStore.getState().setBreadcrumbs(undefined)
      expect(useStore.getState().breadcrumbs).toEqual([])
    })
  
    it('toggles star via toggleStar', () => {
      const courseId = useStore.getState().courses[0].id
      useStore.getState().toggleStar(courseId)
      expect(useStore.getState().isFavorite('course', courseId)).toBe(true)
    })
  
    it('handles migrate with existing data in v0', () => {
      const options = useStore.persist.getOptions()
      const legacyState = { courseProgress: { '1': [1] }, calendarEvents: { 'd': {} } }
      const migrated = options.migrate!(legacyState, 0) as any
      expect(migrated.courseProgress).toEqual({ '1': [1] })
      expect(migrated.calendarEvents).toEqual({ 'd': {} })
    })
  
    it('skips migration for same version', () => {
      const options = useStore.persist.getOptions()
      const state = { theme: 'dark' }
      expect(options.migrate!(state, 2)).toBe(state)
    })
  
    it('migrates version 1 to 2 with missing old data', () => {
      const options = useStore.persist.getOptions()
      const oldState = {}
      const migrated = options.migrate!(oldState, 1) as any
      expect(migrated.favorites).toEqual([])
    })
  
    it('migrates version 1 to 2 and avoids duplicate course favorites', () => {
      const options = useStore.persist.getOptions()
      const oldStateWithDupes = {
        toolFavorites: [],
        courses: [
          { id: 101, isStarred: true },
          { id: 101, isStarred: true }
        ]
      }
      const migrated = options.migrate!(oldStateWithDupes, 1) as any
      expect(migrated.favorites).toHaveLength(1)
    })
  
    it('handles validation failure during rehydration', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const options = useStore.persist.getOptions()
      const rehydrateCallback = options.onRehydrateStorage?.(useStore.getState())
      if (rehydrateCallback) {
        rehydrateCallback(123 as any)
        expect(consoleWarnSpy).toHaveBeenCalled()
      }
      consoleWarnSpy.mockRestore()
    })
  
    it('handles validation failure during migration', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const options = useStore.persist.getOptions()
      const invalidMigrated = options.migrate!(123, -1) as any
      expect(consoleWarnSpy).toHaveBeenCalled()
      expect(invalidMigrated).toBe(123)
      consoleWarnSpy.mockRestore()
    })
  
    it('handles persist parse error and rehydration', () => {
      const originalParse = PersistedStateSchema.parse
      PersistedStateSchema.parse = () => { throw new Error('parse error') }
  
      const options = useStore.persist.getOptions()
      const migrated = options.migrate?.({ invalidField: true }, 0)
      expect(migrated).toBeDefined()
  
      const rehydrateCallback = (options.onRehydrateStorage as any)?.()
      if (rehydrateCallback) {
        rehydrateCallback({ lang: 'invalid-lang-type' })
      }
  
      PersistedStateSchema.parse = originalParse
    })
  
    it('handles clearFavorites', () => {
      useStore.getState().clearFavorites()
      expect(useStore.getState().favorites).toEqual([])
    })
  
    it('handles t key fallback', () => {
      expect(useStore.getState().t('non.existent.key')).toBe('non.existent.key')
      expect(useStore.getState().localize(null as any)).toBe('')
      expect(useStore.getState().localize({ someField: 'val' })).toBe('')
    })
  })
}
