import { useState, useEffect } from 'react';

export interface RecentSearch {
  id: string;
  text: string;
  link: string;
  type: 'course' | 'assignment' | 'message' | 'query' | 'calendar';
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const loaded = localStorage.getItem('aau_recent_searches');
    if (loaded) {
      try {
        setRecentSearches(JSON.parse(loaded).slice(0, 5));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const saveRecentSearches = (items: RecentSearch[]) => {
    setRecentSearches(items);
    localStorage.setItem('aau_recent_searches', JSON.stringify(items));
  };

  const addRecentSearch = (item: RecentSearch) => {
    const filtered = recentSearches.filter(x => x.link !== item.link && x.text !== item.text);
    const updated = [item, ...filtered].slice(0, 5);
    saveRecentSearches(updated);
  };

  const removeRecentSearch = (id: string) => {
    const updated = recentSearches.filter(x => x.id !== id);
    saveRecentSearches(updated);
  };

  const clearAllRecent = () => {
    saveRecentSearches([]);
    localStorage.removeItem('aau_recent_searches');
  };

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearAllRecent
  };
}
