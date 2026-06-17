import type { Theme, Lang } from '@/lib/theme';
import type { FavoriteItem, FavoriteType } from '@/lib/types';
import type { UISlice, BreadcrumbItem, DashboardWidgetConfig } from './slices/uiSlice';
import type { CourseSlice, CourseWithStatus } from './slices/courseSlice';
import type { FavoriteSlice } from './slices/favoriteSlice';
import type { UserSlice } from './slices/userSlice';

export type { Theme, Lang, BreadcrumbItem, DashboardWidgetConfig, CourseWithStatus, FavoriteItem, FavoriteType, UISlice, CourseSlice, FavoriteSlice, UserSlice };

export interface AppState extends UISlice, CourseSlice, FavoriteSlice, UserSlice {}
