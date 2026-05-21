import { api } from "@/api/index";
import { defaultEvents } from "@/data/mockData";
import type { CalendarEvents } from '@/types'

export const calendarApi = {
  getAll() {
    return api.get<CalendarEvents>('/calendar/events', () => defaultEvents)
  },
}
