import { memo } from 'react'
import { Clock } from 'lucide-react'
import { Card } from '@/components/ui'
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import Button from '@/components/ui/Button'
import { MasterItem } from '@/components/ui'
import { Text } from '@/components/ui'
import useStore from '@/store'
import { getFileTypeConfig } from '@/lib/utils'

function CoursePbl() {
  const t = useStore((state) => state.t)

  const pdfConfig = getFileTypeConfig('Draft_v2.pdf')
  const PdfIcon = pdfConfig.icon

  const xlsConfig = getFileTypeConfig('User_Testing_Data.xlsx')
  const XlsIcon = xlsConfig.icon

  return (
    <div className="animate-fade-in">
      <Card variant="elevated">
        <Card.Header>
          <Text weight="bold" size="lg" className="card__title">{t('tab_pbl_group')}</Text>
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
                    <MasterItem
                      title="Draft_v2.pdf"
                      leading={
                        <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)] shrink-0 transition-colors ${pdfConfig.colorClass}`}>
                          <PdfIcon size={18} strokeWidth={2.5} aria-hidden="true" />
                        </div>
                      }
                    />
                    <MasterItem
                      title="User_Testing_Data.xlsx"
                      leading={
                        <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)] shrink-0 transition-colors ${xlsConfig.colorClass}`}>
                          <XlsIcon size={18} strokeWidth={2.5} aria-hidden="true" />
                        </div>
                      }
                    />
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
