import { api } from '@/api'
import type { SupportFormData } from '@/types'

export const submitSupportTicket = (data: SupportFormData) =>
  api.post('/support/tickets', data, () => ({ success: true, ticketId: 'MOCK-001' }))
