import { useState } from 'react';
import { Card, FormField, SectionHeader } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text } from '@/components/ui'
import useStore from '@/store'
import AutosaveStatus from './AutosaveStatus'
import { Check } from 'lucide-react'

export default function ForumTab() {
  const store = useStore()
  const { forumDigest, setForumDigest, forumTracking, setForumTracking, forumAutoSubscribe, setForumAutoSubscribe, t } = store
  const [changeCount, setChangeCount] = useState(0)

  const bump = () => setChangeCount(c => c + 1)

  return (
    <Stack gap="lg" className="settings__forum max-w-[var(--container-max-width)] animate-fade-in">
      <SectionHeader title={t('settings.forum_prefs')} description={t('settings.forum_desc')} className="!mb-0" />
      <AutosaveStatus changeCount={changeCount} />
      <Stack gap="lg" className="mt-sm">
        <FormField label={t('settings.email_digest_type')}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
            {[
              { id: 'none', label: t('settings.digest_none'), desc: t('settings.digest_none_desc') },
              { id: 'complete', label: t('settings.digest_complete'), desc: t('settings.digest_complete_desc') },
              { id: 'subjects', label: t('settings.digest_subjects'), desc: t('settings.digest_subjects_desc') }
            ].map(opt => {
              const isSelected = forumDigest === opt.id;
              return (
                <Card
                  as="button"
                  key={opt.id}
                  variant="outlined"
                  interactive
                  className={`p-md text-left active:scale-[0.98] relative ${isSelected ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20' : 'bg-card hover:border-primary/20'}`}
                  onClick={() => { setForumDigest(opt.id as 'none' | 'complete' | 'subjects'); bump(); }}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                      <Check size={12} strokeWidth={3} className="text-white" />
                    </div>
                  )}
                  <Text size="sm" weight="bold" className={isSelected ? 'text-primary' : 'text-main'}>{opt.label}</Text>
                  <Text size="xs" muted className="mt-3xs leading-snug">{opt.desc}</Text>
                </Card>
              );
            })}
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
            role="switch"
            aria-checked={forumTracking}
            aria-labelledby="toggle-label-forum-tracking"
            onClick={() => { setForumTracking(!forumTracking); bump(); }}
            className={`relative w-11 h-7 rounded-full flex items-center px-3xs transition-colors cursor-pointer after:absolute after:inset-[-12px] focus-visible:outline-none focus-visible:shadow-focus ${forumTracking ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}
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
            role="switch"
            aria-checked={forumAutoSubscribe}
            aria-labelledby="toggle-label-forum-auto-subscribe"
            onClick={() => { setForumAutoSubscribe(!forumAutoSubscribe); bump(); }}
            className={`relative w-11 h-7 rounded-full flex items-center px-3xs transition-colors cursor-pointer after:absolute after:inset-[-12px] focus-visible:outline-none focus-visible:shadow-focus ${forumAutoSubscribe ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${forumAutoSubscribe ? 'ml-auto' : 'ml-0'}`} />
          </button>
        </div>
      </Stack>
    </Stack>
  )
}
