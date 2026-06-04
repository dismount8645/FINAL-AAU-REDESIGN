import { useState, useEffect, useRef, useCallback, useMemo, type MouseEvent } from 'react'
import { useLocation } from 'react-router-dom'
import useStore from '@/store'
import type { Contact } from '@/lib/types'

export interface UseMessagesStateReturn {
  view: 'active' | 'archive'
  setView: (v: 'active' | 'archive') => void
  activeContactId: number
  setActiveContactId: (id: number) => void
  contacts: Contact[]
  messageText: string
  setMessageText: (t: string) => void
  showChat: boolean
  setShowChat: (show: boolean) => void
  chatBodyRef: React.RefObject<HTMLDivElement>
  filteredContacts: Contact[]
  activeContact: Contact | undefined
  handleSend: () => void
  archiveContact: (id: number, e: MouseEvent) => void
  restoreContact: (id: number, e: MouseEvent) => void
}

export function useMessagesState(): UseMessagesStateReturn {
  const t = useStore(state => state.t)
  const decrementMessageCount = useStore(state => state.decrementMessageCount)
  const isMobile = useStore(state => state.isMobile)
  const location = useLocation()

  const [view, setView] = useState<'active' | 'archive'>('active')
  const [activeContactId, setActiveContactId] = useState<number>(1)
  const [contacts, setContacts] = useState<Contact[]>(() => [
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
  ])

  const [messageText, setMessageText] = useState('')
  const [showChat, setShowChat] = useState(location.search.includes('id='))
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
    if (isMobile && !showChat) return
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
  }, [activeContactId, contacts, decrementMessageCount, isMobile, showChat])

  // Sync URL param → activeContactId
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    if (id) setActiveContactId(parseInt(id))
  }, [location])

  const archiveContact = useCallback((id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setContacts(prev => prev.map(c => c.id === id ? { ...c, archived: true } : c))
    if (activeContactId === id) {
      const next = contacts.find(c => c.id !== id && !c.archived)
      if (next) setActiveContactId(next.id)
    }
  }, [activeContactId, contacts])

  const restoreContact = useCallback((id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setContacts(prev => prev.map(c => c.id === id ? { ...c, archived: false } : c))
  }, [])

  const filteredContacts = useMemo(
    () => contacts.filter(c => view === 'active' ? !c.archived : c.archived),
    [contacts, view]
  )

  const activeContact = useMemo(
    () => contacts.find(c => c.id === activeContactId) ?? filteredContacts[0],
    [contacts, activeContactId, filteredContacts]
  )

  return {
    view,
    setView,
    activeContactId,
    setActiveContactId,
    contacts,
    messageText,
    setMessageText,
    showChat,
    setShowChat,
    chatBodyRef,
    filteredContacts,
    activeContact,
    handleSend,
    archiveContact,
    restoreContact,
  }
}
