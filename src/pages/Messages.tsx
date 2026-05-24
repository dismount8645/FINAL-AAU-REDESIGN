import useStore from '@/store/useStore'
import PageHeader from '@/components/common/PageHeader'
import Grid from '@/components/ui/Grid'
import Stack from '@/components/ui/Stack'
import Badge from '@/components/ui/Badge'
import { useMessagesState } from '@/hooks/useMessagesState'
import { ChatSidebar, ChatWindow } from './messages/index'

function Messages() {
  const t = useStore(state => state.t)
  const {
    view,
    setView,
    activeContactId,
    setActiveContactId,
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
  } = useMessagesState()

  return (
    <Stack className="container messages-page flex flex-col pb-[var(--space-2xl)]">
      <PageHeader
        pageKey="messages"
        title={t('messages')}
        subtitle={t('messages_page_subtitle')}
        breadcrumbs={[{ label: t('dashboard'), href: '/' }, { label: t('messages') }]}
      >
        <Badge variant="default" className="bg-bg-placeholder text-text-muted">{t('communication')}</Badge>
      </PageHeader>

      <Grid>
        <Grid.Item span={4} tabletSpan={2} mobileSpan={4}
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

        <Grid.Item span={8} tabletSpan={4} mobileSpan={4}
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
