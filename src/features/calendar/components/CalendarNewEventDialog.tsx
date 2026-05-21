import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Text } from '@/components/ui/Typography'

interface NewEventFormState {
  title: string
  date: string
  startTime: string
  endTime: string
  course: string
  description: string
}

interface CalendarNewEventDialogProps {
  isOpen: boolean
  onClose: () => void
  newEvent: NewEventFormState
  setNewEvent: React.Dispatch<React.SetStateAction<NewEventFormState>>
  handleCreateEvent: () => void
  t: (key: string) => string
}

const toInputDate = (internal: string): string => {
  const [y, m, d] = internal.split('-').map(Number)
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

const toInternalDate = (input: string): string => {
  const [y, m, d] = input.split('-').map(Number)
  return `${y}-${m - 1}-${d}`
}

export default function CalendarNewEventDialog({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  handleCreateEvent,
  t,
}: CalendarNewEventDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('new_event')}</DialogTitle>
        </DialogHeader>
        <Stack gap="md">
          <Stack gap="xs">
            <Text size="sm" weight="bold">
              {t('event_title')}
            </Text>
            <Input
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder={t('event_title')}
            />
          </Stack>
          <Stack gap="xs">
            <Text size="sm" weight="bold">
              {t('event_date')}
            </Text>
            <Input
              type="date"
              value={newEvent.date ? toInputDate(newEvent.date) : ''}
              onChange={(e) => setNewEvent({ ...newEvent, date: toInternalDate(e.target.value) })}
            />
          </Stack>
          <Stack direction="row" gap="md">
            <Stack gap="xs" className="flex-1">
              <Text size="sm" weight="bold">
                {t('event_start_time')}
              </Text>
              <Input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              />
            </Stack>
            <Stack gap="xs" className="flex-1">
              <Text size="sm" weight="bold">
                {t('event_end_time')}
              </Text>
              <Input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              />
            </Stack>
          </Stack>
          <Stack gap="xs">
            <Text size="sm" weight="bold">
              {t('event_course')}
            </Text>
            <Input
              value={newEvent.course}
              onChange={(e) => setNewEvent({ ...newEvent, course: e.target.value })}
              placeholder={t('event_course')}
            />
          </Stack>
          <Stack gap="xs">
            <Text size="sm" weight="bold">
              {t('event_description')}
            </Text>
            <Textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder={t('event_description')}
              rows={3}
            />
          </Stack>
          <Stack direction="row" gap="sm" className="calendar__modal-actions mt-[var(--space-sm)]">
            <Button variant="secondary" full onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button variant="primary" full onClick={handleCreateEvent}>
              {t('create_event')}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
