import { useState, useEffect, useRef, type MouseEvent } from 'react'
import { useLocation } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import Grid from '@/components/ui/Grid'
import Stack from '@/components/ui/Stack'
import Badge from '@/components/ui/Badge'
import useStore from '@/store/useStore'
import { ChatSidebar, ChatWindow, type Contact } from './messages/index'

function Messages() {
  const { t, decrementMessageCount, isMobile } = useStore()
  const location = useLocation()
  const [view, setView] = useState<'active' | 'archive'>('active')
  const [activeContactId, setActiveContactId] = useState<number>(1)
  const [contacts, setContacts] = useState<Contact[]>([
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

  const handleSend = () => {
    if (!messageText.trim()) return
    setContacts(prev => prev.map(c =>
      c.id === activeContactId
        ? { ...c, messages: [...c.messages, { id: Date.now(), type: 'out' as const, text: messageText.trim() }] }
        : c
    ))
    setMessageText('')
  }

  // Improved scrolling: Use scrollTop on container to avoid window scroll jumps
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

  // Balanced auto-mark-as-read: mark as read after a short delay of being active and visible
  useEffect(() => {
    // Only auto-mark as read if the chat is visible (on desktop/tablet, or on mobile when showChat is true)
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

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    if (id) setActiveContactId(parseInt(id))
  }, [location])

  const archiveContact = (id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setContacts(prev => prev.map((c) => (c.id === id ? { ...c, archived: true } : c)))
    if (activeContactId === id) {
      const next = contacts.find((c) => c.id !== id && !c.archived)
      if (next) setActiveContactId(next.id)
    }
  }

  const restoreContact = (id: number, e: MouseEvent): void => {
    e.stopPropagation()
    setContacts(contacts.map((c) => (c.id === id ? { ...c, archived: false } : c)))
  }

  const filteredContacts = contacts.filter((c) => (view === 'active' ? !c.archived : c.archived))
  const activeContact = contacts.find((c) => c.id === activeContactId) || filteredContacts[0]

  return (
    <Stack className="container messages-page flex flex-col pb-[var(--space-2xl)]">
      <PageHeader
        pageKey="messages"
        title={t('messages')}
        subtitle={t('messages_page_subtitle')}
        breadcrumbs={[{ label: t('dashboard'), href: '/' }, { label: t('messages') }]}
      >
        <Badge variant="default" className="bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white">{t('communication')}</Badge>
      </PageHeader>

      <Grid>
        <Grid.Item span={4} tabletSpan={3} mobileSpan={4}
          className={showChat ? 'hidden md:block' : ''}>
          <ChatSidebar
            view={view}
            setView={setView}
            filteredContacts={filteredContacts}
            activeContactId={activeContactId}
            setActiveContactId={setActiveContactId}
            setShowChat={setShowChat}
            archiveContact={archiveContact}
            restoreContact={restoreContact}
            t={t}
          />
        </Grid.Item>

        <Grid.Item span={8} tabletSpan={5} mobileSpan={4}
          className={!showChat ? 'hidden md:block' : ''}>
          <ChatWindow
            activeContact={activeContact}
            chatBodyRef={chatBodyRef}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSend={handleSend}
            setShowChat={setShowChat}
            t={t}
          />
        </Grid.Item>
      </Grid>
    </Stack>
  )
}

export default Messages

