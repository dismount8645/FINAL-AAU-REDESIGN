import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Users, GraduationCap, Book, FileSignature, Clock } from 'lucide-react'
import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout'
import { MasterItem } from '@/components/ui'
import Button from '@/components/ui/Button'
import { Avatar } from '@/components/ui'
import { Text } from '@/components/ui'
import useStore from '@/store'
import { ASSETS } from '@/lib'
import { useFormat } from '@/hooks'

interface CourseSidebarProps {
  courseId: string
  professor: string
  email: string
  setActiveTab: (tab: string) => void
}

function CourseSidebar({
  courseId,
  professor,
  email,
  setActiveTab,
}: CourseSidebarProps) {
  const t = useStore((state) => state.t)
  const navigate = useNavigate()
  const { formatDeadline } = useFormat()

  return (
    <aside className="course-sidebar flex flex-col gap-lg">
      <Card variant="elevated" className="h-fit">
        <Card.Header>
          <Text weight="bold" size="lg" className="card__title">{t('quick_access')}</Text>
        </Card.Header>
        <Card.Body className="p-sm">
          <Stack gap="none">
            <MasterItem
              leading={MessageSquare}
              leadingClassName="text-primary"
              title={t('course_forum')}
              onClick={() => { setActiveTab('forum'); window.scrollTo(0, 0) }}
              className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none"
            />
            <MasterItem
              leading={Users}
              leadingClassName="text-primary"
              title={t('participants')}
              onClick={() => { setActiveTab('participants'); window.scrollTo(0, 0) }}
              className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none"
            />
            <MasterItem
              leading={GraduationCap}
              leadingClassName="text-primary"
              title={t('my_grades')}
              onClick={() => { navigate('/grades') }}
              className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none"
            />
            <MasterItem
              leading={Book}
              leadingClassName="text-primary"
              title={t('syllabus')}
              onClick={() => { setActiveTab('resources'); window.scrollTo(0, 0) }}
              className="rounded-[var(--radius-lg)] hover:bg-bg-hover border-none"
            />
          </Stack>
        </Card.Body>
      </Card>

      <Card variant="brand" className="relative overflow-hidden group">
        <Card.Decoration icon={FileSignature} className="opacity-10 group-hover:scale-110 transition-transform duration-500" />
        <Card.Header>
          <Text weight="bold" size="lg" className="card__title text-white">{t('next_assignment')}</Text>
        </Card.Header>
        <Card.Body>
          <Text size="sm" weight="bold" className="mb-md text-white/90 block leading-tight">
            {t(`course_${courseId}_${courseId === '2' ? 'w2_i204' : 's2_i105'}_title`)}
          </Text>
          <Stack direction="row" align="center" gap="sm">
            <Clock size={16} strokeWidth={2} className="text-white opacity-70" />
            <Text size="xs" className="text-white/90">
              {formatDeadline(new Date(Date.now() + (courseId === '1' ? 4 : (courseId === '2' ? 2 : 7)) * 24 * 60 * 60 * 1000))}
            </Text>
          </Stack>
        </Card.Body>
        <Card.Footer className="border-t border-white/10 pt-md">
          <Button
            variant="primary"
            full
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate(`/submission/${courseId}/${courseId === '2' ? '204' : '105'}`)}
          >
            {t('go_to_assignment')}
          </Button>
        </Card.Footer>
      </Card>

      <Card variant="elevated" className="h-fit">
        <Card.Header>
          <Text weight="bold" size="lg" className="card__title">{t('instructor')}</Text>
        </Card.Header>
        <Card.Body className="pt-md pb-md">
          <Stack direction="row" align="center" gap="md">
            <Avatar
              src={ASSETS.promo.instructor}
              name={professor}
              size="lg"
              status="online"
            />
            <Stack gap="none" className="min-w-0 flex-1">
              <Text size="sm" weight="bold" className="truncate block">{professor}</Text>
              <Text size="xs" muted className="break-all block">{email}</Text>
            </Stack>
          </Stack>
        </Card.Body>
        <Card.Footer className="border-t border-border pt-md">
          <Button variant="secondary" full className="shadow-[var(--shadow-sm)]">
            {t('send_message')}
          </Button>
        </Card.Footer>
      </Card>
    </aside>
  )
}

export default memo(CourseSidebar)
