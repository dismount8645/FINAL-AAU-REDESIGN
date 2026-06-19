import { memo } from 'react'
import { X } from 'lucide-react'
import { Card, FormField, Heading, Text, Button, Input, Textarea } from '@/components/ui'
import useStore from '@/store'

interface ContactFormProps {
  subject: string
  setSubject: (val: string) => void
  description: string
  setDescription: (val: string) => void
  isFormOpen: boolean
  setIsFormOpen: (val: boolean) => void
  isSubmitting: boolean
  fieldErrors: { subject: boolean; description: boolean }
  onSubmit: (e?: React.FormEvent) => Promise<void>
  onCancel: () => void
}

function ContactForm({
  subject,
  setSubject,
  description,
  setDescription,
  isFormOpen,
  setIsFormOpen,
  isSubmitting,
  fieldErrors,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)

  return (
    <Card className="h-auto overflow-visible min-h-[200px]">
      <Card.Body padding="compact" className="p-lg">
        <Heading level={3} className="mb-xs">{lang === 'da' ? 'Send besked' : 'Send message'}</Heading>
        {!isFormOpen ? (
          <div className="flex flex-col items-start">
            <Text size="xs" className="text-muted mb-sm">{t('send_message_desc')}</Text>
            <Button variant="primary" onClick={() => setIsFormOpen(true)}>
              {lang === 'da' ? 'Send besked' : 'Send message'}
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-md">
            <FormField
              id="support-subject"
              label={t('support_subject')}
              required
              error={fieldErrors.subject ? t('support_subject_error') : undefined}
            >
              <Input
                placeholder={t('support_subject_placeholder')}
                value={subject}
                error={fieldErrors.subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </FormField>

            <FormField
              id="support-description"
              label={t('support_description')}
              required
              error={fieldErrors.description ? t('support_description_error') : undefined}
            >
              <Textarea
                placeholder={t('support_description_placeholder')}
                rows={4}
                value={description}
                error={fieldErrors.description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>
            <div className="flex items-center gap-sm">
              <Button type="submit" variant="primary" disabled={isSubmitting} loading={isSubmitting} aria-label={t('send_message')}>
                {isSubmitting ? '' : t('send_message')}
              </Button>
              <Button type="button" variant="ghost" size="sm" icon={X} onClick={onCancel}>
                {t('cancel')}
              </Button>
            </div>
          </form>
        )}
      </Card.Body>
    </Card>
  )
}

export default memo(ContactForm)