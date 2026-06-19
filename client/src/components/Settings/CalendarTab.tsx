import { useState } from 'react';
import { FormField, SectionHeader, Select } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store'
import AutosaveStatus from './AutosaveStatus'

export default function CalendarTab() {
  const store = useStore()
  const { calendarStartDay, setCalendarStartDay, calendarDefaultView, setCalendarDefaultView, t } = store
  const [changeCount, setChangeCount] = useState(0)

  const bump = () => setChangeCount(c => c + 1)

  return (
    <Stack gap="lg" className="settings__calendar max-w-[36rem] animate-fade-in">
      <SectionHeader title={t('settings.calendar_prefs')} description={t('settings.calendar_desc')} className="!mb-0" />
      <AutosaveStatus changeCount={changeCount} />
      <Stack gap="md" className="mt-xs">
        <FormField id="pref-first-day" label={t('settings.first_day_of_week')}>
          <Select
            id="pref-first-day"
            value={calendarStartDay}
            onChange={(e) => { setCalendarStartDay(e.target.value as 'monday' | 'sunday'); bump(); }}
            className="max-w-[280px]"
          >
            <option value="monday">{t('common.monday')}</option>
            <option value="sunday">{t('days.sun')}</option>
          </Select>
        </FormField>

        <FormField id="pref-default-view" label={t('settings.default_view')}>
          <Select
            id="pref-default-view"
            value={calendarDefaultView}
            onChange={(e) => { setCalendarDefaultView(e.target.value as 'month' | 'week' | 'day'); bump(); }}
            className="max-w-[280px]"
          >
            <option value="month">{t('common.month')}</option>
            <option value="week">{t('common.week')}</option>
            <option value="day">{t('common.day')}</option>
          </Select>
        </FormField>
      </Stack>
    </Stack>
  )
}
