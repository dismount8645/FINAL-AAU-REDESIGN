export const SETTINGS_CATEGORIES = [
  {
    id: 'bruger', nameKey: 'categories.user_account', items: [
      { id: 'profil', nameKey: 'categories.edit_profile' },
      { id: 'sprog', nameKey: 'categories.select_language' },
    ],
  },
  {
    id: 'indstillinger', nameKey: 'categories.preferences', items: [
      { id: 'forum', nameKey: 'categories.forum_settings' },
      { id: 'editor', nameKey: 'categories.editor_settings' },
      { id: 'kalender', nameKey: 'categories.calendar_settings' },
      { id: 'indholdsbank', nameKey: 'categories.content_bank' },
    ],
  },
  {
    id: 'sikkerhed', nameKey: 'categories.security', items: [
      { id: 'sikkerhedsnogler', nameKey: 'categories.security_keys' },
      { id: 'beskeder', nameKey: 'categories.message_settings' },
      { id: 'notifikationer', nameKey: 'categories.notification_settings' },
    ],
  },
  {
    id: 'filer', nameKey: 'categories.files', items: [
      { id: 'arkiver', nameKey: 'cat_file_archives' },
      { id: 'eksempler', nameKey: 'cat_manage_samples' },
    ],
  },
  {
    id: 'blogs', nameKey: 'cat_blogs', items: [
      { id: 'blogindstillinger', nameKey: 'cat_blog_settings' },
      { id: 'eksterneb', nameKey: 'cat_external_blogs' },
      { id: 'registrerb', nameKey: 'cat_register_blog' },
    ],
  },
  {
    id: 'badges', nameKey: 'cat_badges', items: [
      { id: 'badgeadm', nameKey: 'cat_manage_badges' },
      { id: 'badgeind', nameKey: 'cat_badge_settings' },
    ],
  },
] as const
