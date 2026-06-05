import { FormField } from '@/components/ui'
import { Grid } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store'
import SettingsSection from './SettingsSection'
import Select from '@/components/ui/Select'
import { useUserStore } from '@/store/userStore'

interface CalendarTabProps {
  calendarStartDay?: 'monday' | 'sunday'
  setCalendarStartDay?: (val: 'monday' | 'sunday') => void
  calendarDefaultView?: 'month' | 'week' | 'day'
  setCalendarDefaultView?: (val: 'month' | 'week' | 'day') => void
}

export default function CalendarTab(props: CalendarTabProps) {
  const store = useUserStore()
  const calendarStartDay = props.calendarStartDay ?? store.calendarStartDay
  const setCalendarStartDay = props.setCalendarStartDay ?? store.setCalendarStartDay
  const calendarDefaultView = props.calendarDefaultView ?? store.calendarDefaultView
  const setCalendarDefaultView = props.setCalendarDefaultView ?? store.setCalendarDefaultView

  const t = useStore(state => state.t)

  return (
    <SettingsSection titleKey="settings.calendar_prefs" descKey="settings.calendar_desc" className="settings__calendar max-w-[var(--container-max-width)]">

      <Grid columns={2} gap="md" className="mt-sm">
        <Grid.Item span={1} mobileSpan={2}>
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

        <Grid.Item span={1} mobileSpan={2}>
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
    </SettingsSection>
  )
}
