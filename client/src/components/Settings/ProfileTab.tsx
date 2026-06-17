

import { forwardRef, useState, useEffect, useImperativeHandle } from 'react';
import { Sun, Monitor, Moon, Camera, Lock, Check } from 'lucide-react';
import { Avatar, Card, SectionHeader } from '@/components/ui';
import Button from '@/components/ui/Button';
import { FormField } from '@/components/ui';
import { Grid, Stack } from '@/components/Layout/LayoutPrimitives';
import Input from '@/components/ui/Input';
import { Text } from '@/components/ui';
import useStore, { type Theme } from '@/store';
import NotificationsTab from './NotificationsTab';
import LanguageTab from './LanguageTab';
import ForumTab from './ForumTab';
import CalendarTab from './CalendarTab';
import MessagesTab from './MessagesTab';

interface ProfileTabProps {
  onDirtyChange?: (dirty: boolean) => void;
}

export interface ProfileTabHandle {
  commit: () => void;
}

const ProfileTab = forwardRef<ProfileTabHandle, ProfileTabProps>(({ onDirtyChange }, ref) => {
  const store = useStore();
  const t = store.t;
  const theme = store.theme;

  const [draftFirst, setDraftFirst] = useState(store.firstName);
  const [draftLast, setDraftLast] = useState(store.lastName);

  const isDirty = draftFirst !== store.firstName || draftLast !== store.lastName;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useImperativeHandle(ref, () => ({
    commit: () => {
      store.setFirstName(draftFirst);
      store.setLastName(draftLast);
    },
  }), [draftFirst, store]);

  return (
    <Stack gap="lg" className="settings__profile-form max-w-[var(--container-max-width)] animate-fade-in">
      <SectionHeader title={t('settings.profile')} description={t('settings.profile_desc')} className="!mb-0" />
      <Stack direction="row" gap="md" align="center" className="profile-hero pb-lg border-b border-border/50 flex-col sm:flex-row">
        <Avatar name={`${draftFirst} ${draftLast}`} size={96} className="ring-4 ring-primary/10 shrink-0" />
        <Stack gap="xs" className="items-start">
          <Text weight="bold" size="xl" className="text-main">{`${draftFirst} ${draftLast}`}</Text>
          <Button variant="secondary" size="md" pill icon={Camera} className="normal-case tracking-normal font-semibold h-11 min-h-[44px] px-lg">{t('settings.change_photo')}</Button>
          <Text size="2xs" muted>JPG eller PNG · maks. 5 MB</Text>
        </Stack>
      </Stack>
      
      <Grid columns={2} gap="md">
        <Grid.Item span={1}>
          <FormField id="settings-first-name" label={t('settings.first_name')}>
            <Input id="settings-first-name" value={draftFirst} onChange={(e) => setDraftFirst(e.target.value)} />
          </FormField>
        </Grid.Item>
        <Grid.Item span={1}>
          <FormField id="settings-last-name" label={t('settings.last_name')}>
            <Input id="settings-last-name" value={draftLast} onChange={(e) => setDraftLast(e.target.value)} />
          </FormField>
        </Grid.Item>
      </Grid>
      
      <FormField id="settings-email" label={t("settings.email")} helpText={t('settings.email_stads_help')}>
        <div className="relative flex items-center w-full">
          <Input id="settings-email" type="email" defaultValue="jkm@student.aau.dk" disabled className="pr-10 bg-bg-highlight/50 opacity-70 cursor-not-allowed" />
          <div className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none opacity-80">
            <Lock size={15} />
          </div>
        </div>
      </FormField>

      {isDirty && (
        <Text size="sm" className="text-warning font-semibold flex items-center gap-xs">
          Du har ikke-gemte ændringer
        </Text>
      )}
      
      <Stack gap="md" className="appearance-section">
        <Text size="md" weight="bold" className="text-main">{t('settings.appearance')}</Text>
        <Text size="xs" muted className="-mt-sm">Gemmes automatisk</Text>
        <div className="appearance-grid grid grid-cols-1 sm:grid-cols-3 gap-md">
          {[
            { id: 'light', icon: Sun, label: t('theme.light') },
            { id: 'system', icon: Monitor, label: t('theme.system') },
            { id: 'dark', icon: Moon, label: t('theme.dark') }
          ].map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <Card
                as="button"
                key={opt.id}
                variant="outlined"
                interactive
                className={`appearance-card group p-2 rounded-[var(--radius-lg)] active:scale-[0.98] hover:-translate-y-0.5 relative ${isSelected ? 'active border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20' : 'bg-card hover:border-primary/20'}`}
                onClick={() => store.setTheme(opt.id as Theme)}
                aria-pressed={isSelected}
                aria-label={opt.label}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </div>
                )}
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
                  <opt.icon size={14} className={isSelected ? 'text-primary' : 'text-muted'} />
                  <span className={isSelected ? 'text-primary' : 'text-muted'}>{opt.label}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </Stack>
    </Stack>
  );
});
ProfileTab.displayName = 'ProfileTab';
export default ProfileTab;
