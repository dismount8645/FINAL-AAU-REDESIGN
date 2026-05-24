import { Sun, Monitor, Moon, Camera } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import FormField from '@/components/ui/FormField'
import Avatar from '@/components/ui/Avatar'
import Grid from '@/components/ui/Grid'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import useStore, { type Theme } from '@/store/useStore'

interface ProfileTabProps {
  firstName: string
  setFirstName: (val: string) => void
  lastName: string
  setLastName: (val: string) => void
  theme: Theme
  setTheme: (theme: Theme) => void
}

export default function ProfileTab({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  theme,
  setTheme,
}: ProfileTabProps) {
  const t = useStore(state => state.t)

  return (
    <Stack gap="2xl" className="settings__profile-form max-w-[var(--container-max-width)]">
      <Stack direction="row" gap="lg" align="start" className="profile-hero pb-xl border-b border-border/50 flex-col sm:flex-row">
        <Avatar name={`${firstName} ${lastName}`} size={96} className="ring-4 ring-primary/10 shrink-0" />
        <Stack gap="sm" className="items-start">
          <Text weight="bold" size="xl" className="text-main">{`${firstName} ${lastName}`}</Text>
          <Button variant="secondary" size="sm" pill icon={Camera}>{t('settings.change_photo')}</Button>
        </Stack>
      </Stack>
      
      <Grid columns={2} gap="md">
        <Grid.Item span={1} mobileSpan={2}>
          <FormField id="settings-first-name" label={t('settings.first_name')}>
            <Input id="settings-first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </FormField>
        </Grid.Item>
        <Grid.Item span={1} mobileSpan={2}>
          <FormField id="settings-last-name" label={t('settings.last_name')}>
            <Input id="settings-last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </FormField>
        </Grid.Item>
      </Grid>
      
      <FormField id="settings-email" label={t("settings.email")} helpText={t('settings.email_stads_help')}>
        <Input id="settings-email" type="email" defaultValue="jkm@student.aau.dk" disabled />
      </FormField>
      
      <Stack gap="md" className="appearance-section mt-md">
        <Text size="md" weight="bold" className="text-main">{t('settings.appearance')}</Text>
        <div className="appearance-grid grid grid-cols-1 sm:grid-cols-3 gap-md">
          {[
            { id: 'light', icon: Sun, label: t('theme.light') },
            { id: 'system', icon: Monitor, label: t('theme.system') },
            { id: 'dark', icon: Moon, label: t('theme.dark') }
          ].map((opt) => (
            <button
              key={opt.id}
              className={`appearance-card group border-2 transition-all duration-200 p-2 rounded-[var(--radius-lg)] ${theme === opt.id ? 'active border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/20'}`}
              onClick={() => setTheme(opt.id as Theme)}
              aria-pressed={theme === opt.id}
              aria-label={opt.label}
            >
              <div className={`appearance-preview appearance-preview--${opt.id} border border-border rounded-[var(--radius-md)] overflow-hidden bg-bg-body aspect-video`}>
                <div className={`preview-topbar h-2 ${opt.id === 'dark' ? 'bg-slate-800' : 'bg-aau-blue'}`} />
                <div className="flex flex-1 h-full">
                  <div className={`preview-sidebar w-4 h-full border-r border-border ${opt.id === 'dark' ? 'bg-slate-900' : 'bg-bg-sidebar'}`} />
                  <div className="preview-content p-2 flex flex-col gap-1.5 flex-1">
                    <div className="preview-line h-1 w-4/5 bg-border rounded-full" />
                    <div className="preview-line h-1 w-3/5 bg-border rounded-full" />
                    <div className="preview-line h-1 w-2/5 bg-border rounded-full" />
                  </div>
                </div>
              </div>
              <div className="appearance-label flex items-center gap-sm mt-sm text-sm font-semibold">
                <opt.icon size={14} className={theme === opt.id ? 'text-primary' : 'text-muted'} />
                <span className={theme === opt.id ? 'text-primary' : 'text-muted'}>{opt.label}</span>
              </div>
            </button>
          ))}
        </div>
      </Stack>
    </Stack>
  )
}
