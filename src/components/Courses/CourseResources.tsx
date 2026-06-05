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
              leading={
                <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)] shrink-0 transition-colors ${pdfConfig.colorClass}`}>
                  <PdfIcon size={18} strokeWidth={2.5} aria-hidden="true" />
                </div>
              }
              title={t('syllabus')}
              subtitle="PDF, 2.4 MB"
              onClick={(e) => e.preventDefault()}
            />
            <MasterItem
              leading={
                <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)] shrink-0 transition-colors ${fileConfig.colorClass}`}>
                  <FileIcon size={18} strokeWidth={2.5} aria-hidden="true" />
                </div>
              }
              title={t('reading_list')}
              subtitle="Excel, 150 KB"
              onClick={(e) => e.preventDefault()}
            />
            <MasterItem
              leading={
                <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)] shrink-0 transition-colors ${linkConfig.colorClass}`}>
                  <LinkIcon size={18} strokeWidth={2.5} aria-hidden="true" />
                </div>
              }
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

  it('handles click on all MasterItems', () => {
    render(<CourseResources />)
    const items = [screen.getByText('Pensumliste'), screen.getByText('Litteraturliste'), screen.getByText('Eksamensplan')]
    items.forEach(item => {
      fireEvent.click(item)
    })
    expect(screen.getByText('Pensumliste')).toBeInTheDocument()
    expect(screen.getByText('Litteraturliste')).toBeInTheDocument()
    expect(screen.getByText('Eksamensplan')).toBeInTheDocument()
  })
}
