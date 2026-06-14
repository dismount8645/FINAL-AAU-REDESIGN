import { useState, useEffect, useRef, useCallback, useMemo, type MouseEvent } from 'react'
import { useLocation } from 'react-router-dom'
import useStore from '@/store'
import type { Contact } from '@/lib/types'
import { useManagedCollection } from '@/hooks/useManagedCollection'

interface UseMessagesStateReturn {
  view: 'active' | 'archive'
  setView: (v: 'active' | 'archive') => void
  activeContactId: number
  setActiveContactId: (id: number) => void
  contacts: Contact[]
  messageText: string
  setMessageText: (t: string) => void
  chatBodyRef: React.RefObject<HTMLDivElement>
  filteredItems: Contact[]
  activeContact: Contact | undefined
  handleSend: () => void
  archiveContact: (id: number, e: MouseEvent) => void
  restoreContact: (id: number, e: MouseEvent) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function useMessagesState(): UseMessagesStateReturn {
  const t = useStore(state => state.t)
  const decrementMessageCount = useStore(state => state.decrementMessageCount)
  const location = useLocation()

  const [activeContactId, setActiveContactId] = useState<number>(1)
  const { items: contacts, setItems: setContacts, view, setView, filteredItems, archiveItem, restoreItem, searchQuery, setSearchQuery } = useManagedCollection<Contact>([
    {
      id: 1,
      name: 'Mette Jensen',
      role: t('role_student'),
      msg: t('msg_mette_1'),
      time: t('msg_mette_time'),
      unread: true,
      archived: false,
      messages: [
        { id: 1, type: 'in', text: t('msg_mette_chat_1'), timestamp: t('msg_mette_chat_1_time') },
        { id: 2, type: 'out', text: t('msg_mette_chat_2'), timestamp: t('msg_mette_chat_2_time') },
      ],
    },
    {
      id: 2,
      name: t('msg_guidance_name'),
      role: t('role_administrative'),
      msg: t('msg_guidance_1'),
      time: t('yesterday'),
      unread: false,
      archived: false,
      messages: [
        { id: 1, type: 'in', text: t('msg_guidance_chat_1'), timestamp: '13:00' },
        { id: 2, type: 'in', text: t('msg_guidance_chat_2'), timestamp: '13:01' },
      ],
    },
  ], {
    searchKeys: (c: Contact) => [c.name, c.role, c.msg],
  })

  const [messageText, setMessageText] = useState('')
  const chatBodyRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)
  const lastActiveContactId = useRef<number | null>(null)
  const lastMessagesLength = useRef<number>(0)

  const handleSend = useCallback(() => {
    if (!messageText.trim()) return
    setContacts(prev => prev.map(c =>
      c.id === activeContactId
        ? { ...c, messages: [...c.messages, { id: Date.now(), type: 'out' as const, text: messageText.trim() }] }
        : c
    ))
    setMessageText('')
  }, [messageText, activeContactId])

  // Scroll to bottom on contact/message change
  useEffect(() => {
    /* istanbul ignore next */
    if (chatBodyRef.current) {
      const activeContact = contacts.find(c => c.id === activeContactId)
      const activeMessagesLength = activeContact?.messages.length || 0

      const idChanged = lastActiveContactId.current !== activeContactId
      const messagesCountChanged = lastMessagesLength.current !== activeMessagesLength

      if (isInitialMount.current || idChanged) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
        isInitialMount.current = false
      } else if (messagesCountChanged && activeMessagesLength > lastMessagesLength.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
      }

      lastActiveContactId.current = activeContactId
      lastMessagesLength.current = activeMessagesLength
    }
  }, [activeContactId, contacts])

  // Auto mark-as-read after 1s
  useEffect(() => {
    const contact = contacts.find(c => c.id === activeContactId)
    if (contact?.unread) {
      const timer = setTimeout(() => {
        decrementMessageCount()
        setContacts(prev => prev.map(c => {
          if (c.id === activeContactId && c.unread) {
            return { ...c, unread: false }
          }
          return c
        }))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [activeContactId, contacts, decrementMessageCount])

  // Sync URL param → activeContactId
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    if (id) setActiveContactId(parseInt(id))
  }, [location])

  const archiveContact = useCallback((id: number, e: MouseEvent): void => {
    archiveItem(id, e)
    if (activeContactId === id) {
      const next = contacts.find(c => c.id !== id && !c.archived)
      if (next) setActiveContactId(next.id)
    }
  }, [archiveItem, activeContactId, contacts])

  const restoreContact = restoreItem

  const activeContact = useMemo(
    () => contacts.find(c => c.id === activeContactId) ?? filteredItems[0],
    [contacts, activeContactId, filteredItems]
  )

  return {
    view,
    setView,
    activeContactId,
    setActiveContactId,
    contacts,
    messageText,
    setMessageText,
    chatBodyRef,
    filteredItems,
    activeContact,
    handleSend,
    archiveContact,
    restoreContact,
    searchQuery,
    setSearchQuery,
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  const { describe, it, expect, vi } = await import('vitest')
  const { renderHook } = await import('@/test/test-utils')
  const { act } = await import('react')
  const { MemoryRouter } = await import('react-router-dom')

  describe('useMessagesState', () => {
    it('returns default state', () => {
      const { result } = renderHook(() => useMessagesState(), { wrapper: MemoryRouter })
      expect(result.current.view).toBe('active')
      expect(result.current.activeContactId).toBe(1)
      expect(result.current.messageText).toBe('')
    })

    it('handleSend adds a message to the active contact', () => {
      const { result } = renderHook(() => useMessagesState(), { wrapper: MemoryRouter })

      act(() => result.current.setMessageText('Hello'))
      act(() => result.current.handleSend())

      const contact = result.current.contacts.find(c => c.id === 1)
      expect(contact?.messages.length).toBe(3)
      expect(contact?.messages[2].text).toBe('Hello')
      expect(result.current.messageText).toBe('')
    })

    it('handleSend with empty text does nothing', () => {
      const { result } = renderHook(() => useMessagesState(), { wrapper: MemoryRouter })

      act(() => result.current.handleSend())

      const contact = result.current.contacts.find(c => c.id === 1)
      expect(contact?.messages.length).toBe(2)
    })

    it('archiveContact marks contact as archived', () => {
      const { result } = renderHook(() => useMessagesState(), { wrapper: MemoryRouter })
      const mockEvent = { stopPropagation: vi.fn() }

      act(() => result.current.archiveContact(1, mockEvent as any))

      const contact = result.current.contacts.find(c => c.id === 1)
      expect(contact?.archived).toBe(true)
    })

    it('restoreContact un-archives a contact', () => {
      const { result } = renderHook(() => useMessagesState(), { wrapper: MemoryRouter })
      const mockEvent = { stopPropagation: vi.fn() }

      act(() => result.current.archiveContact(1, mockEvent as any))
      act(() => result.current.restoreContact(1, mockEvent as any))

      const contact = result.current.contacts.find(c => c.id === 1)
      expect(contact?.archived).toBe(false)
    })

    it('filteredItems with active view shows only non-archived contacts', () => {
      const { result } = renderHook(() => useMessagesState(), { wrapper: MemoryRouter })
      const mockEvent = { stopPropagation: vi.fn() }

      expect(result.current.filteredItems.length).toBe(2)

      act(() => result.current.archiveContact(1, mockEvent as any))

      expect(result.current.filteredItems.length).toBe(1)
      expect(result.current.filteredItems[0].id).toBe(2)
    })

    it('filteredItems with archive view shows only archived contacts', () => {
      const { result } = renderHook(() => useMessagesState(), { wrapper: MemoryRouter })
      const mockEvent = { stopPropagation: vi.fn() }

      act(() => result.current.archiveContact(1, mockEvent as any))
      act(() => result.current.archiveContact(2, mockEvent as any))
      act(() => result.current.setView('archive'))

      expect(result.current.filteredItems.length).toBe(2)
    })

    it('setView changes the view', () => {
      const { result } = renderHook(() => useMessagesState(), { wrapper: MemoryRouter })

      act(() => result.current.setView('archive'))

      expect(result.current.view).toBe('archive')
    })
  })
}
