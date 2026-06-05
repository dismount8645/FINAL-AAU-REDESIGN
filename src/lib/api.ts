
import { API_RETRY_BACKOFF } from '@/lib';
import type { SettingsData, SubmissionData, SupportFormData } from '@/lib/types';

function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError) return true
  if (error instanceof DOMException) return true
  if (error instanceof Error) {
    const msg = error.message
    if (msg.startsWith('API Error: 5')) return true
    if (msg === 'Request timeout') return true
  }
  return false
}

let cachedCsrfToken: string | null | undefined = undefined;

function getCsrfToken(selector = 'meta[name="csrf-token"]'): string | null {
  if (cachedCsrfToken !== undefined) return cachedCsrfToken;
  if (typeof document === 'undefined') return null;
  const meta = document.querySelector<HTMLMetaElement>(selector)
  cachedCsrfToken = meta?.content || null;
  return cachedCsrfToken;
}

function buildHeaders(hasBody: boolean): HeadersInit {
  const headers: Record<string, string> = {}
  if (hasBody) headers['Content-Type'] = 'application/json'
  const token = getCsrfToken()
  if (token) headers['X-CSRF-Token'] = token
  return headers
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Request timeout')), ms)
    promise.then(
      (v) => { clearTimeout(timer); resolve(v) },
      (e) => { clearTimeout(timer); reject(e) },
    )
  })
}

function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  const backoff = (attempt: number) => API_RETRY_BACKOFF[attempt] || 5000

  const attempt = (n: number): Promise<T> =>
    fn().catch((error) => {
      if (n >= maxRetries || !isRetryableError(error)) throw error
      return new Promise<T>((r) => setTimeout(r, backoff(n)))
        .then(() => attempt(n + 1))
    })

  return attempt(0)
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body = ''
    try { body = await res.text() } catch { /* ignore */ }
    throw new Error(`API Error: ${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 200)}` : ''}`)
  }
  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return res.json()
  }
  const text = await res.text()
  if (!text) return undefined as T
  try { return JSON.parse(text) as T } catch {
    throw new Error(`Expected JSON but got: ${text.slice(0, 100)}`)
  }
}

export class ApiClient {
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

export const api = new ApiClient()

export const saveSettings = (data: SettingsData) =>
  api.put('/settings', data, () => ({ success: true }))

export const submitAssignment = (data: SubmissionData) =>
  api.post('/submissions', data, () => ({ success: true, submissionId: 'MOCK-001' }))

export const submitSupportTicket = (data: SupportFormData) =>
  api.post('/support/tickets', data, () => ({ success: true, ticketId: 'MOCK-001' }))

/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  describe('isRetryableError', () => {
    it('returns true for TypeError (network errors)', () => {
      expect(isRetryableError(new TypeError('Failed to fetch'))).toBe(true)
    })
  
    it('returns true for DOMException', () => {
      expect(isRetryableError(new DOMException('Abort'))).toBe(true)
    })
  
    it('returns true for 5xx API errors', () => {
      expect(isRetryableError(new Error('API Error: 502 Bad Gateway'))).toBe(true)
    })
  
    it('returns false for 4xx API errors', () => {
      expect(isRetryableError(new Error('API Error: 404 Not Found'))).toBe(false)
      expect(isRetryableError(new Error('API Error: 401 Unauthorized'))).toBe(false)
    })
  
    it('returns true for timeout error', () => {
      expect(isRetryableError(new Error('Request timeout'))).toBe(true)
    })
  
    it('returns false for generic errors', () => {
      expect(isRetryableError(new Error('Something else'))).toBe(false)
    })
  })

  describe('getCsrfToken', () => {
    beforeEach(() => {
      cachedCsrfToken = undefined
      document.querySelector('meta[name="csrf-token"]')?.remove()
    })

    it('returns the csrf token value from meta tag', () => {
      const meta = document.createElement('meta')
      meta.name = 'csrf-token'
      meta.content = 'test-csrf-token-123'
      document.head.appendChild(meta)
      expect(getCsrfToken()).toBe('test-csrf-token-123')
      meta.remove()
    })

    it('returns null when no csrf meta tag exists', () => {
      expect(getCsrfToken()).toBeNull()
    })
  })

  describe('buildHeaders', () => {
    beforeEach(() => {
      cachedCsrfToken = undefined
      document.querySelector('meta[name="csrf-token"]')?.remove()
    })

    it('includes Content-Type when hasBody is true', () => {
      const headers = buildHeaders(true) as Record<string, string>
      expect(headers['Content-Type']).toBe('application/json')
    })

    it('omits Content-Type when hasBody is false', () => {
      const headers = buildHeaders(false) as Record<string, string>
      expect(headers['Content-Type']).toBeUndefined()
    })

    it('includes X-CSRF-Token when csrf meta tag exists', () => {
      const meta = document.createElement('meta')
      meta.name = 'csrf-token'
      meta.content = 'my-token'
      document.head.appendChild(meta)
      const headers = buildHeaders(true) as Record<string, string>
      expect(headers['X-CSRF-Token']).toBe('my-token')
      meta.remove()
    })

    it('omits X-CSRF-Token when no csrf meta tag', () => {
      const headers = buildHeaders(true) as Record<string, string>
      expect(headers['X-CSRF-Token']).toBeUndefined()
    })
  })

  describe('withTimeout', () => {
    it('resolves with the promise value when it completes in time', async () => {
      const result = await withTimeout(Promise.resolve('ok'), 1000)
      expect(result).toBe('ok')
    })
  
    it('rejects with timeout error when promise takes too long', async () => {
      const slow = new Promise((r) => setTimeout(r, 500))
      await expect(withTimeout(slow, 50)).rejects.toThrow('Request timeout')
    })
  })

  describe('handleResponse', () => {
    it('parses JSON response when content-type is application/json', async () => {
      const res = new Response(JSON.stringify({ data: 'test' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
      const result = await handleResponse<{ data: string }>(res)
      expect(result).toEqual({ data: 'test' })
    })

    it('returns undefined for empty non-JSON responses', async () => {
      const res = new Response('', { status: 200 })
      const result = await handleResponse(res)
      expect(result).toBeUndefined()
    })

    it('throws on non-ok responses with status code', async () => {
      const res = new Response('Not Found', { status: 404, statusText: 'Not Found' })
      await expect(handleResponse(res)).rejects.toThrow('API Error: 404')
    })

    it('throws on non-ok response with body in error message', async () => {
      const res = new Response('Validation failed', { status: 422, statusText: 'Unprocessable' })
      await expect(handleResponse(res)).rejects.toThrow('API Error: 422 Unprocessable — Validation failed')
    })

    it('throws when non-JSON response cannot be parsed as JSON', async () => {
      const res = new Response('plain text', { status: 200 })
      await expect(handleResponse(res)).rejects.toThrow('Expected JSON but got: plain text')
    })
  })

  describe('withRetry', () => {
    it('resolves on first successful attempt', async () => {
      const fn = vi.fn().mockResolvedValue('ok')
      await expect(withRetry(fn)).resolves.toBe('ok')
      expect(fn).toHaveBeenCalledTimes(1)
    })
  
    it('retries on retryable errors', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockResolvedValueOnce('ok')
      await expect(withRetry(fn)).resolves.toBe('ok')
      expect(fn).toHaveBeenCalledTimes(2)
    })
  
    it('does not retry on non-retryable errors', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('API Error: 404 Not Found'))
      await expect(withRetry(fn)).rejects.toThrow('API Error: 404 Not Found')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('throws when all retries are exhausted', async () => {
      const fn = vi.fn().mockRejectedValue(new TypeError('Network error'))
      await expect(withRetry(fn, 1)).rejects.toThrow('Network error')
      expect(fn).toHaveBeenCalledTimes(2)
    }, 10000)
  })

  describe('ApiClient', () => {
    let client: ApiClient
  
    beforeEach(() => {
      client = new ApiClient()
    })
  
    describe('get', () => {
      it('returns mock data when useMocks is true and mockFallback is provided', async () => {
        const data = await client.get('/courses', () => [{ id: 1 }])
        expect(data).toEqual([{ id: 1 }])
      })
  
      it('throws when useMocks is false and fetch fails with a client error', async () => {
        client.setUseMocks(false)
        const originalFetch = globalThis.fetch
        globalThis.fetch = vi.fn().mockResolvedValue(new Response('Not Found', { status: 404, statusText: 'Not Found' }))
        await expect(client.get('/test')).rejects.toThrow('API Error: 404')
        globalThis.fetch = originalFetch
      })

      it('returns parsed JSON when fetch succeeds with JSON content-type', async () => {
        client.setUseMocks(false)
        const originalFetch = globalThis.fetch
        const data = { id: 1, name: 'Test' }
        const mockResponse = new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse)
        await expect(client.get('/test')).resolves.toEqual(data)
        globalThis.fetch = originalFetch
      })
    })
  
    describe('post', () => {
      it('returns mock data when useMocks is true', async () => {
        const data = await client.post('/courses', { title: 'New' }, () => ({ id: 2 }))
        expect(data).toEqual({ id: 2 })
      })

      it('performs fetch when useMocks is false', async () => {
        client.setUseMocks(false)
        const originalFetch = globalThis.fetch
        const mockResponse = new Response(JSON.stringify({ success: true }), { status: 200 })
        const fetchMock = vi.fn().mockResolvedValue(mockResponse)
        globalThis.fetch = fetchMock
        const res = await client.post('/test', { data: 1 })
        expect(res).toEqual({ success: true })
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('/test'),
          expect.objectContaining({ method: 'POST' })
        )
        globalThis.fetch = originalFetch
      })
    })
  
    describe('put', () => {
      it('returns mock data when useMocks is true', async () => {
        const data = await client.put('/courses/1', { title: 'Updated' }, () => ({ id: 1 }))
        expect(data).toEqual({ id: 1 })
      })

      it('performs fetch when useMocks is false', async () => {
        client.setUseMocks(false)
        const originalFetch = globalThis.fetch
        const mockResponse = new Response(JSON.stringify({ success: true }), { status: 200 })
        const fetchMock = vi.fn().mockResolvedValue(mockResponse)
        globalThis.fetch = fetchMock
        const res = await client.put('/test', { data: 1 })
        expect(res).toEqual({ success: true })
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('/test'),
          expect.objectContaining({ method: 'PUT' })
        )
        globalThis.fetch = originalFetch
      })
    })
  
    describe('delete', () => {
      it('returns mock data when useMocks is true', async () => {
        const data = await client.delete('/courses/1', () => ({ success: true }))
        expect(data).toEqual({ success: true })
      })

      it('performs fetch when useMocks is false', async () => {
        client.setUseMocks(false)
        const originalFetch = globalThis.fetch
        const mockResponse = new Response(JSON.stringify({ success: true }), { status: 200 })
        const fetchMock = vi.fn().mockResolvedValue(mockResponse)
        globalThis.fetch = fetchMock
        const res = await client.delete('/test')
        expect(res).toEqual({ success: true })
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('/test'),
          expect.objectContaining({ method: 'DELETE' })
        )
        globalThis.fetch = originalFetch
      })
    })
  
    describe('api singleton', () => {
      it('exists and is an ApiClient instance', () => {
        expect(api).toBeInstanceOf(ApiClient)
      })
    })

    describe('saveSettings', () => {
      it('calls api.put with settings data', async () => {
        const spy = vi.spyOn(ApiClient.prototype, 'put').mockResolvedValue({ success: true })
        const settings: SettingsData = { theme: 'dark', language: 'da' }
        const result = await saveSettings(settings)
        expect(spy).toHaveBeenCalledWith('/settings', settings, expect.any(Function))
        expect(result).toEqual({ success: true })
        spy.mockRestore()
      })
    })

    describe('submitAssignment', () => {
      it('calls api.post with submission data', async () => {
        const spy = vi.spyOn(ApiClient.prototype, 'post').mockResolvedValue({ success: true, submissionId: 'MOCK-001' })
        const data: SubmissionData = { courseId: '101', comment: 'My work' }
        const result = await submitAssignment(data)
        expect(spy).toHaveBeenCalledWith('/submissions', data, expect.any(Function))
        expect(result).toEqual({ success: true, submissionId: 'MOCK-001' })
        spy.mockRestore()
      })
    })

    describe('submitSupportTicket', () => {
      it('calls api.post with ticket data', async () => {
        const spy = vi.spyOn(ApiClient.prototype, 'post').mockResolvedValue({ success: true, ticketId: 'MOCK-001' })
        const data: SupportFormData = { subject: 'Bug', description: 'Something broke' }
        const result = await submitSupportTicket(data)
        expect(spy).toHaveBeenCalledWith('/support/tickets', data, expect.any(Function))
        expect(result).toEqual({ success: true, ticketId: 'MOCK-001' })
        spy.mockRestore()
      })
    })

    describe('timeout', () => {
      it('uses configurable timeout', () => {
        const custom = new ApiClient('/api', false, 5000)
        expect((custom as any).timeoutMs).toBe(5000)
        custom.setTimeout(3000)
        expect((custom as any).timeoutMs).toBe(3000)
      })
    })
  })
}
