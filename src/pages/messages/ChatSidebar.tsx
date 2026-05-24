import { type MouseEvent, type KeyboardEvent } from 'react'
import { Archive, Undo2, MessageSquare } from 'lucide-react'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'
import EmptyState from '@/components/ui/EmptyState'
import Avatar from '@/components/ui/Avatar'
import TabBar from '@/components/ui/TabBar'
import type { Contact } from './types'

interface ChatSidebarProps {
  view: 'active' | 'archive'
  setView: (view: 'active' | 'archive') => void
  filteredContacts: Contact[]
  activeContactId: number
  setActiveContactId: (id: number) => void
  setShowChat: (showChat: boolean) => void
  archiveContact: (id: number, e: MouseEvent) => void
  restoreContact: (id: number, e: MouseEvent) => void
  t: (key: string) => string
}

export function ChatSidebar({
  view,
  setView,
  filteredContacts,
  activeContactId,
  setActiveContactId,
  setShowChat,
  archiveContact,
  restoreContact,
  t,
}: ChatSidebarProps) {
  return (
    <Card className="messages-list-panel panel-card flex flex-col p-[var(--space-0)]">
      <div className="px-md pt-md border-b border-border">
        <TabBar
          tabs={[
            { id: 'active', label: t('active_tab') },
            { id: 'archive', label: t('archive_tab'), icon: Archive },
          ]}
          activeTab={view}
          onChange={(id) => setView(id as typeof view)}
        />
      </div>
      <div className="panel-scroll">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <Stack
              key={contact.id}
              onClick={() => {
                setActiveContactId(contact.id)
                setShowChat(true)
              }}
              tabIndex={0}
              role="button"
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActiveContactId(contact.id)
                  setShowChat(true)
                }
              }}
              className={`contact-item group border-b border-border/40 cursor-pointer hover:bg-bg-hover focus-visible:outline-none focus-visible:shadow-focus transition-colors p-md relative ${
                activeContactId === contact.id ? 'active bg-bg-highlight dark:bg-white/5' : ''
              }`}
            >
              {activeContactId === contact.id && <div className="panel-active-indicator" />}
              <Stack direction="row" justify="between" align="center" className="w-full">
                <Stack direction="row" gap="sm" align="center" className="flex-1 min-w-0">
                  <Avatar name={contact.name} size="sm" />
                  <Stack gap="2xs" className="flex-1 min-w-0">
                    <Heading level={4} className="truncate">
                      {contact.name}
                    </Heading>
                    <Text
                      size="xs"
                      weight={contact.unread ? 'bold' : 'normal'}
                      className={`truncate ${
                        contact.unread ? 'text-main' : 'text-text-muted'
                      }`}
                    >
                      {contact.msg}
                    </Text>
                    <Text
                      size="2xs"
                      className="mt-[var(--space-2xs)] text-text-muted font-medium"
                    >
                      {contact.time}
                    </Text>
                  </Stack>
                </Stack>
                <Stack direction="row" gap="sm" align="center" className="shrink-0 ml-sm">
                  {contact.unread && !contact.archived && (
                    <div className="w-2.5 h-2.5 rounded-[var(--radius-pill)] bg-primary shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.4)]" />
                  )}
                  <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={view === 'active' ? Archive : Undo2}
                      aria-label={view === 'active' ? 'Archive contact' : 'Restore contact'}
                      onClick={(e: MouseEvent<HTMLButtonElement>) =>
                        view === 'active' ? archiveContact(contact.id, e) : restoreContact(contact.id, e)
                      }
                      pill
                      className="bg-bg-card border border-border/50 hover:border-primary shadow-[var(--shadow-sm)]"
                    />
                  </div>
                </Stack>
              </Stack>
            </Stack>
          ))
        ) : (
          <EmptyState icon={MessageSquare} title={t('no_messages_found')} />
        )}
      </div>
    </Card>
  )
}
