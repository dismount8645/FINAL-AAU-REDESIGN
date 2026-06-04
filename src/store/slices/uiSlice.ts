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
