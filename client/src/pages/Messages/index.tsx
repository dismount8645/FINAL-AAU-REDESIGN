
import { MemoryRouter } from 'react-router-dom';
import { Archive, ArrowLeft } from 'lucide-react';
import { ChatSidebar } from '@/components/Messages';
import { ChatWindow } from '@/components/Messages';
import { Badge, TabBar } from '@/components/ui';
import SplitLayout from '@/components/Layout/SplitLayout';
import PageLayout from '@/components/Layout/PageLayout';
import Button from '@/components/ui/Button';
import useStore, { type Lang } from '@/store';
import { useMessagesState } from './useMessagesState';

function Messages() {
  const t = useStore(state => state.t)
  const {
    view,
    setView,
    activeContactId,
    setActiveContactId,
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

      <SplitLayout
        sidebarPosition="left"
        showDetailOnMobile={!!activeContactId}
        listHeader={
          <div className="px-md pt-md border-b border-border bg-bg-card">
            <TabBar
              tabs={[
                { id: 'active', label: t('active_tab') },
                { id: 'archive', label: t('archive_tab'), icon: Archive },
              ]}
              activeTab={view}
              onChange={(id) => setView(id as typeof view)}
            />
          </div>
        }
        sidebar={
          <ChatSidebar
            view={view}
            filteredContacts={filteredItems}
            activeContactId={activeContactId}
            setActiveContactId={setActiveContactId}
            archiveContact={archiveContact}
            restoreContact={restoreContact}
            t={t}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        }
        detailHeader={
          <div className="md:hidden flex items-center h-14 px-md border-b border-border bg-bg-card">
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={() => setActiveContactId(0)}
              className="font-bold"
            >
              {t('common.back')}
            </Button>
          </div>
        }
        main={
          <ChatWindow
            activeContact={activeContact}
            chatBodyRef={chatBodyRef}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSend={handleSend}
            t={t}
          />
        }
      />
    </PageLayout>
  )
}

export default Messages
