import { memo } from 'react'
import { Users } from 'lucide-react'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import SearchInput from '@/components/ui/SearchInput'
import ListItem from '@/components/ui/ListItem'
import { Heading } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

interface CourseParticipantsProps {
  participantSearch: string
  setParticipantSearch: (val: string) => void
  participantRoleFilter: string
  setParticipantRoleFilter: (val: string) => void
  participantsData: { name: string; role: string }[]
}

function CourseParticipants({
  participantSearch,
  setParticipantSearch,
  participantRoleFilter,
  setParticipantRoleFilter,
  participantsData,
}: CourseParticipantsProps) {
  const t = useStore((state) => state.t)

  return (
    <div className="animate-fade-in">
      <Card variant="elevated">
        <Card.Header className="flex-col items-start gap-md">
          <Heading level={3}>{t('participants')}</Heading>
          <div className="flex flex-col sm:flex-row gap-sm w-full">
            <SearchInput
              placeholder={t('search_participants_placeholder')}
              value={participantSearch}
              onChange={(e) => setParticipantSearch(e.target.value)}
              onClear={() => setParticipantSearch('')}
            />
            <label htmlFor="participant-role-filter" className="sr-only">{t('filter')}</label>
            <select
              id="participant-role-filter"
              value={participantRoleFilter}
              onChange={(e) => setParticipantRoleFilter(e.target.value)}
              className="px-xs py-2xs rounded-[var(--radius-lg)] border border-border bg-bg-card text-sm text-main outline-none focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-2 focus:border-primary transition-colors"
            >
              <option value="all">{t('all_roles')}</option>
              <option value="student">{t('role_student')}</option>
              <option value="teacher">{t('role_teacher')}</option>
            </select>
          </div>
        </Card.Header>
        <Card.Body className="p-[var(--space-0)]">
          <Stack gap="none">
            {participantsData
              .filter((p) => {
                if (participantRoleFilter !== 'all' && p.role !== participantRoleFilter) return false
                if (participantSearch && !p.name.toLowerCase().includes(participantSearch.toLowerCase())) return false
                return true
              })
              .map((p, i) => (
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
