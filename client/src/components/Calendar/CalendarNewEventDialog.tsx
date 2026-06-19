import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import Button from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'

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
  isPending?: boolean
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
  isPending = false,
  t,
}: CalendarNewEventDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">{t('new_event')}</DialogTitle>
        </DialogHeader>
        <Stack gap="md" className="py-2">
          <Stack gap="xs">
            <label htmlFor="event-title" className="text-sm font-semibold text-text-main">
              {t('event_title')}
            </label>
            <Input
              id="event-title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder={t('event_title')}
              disabled={isPending}
              autoFocus
            />
          </Stack>
          <Stack gap="xs">
            <label htmlFor="event-date" className="text-sm font-semibold text-text-main">
              {t('event_date')}
            </label>
            <Input
              id="event-date"
              type="date"
              value={newEvent.date ? toInputDate(newEvent.date) : ''}
              onChange={(e) => setNewEvent({ ...newEvent, date: toInternalDate(e.target.value) })}
              disabled={isPending}
            />
          </Stack>
          <Stack direction="row" gap="md">
            <Stack gap="xs" className="flex-1">
              <label htmlFor="event-start" className="text-sm font-semibold text-text-main">
                {t('event_start_time')}
              </label>
              <Input
                id="event-start"
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                disabled={isPending}
              />
            </Stack>
            <Stack gap="xs" className="flex-1">
              <label htmlFor="event-end" className="text-sm font-semibold text-text-main">
                {t('event_end_time')}
              </label>
              <Input
                id="event-end"
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                disabled={isPending}
              />
            </Stack>
          </Stack>
          <Stack gap="xs">
            <label htmlFor="event-course" className="text-sm font-semibold text-text-main">
              {t('event_course')}
            </label>
            <Input
              id="event-course"
              value={newEvent.course}
              onChange={(e) => setNewEvent({ ...newEvent, course: e.target.value })}
              placeholder={t('event_course')}
              disabled={isPending}
            />
          </Stack>
          <Stack gap="xs">
            <label htmlFor="event-desc" className="text-sm font-semibold text-text-main">
              {t('event_description')}
            </label>
            <Textarea
              id="event-desc"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder={t('event_description')}
              rows={3}
              disabled={isPending}
              className="resize-none"
            />
          </Stack>
          
          <Stack direction="row" gap="sm" className="mt-4 pt-4 border-t border-border/50">
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={onClose}
              disabled={isPending}
            >
              {t('cancel')}
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 relative" 
              onClick={handleCreateEvent}
              disabled={isPending || !newEvent.title || !newEvent.date}
            >
              <Stack direction="row" gap="xs" align="center" justify="center">
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('create_event')}
              </Stack>
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

