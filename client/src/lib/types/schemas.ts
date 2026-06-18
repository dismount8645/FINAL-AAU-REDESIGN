interface FavoriteItem {
  id: string;
  type: 'course' | 'tool' | 'file' | 'forum' | 'link';
  entityId: number;
  addedAt: number;
  order: number;
}

interface DashboardWidgetItem {
  id: string;
  title?: string;
  visible: boolean;
  span: number;
  size: 'small' | 'medium' | 'large';
  allowedSizes?: ('small' | 'medium' | 'large')[];
  defaultSize: 'small' | 'medium' | 'large';
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  userModified?: boolean;
  pinned?: boolean;
}

export const PersistedStateSchema = {
  parse(state: any): any {
    if (!state || typeof state !== 'object') {
      throw new Error('State must be a non-null object');
    }

    const theme = (state.theme === 'system' || state.theme === 'light' || state.theme === 'dark') ? state.theme : 'system';
    const lang = (state.lang === 'da' || state.lang === 'en') ? state.lang : 'da';
    const isCollapsed = typeof state.isCollapsed === 'boolean' ? state.isCollapsed : true;

    const courseProgress: Record<string, number[]> = {};
    if (state.courseProgress && typeof state.courseProgress === 'object') {
      for (const [key, val] of Object.entries(state.courseProgress)) {
        if (Array.isArray(val)) {
          courseProgress[key] = val.filter((item): item is number => typeof item === 'number');
        }
      }
    }

    const calendarEvents = state.calendarEvents && typeof state.calendarEvents === 'object' ? state.calendarEvents : {};

    const favorites: FavoriteItem[] = [];
    if (Array.isArray(state.favorites)) {
      for (const item of state.favorites) {
        if (item && typeof item === 'object') {
          const type = (item.type === 'course' || item.type === 'tool' || item.type === 'file' || item.type === 'forum' || item.type === 'link') ? item.type : null;
          if (typeof item.id === 'string' && type !== null && typeof item.entityId === 'number' && typeof item.addedAt === 'number' && typeof item.order === 'number') {
            favorites.push({
              id: item.id,
              type,
              entityId: item.entityId,
              addedAt: item.addedAt,
              order: item.order,
            });
          }
        }
      }
    }

    const firstName = typeof state.firstName === 'string' ? state.firstName : 'Jacob Krarup';
    const lastName = typeof state.lastName === 'string' ? state.lastName : 'Madsen';

    const notifPrefs = { email: true, push: true, sms: false };
    if (state.notifPrefs && typeof state.notifPrefs === 'object') {
      notifPrefs.email = typeof state.notifPrefs.email === 'boolean' ? state.notifPrefs.email : true;
      notifPrefs.push = typeof state.notifPrefs.push === 'boolean' ? state.notifPrefs.push : true;
      notifPrefs.sms = typeof state.notifPrefs.sms === 'boolean' ? state.notifPrefs.sms : false;
    }

    const forumDigest = (state.forumDigest === 'none' || state.forumDigest === 'complete' || state.forumDigest === 'subjects') ? state.forumDigest : 'complete';
    const forumTracking = typeof state.forumTracking === 'boolean' ? state.forumTracking : true;
    const forumAutoSubscribe = typeof state.forumAutoSubscribe === 'boolean' ? state.forumAutoSubscribe : true;

    const calendarStartDay = (state.calendarStartDay === 'monday' || state.calendarStartDay === 'sunday') ? state.calendarStartDay : 'monday';
    const calendarDefaultView = (state.calendarDefaultView === 'month' || state.calendarDefaultView === 'week' || state.calendarDefaultView === 'day') ? state.calendarDefaultView : 'month';

    const messagePrivacy = (state.messagePrivacy === 'contacts' || state.messagePrivacy === 'courses' || state.messagePrivacy === 'anyone') ? state.messagePrivacy : 'courses';
    const messageEmailOffline = typeof state.messageEmailOffline === 'boolean' ? state.messageEmailOffline : true;

    const defaultLayout: DashboardWidgetItem[] = [
      { id: 'deadlines', title: 'Seneste afleveringer', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'messages', title: 'Beskeder', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'calendar', title: 'Kalender', visible: true, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'favorites', title: 'Favoritter', visible: true, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'courseProgress', title: 'Kursusprogress', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'forumActivity', title: 'Forum aktivitet', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium', 'large'] },
      { id: 'support', title: 'ITS Support', visible: false, size: 'small', span: 4, defaultSize: 'small', allowedSizes: ['small', 'medium'] },
      { id: 'quickOverview', title: 'Dagens program', visible: false, size: 'medium', span: 8, defaultSize: 'medium', allowedSizes: ['small', 'medium', 'large'] },
    ];

    const dashboardLayout: DashboardWidgetItem[] = [];
    if (Array.isArray(state.dashboardLayout)) {
      for (const item of state.dashboardLayout) {
        if (item && typeof item === 'object' && typeof item.id === 'string') {
          const visible = typeof item.visible === 'boolean' ? item.visible : true;
          const span = typeof item.span === 'number' ? item.span : 12;
          const size = (item.size === 'small' || item.size === 'medium' || item.size === 'large') ? item.size : 'medium';
          const defaultSize = (item.defaultSize === 'small' || item.defaultSize === 'medium' || item.defaultSize === 'large') ? item.defaultSize : 'medium';
          const allowedSizes = Array.isArray(item.allowedSizes) ? item.allowedSizes.filter((s: any) => s === 'small' || s === 'medium' || s === 'large') : undefined;

          dashboardLayout.push({
            id: item.id,
            title: typeof item.title === 'string' ? item.title : undefined,
            visible,
            span,
            size,
            allowedSizes,
            defaultSize,
            x: typeof item.x === 'number' ? item.x : undefined,
            y: typeof item.y === 'number' ? item.y : undefined,
            w: typeof item.w === 'number' ? item.w : undefined,
            h: typeof item.h === 'number' ? item.h : undefined,
            userModified: typeof item.userModified === 'boolean' ? item.userModified : undefined,
            pinned: typeof item.pinned === 'boolean' ? item.pinned : undefined,
          });
        }
      }
    }

    return {
      theme,
      lang,
      isCollapsed,
      courseProgress,
      calendarEvents,
      favorites,
      firstName,
      lastName,
      notifPrefs,
      forumDigest,
      forumTracking,
      forumAutoSubscribe,
      calendarStartDay,
      calendarDefaultView,
      messagePrivacy,
      messageEmailOffline,
      dashboardLayout: dashboardLayout.length > 0 ? dashboardLayout : defaultLayout,
    };
  }
};

