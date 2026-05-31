import FormField from '@/components/ui/FormField'
import Grid from '@/components/ui/Grid'
import useStore from '@/store/useStore'
import SettingsSection from './SettingsSection'

interface CalendarTabProps {
  calendarStartDay: 'monday' | 'sunday'
  setCalendarStartDay: (val: 'monday' | 'sunday') => void
  calendarDefaultView: 'month' | 'week' | 'day'
  setCalendarDefaultView: (val: 'month' | 'week' | 'day') => void
}

export default function CalendarTab({
  calendarStartDay,
  setCalendarStartDay,
  calendarDefaultView,
  setCalendarDefaultView,
}: CalendarTabProps) {
  const t = useStore(state => state.t)

  return (
    <SettingsSection titleKey="settings.calendar_prefs" descKey="settings.calendar_desc" className="settings__calendar max-w-[var(--container-max-width)]">

      <Grid columns={2} gap="md" className="mt-sm">
        <Grid.Item span={1} mobileSpan={2}>
          <FormField id="pref-first-day" label={t('settings.first_day_of_week')}>
            <select
              id="pref-first-day"
              value={calendarStartDay}
              onChange={(e) => setCalendarStartDay(e.target.value as 'monday' | 'sunday')}
              className="w-[100%] max-w-[280px] p-sm border border-border bg-card text-main rounded-[var(--radius-lg)] text-sm focus-visible:outline-none focus-visible:shadow-focus"
            >
              <option value="monday">{t('common.monday')}</option>
              <option value="sunday">{t('days.sun')}</option>
            </select>
          </FormField>
        </Grid.Item>

        <Grid.Item span={1} mobileSpan={2}>
          <FormField id="pref-default-view" label={t('settings.default_view')}>
            <select
              id="pref-default-view"
              value={calendarDefaultView}
              onChange={(e) => setCalendarDefaultView(e.target.value as 'month' | 'week' | 'day')}
              className="w-[100%] max-w-[280px] p-sm border border-border bg-card text-main rounded-[var(--radius-lg)] text-sm focus-visible:outline-none focus-visible:shadow-focus"
            >
              <option value="month">{t('common.month')}</option>
              <option value="week">{t('common.week')}</option>
              <option value="day">{t('common.day')}</option>
            </select>
          </FormField>
        </Grid.Item>
      </Grid>
    </SettingsSection>
  )
}
