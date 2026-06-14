import { useState } from 'react';
import { Card, FormField, SectionHeader } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text } from '@/components/ui'
import useStore from '@/store'
import Radio from '@/components/ui/Radio'
import AutosaveStatus from './AutosaveStatus'

export default function MessagesTab() {
  const store = useStore()
  const { messagePrivacy, setMessagePrivacy, messageEmailOffline, setMessageEmailOffline, t } = store
  const [changeCount, setChangeCount] = useState(0)

  const bump = () => setChangeCount(c => c + 1)

  return (
    <Stack gap="lg" className="settings__messages max-w-[36rem] animate-fade-in">
      <SectionHeader title={t('settings.message_prefs')} description={t('settings.message_desc')} className="!mb-0" />
      <AutosaveStatus changeCount={changeCount} />
      <Stack gap="lg" className="mt-sm">
        <FormField label={t('settings.who_can_contact')}>
          <div className="flex flex-col gap-sm">
            {[
              { id: 'contacts', title: t('settings.privacy_contacts'), desc: t('settings.privacy_contacts_desc') },
              { id: 'courses', title: t('settings.privacy_courses'), desc: t('settings.privacy_courses_desc') },
              { id: 'anyone', title: t('settings.privacy_anyone'), desc: t('settings.privacy_anyone_desc') }
            ].map(item => (
              <Card
                key={item.id}
                variant="outlined"
                className="flex-row gap-md p-md hover:bg-bg-hover transition-colors"
              >
                <Radio 
                  id={`msgPrivacy-${item.id}`}
                  name="msgPrivacy" 
                  checked={messagePrivacy === item.id}
                  onChange={() => { setMessagePrivacy(item.id as 'contacts' | 'courses' | 'anyone'); bump(); }}
                  className="mt-3xs"
                />
                <label htmlFor={`msgPrivacy-${item.id}`} className="cursor-pointer flex-1 select-none">
                  <Text size="sm" weight="bold" className="text-main">{item.title}</Text>
                  <Text size="xs" muted className="mt-3xs leading-normal">{item.desc}</Text>
                </label>
              </Card>
            ))}
          </div>
        </FormField>

        <div className="border-t border-border pt-md flex items-center justify-between pointer-events-auto">
          <Stack gap="2xs" className="max-w-[75%]">
            <Text id="toggle-label-message-email-copies" weight="semibold" size="sm" className="text-main">
              {t('settings.email_copies')}
            </Text>
            <Text size="xs" muted>
              Send e-mailkopier af private beskeder, når du er offline.
            </Text>
          </Stack>
          <button
            type="button"
            role="switch"
            aria-checked={messageEmailOffline}
            aria-labelledby="toggle-label-message-email-copies"
            onClick={() => { setMessageEmailOffline(!messageEmailOffline); bump(); }}
            className={`relative w-11 h-7 rounded-full flex items-center px-3xs transition-colors cursor-pointer after:absolute after:inset-[-12px] focus-visible:outline-none focus-visible:shadow-focus ${messageEmailOffline ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${messageEmailOffline ? 'ml-auto' : 'ml-0'}`} />
          </button>
        </div>
      </Stack>
    </Stack>
  )
}
