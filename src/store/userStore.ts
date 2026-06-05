import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { saveSettings } from '@/lib/api';
import type { Theme, Lang } from '@/lib/theme';

export interface UserState {
  firstName: string;
  lastName: string;
  lang: Lang;
  theme: Theme;
  notifPrefs: { email: boolean; push: boolean; sms: boolean };
  forumDigest: 'none' | 'complete' | 'subjects';
  forumTracking: boolean;
  forumAutoSubscribe: boolean;
  calendarStartDay: 'monday' | 'sunday';
  calendarDefaultView: 'month' | 'week' | 'day';
  messagePrivacy: 'contacts' | 'courses' | 'anyone';
  messageEmailOffline: boolean;
  isSaving: boolean;
  
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  setNotifPrefs: (prefs: { email: boolean; push: boolean; sms: boolean } | ((prev: { email: boolean; push: boolean; sms: boolean }) => { email: boolean; push: boolean; sms: boolean })) => void;
  setForumDigest: (digest: 'none' | 'complete' | 'subjects') => void;
  setForumTracking: (tracking: boolean) => void;
  setForumAutoSubscribe: (autoSubscribe: boolean) => void;
  setCalendarStartDay: (startDay: 'monday' | 'sunday') => void;
  setCalendarDefaultView: (defaultView: 'month' | 'week' | 'day') => void;
  setMessagePrivacy: (privacy: 'contacts' | 'courses' | 'anyone') => void;
  setMessageEmailOffline: (offline: boolean) => void;
  
  handleSave: (toast: any, t: any) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      firstName: storage.get(STORAGE_KEYS.USER_FIRST_NAME, 'Jacob Krarup'),
      lastName: storage.get(STORAGE_KEYS.USER_LAST_NAME, 'Madsen'),
      lang: 'en',
      theme: 'system',
      notifPrefs: { email: true, push: true, sms: false },
      forumDigest: 'complete',
      forumTracking: true,
      forumAutoSubscribe: true,
      calendarStartDay: 'monday',
      calendarDefaultView: 'month',
      messagePrivacy: 'courses',
      messageEmailOffline: true,
      isSaving: false,

      setFirstName: (firstName) => {
        storage.set(STORAGE_KEYS.USER_FIRST_NAME, firstName);
        set({ firstName });
      },
      setLastName: (lastName) => {
        storage.set(STORAGE_KEYS.USER_LAST_NAME, lastName);
        set({ lastName });
      },
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      setNotifPrefs: (notifPrefs) => set((state) => ({
        notifPrefs: typeof notifPrefs === 'function' ? notifPrefs(state.notifPrefs) : notifPrefs
      })),
      setForumDigest: (forumDigest) => set({ forumDigest }),
      setForumTracking: (forumTracking) => set({ forumTracking }),
      setForumAutoSubscribe: (forumAutoSubscribe) => set({ forumAutoSubscribe }),
      setCalendarStartDay: (calendarStartDay) => set({ calendarStartDay }),
      setCalendarDefaultView: (calendarDefaultView) => set({ calendarDefaultView }),
      setMessagePrivacy: (messagePrivacy) => set({ messagePrivacy }),
      setMessageEmailOffline: (messageEmailOffline) => set({ messageEmailOffline }),

      handleSave: async (toast, t) => {
        set({ isSaving: true });
        const { firstName, lastName, lang, theme, notifPrefs, forumDigest, forumTracking, forumAutoSubscribe } = get();
        storage.set(STORAGE_KEYS.USER_FIRST_NAME, firstName);
        storage.set(STORAGE_KEYS.USER_LAST_NAME, lastName);
        try {
          await saveSettings({
            language: lang,
            theme,
            notifications: notifPrefs,
            forumPreferences: {
              digest: forumDigest,
              tracking: String(forumTracking),
              autoSubscribe: String(forumAutoSubscribe),
            },
          });
          toast.success(t('settings.save_success'));
        } catch {
          toast.error(t('common.save_error'));
        } finally {
          set({ isSaving: false });
        }
      }
    }),
    {
      name: STORAGE_KEYS.USER_STORE,
    }
  )
);

export default useUserStore;

if (import.meta.vitest) {
  describe('useUserStore', () => {
    it('initializes with default values', () => {
      const { result } = renderHook(() => useUserStore())
      expect(result.current.firstName).toBe('Jacob Krarup')
      expect(result.current.lastName).toBe('Madsen')
      expect(result.current.lang).toBe('en')
      expect(result.current.theme).toBe('system')
      expect(result.current.notifPrefs.email).toBe(true)
    })

    it('updates user profile names and stores them in storage', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.setFirstName('Jane')
        result.current.setLastName('Doe')
      })

      expect(result.current.firstName).toBe('Jane')
      expect(result.current.lastName).toBe('Doe')
      expect(storage.get(STORAGE_KEYS.USER_FIRST_NAME, '')).toBe('Jane')
      expect(storage.get(STORAGE_KEYS.USER_LAST_NAME, '')).toBe('Doe')
    })
  })
}
