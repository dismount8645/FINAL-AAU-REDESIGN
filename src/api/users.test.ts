import { describe, it, expect } from 'vitest'
import { usersApi } from '@/api/users'

describe('usersApi', () => {
  it('getMessages returns message threads', async () => {
    const messages = await usersApi.getMessages()
    expect(Array.isArray(messages)).toBe(true)
    expect(messages.length).toBeGreaterThan(0)
    expect(messages[0]).toHaveProperty('id')
    expect(messages[0]).toHaveProperty('messages')
  })
})
