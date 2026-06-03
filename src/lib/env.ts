/**
 * Safe wrappers for window and DOM interactions to prevent crashes in iframe/sandbox environments.
 */

export const env = {
  /**
   * Safe check for window.open
   */
  open: (url: string, target = '_blank', features = 'noopener,noreferrer') => {
    try {
      if (typeof window !== 'undefined' && window.open) {
        return window.open(url, target, features);
      }
      console.warn('window.open is not available in this environment.');
    } catch (error) {
      console.error('Failed to execute window.open:', error);
    }
    return null;
  },

  /**
   * Safe check for window.innerWidth
   */
  getInnerWidth: () => {
    try {
      return typeof window !== 'undefined' ? window.innerWidth : 0;
    } catch {
      return 0;
    }
  },

  /**
   * Safe check for window.matchMedia
   */
  matchMedia: (query: string) => {
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia(query);
      }
    } catch (error) {
      console.error('matchMedia is not available:', error);
    }
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList;
  },

  /**
   * Check if we are currently running in an iframe
   */
  isIframe: () => {
    try {
      return typeof window !== 'undefined' && window.self !== window.top;
    } catch {
      return true;
    }
  }
};
