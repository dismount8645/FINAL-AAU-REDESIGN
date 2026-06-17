import { memo } from 'react';
import { Card } from '@/components/ui';
import { MasterItem } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Heading } from '@/components/ui';
import useStore from '@/store';
import { getFileTypeConfig } from '@/lib/utils';

function CourseResources() {
  const t = useStore((state) => state.t)

  const pdfConfig = getFileTypeConfig('pdf')
  const PdfIcon = pdfConfig.icon

  const fileConfig = getFileTypeConfig('file')
  const FileIcon = fileConfig.icon

  const linkConfig = getFileTypeConfig('link')
  const LinkIcon = linkConfig.icon

  return (
    <div className="animate-fade-in">
      <Card variant="elevated">
        <Card.Header>
          <Heading level={3}>{t('tab_resources')}</Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap="md">
            <MasterItem
              leading={PdfIcon}
              leadingClassName={pdfConfig.colorClass}
              title={t('syllabus')}
              subtitle="PDF, 2.4 MB"
              onClick={(e) => e.preventDefault()}
            />
            <MasterItem
              leading={FileIcon}
              leadingClassName={fileConfig.colorClass}
              title={t('reading_list')}
              subtitle="Excel, 150 KB"
              onClick={(e) => e.preventDefault()}
            />
            <MasterItem
              leading={LinkIcon}
              leadingClassName={linkConfig.colorClass}
              title={t('exam_schedule')}
              subtitle="Link"
              onClick={(e) => e.preventDefault()}
            />
          </Stack>
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(CourseResources)

