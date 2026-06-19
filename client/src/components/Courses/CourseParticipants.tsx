import { memo } from 'react'
import { Users } from 'lucide-react'
import { Card, SearchInput, MasterItem, Select, Heading } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store'
import { useFilteredCollection } from '@/hooks'

interface CourseParticipantsProps {
  participantsData: { name: string; role: string; email?: string }[]
}

function CourseParticipants({ participantsData }: CourseParticipantsProps) {
  const t = useStore((state) => state.t)
  const { searchQuery, setSearchQuery, activeFilter: roleFilter, setActiveFilter: setRoleFilter, items: filteredParticipants } = useFilteredCollection(participantsData, {
    searchKeys: p => [p.name],
    filterKey: p => p.role,
    filterDefault: 'all',
  })

  return (
    <div className="animate-fade-in">
      <Card variant="elevated">
        <Card.Header className="flex-col items-start gap-md">
          <Heading level={3}>{t('participants')}</Heading>
          <div className="flex flex-col sm:flex-row gap-sm w-full">
            <SearchInput
              placeholder={t('search_participants_placeholder')}
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
            <label htmlFor="participant-role-filter" className="sr-only">{t('filter')}</label>
            <Select
              id="participant-role-filter"
              value={roleFilter ?? 'all'}
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
              <MasterItem
                key={i}
                leading={Users}
                title={p.name}
                subtitle={
                  <span className="flex flex-col sm:flex-row sm:items-center sm:gap-xs text-xs text-muted">
                    <span className="font-semibold text-foreground/70">
                      {p.role === 'student' ? t('role_student') : t('role_teacher')}
                    </span>
                    {p.email && (
                      <>
                        <span className="hidden sm:inline">·</span>
                        <a href={`mailto:${p.email}`} className="hover:underline text-primary break-all">
                          {p.email}
                        </a>
                      </>
                    )}
                  </span>
                }
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
