import { memo } from 'react'
import { FileSignature, Book, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import ListItem from '@/components/ui/ListItem'
import { Heading } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

function CourseResources() {
  const t = useStore((state) => state.t)

  return (
    <div className="animate-fade-in">
      <Card variant="elevated">
        <Card.Header>
          <Heading level={3}>{t('tab_resources')}</Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap="md">
            <ListItem icon={FileSignature} title={t('syllabus')} subtitle="PDF, 2.4 MB" onClick={(e) => e.preventDefault()} />
            <ListItem icon={Book} title={t('reading_list')} subtitle="Excel, 150 KB" onClick={(e) => e.preventDefault()} />
            <ListItem icon={Clock} title={t('exam_schedule')} subtitle="Link" onClick={(e) => e.preventDefault()} />
          </Stack>
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(CourseResources)
