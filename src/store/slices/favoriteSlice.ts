import { StateCreator } from 'zustand'
import { AppState } from '@/store/useStore'
import type { FavoriteItem, FavoriteType } from '@/types'
import { DASHBOARD_CONFIG } from '@/config/dashboard'

export interface FavoriteSlice {
  favorites: FavoriteItem[]
  favoritesLimit: number
  toggleFavorite: (type: FavoriteType, entityId: number) => void
  reorderFavorites: (fromIndex: number, toIndex: number) => void
  isFavorite: (type: FavoriteType, entityId: number) => boolean
}

export const createFavoriteSlice: StateCreator<AppState, [], [], FavoriteSlice> = (set, get) => ({
  favorites: [],
  favoritesLimit: DASHBOARD_CONFIG.FAVORITES_LIMIT,
  toggleFavorite: (type, entityId) => {
    const { favorites } = get()
    const id = `${type}-${entityId}`
    const existing = favorites.find(f => f.id === id)
    if (existing) {
      set({ favorites: favorites.filter(f => f.id !== id) })
    } else {
      if (favorites.length >= DASHBOARD_CONFIG.FAVORITES_LIMIT) return
      const maxOrder = favorites.reduce((max, f) => Math.max(max, f.order), -1)
      set({
        favorites: [...favorites, {
          id,
          type,
          entityId,
          addedAt: Date.now(),
          order: maxOrder + 1,
        }],
      })
    }
  },
  reorderFavorites: (fromIndex, toIndex) => {
    const { favorites } = get()
    const reordered = [...favorites]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    set({ favorites: reordered.map((f, i) => ({ ...f, order: i })) })
  },
  isFavorite: (type, entityId) => {
    const { favorites } = get()
    return favorites.some(f => f.type === type && f.entityId === entityId)
  },
})
