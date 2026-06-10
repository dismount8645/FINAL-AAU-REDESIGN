export const SETTINGS_CATEGORIES = [
  {
    id: 'bruger', nameKey: 'categories.user_account', items: [
      { id: 'profil', nameKey: 'categories.edit_profile' },
      { id: 'sprog', nameKey: 'categories.select_language' },
    ],
  },
  {
    id: 'indstillinger', nameKey: 'categories.preferences', items: [
      { id: 'notifikationer', nameKey: 'categories.notification_settings' },
      { id: 'beskeder', nameKey: 'categories.message_settings' },
      { id: 'forum', nameKey: 'categories.forum_settings' },
      { id: 'kalender', nameKey: 'categories.calendar_settings' },
    ],
  },
  {
    id: 'avanceret', nameKey: 'categories.advanced', items: [
      { id: 'sikkerhedsnogler', nameKey: 'categories.security_keys' },
      { id: 'editor', nameKey: 'categories.editor_settings' },
      { id: 'indholdsbank', nameKey: 'categories.content_bank' },
      { id: 'arkiver', nameKey: 'categories.file_archives' },
      { id: 'eksempler', nameKey: 'categories.manage_samples' },
      { id: 'blogindstillinger', nameKey: 'categories.blog_settings' },
      { id: 'eksterneb', nameKey: 'categories.external_blogs' },
      { id: 'registrerb', nameKey: 'categories.register_blog' },
      { id: 'badgeadm', nameKey: 'categories.manage_badges' },
      { id: 'badgeind', nameKey: 'categories.badge_settings' },
    ],
  },
] as const
