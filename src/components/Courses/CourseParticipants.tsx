import { memo } from 'react'
import { Users } from 'lucide-react'
import Card from '@/components/Card'
import { Stack } from '@/components/LayoutPrimitives'
import { SearchInput } from '@/components/FormControls'
import ListItem from '@/components/ListItem'
import Select from '@/components/ui/Select'
import { Heading } from '@/components/Typography'
import useStore from '@/store'
import { useParticipantFilter } from '@/lib/useParticipantFilter'

interface CourseParticipantsProps {
  participantsData: { name: string; role: string }[]
}

function CourseParticipants({ participantsData }: CourseParticipantsProps) {
  const t = useStore((state) => state.t)
  const { searchQuery, setSearchQuery, roleFilter, setRoleFilter, filteredParticipants } = useParticipantFilter(participantsData)

  return (
    <div className="animate-fade-in">
      <Card variant="elevated">
        <Card.Header className="flex-col items-start gap-md">
          <Heading level={3}>{t('participants')}</Heading>
          <div className="flex flex-col sm:flex-row gap-sm w-full">
            <SearchInput
              placeholder={t('search_participants_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
            <label htmlFor="participant-role-filter" className="sr-only">{t('filter')}</label>
            <Select
              id="participant-role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="sm:w-[150px]"
            >
              <option value="all">{t('all_roles')}</option>
              <option value="student">{t('role_student')}</option>
              <option value="teacher">{t('role_teacher')}</option>
            </Select>
          </div>
        </Card.Header>
        <Card.Body className="p-[var(--space-0)]">
          <Stack gap="none">
            {filteredParticipants.map((p, i) => (
              <ListItem
                key={i}
                icon={Users}
                title={p.name}
                subtitle={p.role === 'student' ? t('role_student') : t('role_teacher')}
                className="border-b border-border/50 last:border-0"
              />
            ))}
          </Stack>
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(CourseParticipants)
