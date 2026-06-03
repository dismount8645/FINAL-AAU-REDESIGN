import { describe, it, expect } from 'vitest'
import { storage } from './storage'

describe('storage', () => {
  it('handles all resilience scenarios', () => {
    localStorage.setItem('test_json_err', 'invalid-json')
    expect(storage.get('test_json_err', { a: 1 })).toEqual({ a: 1 })
    expect(storage.get('test_json_err', 'fallback-string')).toBe('invalid-json')

    const originalGetItem = localStorage.getItem
    localStorage.getItem = () => { throw new Error('getItem error') }
    expect(storage.get('test_key', 'fallback')).toBe('fallback')
    localStorage.getItem = originalGetItem

    const originalSetItem = localStorage.setItem
    localStorage.setItem = () => { throw new Error('setItem error') }
    storage.set('test_key', 'val')
    localStorage.setItem = originalSetItem

    const originalRemoveItem = localStorage.removeItem
    localStorage.removeItem = () => { throw new Error('removeItem error') }
    storage.remove('test_key')
    localStorage.removeItem = originalRemoveItem

    const originalWindow = globalThis.window
    delete (globalThis as any).window
    try {
      expect(storage.get('test_key', 'fallback')).toBe('fallback')
      storage.set('test_key', 'val')
      storage.remove('test_key')
    } finally {
      (globalThis as any).window = originalWindow
    }
  })
})
