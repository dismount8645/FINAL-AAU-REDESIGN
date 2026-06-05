import { memo } from 'react';
import { FileSignature, Book, Clock } from 'lucide-react';
import { Card } from '@/components/ui';
import { MasterItem } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';;
import { Heading } from '@/components/ui';
import useStore from '@/store';

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
            <MasterItem leading={FileSignature} title={t('syllabus')} subtitle="PDF, 2.4 MB" onClick={(e) => e.preventDefault()} />
            <MasterItem leading={Book} title={t('reading_list')} subtitle="Excel, 150 KB" onClick={(e) => e.preventDefault()} />
            <MasterItem leading={Clock} title={t('exam_schedule')} subtitle="Link" onClick={(e) => e.preventDefault()} />
          </Stack>
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(CourseResources)

if (import.meta.vitest) {
  beforeEach(() => {
    useStore.setState({ lang: 'da' })
  })

  it('renders heading with translated title', () => {
    render(<CourseResources />)
    expect(screen.getByText('Ressourcer')).toBeInTheDocument()
  })
  
  it('renders three list items with translated labels', () => {
    render(<CourseResources />)
    expect(screen.getByText('Pensumliste')).toBeInTheDocument()
    expect(screen.getByText('Litteraturliste')).toBeInTheDocument()
    expect(screen.getByText('Eksamensplan')).toBeInTheDocument()
  })
}
