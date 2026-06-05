import { memo } from 'react'
import { FileSignature, Clock } from 'lucide-react'
import { Card } from '@/components/ui'
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import Button from '@/components/ui/Button'
import { MasterItem } from '@/components/ui'
import { Heading, Text } from '@/components/ui'
import useStore from '@/store'

function CoursePbl() {
  const t = useStore((state) => state.t)

  return (
    <div className="animate-fade-in">
      <Card variant="elevated">
        <Card.Header>
          <Heading level={3}>{t('tab_pbl_group')}</Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap="md">
            <Card variant="outlined" className="bg-primary/5 border-primary/20">
              <Card.Body className="p-md">
                <Stack direction="row" justify="between" align="center">
                  <Stack gap="xs">
                    <Text weight="bold" size="lg" className="text-primary">{t('pbl_group_name')}</Text>
                    <Text size="sm" muted>{t('pbl_project_title')}</Text>
                  </Stack>
                  <Button variant="primary" size="sm">{t('pbl_view_space')}</Button>
                </Stack>
              </Card.Body>
            </Card>
            
            <Grid columns={2} gap="md">
              <Card variant="outlined">
                <Card.Header>
                  <Text weight="semibold">{t('pbl_recent_files')}</Text>
                </Card.Header>
                <Card.Body className="p-sm">
                  <Stack>
                    <MasterItem title="Draft_v2.pdf" leading={FileSignature} />
                    <MasterItem title="User_Testing_Data.xlsx" leading={FileSignature} />
                  </Stack>
                </Card.Body>
              </Card>
              <Card variant="outlined">
                <Card.Header>
                  <Text weight="semibold">{t('pbl_upcoming_deadlines')}</Text>
                </Card.Header>
                <Card.Body className="p-sm">
                  <Stack>
                    <MasterItem title={t('pbl_peer_feedback')} subtitle={t('pbl_tomorrow') + ', 12:00'} leading={Clock} />
                    <MasterItem title={t('pbl_final_submission')} subtitle={t('pbl_friday') + ', 23:59'} leading={Clock} />
                  </Stack>
                </Card.Body>
              </Card>
            </Grid>
          </Stack>
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(CoursePbl)
