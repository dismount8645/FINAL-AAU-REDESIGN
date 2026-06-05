

/**
 * Type-safe and error-resilient wrapper for localStorage.
 */

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (!item) return defaultValue;
      try {
        return JSON.parse(item);
      } catch {
        if (typeof defaultValue === 'string') {
          return item as unknown as T;
        }
        console.warn(`Could not parse storage key "${key}" as JSON, using default.`);
        return defaultValue;
      }
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error);
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error writing storage key "${key}":`, error);
    }
  },
  
  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error);
    }
  }
};

if (import.meta.vitest) {
  describe('storage', () => {
    it('handles all resilience scenarios', () => {
      localStorage.setItem('test_json_err', 'invalid-json')
      expect(storage.get('test_json_err', { a: 1 })).toEqual({ a: 1 })
      expect(storage.get('test_json_err', 'fallback-string')).toBe('invalid-json')
  
      const originalGetItem = localStorage.getItem
      localStorage.getItem = () => { throw new Error('getItem error') }
      expect(storage.get('test_key', 'fallback')).toBe('fallback')
      localStorage.getItem = originalGetItem
  
      const originalSetItem = localStorage.setItem
      localStorage.setItem = () => { throw new Error('setItem error') }
      storage.set('test_key', 'val')
      localStorage.setItem = originalSetItem
  
      const originalRemoveItem = localStorage.removeItem
      localStorage.removeItem = () => { throw new Error('removeItem error') }
      storage.remove('test_key')
      localStorage.removeItem = originalRemoveItem
  
      const originalWindow = globalThis.window
      delete (globalThis as any).window
      try {
        expect(storage.get('test_key', 'fallback')).toBe('fallback')
        storage.set('test_key', 'val')
        storage.remove('test_key')
      } finally {
        (globalThis as any).window = originalWindow
      }
    })
  })
}
