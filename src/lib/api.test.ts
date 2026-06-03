import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiClient, api, withTimeout, withRetry, isRetryableError } from '@/lib/api'

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
  })

  describe('post', () => {
    it('returns mock data when useMocks is true', async () => {
      const data = await client.post('/courses', { title: 'New' }, () => ({ id: 2 }))
      expect(data).toEqual({ id: 2 })
    })
  })

  describe('put', () => {
    it('returns mock data when useMocks is true', async () => {
      const data = await client.put('/courses/1', { title: 'Updated' }, () => ({ id: 1 }))
      expect(data).toEqual({ id: 1 })
    })
  })

  describe('delete', () => {
    it('returns mock data when useMocks is true', async () => {
      const data = await client.delete('/courses/1', () => ({ success: true }))
      expect(data).toEqual({ success: true })
    })
  })

  describe('api singleton', () => {
    it('exists and is an ApiClient instance', () => {
      expect(api).toBeInstanceOf(ApiClient)
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
