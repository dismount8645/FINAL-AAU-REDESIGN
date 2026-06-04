import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatWindow } from '@/components/ChatWindow';
import Badge from '@/components/Badge';
import { Grid } from '@/components/LayoutPrimitives';
import PageLayout from '@/components/PageLayout';
import useStore, { type Lang } from '@/store';
import { useMessagesState } from '@/lib/useMessagesState';

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
    <PageLayout
      className="container messages-page flex flex-col pb-[var(--space-2xl)]"
      pageKey="messages"
      title={t('messages')}
      subtitle={t('messages_page_subtitle')}
      breadcrumbs={[{ label: t('dashboard'), href: '/' }, { label: t('messages') }]}
      headerChildren={
        <Badge variant="default" className="bg-bg-placeholder text-text-muted">{t('communication')}</Badge>
      }
    >

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
    </PageLayout>
  )
}

export default Messages

if (import.meta.vitest) {
  describe('Messages Page', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
    })
  
    const renderMessages = (lang: Lang = 'da') => {
      useStore.setState({ lang })
      return render(
        <MemoryRouter>
          <Messages />
        </MemoryRouter>
      )
    }
  
    it('renders messages correctly in Danish', () => {
      renderMessages('da')
      // Mette Jensen appears in list AND chat panel (activeContactId=1), use getAllByText
      expect(screen.getAllByText('Mette Jensen').length).toBeGreaterThan(0)
      expect(screen.getByText('Studievejledningen')).toBeInTheDocument()
    })
  
    it('selects a different conversation', () => {
      renderMessages('da')
      fireEvent.click(screen.getByText('Studievejledningen'))
      expect(screen.getByText('Hej Jacob. Vi bekræfter hermed din tid til studievejledning d. 15. maj kl. 13:00.')).toBeInTheDocument()
    })
  
    it('archives and restores a conversation', () => {
      renderMessages('da')
      // aria-label is 'Archive contact'
      const archiveBtns = screen.getAllByLabelText('Archive contact')
      fireEvent.click(archiveBtns[0])
      
      // Switch to archive view using data-testid
      fireEvent.click(screen.getByTestId('tab-archive'))
      expect(screen.getAllByText('Mette Jensen').length).toBeGreaterThan(0)
      
      // Restore — in archive view the aria-label changes to 'Restore contact'
      const restoreBtn = screen.getByLabelText('Restore contact')
      fireEvent.click(restoreBtn)
    })
  
    it('renders in English and handles empty states', () => {
      useStore.setState({ lang: 'en' })
      renderMessages('en')
      expect(screen.getAllByText('Mette Jensen').length).toBeGreaterThan(0)
      expect(screen.getByText('Student Guidance')).toBeInTheDocument()
  
      // Archive first contact
      fireEvent.click(screen.getAllByLabelText('Archive contact')[0])
      // Re-query to avoid stale DOM reference after re-render
      fireEvent.click(screen.getByLabelText('Archive contact'))
  
      expect(screen.getByText('No messages found')).toBeInTheDocument()
    })
  
    it('selects contact from URL params', () => {
      useStore.setState({ lang: 'da' })
      render(
        <MemoryRouter initialEntries={['/messages?id=2']}>
          <Messages />
        </MemoryRouter>
      )
      expect(screen.getByText(/Vi bekræfter hermed din tid/i)).toBeInTheDocument()
    })
  
    it('archives active contact and switches to next', () => {
      renderMessages('da')
      const archiveBtns = screen.getAllByLabelText('Archive contact')
      fireEvent.click(archiveBtns[0])
      expect(screen.getByText(/Vi bekræfter hermed din tid/i)).toBeInTheDocument()
    })
  
    it('shows tertiary variant for active tab when in archive view', () => {
      renderMessages('da')
      const archiveTab = screen.getByTestId('tab-archive')
      fireEvent.click(archiveTab)
      const activeTab = screen.getByTestId('tab-active')
      expect(activeTab.className).not.toContain('bg-primary')
    })
  
    it('switches back to active view from archive view', () => {
      renderMessages('da')
      fireEvent.click(screen.getByTestId('tab-archive'))
      fireEvent.click(screen.getByTestId('tab-active'))
      const archiveTab = screen.getByTestId('tab-archive')
      expect(archiveTab.className).not.toContain('bg-primary')
    })
  
    it('handles non-existent contact ID from URL params', () => {
      useStore.setState({ lang: 'da' })
      render(
        <MemoryRouter initialEntries={['/messages?id=999']}>
          <Messages />
        </MemoryRouter>
      )
      // Falls back to first contact
      expect(screen.getAllByText('Mette Jensen').length).toBeGreaterThan(0)
    })
  
    it('shows empty state in archive view with no archived messages', () => {
      renderMessages('da')
      // Switch to archive view without archiving any contacts
      fireEvent.click(screen.getByTestId('tab-archive'))
      expect(screen.getByText('Ingen beskeder fundet')).toBeInTheDocument()
    })
  
    it('shows empty chat panel when no contact is selected in archive view', () => {
      useStore.setState({ lang: 'da' })
      render(
        <MemoryRouter initialEntries={['/messages?id=999']}>
          <Messages />
        </MemoryRouter>
      )
      // Switch to archive view (no archived contacts, nonexistent activeContactId)
      fireEvent.click(screen.getByTestId('tab-archive'))
      expect(screen.getByText('Vælg en samtale')).toBeInTheDocument()
      expect(screen.getByText('Vælg en samtale for at læse den')).toBeInTheDocument()
    })
  
    it('shows empty chat panel in English in archive view', () => {
      useStore.setState({ lang: 'en' })
      render(
        <MemoryRouter initialEntries={['/messages?id=999']}>
          <Messages />
        </MemoryRouter>
      )
      fireEvent.click(screen.getByTestId('tab-archive'))
      expect(screen.getByText('Select a conversation')).toBeInTheDocument()
      expect(screen.getByText('Select a conversation to read it')).toBeInTheDocument()
    })
  
    it('archives a contact that is not the active one', () => {
      renderMessages('da')
      // Select Studievejledningen (id=2) as active
      fireEvent.click(screen.getByText('Studievejledningen'))
      // Archive Mette Jensen (id=1) which is NOT the active contact
      const archiveBtns = screen.getAllByLabelText('Archive contact')
      fireEvent.click(archiveBtns[0])
      // Should still show Studievejledningen's messages
      expect(screen.getByText(/Vi bekræfter hermed din tid/i)).toBeInTheDocument()
    })
  
    it('sends a message via the input field', () => {
      renderMessages('da')
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'Test besked' } })
      const sendBtn = document.querySelector('.messages-input-area button')
      fireEvent.click(sendBtn!)
      expect(screen.getByText('Test besked')).toBeInTheDocument()
    })
  
    it('does not send empty messages', () => {
      renderMessages('da')
      const sendBtn = document.querySelector('.messages-input-area button') as HTMLButtonElement
      expect(sendBtn.disabled).toBe(true)
    })
  
    it('sends message on Enter key press', () => {
      renderMessages('da')
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'Enter test' } })
      fireEvent.keyDown(textarea, { key: 'Enter' })
      expect(screen.getByText('Enter test')).toBeInTheDocument()
    })
  
    it('shows back button on mobile when chat is open', () => {
      renderMessages('da')
      fireEvent.click(screen.getByText('Studievejledningen'))
      const backBtn = screen.getByLabelText('Tilbage til beskeder')
      expect(backBtn).toBeInTheDocument()
    })
  
    it('back button hides chat panel', () => {
      renderMessages('da')
      fireEvent.click(screen.getByText('Studievejledningen'))
      const backBtn = screen.getByLabelText('Tilbage til beskeder')
      fireEvent.click(backBtn)
      const listPanel = document.querySelector('.messages-list-panel')
      expect(listPanel).toBeInTheDocument()
    })
  
    it('does not send message with empty text via Enter key', () => {
      renderMessages('da')
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement
      fireEvent.keyDown(textarea, { key: 'Enter' })
      const messages = document.querySelectorAll('.chat-bubble')
      expect(messages.length).toBe(2)
    })
  
    it('marks contact as read after delay', async () => {
      vi.useFakeTimers()
      renderMessages('da')
      
      // Mette Jensen (id=1) is active and unread
      const getUnreadIndicator = () => document.querySelector('.bg-primary.rounded-\\[var\\(--radius-pill\\)\\].w-2\\.5')
      expect(getUnreadIndicator()).toBeInTheDocument()
      
      // Fast-forward time
      await act(async () => {
        vi.advanceTimersByTime(1500)
        // We need to allow React to process the state update
        await vi.runOnlyPendingTimersAsync()
      })
      
      expect(getUnreadIndicator()).not.toBeInTheDocument()
      
      vi.useRealTimers()
    })
  
    it('does not mark contact as read after delay on mobile when chat is not shown', async () => {
      vi.useFakeTimers()
      useStore.setState({ lang: 'da', isMobile: true })
      
      render(
        <MemoryRouter>
          <Messages />
        </MemoryRouter>
      )
      
      // Mette Jensen (id=1) is active and unread
      const getUnreadIndicator = () => document.querySelector('.bg-primary.rounded-\\[var\\(--radius-pill\\)\\].w-2\\.5')
      expect(getUnreadIndicator()).toBeInTheDocument()
      
      // Fast-forward time
      await act(async () => {
        vi.advanceTimersByTime(1500)
        await vi.runOnlyPendingTimersAsync()
      })
      
      // Should still be unread because showChat is false on mobile!
      expect(getUnreadIndicator()).toBeInTheDocument()
      
      vi.useRealTimers()
    })
  
    it('handles scroll logic and scroll fallback', () => {
      const { container } = renderMessages('da')
      const chatBody = container.querySelector('.messages-chat-body') as HTMLElement
      Object.defineProperty(chatBody, 'scrollHeight', { value: 1000 })
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'Scroll test' } })
      fireEvent.keyDown(textarea, { key: 'Enter' })
      expect(screen.getByText('Scroll test')).toBeInTheDocument()
    })
  
    it('uses scrollTop fallback when scrollTo is not a function', () => {
      renderMessages('da')
      const chatBody = document.querySelector('.messages-chat-body') as HTMLElement
      Object.defineProperty(chatBody, 'scrollHeight', { value: 1000 });
      (chatBody as any).scrollTo = undefined
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'Scroll test' } })
      fireEvent.keyDown(textarea, { key: 'Enter' })
      expect(screen.getByText('Scroll test')).toBeInTheDocument()
    })
  
    it('calls scrollTo when a new message is added to current chat', () => {
      const { container } = renderMessages('da')
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'New message' } })
      fireEvent.keyDown(textarea, { key: 'Enter' })
      expect(screen.getByText('New message')).toBeInTheDocument()
    })
  })
}
