import { FormField, SectionHeader } from '@/components/ui'
import { Grid, Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store'
import Select from '@/components/ui/Select'

export default function CalendarTab() {
  const store = useStore()
  const { calendarStartDay, setCalendarStartDay, calendarDefaultView, setCalendarDefaultView, t } = store

  return (
    <Stack gap="xl" className="settings__calendar max-w-[var(--container-max-width)] animate-fade-in">
      <SectionHeader title={t('settings.calendar_prefs')} description={t('settings.calendar_desc')} className="!mb-0" />
      <Grid columns={2} gap="md" className="mt-sm">
        <Grid.Item span={1}>
          <FormField id="pref-first-day" label={t('settings.first_day_of_week')}>
            <Select
              id="pref-first-day"
              value={calendarStartDay}
              onChange={(e) => setCalendarStartDay(e.target.value as 'monday' | 'sunday')}
              className="max-w-[280px]"
            >
              <option value="monday">{t('common.monday')}</option>
              <option value="sunday">{t('days.sun')}</option>
            </Select>
          </FormField>
        </Grid.Item>

        <Grid.Item span={1}>
          <FormField id="pref-default-view" label={t('settings.default_view')}>
            <Select
              id="pref-default-view"
              value={calendarDefaultView}
              onChange={(e) => setCalendarDefaultView(e.target.value as 'month' | 'week' | 'day')}
              className="max-w-[280px]"
            >
              <option value="month">{t('common.month')}</option>
              <option value="week">{t('common.week')}</option>
              <option value="day">{t('common.day')}</option>
            </Select>
          </FormField>
        </Grid.Item>
      </Grid>
    </Stack>
  )
}
