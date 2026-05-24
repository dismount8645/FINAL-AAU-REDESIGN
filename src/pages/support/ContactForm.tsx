import { memo } from 'react'
import { X } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import FormField from '@/components/ui/FormField'
import { Heading } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

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
  const { t } = useStore()

  return (
    <Card className="h-auto overflow-visible min-h-[200px]">
      <Card.Body padding="compact" className="p-lg">
        <Heading level={3} className="mb-md">{t('send_message_to_support')}</Heading>
        {!isFormOpen ? (
          <Button variant="primary" full onClick={() => setIsFormOpen(true)}>
            {t('write_a_message')}
          </Button>
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
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? t('support_sending') : t('send_message')}
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
