import { api } from '@/api'
import type { SubmissionData } from '@/types'

export const submitAssignment = (data: SubmissionData) =>
  api.post('/submissions', data, () => ({ success: true, submissionId: 'MOCK-001' }))
