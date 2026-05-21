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
