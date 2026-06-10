import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, User as UserIcon } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import Button from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui'
import type { CalendarEvent } from '@/lib/types'
import useStore from '@/store'
import { PATHS } from '@/routes'

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
      <DialogContent className="sm:max-w-[540px] md:max-w-[620px] max-h-[80vh] overflow-y-auto p-0 flex flex-col scrollbar-thin">
        <div className="animate-modal-enter flex flex-col h-full w-full">
          <div
            className="calendar__detail-header p-[var(--space-md)_var(--space-lg)] pr-[60px] border-b border-[var(--border-color)]/60 flex items-center justify-between gap-[var(--space-md)]"
            style={{ borderLeft: `6px solid ${selectedEvent.color}` }}
          >
            <Stack gap="3xs" className="min-w-0 flex-1">
              <Heading level={2} className="calendar__detail-title text-xl font-extrabold text-main leading-tight truncate">
                {getEventTitle(selectedEvent)}
              </Heading>
              {(() => {
                const courseTitle = lang === 'da' ? selectedEvent.courseTitleDa : selectedEvent.courseTitleEn
                if (courseTitle) {
                  return (
                    <Text size="xs" weight="bold" className="text-primary dark:text-[var(--aau-light-blue-sec)] truncate">
                      {courseTitle} {selectedEvent.courseCode ? `(${selectedEvent.courseCode})` : ''}
                    </Text>
                  )
                }
                return null
              })()}
            </Stack>
            <Button variant="primary" size="sm" className="shrink-0" onClick={() => navigate(PATHS.COURSE(1))}>
              {t('go_to_module')}
            </Button>
          </div>

          <Stack gap="lg" className="p-md lg:p-lg">
            <div className="event-info-grid grid grid-cols-1 sm:grid-cols-2 gap-md p-md bg-bg-highlight/30 dark:bg-white/5 border border-[var(--border-color)]/40 rounded-[var(--radius-lg)]">
              <Stack className="info-item flex flex-row items-start gap-sm">
                <div className="p-xs bg-primary/10 text-primary dark:text-[var(--aau-light-blue-sec)] rounded-lg shrink-0 mt-0.5">
                  <Clock size={16} strokeWidth={2.5} />
                </div>
                <Stack gap="3xs">
                  <Text size="xs" weight="bold" muted className="tracking-wider uppercase opacity-70">
                    {t('date_and_time')}
                  </Text>
                  <Text size="sm" weight="extrabold" className="text-main leading-snug">
                    {(() => {
                      const [y, m, d_num] = selectedEvent.dateKey.split('-').map(Number)
                      const date = new Date(y, m, d_num)
                      return `${dayNames[(date.getDay() + 6) % 7]} d. ${date.getDate()}. ${monthNames[date.getMonth()]}`
                    })()}
                  </Text>
                  <Text size="xs" weight="semibold" muted className="mt-3xs">
                    {selectedEvent.time}
                  </Text>
                </Stack>
              </Stack>
              <Stack className="info-item flex flex-row items-start gap-sm">
                <div className="p-xs bg-primary/10 text-primary dark:text-[var(--aau-light-blue-sec)] rounded-lg shrink-0 mt-0.5">
                  <MapPin size={16} strokeWidth={2.5} />
                </div>
                <Stack gap="3xs">
                  <Text size="xs" weight="bold" muted className="tracking-wider uppercase opacity-70">
                    {t('location_label')}
                  </Text>
                  <Text size="sm" weight="semibold" className="text-main">{selectedEvent.location}</Text>
                </Stack>
              </Stack>
              <Stack className="info-item flex flex-row items-start gap-sm sm:col-span-2 border-t border-[var(--border-color)]/20 pt-sm mt-3xs">
                <div className="p-xs bg-primary/10 text-primary dark:text-[var(--aau-light-blue-sec)] rounded-lg shrink-0 mt-0.5">
                  <UserIcon size={16} strokeWidth={2.5} />
                </div>
                <Stack gap="3xs">
                  <Text size="xs" weight="bold" muted className="tracking-wider uppercase opacity-70">
                    {t('lecturer_host')}
                  </Text>
                  <Text size="sm" weight="semibold" className="text-main">{selectedEvent.host}</Text>
                </Stack>
              </Stack>
            </div>

            <Text muted className="calendar__detail-description text-sm leading-relaxed block bg-bg-highlight/10 p-sm rounded-lg border border-[var(--border-color)]/20">
              {t('event_detail_desc')}
            </Text>

            <div className="calendar__detail-actions flex justify-end mt-xs">
              <Button variant="outline" size="sm" onClick={() => navigate('/submission/1')}>
                {lang === 'da' ? 'Se detaljer' : 'Se detaljer'}
              </Button>
            </div>
          </Stack>
        </div>
      </DialogContent>
    </Dialog>
  )
}
