import { Send, MessageCircle } from 'lucide-react'
import { Card, Heading, Text, EmptyState, Avatar, Button, Textarea } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { cn } from '@/lib/utils'
import type { ChatWindowProps } from '@/lib/types'

export function ChatWindow({
  activeContact,
  chatBodyRef,
  messageText,
  setMessageText,
  handleSend,
  t,
}: ChatWindowProps) {
  return (
    <Card className="h-full flex flex-col p-[var(--space-0)] border-none shadow-none rounded-none bg-transparent">
      {activeContact ? (
        <>
          <div className="messages-chat-header p-md border-b border-border bg-bg-card">
            <Stack direction="row" gap="md" align="center">
              <Avatar name={activeContact.name} size="md" />
              <Stack gap="none">
                <Heading level={4}>{activeContact.name}</Heading>
                <Text size="xs" muted weight="medium">
                  {activeContact.role}
                </Text>
              </Stack>
            </Stack>
          </div>
          <div
            ref={chatBodyRef}
            className="messages-chat-body flex-1 p-lg bg-bg-highlight dark:bg-bg-body overflow-y-auto"
          >
            <div className="flex flex-col justify-end min-h-full gap-md">
              {activeContact.messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <div className={`chat-bubble chat-bubble--${msg.type} animate-fade-in`}>
                    <Text size="sm" className="leading-relaxed">
                      {msg.text}
                    </Text>
                  </div>
                  {msg.timestamp && (
                    <Text
                      size="2xs"
                      className={cn(
                        "text-text-secondary mt-[var(--space-3xs)] px-xs font-semibold opacity-90",
                        msg.type === 'out' ? 'self-end text-right mr-sm' : 'self-start text-left ml-sm'
                      )}
                    >
                      {msg.timestamp}
                    </Text>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="messages-input-area p-md bg-bg-card border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            <Stack
              direction="row"
              align="end"
              gap="sm"
              className="p-xs border border-border rounded-[var(--radius-xl)] bg-bg-input focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.1)] transition-all"
            >
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                className="flex-1 border-none focus-visible:ring-0 bg-transparent min-h-[44px] py-2.5 px-xs text-sm"
                placeholder={t('write_message_placeholder')}
                rows={1}
                resize="none"
              />
              <Button
                variant="primary"
                icon={Send}
                onClick={handleSend}
                disabled={!messageText.trim()}
                size="icon"
                aria-label={t('send_message')}
                className="mb-[3px] mr-[3px] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] hover:scale-105 active:scale-95 transition-all"
              />
            </Stack>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-xl">
          <EmptyState
            icon={MessageCircle}
            title={t('select_conversation')}
            message={t('select_conversation_desc')}
          />
        </div>
      )}
    </Card>
  )
}
