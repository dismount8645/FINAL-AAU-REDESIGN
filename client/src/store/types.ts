import type { Theme, Lang } from '@/lib/theme';
import type { BreadcrumbItem } from './slices/uiSlice';
import type { CourseWithStatus } from './slices/courseSlice';
import type { UISlice } from './slices/uiSlice';
import type { CourseSlice } from './slices/courseSlice';
import type { FavoriteSlice } from './slices/favoriteSlice';
import type { UserSlice } from './slices/userSlice';

export type { Theme, Lang, BreadcrumbItem, CourseWithStatus };

export interface AppState extends UISlice, CourseSlice, FavoriteSlice, UserSlice {}
