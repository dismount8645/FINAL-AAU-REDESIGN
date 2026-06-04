import { Book } from 'lucide-react'
import Card from '@/components/Card'
import { Stack } from '@/components/LayoutPrimitives'
import Button from '@/components/ui/Button'
import Icon from '@/components/Icon'
import { Text } from '@/components/Typography'

interface SubmissionDetailsProps {
  t: (key: string) => string
}

export default function SubmissionDetails({ t }: SubmissionDetailsProps) {
  return (
    <aside className="course-sidebar">
      <Card>
        <Card.Header>
          <Text weight="bold" size="lg" className="card__title">{t('pre_submission_checklist')}</Text>
        </Card.Header>
        <Card.Body>
          <Stack gap="xs" className="submission__checklist list-none p-[var(--space-0)]">
            <li className="flex items-center gap-[var(--space-xs)]">
              <Text size="sm">
                <Icon name="square-check" variant="success" size="sm" /> {t('submission_checklist_id')}
              </Text>
            </li>
            <li className="flex items-center gap-[var(--space-xs)]">
              <Text size="sm">
                <Icon name="square-check" variant="success" size="sm" /> {t('submission_checklist_pdf')}
              </Text>
            </li>
            <li className="flex items-center gap-[var(--space-xs)]">
              <Text size="sm">
                <Icon name="square-check" variant="success" size="sm" /> {t('submission_checklist_sources')}
              </Text>
            </li>
          </Stack>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Text weight="bold" size="lg" className="card__title">{t('submission_help')}</Text>
        </Card.Header>
        <Card.Body>
          <Text size="xs" muted className="submission__help-text mb-[var(--space-md)] block">
            {t('submission_help_desc')}
          </Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="ghost" size="sm" icon={Book} full>
            {t('view_submission_guide')}
          </Button>
        </Card.Footer>
      </Card>
    </aside>
  )
}
