import type { StateCreator } from 'zustand';
import type { AppState } from '../types';
import { Theme, Lang, computeIsDarkMode } from '@/lib/theme';
import { getTranslation } from '@/translations';

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
  userModified?: boolean;
  pinned?: boolean;
}

function applySidebarClasses(isCollapsed: boolean) {
  if (typeof window === 'undefined') return;
  document.body.classList.toggle('sidebar-collapsed', isCollapsed);
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
    return getTranslation(key, lang);
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

  isCollapsed: true,
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
    { id: 'quickOverview', title: 'Dagens program', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'deadlines', title: 'Seneste afleveringer', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'messages', title: 'Beskeder', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'forumActivity', title: 'Forum aktivitet', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'favorites', title: 'Favoritter', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'shortcuts', title: 'Genveje', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
    { id: 'calendar', title: 'Kalender', visible: false, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'courseProgress', title: 'Kursusprogress', visible: false, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    { id: 'support', title: 'ITS Support', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
  ],
  setDashboardLayout: (layout) => set({ dashboardLayout: layout }),
  resetDashboardLayout: () => set({
    dashboardLayout: [
      { id: 'quickOverview', title: 'Dagens program', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'deadlines', title: 'Seneste afleveringer', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'messages', title: 'Beskeder', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'forumActivity', title: 'Forum aktivitet', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'favorites', title: 'Favoritter', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'shortcuts', title: 'Genveje', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
      { id: 'calendar', title: 'Kalender', visible: false, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'courseProgress', title: 'Kursusprogress', visible: false, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'support', title: 'ITS Support', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
    ]
  }),
});
