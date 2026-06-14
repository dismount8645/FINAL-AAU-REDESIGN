import { memo } from 'react'
import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Heading, Text } from '@/components/ui'
import useStore from '@/store'

function CourseInfo() {
  const t = useStore((state) => state.t)

  return (
    <div className="animate-fade-in">
      <Card variant="elevated">
        <Card.Header>
          <Heading level={3}>{t('course_information')}</Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap="lg">
            <Stack gap="xs">
              <Text weight="bold">{t('description')}</Text>
              <Text muted>{t('course_description_placeholder')}</Text>
            </Stack>
            <Stack gap="xs">
              <Text weight="bold">{t('learning_goals')}</Text>
              <ul className="list-disc pl-[var(--space-lg)] text-muted space-y-3xs">
                <li>{t('goal_understand_principles')}</li>
                <li>{t('goal_apply_methods')}</li>
              </ul>
            </Stack>
          </Stack>
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(CourseInfo)
