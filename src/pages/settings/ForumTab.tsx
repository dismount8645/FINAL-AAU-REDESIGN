import FormField from '@/components/ui/FormField'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

interface ForumTabProps {
  forumDigest: 'none' | 'complete' | 'subjects'
  setForumDigest: (val: 'none' | 'complete' | 'subjects') => void
  forumTracking: boolean
  setForumTracking: (val: boolean) => void
  forumAutoSubscribe: boolean
  setForumAutoSubscribe: (val: boolean) => void
}

export default function ForumTab({
  forumDigest,
  setForumDigest,
  forumTracking,
  setForumTracking,
  forumAutoSubscribe,
  setForumAutoSubscribe,
}: ForumTabProps) {
  const { t } = useStore()

  return (
    <Stack gap="xl" className="settings__forum max-w-[var(--container-max-width)]">
      <div className="flex flex-col gap-[var(--space-2xs)]">
        <Text weight="bold" size="md" className="text-main">
          {t('settings.forum_prefs')}
        </Text>
        <Text muted size="sm">
          {t('settings.forum_desc')}
        </Text>
      </div>

      <Stack gap="lg" className="mt-sm">
        <FormField label={t('settings.email_digest_type')}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
            {[
              { id: 'none', label: t('settings.digest_none'), desc: t('settings.digest_none_desc') },
              { id: 'complete', label: t('settings.digest_complete'), desc: t('settings.digest_complete_desc') },
              { id: 'subjects', label: t('settings.digest_subjects'), desc: t('settings.digest_subjects_desc') }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setForumDigest(opt.id as 'none' | 'complete' | 'subjects')}
                className={`p-md rounded-xl border text-left transition-all cursor-pointer ${forumDigest === opt.id ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
              >
                <Text size="sm" weight="bold" className="text-main">{opt.label}</Text>
                <Text size="xs" muted className="mt-3xs leading-snug">{opt.desc}</Text>
              </button>
            ))}
          </div>
        </FormField>

        <div className="border-t border-border pt-md flex items-center justify-between pointer-events-auto">
          <Stack gap="2xs" className="max-w-[75%]">
            <Text id="toggle-label-forum-tracking" weight="semibold" size="sm" className="text-main">
              {t('settings.forum_tracking')}
            </Text>
            <Text size="xs" muted>
              {t('settings.forum_tracking_desc')}
            </Text>
          </Stack>
          <button
            type="button"
            aria-labelledby="toggle-label-forum-tracking"
            onClick={() => setForumTracking(!forumTracking)}
            className={`relative w-11 h-7 rounded-full flex items-center px-3xs transition-colors cursor-pointer after:absolute after:inset-[-12px] ${forumTracking ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${forumTracking ? 'ml-auto' : 'ml-0'}`} />
          </button>
        </div>

        <div className="border-t border-border pt-md flex items-center justify-between pointer-events-auto">
          <Stack gap="2xs" className="max-w-[75%]">
            <Text id="toggle-label-forum-auto-subscribe" weight="semibold" size="sm" className="text-main">
              {t('settings.auto_subscribe')}
            </Text>
            <Text size="xs" muted>
              {t('settings.auto_subscribe_desc')}
            </Text>
          </Stack>
          <button
            type="button"
            aria-labelledby="toggle-label-forum-auto-subscribe"
            onClick={() => setForumAutoSubscribe(!forumAutoSubscribe)}
            className={`relative w-11 h-7 rounded-full flex items-center px-3xs transition-colors cursor-pointer after:absolute after:inset-[-12px] ${forumAutoSubscribe ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${forumAutoSubscribe ? 'ml-auto' : 'ml-0'}`} />
          </button>
        </div>
      </Stack>
    </Stack>
  )
}
