import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, User as UserIcon } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/Dialog'
import Stack from '@/components/Stack'
import Badge from '@/components/Badge'
import Icon from '@/components/Icon'
import Button from '@/components/Button'
import { Heading, Text } from '@/components/Typography'
import type { CalendarEvent } from '@/types'
import useStore from '@/lib/store'

interface CalendarEventDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedEvent: (CalendarEvent & { dateKey: string }) | null
  dayNames: string[]
  monthNames: string[]
  t: (key: string) => string
}

export default function CalendarEventDetailsDialog({
  isOpen,
  onClose,
  selectedEvent,
  dayNames,
  monthNames,
  t,
}: CalendarEventDetailsDialogProps) {
  const navigate = useNavigate()
  const lang = useStore(state => state.lang)

  if (!selectedEvent) return null

  const getEventTitle = (e: CalendarEvent) => {
    return e.title || (lang === 'da' ? e.titleDa : e.titleEn) || ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <Stack
          direction="row"
          align="center"
          justify="between"
          className="calendar__detail-header p-[var(--space-md)_var(--space-lg)] border-b border-[var(--border-color)] gap-[var(--space-md)]"
          style={{ borderLeft: `6px solid ${selectedEvent.color}` }}
        >
          <Stack gap="xs">
            <Badge
              variant="default"
              className="calendar__detail-badge text-[0.6rem]"
              style={{ background: selectedEvent.color, color: 'var(--text-white)' }}
            >
              {t('event')}
            </Badge>
            <Heading level={2} className="calendar__detail-title text-[1.4rem]">
              {getEventTitle(selectedEvent)}
            </Heading>
          </Stack>
        </Stack>
        <Stack className="event-info-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[var(--space-md)] mt-[var(--space-md)] p-[var(--space-md)] bg-bg-main rounded-[var(--radius-md)]">
          <Stack className="info-item flex items-start gap-[var(--space-sm)]">
            <Icon icon={Clock} />
            <Stack gap="2xs">
              <Text size="xs" weight="bold" muted>
                {t('date_and_time')}
              </Text>
              <Text weight="semibold">
                {(() => {
                  const [y, m, d_num] = selectedEvent.dateKey.split('-').map(Number)
                  const date = new Date(y, m, d_num)
                  return `${dayNames[(date.getDay() + 6) % 7]} d. ${date.getDate()}. ${monthNames[date.getMonth()]}`
                })()}
              </Text>
              <Text size="sm" muted>
                {selectedEvent.time}
              </Text>
            </Stack>
          </Stack>
          <Stack className="info-item flex items-start gap-[var(--space-sm)]">
            <Icon icon={MapPin} />
            <Stack gap="2xs">
              <Text size="xs" weight="bold" muted>
                {t('location_label')}
              </Text>
              <Text>{selectedEvent.location}</Text>
            </Stack>
          </Stack>
          <Stack className="info-item flex items-start gap-[var(--space-sm)]">
            <Icon icon={UserIcon} />
            <Stack gap="2xs">
              <Text size="xs" weight="bold" muted>
                {t('lecturer_host')}
              </Text>
              <Text>{selectedEvent.host}</Text>
            </Stack>
          </Stack>
        </Stack>
        <Text muted className="calendar__detail-description mt-[var(--space-md)] text-[0.9rem] leading-[1.6] block">
          {t('event_detail_desc')}
        </Text>
        <Stack direction="row" gap="sm" className="calendar__detail-actions mt-[var(--space-lg)]">
          <Button variant="primary" full onClick={() => navigate('/course/1')}>
            {t('go_to_module')}
          </Button>
          <Button variant="secondary" full onClick={() => navigate('/submission/1')}>
            {t('full_info')}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
