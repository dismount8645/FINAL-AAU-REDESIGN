import { useState } from 'react';
import { Card, SectionHeader } from '@/components/ui'
import { Grid, Stack } from '@/components/Layout/LayoutPrimitives';
import Input from '@/components/ui/Input'
import { Text } from '@/components/ui'
import useStore from '@/store'
import AutosaveStatus from './AutosaveStatus'

export default function NotificationsTab() {
  const store = useStore()
  const { notifPrefs, setNotifPrefs, t } = store
  const [changeCount, setChangeCount] = useState(0)

  const bump = () => setChangeCount(c => c + 1)

  return (
    <Stack gap="xl" className="settings__notif-prefs max-w-[var(--container-max-width)] animate-fade-in">
      <SectionHeader title={t('settings.notif_preferences')} description={t('settings.notif_preferences_desc')} className="!mb-0" />
      <AutosaveStatus changeCount={changeCount} />
      <Grid columns={2} gap="md">
        {[
          { id: 'email', label: t('settings.notif_channel_email'), desc: t('settings.notif_channel_email_desc') },
          { id: 'push', label: t('settings.notif_channel_push'), desc: t('settings.notif_channel_push_desc') },
          { id: 'sms', label: t('settings.notif_channel_sms'), desc: t('settings.notif_channel_sms_desc') },
        ].map((ch) => {
          const isOn = notifPrefs[ch.id as keyof typeof notifPrefs];
          return (
            <Grid.Item key={ch.id} span={1}>
              <Card
                variant="outlined"
                className={`hover:border-primary/30 transition-colors ${isOn ? 'border-primary/60' : ''}`}
                onClick={() => { setNotifPrefs((prev) => ({ ...prev, [ch.id]: !prev[ch.id as keyof typeof prev] })); bump(); }}
                role="switch"
                aria-checked={isOn}
              >
                <Card.Body className="p-md">
                  <Stack direction="row" align="center" justify="between">
                    <Stack gap="2xs">
                      <Text weight="bold" size="sm" className="text-main">{ch.label}</Text>
                      <Text muted size="xs">{ch.desc}</Text>
                      {ch.id === 'sms' && (
                        <Text size="2xs" muted className="italic">SMS kræver et registreret telefonnummer.</Text>
                      )}
                    </Stack>
                    <div className={`w-11 h-6 rounded-[var(--radius-pill)] flex items-center px-[var(--space-2xs)] transition-colors ${isOn ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}>
                      <div className={`w-5 h-5 rounded-[var(--radius-pill)] bg-white shadow-[var(--shadow-sm)] transition-all ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </Stack>
                </Card.Body>
              </Card>
            </Grid.Item>
          );
        })}
      </Grid>
      <Stack gap="xs" className="mt-md pt-md border-t border-border">
        <Text weight="bold" size="sm" className="text-main">{t('settings.quiet_hours')}</Text>
        <Text muted size="xs">{t('settings.quiet_hours_desc')}</Text>
        <Text size="2xs" muted className="italic">Gælder notifikationer i de valgte kanaler.</Text>
        <div className="flex items-center gap-md mt-sm">
          <div className="flex items-center gap-xs">
            <label htmlFor="quiet-hours-start" className="text-xs font-semibold text-text-secondary shrink-0">Fra</label>
            <Input id="quiet-hours-start" type="time" step="900" defaultValue="22:00" className="w-32" />
          </div>
          <Text size="sm" muted className="shrink-0">{t('settings.to_label')}</Text>
          <div className="flex items-center gap-xs">
            <label htmlFor="quiet-hours-end" className="text-xs font-semibold text-text-secondary shrink-0">Til</label>
            <Input id="quiet-hours-end" type="time" step="900" defaultValue="07:00" className="w-32" />
          </div>
        </div>
      </Stack>
    </Stack>
  )
}
