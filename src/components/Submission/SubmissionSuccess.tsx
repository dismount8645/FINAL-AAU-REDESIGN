import { Check } from 'lucide-react'
import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import Button from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui'
import { IconCircle } from '@/components/ui/Icon'

interface SubmissionSuccessProps {
  onBackToCourse: () => void
  t: (key: string) => string
}

export default function SubmissionSuccess({
  onBackToCourse,
  t,
}: SubmissionSuccessProps) {
  return (
    <Stack align="center" justify="center" className="container submission__success-wrapper min-h-[60vh]">
      <Card className="submission__success-card max-w-xl w-full text-center">
        <Card.Body className="submission__success-body p-[var(--space-3xl)_var(--space-xl)]">
          <Stack align="center" gap="xl">
            <IconCircle icon={Check} size={64} bg="var(--color-success)" color="white" />
            <Stack gap="xs">
              <Heading level={1}>{t('submission_success')}</Heading>
              <Text muted>
                {t('submission_received')}
              </Text>
            </Stack>
            <Stack direction="row" gap="md" align="center" fullWidth>
              <Button variant="primary" full onClick={onBackToCourse}>
                {t('back_to_course')}
              </Button>
              <Button variant="secondary" full>{t('view_receipt')}</Button>
            </Stack>
          </Stack>
        </Card.Body>
      </Card>
    </Stack>
  )
}
