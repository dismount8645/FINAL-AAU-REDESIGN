import type { AppState } from './index';
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

export const selectGradesStats = (state: AppState) => {
  const graded = state.grades.filter(g => g.grade !== null);
  if (graded.length === 0) return { gpa: 0, completedEcts: 0, gradedCount: 0, totalCount: state.grades.length };

  const totalWeighted = graded.reduce((sum, r) => sum + (r.grade || 0) * r.ects, 0);
  const totalEcts = graded.reduce((sum, r) => sum + r.ects, 0);

  return {
    gpa: parseFloat((totalWeighted / totalEcts).toFixed(2)),
    completedEcts: totalEcts,
    gradedCount: graded.length,
    totalCount: state.grades.length,
  };
};
