import { api } from '@/api'
import type { SettingsData } from '@/types'

export const saveSettings = (data: SettingsData) =>
  api.put('/settings', data, () => ({ success: true }))
