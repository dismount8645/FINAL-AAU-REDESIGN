import type { StateCreator } from 'zustand';
import type { AppState } from '../index';
import { Theme, Lang, computeIsDarkMode } from '@/lib/theme';
import { translations } from '@/lib/translations';

export interface BreadcrumbItem {
  label: string
  href?: string
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
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (crumbs: BreadcrumbItem[] | undefined) => void;

  notificationCount: number;
  setNotificationCount: (count: number) => void;
  decrementNotificationCount: () => void;

  messageCount: number;
  setMessageCount: (count: number) => void;
  decrementMessageCount: () => void;

  dashboardLayout: DashboardWidgetConfig[];
  setDashboardLayout: (layout: DashboardWidgetConfig[]) => void;
  resetDashboardLayout: () => void;
}

export interface DashboardWidgetConfig {
  id: string;
  span: number;
  size?: 'small' | 'medium' | 'large';
  visible?: boolean;
  title?: string;
  allowedSizes?: ('small' | 'medium' | 'large')[];
  defaultSize?: 'small' | 'medium' | 'large';
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

function applySidebarClasses(isCollapsed: boolean) {
  if (typeof window === 'undefined') return;
  document.body.classList.toggle('sidebar-collapsed', isCollapsed);
}

if (import.meta.vitest) {
  const { describe, it, expect } = await import('vitest');
  const { computeIsDarkMode } = await import('@/lib/theme');

  describe('createUISlice', () => {
    const createMockAppState = () => {
      const state: Partial<AppState> = {
        theme: 'system' as Theme, lang: 'da' as Lang, isDarkMode: computeIsDarkMode('system'),
        isCollapsed: false,
        notificationCount: 2, messageCount: 1, breadcrumbs: [],
        t: (key: string) => key,
      };
      const ui = createUISlice(
        (partial) => {
          if (typeof partial === 'object') Object.assign(state, partial);
          else if (typeof partial === 'function') partial(state as AppState);
        },
        () => state as AppState,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        {} as any,
      );
      return { state, ui: ui as unknown as UISlice };
    };

    it('has default state', () => {
      const { ui } = createMockAppState();
      expect(ui.theme).toBe('system');
      expect(ui.lang).toBe('da');
      expect(ui.isCollapsed).toBe(false);
      expect(ui.notificationCount).toBe(2);
      expect(ui.messageCount).toBe(1);
      expect(ui.breadcrumbs).toEqual([]);
    });

    it('setTheme updates theme and isDarkMode', () => {
      const { state, ui } = createMockAppState();
      const isDark = computeIsDarkMode('light');
      ui.setTheme('light');
      expect(state.theme).toBe('light');
      expect(state.isDarkMode).toBe(isDark);
    });

    it('setLang updates lang', () => {
      const { state, ui } = createMockAppState();
      ui.setLang('en');
      expect(state.lang).toBe('en');
    });

    it('t returns translation for dot-notation key', () => {
      const { ui } = createMockAppState();
      expect(ui.t('common.close')).toBe('Luk');
    });

    it('t returns key when not found', () => {
      const { ui } = createMockAppState();
      expect(ui.t('nonexistent.key')).toBe('nonexistent.key');
    });

    it('t falls back to flat key search', () => {
      const { ui } = createMockAppState();
      const val = ui.t('all_results');
      expect(typeof val).toBe('string');
      expect(val.length).toBeGreaterThan(0);
    });

    it('localize returns da/en value', () => {
      const { ui } = createMockAppState();
      const obj = { title: { da: 'Dansk titel', en: 'English title' } };
      expect(ui.localize(obj, 'title')).toBe('Dansk titel');
    });

    it('localize falls back to keyEn/keyDa pattern for English', () => {
      const { ui } = createMockAppState();
      ui.setLang('en');
      const obj = { title: 'Titel', titleEn: 'Title' };
      expect(ui.localize(obj, 'title')).toBe('Title');
    });

    it('localize falls back to keyDa/keyEn pattern for Danish', () => {
      const { ui } = createMockAppState();
      ui.setLang('da');
      const obj = { title: 'Titel', titleEn: 'Title' };
      expect(ui.localize(obj, 'title')).toBe('Titel');
    });

    it('toggleSidebar toggles isCollapsed', () => {
      const { state, ui } = createMockAppState();
      expect(state.isCollapsed).toBe(false);
      ui.toggleSidebar();
      expect(state.isCollapsed).toBe(true);
      ui.toggleSidebar();
      expect(state.isCollapsed).toBe(false);
    });

    it('closeSidebar collapses sidebar', () => {
      const { state, ui } = createMockAppState();
      state.isCollapsed = false;
      ui.closeSidebar();
      expect(state.isCollapsed).toBe(true);
    });

    it('decrementNotificationCount stops at 0', () => {
      const { state, ui } = createMockAppState();
      expect(state.notificationCount).toBe(2);
      ui.decrementNotificationCount();
      expect(state.notificationCount).toBe(1);
      ui.decrementNotificationCount();
      expect(state.notificationCount).toBe(0);
      ui.decrementNotificationCount();
      expect(state.notificationCount).toBe(0);
    });

    it('decrementMessageCount stops at 0', () => {
      const { state, ui } = createMockAppState();
      state.messageCount = 0;
      ui.decrementMessageCount();
      expect(state.messageCount).toBe(0);
    });

    it('setBreadcrumbs handles undefined', () => {
      const { state, ui } = createMockAppState();
      ui.setBreadcrumbs(undefined);
      expect(state.breadcrumbs).toEqual([]);
    });

    it('setCollapsed applies sidebar classes', () => {
      const { ui } = createMockAppState();
      expect(() => ui.setCollapsed(true)).not.toThrow();
    });
  });
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
        return (tObj[lang] as string) || (tObj['da'] as string) || (tObj['en'] as string) || '';
      }
    }

    if (key) {
      const keyEn = `${key}En`;
      const keyDa = `${key}Da`;
      if (lang === 'en') {
        return (rec[keyEn] as string) || (rec[key] as string) || (rec[keyDa] as string) || '';
      }
      return (rec[keyDa] as string) || (rec[key] as string) || (rec[keyEn] as string) || '';
    }

    return '';
  },

  isCollapsed: false,
  setCollapsed: (collapsed) => {
    set({ isCollapsed: collapsed });
    applySidebarClasses(collapsed);
  },
  toggleSidebar: () => {
    const { isCollapsed } = get();
    const next = !isCollapsed;
    set({ isCollapsed: next });
    applySidebarClasses(next);
  },
  closeSidebar: () => {
    set({ isCollapsed: true });
    applySidebarClasses(true);
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

  dashboardLayout: [
    { id: 'deadlines', title: 'Seneste afleveringer', visible: true, size: 'medium', span: 14, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'quickOverview', title: 'Hurtig oversigt', visible: true, size: 'small', span: 10, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
    { id: 'favorites', title: 'Favoritter', visible: true, size: 'medium', span: 14, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'support', title: 'ITS Support', visible: true, size: 'small', span: 10, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
    { id: 'forumActivity', title: 'Forum aktivitet', visible: true, size: 'medium', span: 24, defaultSize: 'medium', allowedSizes: ['medium', 'large'] },
    { id: 'messages', title: 'Beskeder', visible: false, size: 'small', span: 10, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'calendar', title: 'Kalender', visible: false, size: 'large', span: 24, defaultSize: 'large', allowedSizes: ['medium', 'large'] },
    { id: 'courseProgress', title: 'Kursusprogress', visible: false, size: 'medium', span: 14, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
  ],
  setDashboardLayout: (layout) => set({ dashboardLayout: layout }),
  resetDashboardLayout: () => set({
    dashboardLayout: [
      { id: 'deadlines', title: 'Seneste afleveringer', visible: true, size: 'medium', span: 14, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'quickOverview', title: 'Hurtig oversigt', visible: true, size: 'small', span: 10, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
      { id: 'favorites', title: 'Favoritter', visible: true, size: 'medium', span: 14, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'support', title: 'ITS Support', visible: true, size: 'small', span: 10, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
      { id: 'forumActivity', title: 'Forum aktivitet', visible: true, size: 'medium', span: 24, defaultSize: 'medium', allowedSizes: ['medium', 'large'] },
      { id: 'messages', title: 'Beskeder', visible: false, size: 'small', span: 10, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'calendar', title: 'Kalender', visible: false, size: 'large', span: 24, defaultSize: 'large', allowedSizes: ['medium', 'large'] },
      { id: 'courseProgress', title: 'Kursusprogress', visible: false, size: 'medium', span: 14, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    ]
  }),
});
