import type { AppState } from './types';
import { allToolsList } from '@/lib/utils';
import { sortFavorites, resolveFavorite } from '@/lib/favorites';
import type { ResolvedFavorite } from '@/lib/favorites';

export const selectPinnedTools = (state: AppState) =>
  allToolsList.filter(t => state.isFavorite('tool', t.id))

export const selectResolvedFavorites = (state: AppState) => {
  const sorted = sortFavorites(state.favorites);
  return sorted
    .map(fav => resolveFavorite(fav, state.lang, state.courses, state.t))
    .filter(Boolean) as ResolvedFavorite[];
};
