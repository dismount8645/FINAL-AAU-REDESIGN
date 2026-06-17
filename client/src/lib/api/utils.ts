import { API_RETRY_BACKOFF } from '../constants';

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

function resetCsrfCache(): void {
  cachedCsrfToken = undefined;
}

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

export { isRetryableError, getCsrfToken, buildHeaders, withTimeout, withRetry, handleResponse, resetCsrfCache }
