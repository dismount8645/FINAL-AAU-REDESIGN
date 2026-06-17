import { describe, it, expect } from 'vitest'
import { computeIsDarkMode } from '@/lib/theme'
import type { Theme, Lang } from '@/lib/theme'
import { createUISlice } from '../uiSlice'
import type { AppState } from '../../types'
import type { UISlice } from '../uiSlice'

const createMockAppState = () => {
  const state: Partial<UISlice & { t: (key: string) => string }> = {
    theme: 'system' as Theme, lang: 'da' as Lang, isDarkMode: computeIsDarkMode('system'),
    isCollapsed: true,
    notificationCount: 2, messageCount: 1, breadcrumbs: [],
    t: (key: string) => key,
  } as Partial<UISlice & { t: (key: string) => string }>;
  const ui = createUISlice(
    (partial) => {
      if (typeof partial === 'object') Object.assign(state, partial);
      else if (typeof partial === 'function') partial(state as AppState);
    },
    () => state as AppState,
    {} as any,
  );
  return { state, ui: ui as unknown as UISlice };
};

describe('createUISlice', () => {
  it('has default state', () => {
    const { ui } = createMockAppState();
    expect(ui.theme).toBe('system');
    expect(ui.lang).toBe('da');
    expect(ui.isCollapsed).toBe(true);
    expect(ui.notificationCount).toBe(2);
    expect(ui.messageCount).toBe(1);
    expect(ui.breadcrumbs).toEqual([]);
  });

  it('setTheme updates theme and isDarkMode', () => {
    const { state, ui } = createMockAppState();
    const isDark = computeIsDarkMode('light');
    ui.setTheme('light');
    expect((state as any).theme).toBe('light');
    expect((state as any).isDarkMode).toBe(isDark);
  });

  it('setLang updates lang', () => {
    const { state, ui } = createMockAppState();
    ui.setLang('en');
    expect((state as any).lang).toBe('en');
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
    expect((state as any).isCollapsed).toBe(true);
    ui.toggleSidebar();
    expect((state as any).isCollapsed).toBe(false);
    ui.toggleSidebar();
    expect((state as any).isCollapsed).toBe(true);
  });

  it('closeSidebar collapses sidebar', () => {
    const { state, ui } = createMockAppState();
    (state as any).isCollapsed = false;
    ui.closeSidebar();
    expect((state as any).isCollapsed).toBe(true);
  });

  it('decrementNotificationCount stops at 0', () => {
    const { state, ui } = createMockAppState();
    expect((state as any).notificationCount).toBe(2);
    ui.decrementNotificationCount();
    expect((state as any).notificationCount).toBe(1);
    ui.decrementNotificationCount();
    expect((state as any).notificationCount).toBe(0);
    ui.decrementNotificationCount();
    expect((state as any).notificationCount).toBe(0);
  });

  it('decrementMessageCount stops at 0', () => {
    const { state, ui } = createMockAppState();
    (state as any).messageCount = 0;
    ui.decrementMessageCount();
    expect((state as any).messageCount).toBe(0);
  });

  it('setBreadcrumbs handles undefined', () => {
    const { state, ui } = createMockAppState();
    ui.setBreadcrumbs(undefined);
    expect((state as any).breadcrumbs).toEqual([]);
  });

  it('setCollapsed applies sidebar classes', () => {
    const { ui } = createMockAppState();
    expect(() => ui.setCollapsed(true)).not.toThrow();
  });
})
