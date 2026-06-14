import { type MouseEvent } from 'react'
import { MessageSquare, Archive, Undo2 } from 'lucide-react'
import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import Button from '@/components/ui/Button'
import { Heading, Text, MasterItem, SearchInput } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import { Avatar } from '@/components/ui'
import type { Contact } from '@/lib/types'

interface ChatSidebarProps {
  view: 'active' | 'archive'
  filteredContacts: Contact[]
  activeContactId: number
  setActiveContactId: (id: number) => void
  archiveContact: (id: number, e: MouseEvent) => void
  restoreContact: (id: number, e: MouseEvent) => void
  t: (key: string) => string
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function ChatSidebar({
  view,
  filteredContacts,
  activeContactId,
  setActiveContactId,
  archiveContact,
  restoreContact,
  t,
  searchQuery,
  setSearchQuery,
}: ChatSidebarProps) {
  return (
    <Card className="h-full w-full border-none shadow-none rounded-none bg-transparent flex flex-col">
      <div className="p-sm pb-xs border-b border-border/40 bg-bg-card shrink-0">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder={t('search_placeholder') || 'Søg...'}
        />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
      {filteredContacts.length > 0 ? (
        filteredContacts.map((contact) => (
          <MasterItem
            key={contact.id}
            selected={activeContactId === contact.id}
            unread={contact.unread}
            onClick={() => {
              setActiveContactId(contact.id)
            }}
            className="contact-item"
            leading={<Avatar name={contact.name} size="sm" />}
            title={
              <Heading level={4} className="truncate">
                {contact.name}
              </Heading>
            }
            subtitle={
              <Text
                size="xs"
                weight={contact.unread ? 'bold' : 'normal'}
                className={`truncate ${
                  contact.unread ? 'text-main' : 'text-text-muted'
                }`}
              >
                {contact.msg}
              </Text>
            }
            meta={
              <Text
                size="2xs"
                className="mt-[var(--space-2xs)] text-text-muted font-medium"
              >
                {contact.time}
              </Text>
            }
            trailing={
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
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      if (view === 'active') archiveContact(contact.id, e)
                      else restoreContact(contact.id, e)
                    }}
                    pill
                    className="bg-bg-card border border-border/50 hover:border-primary shadow-[var(--shadow-sm)]"
                  />
                </div>
              </Stack>
            }
          />
        ))
      ) : (
        <EmptyState icon={MessageSquare} title={t('no_messages_found')} />
      )}
      </div>
    </Card>
  )
}
