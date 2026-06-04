import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { storage } from '@/lib/storage';
import type { Theme, Lang } from '@/lib/theme';

export interface UserState {
  firstName: string;
  lastName: string;
  lang: Lang;
  theme: Theme;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      firstName: storage.get('userFirstName', 'Jacob Krarup'),
      lastName: storage.get('userLastName', 'Madsen'),
      lang: 'en',
      theme: 'system',
      setFirstName: (firstName) => {
        storage.set('userFirstName', firstName);
        set({ firstName });
      },
      setLastName: (lastName) => {
        storage.set('userLastName', lastName);
        set({ lastName });
      },
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'aau-user-store',
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
    })

    it('updates user profile names and stores them in storage', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.setFirstName('Jane')
        result.current.setLastName('Doe')
      })

      expect(result.current.firstName).toBe('Jane')
      expect(result.current.lastName).toBe('Doe')
      expect(storage.get('userFirstName', '')).toBe('Jane')
      expect(storage.get('userLastName', '')).toBe('Doe')
    })
  })
}
