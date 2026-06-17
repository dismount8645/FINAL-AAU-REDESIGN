import type { SettingsData, SubmissionData, SupportFormData } from '@/lib/types';
import { isRetryableError, getCsrfToken, buildHeaders, withTimeout, withRetry, handleResponse } from './utils';

class ApiClient {
  private baseUrl: string
  private useMocks: boolean
  private timeoutMs: number

  constructor(baseUrl = '/api', useMocks = true, timeoutMs = 10000) {
    this.baseUrl = baseUrl
    this.useMocks = useMocks
    this.timeoutMs = timeoutMs
  }

  setUseMocks(value: boolean) {
    this.useMocks = value
  }

  setTimeout(ms: number) {
    this.timeoutMs = ms
  }

  async get<T>(endpoint: string, mockFallback?: () => T): Promise<T> {
    if (this.useMocks && mockFallback) return mockFallback()
    return withRetry(() =>
      withTimeout(
        fetch(`${this.baseUrl}${endpoint}`, {
          credentials: 'same-origin',
          headers: buildHeaders(false),
        }).then(res => handleResponse<T>(res)),
        this.timeoutMs,
      ),
    )
  }

  async post<T>(endpoint: string, body: unknown, mockFallback?: () => T): Promise<T> {
    if (this.useMocks && mockFallback) return mockFallback()
    return withRetry(() =>
      withTimeout(
        fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          credentials: 'same-origin',
          headers: buildHeaders(true),
          body: JSON.stringify(body),
        }).then(res => handleResponse<T>(res)),
        this.timeoutMs,
      ),
    )
  }

  async put<T>(endpoint: string, body: unknown, mockFallback?: () => T): Promise<T> {
    if (this.useMocks && mockFallback) return mockFallback()
    return withRetry(() =>
      withTimeout(
        fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PUT',
          credentials: 'same-origin',
          headers: buildHeaders(true),
          body: JSON.stringify(body),
        }).then(res => handleResponse<T>(res)),
        this.timeoutMs,
      ),
    )
  }

  async delete<T>(endpoint: string, mockFallback?: () => T): Promise<T> {
    if (this.useMocks && mockFallback) return mockFallback()
    return withRetry(() =>
      withTimeout(
        fetch(`${this.baseUrl}${endpoint}`, {
          method: 'DELETE',
          credentials: 'same-origin',
          headers: buildHeaders(false),
        }).then(res => handleResponse<T>(res)),
        this.timeoutMs,
      ),
    )
  }
}

export { ApiClient }

export const api = new ApiClient()

export const saveSettings = (data: SettingsData) =>
  api.put('/settings', data, () => ({ success: true }))

export const submitAssignment = (data: SubmissionData) =>
  api.post('/submissions', data, () => ({ success: true, submissionId: 'MOCK-001' }))

export const submitSupportTicket = (data: SupportFormData) =>
  api.post('/support/tickets', data, () => ({ success: true, ticketId: 'MOCK-001' }))
