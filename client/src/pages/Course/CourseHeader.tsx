import { ModuleHeader, Card, Text, Button } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { cn } from '@/lib/utils';

interface CourseHeaderProps {
  data: {
    img: string
    code: string
    professor: string
  }
  id: string
  t: (key: string) => string
  descExpanded: boolean
  setDescExpanded: (expanded: boolean) => void
  courseDesc: string
}

function CourseHeader({ data, id, t, descExpanded, setDescExpanded, courseDesc }: CourseHeaderProps) {
  return (
    <>
      <ModuleHeader
        image={data.img}
        code={data.code}
        title={t(`course_${id}_title`)}
        semester={t('course_semester_spring')}
        professor={data.professor}
        campus={t('course_campus_aalborg')}
      />

      <div className="mt-md">
        <Card variant="elevated" className="overflow-hidden">
          <Card.Body padding="compact">
            <Stack gap="xs">
              <Text weight="bold" size="sm" className="text-muted text-uppercase tracking-wider">
                {t('description')}
              </Text>
              <div 
                className={cn(
                  "text-sm text-foreground/80 transition-all duration-300 relative",
                  !descExpanded && "line-clamp-2"
                )}
                style={{
                  display: !descExpanded ? '-webkit-box' : 'block',
                  WebkitLineClamp: !descExpanded ? 2 : undefined,
                  WebkitBoxOrient: !descExpanded ? 'vertical' : undefined,
                  overflow: 'hidden'
                }}
              >
                {courseDesc}
              </div>
              <div className="flex justify-start">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-0 py-none h-fit hover:bg-transparent text-primary font-bold hover:text-primary-dark"
                  onClick={() => setDescExpanded(!descExpanded)}
                >
                  {descExpanded ? 'Vis mindre' : 'Vis mere'}
                </Button>
              </div>
            </Stack>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default CourseHeader
