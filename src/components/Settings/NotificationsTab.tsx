import Card from '@/components/Card'
import { Grid } from '@/components/LayoutPrimitives'
import { Stack } from '@/components/LayoutPrimitives'
import Input from '@/components/ui/Input'
import { Text } from '@/components/Typography'
import useStore from '@/lib/store'
import SettingsSection from './SettingsSection'
import { useUserStore } from '@/store/userStore'

interface NotificationsTabProps {
  notifPrefs?: { email: boolean; push: boolean; sms: boolean }
  setNotifPrefs?: (prefs: { email: boolean; push: boolean; sms: boolean } | ((prev: { email: boolean; push: boolean; sms: boolean }) => { email: boolean; push: boolean; sms: boolean })) => void
}

export default function NotificationsTab(props: NotificationsTabProps) {
  const store = useUserStore()
  const notifPrefs = props.notifPrefs ?? store.notifPrefs
  const setNotifPrefs = props.setNotifPrefs ?? store.setNotifPrefs
  const t = useStore(state => state.t)

  return (
    <SettingsSection titleKey="settings.notif_preferences" descKey="settings.notif_preferences_desc" className="settings__notif-prefs max-w-[var(--container-max-width)]">
      <Grid columns={2} gap="md">
        {[
          { id: 'email', label: t('settings.notif_channel_email'), desc: t('settings.notif_channel_email_desc') },
          { id: 'push', label: t('settings.notif_channel_push'), desc: t('settings.notif_channel_push_desc') },
          { id: 'sms', label: t('settings.notif_channel_sms'), desc: t('settings.notif_channel_sms_desc') },
        ].map((ch) => (
          <Grid.Item key={ch.id} span={1} mobileSpan={2}>
            <Card
              variant="outlined"
              className="hover:border-primary/30 transition-colors"
              onClick={() => setNotifPrefs((prev) => ({ ...prev, [ch.id]: !prev[ch.id as keyof typeof prev] }))}
              role="switch"
              aria-checked={notifPrefs[ch.id as keyof typeof notifPrefs]}
            >
              <Card.Body className="p-md">
                <Stack direction="row" align="center" justify="between">
                  <Stack gap="2xs">
                    <Text weight="bold" size="sm" className="text-main">{ch.label}</Text>
                    <Text muted size="xs">{ch.desc}</Text>
                  </Stack>
                  <div className={`w-11 h-6 rounded-[var(--radius-pill)] flex items-center px-[var(--space-2xs)] transition-colors ${notifPrefs[ch.id as keyof typeof notifPrefs] ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}>
                    <div className={`w-5 h-5 rounded-[var(--radius-pill)] bg-white shadow-[var(--shadow-sm)] transition-all ${notifPrefs[ch.id as keyof typeof notifPrefs] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </Stack>
              </Card.Body>
            </Card>
          </Grid.Item>
        ))}
      </Grid>
      <Stack gap="xs" className="mt-md pt-md border-t border-border">
        <Text weight="bold" size="sm" className="text-main">{t('settings.quiet_hours')}</Text>
        <Text muted size="xs">{t('settings.quiet_hours_desc')}</Text>
        <div className="flex items-center gap-md mt-sm">
          <label htmlFor="quiet-hours-start" className="sr-only">{t('settings.start_time')}</label>
          <Input id="quiet-hours-start" type="time" defaultValue="22:00" />
          <Text size="sm" muted>{t('settings.to_label')}</Text>
          <label htmlFor="quiet-hours-end" className="sr-only">{t('settings.end_time')}</label>
          <Input id="quiet-hours-end" type="time" defaultValue="07:00" />
        </div>
      </Stack>
    </SettingsSection>
  )
}
