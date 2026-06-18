import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, Heading, Text, IconCircle } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';

interface SubmissionSuccessProps {
  onBackToCourse: () => void;
  t: (key: string) => string;
}

function SubmissionSuccess({ onBackToCourse, t }: SubmissionSuccessProps) {
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

export default SubmissionSuccess
