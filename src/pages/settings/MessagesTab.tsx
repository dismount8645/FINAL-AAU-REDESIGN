import FormField from '@/components/ui/FormField'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import SettingsSection from './SettingsSection'

interface MessagesTabProps {
  messagePrivacy: 'contacts' | 'courses' | 'anyone'
  setMessagePrivacy: (val: 'contacts' | 'courses' | 'anyone') => void
  messageEmailOffline: boolean
  setMessageEmailOffline: (val: boolean) => void
}

export default function MessagesTab({
  messagePrivacy,
  setMessagePrivacy,
  messageEmailOffline,
  setMessageEmailOffline,
}: MessagesTabProps) {
  const t = useStore(state => state.t)

  return (
    <SettingsSection titleKey="settings.message_prefs" descKey="settings.message_desc" className="settings__messages max-w-[var(--container-max-width)]">

      <Stack gap="lg" className="mt-sm">
        <FormField label={t('settings.who_can_contact')}>
          <div className="flex flex-col gap-sm">
            {[
              { id: 'contacts', title: t('settings.privacy_contacts'), desc: t('settings.privacy_contacts_desc') },
              { id: 'courses', title: t('settings.privacy_courses'), desc: t('settings.privacy_courses_desc') },
              { id: 'anyone', title: t('settings.privacy_anyone'), desc: t('settings.privacy_anyone_desc') }
            ].map(item => (
              <label key={item.id} htmlFor={`msgPrivacy-${item.id}`} className="flex gap-md p-md rounded-xl border border-border cursor-pointer hover:bg-bg-hover transition-colors">
                <input 
                  id={`msgPrivacy-${item.id}`}
                  type="radio" 
                  name="msgPrivacy" 
                  checked={messagePrivacy === item.id}
                  onChange={() => setMessagePrivacy(item.id as 'contacts' | 'courses' | 'anyone')}
                  className="mt-3xs cursor-pointer"
                />
                <div>
                  <Text size="sm" weight="bold" className="text-main">{item.title}</Text>
                  <Text size="xs" muted className="mt-3xs leading-normal">{item.desc}</Text>
                </div>
              </label>
            ))}
          </div>
        </FormField>

        <div className="border-t border-border pt-md flex items-center justify-between pointer-events-auto">
          <Stack gap="2xs" className="max-w-[75%]">
            <Text id="toggle-label-message-email-copies" weight="semibold" size="sm" className="text-main">
              {t('settings.email_copies')}
            </Text>
            <Text size="xs" muted>
              {t('settings.email_copies_desc')}
            </Text>
          </Stack>
          <button
            type="button"
            role="switch"
            aria-checked={messageEmailOffline}
            aria-labelledby="toggle-label-message-email-copies"
            onClick={() => setMessageEmailOffline(!messageEmailOffline)}
            className={`relative w-11 h-7 rounded-full flex items-center px-3xs transition-colors cursor-pointer after:absolute after:inset-[-12px] focus-visible:outline-none focus-visible:shadow-focus ${messageEmailOffline ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${messageEmailOffline ? 'ml-auto' : 'ml-0'}`} />
          </button>
        </div>
      </Stack>
    </SettingsSection>
  )
}
