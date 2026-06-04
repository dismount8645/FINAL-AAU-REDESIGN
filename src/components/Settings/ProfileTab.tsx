import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sun, Monitor, Moon, Camera } from 'lucide-react';
import NotificationsTab from './NotificationsTab';
import LanguageTab from './LanguageTab';
import ForumTab from './ForumTab';
import CalendarTab from './CalendarTab';
import MessagesTab from './MessagesTab';
import SettingsSection from './SettingsSection';
import Avatar from '@/components/Avatar';
import Button from '@/components/ui/Button';
import { FormField } from '@/components/FormControls';
import { Grid } from '@/components/LayoutPrimitives';
import Input from '@/components/ui/Input';
import { Stack } from '@/components/LayoutPrimitives';
import { Text } from '@/components/Typography';
import useStore, { type Theme } from '@/lib/store';
import { useUserStore } from '@/store/userStore';

interface ProfileTabProps {
  firstName?: string;
  setFirstName?: (val: string) => void;
  lastName?: string;
  setLastName?: (val: string) => void;
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
}

export default function ProfileTab(props: ProfileTabProps) {
  const store = useUserStore();
  const firstName = props.firstName ?? store.firstName;
  const setFirstName = props.setFirstName ?? store.setFirstName;
  const lastName = props.lastName ?? store.lastName;
  const setLastName = props.setLastName ?? store.setLastName;
  const theme = props.theme ?? store.theme;
  const setTheme = props.setTheme ?? store.setTheme;

  const t = useStore(state => state.t)

  return (
    <SettingsSection titleKey="settings.profile" descKey="settings.profile_desc" className="settings__profile-form max-w-[var(--container-max-width)]">
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
              className={`appearance-card group border-2 transition-all duration-150 p-2 rounded-[var(--radius-lg)] active:scale-[0.98] focus-visible:outline-none focus-visible:shadow-focus hover:-translate-y-0.5 ${theme === opt.id ? 'active border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/20'}`}
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
    </SettingsSection>
  )
}

let mockToast: any
if (import.meta.vitest) {
  // Mock useToast
  mockToast = {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }
  
  vi.mock('@/components/Toast', async () => {
    const actual = await vi.importActual('@/components/Toast')
    return {
      ...actual,
      useToast: () => mockToast,
    }
  })
  describe('Settings Tabs Components', () => {
    beforeEach(() => {
      useStore.setState({ lang: 'da' })
    })
  
    describe('ProfileTab', () => {
      it('renders profile fields and calls handlers', () => {
        const setFirstName = vi.fn()
        const setLastName = vi.fn()
        const setTheme = vi.fn()
  
        render(
          <ProfileTab
            firstName="First"
            lastName="Last"
            theme="light"
            setFirstName={setFirstName}
            setLastName={setLastName}
            setTheme={setTheme}
          />
        )
  
        expect(screen.getByDisplayValue('First')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Last')).toBeInTheDocument()
        expect(screen.getByText('Skift profilbillede')).toBeInTheDocument()
  
        const firstInput = screen.getByLabelText('Fornavn')
        fireEvent.change(firstInput, { target: { value: 'NewFirst' } })
        expect(setFirstName).toHaveBeenCalledWith('NewFirst')
  
        const darkThemeButton = screen.getByLabelText('Mørk')
        fireEvent.click(darkThemeButton)
        expect(setTheme).toHaveBeenCalledWith('dark')
      })
    })
  
    describe('NotificationsTab', () => {
      it('renders notification options and handles switch clicks', () => {
        const setNotifPrefs = vi.fn()
        const notifPrefs = { email: true, push: false, sms: false }
  
        render(
          <NotificationsTab
            notifPrefs={notifPrefs}
            setNotifPrefs={setNotifPrefs}
          />
        )
  
        expect(screen.getByText('Email')).toBeInTheDocument()
        expect(screen.getByText('Push')).toBeInTheDocument()
  
        const emailSwitch = screen.getAllByRole('switch')[0]
        fireEvent.click(emailSwitch)
        expect(setNotifPrefs).toHaveBeenCalled()
  
        fireEvent.keyDown(emailSwitch, { key: 'Enter' })
        expect(setNotifPrefs).toHaveBeenCalled()
      })
    })
  
    describe('LanguageTab', () => {
      it('renders language choices and handles selection', () => {
        const setLang = vi.fn()
  
        render(
          <LanguageTab
            lang="da"
            setLang={setLang}
          />
        )
  
        expect(screen.getByText('Dansk (Danish)')).toBeInTheDocument()
        expect(screen.getByText('English (English)')).toBeInTheDocument()
  
        fireEvent.click(screen.getByText('English (English)'))
        expect(setLang).toHaveBeenCalledWith('en')
      })
    })
  
    describe('ForumTab', () => {
      it('renders forum configuration settings and calls handlers', () => {
        const setForumDigest = vi.fn()
        const setForumTracking = vi.fn()
        const setForumAutoSubscribe = vi.fn()
  
        render(
          <ForumTab
            forumDigest="complete"
            forumTracking={true}
            forumAutoSubscribe={false}
            setForumDigest={setForumDigest}
            setForumTracking={setForumTracking}
            setForumAutoSubscribe={setForumAutoSubscribe}
          />
        )
  
        expect(screen.getByText('E-mail opsamlingstype')).toBeInTheDocument()
        
        const noneBtn = screen.getByText('Ingen opsamling')
        fireEvent.click(noneBtn)
        expect(setForumDigest).toHaveBeenCalledWith('none')
  
        const trackingToggle = screen.getByLabelText('Forumsporing')
        fireEvent.click(trackingToggle)
        expect(setForumTracking).toHaveBeenCalledWith(false)
  
        const autoSubscribeToggle = screen.getByLabelText('Automatisk abonnement')
        fireEvent.click(autoSubscribeToggle)
        expect(setForumAutoSubscribe).toHaveBeenCalledWith(true)
      })
    })
  
    describe('CalendarTab', () => {
      it('renders calendar dropdown settings and calls handlers', () => {
        const setCalendarStartDay = vi.fn()
        const setCalendarDefaultView = vi.fn()
  
        render(
          <CalendarTab
            calendarStartDay="monday"
            calendarDefaultView="month"
            setCalendarStartDay={setCalendarStartDay}
            setCalendarDefaultView={setCalendarDefaultView}
          />
        )
  
        expect(screen.getByText('Ugens første dag')).toBeInTheDocument()
        expect(screen.getByText('Standard visning')).toBeInTheDocument()
  
        const startDaySelect = screen.getAllByRole('combobox')[0]
        fireEvent.change(startDaySelect, { target: { value: 'sunday' } })
        expect(setCalendarStartDay).toHaveBeenCalledWith('sunday')
  
        const defaultViewSelect = screen.getAllByRole('combobox')[1]
        fireEvent.change(defaultViewSelect, { target: { value: 'week' } })
        expect(setCalendarDefaultView).toHaveBeenCalledWith('week')
      })
    })
  
    describe('MessagesTab', () => {
      it('renders message privacy controls and calls handlers', () => {
        const setMessagePrivacy = vi.fn()
        const setMessageEmailOffline = vi.fn()
  
        render(
          <MessagesTab
            messagePrivacy="courses"
            messageEmailOffline={true}
            setMessagePrivacy={setMessagePrivacy}
            setMessageEmailOffline={setMessageEmailOffline}
          />
        )
  
        expect(screen.getByText('Hvem kan kontakte mig')).toBeInTheDocument()
        
        const radio = screen.getByLabelText(/Kun mine kontakter/i)
        fireEvent.click(radio)
        expect(setMessagePrivacy).toHaveBeenCalledWith('contacts')
  
        const emailSwitch = screen.getByRole('switch')
        fireEvent.click(emailSwitch)
        expect(setMessageEmailOffline).toHaveBeenCalled()
      })
    })
  })
}
