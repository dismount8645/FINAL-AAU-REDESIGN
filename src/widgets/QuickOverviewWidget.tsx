import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

import { Text } from '@/components/ui/Typography'
import Card from '@/components/ui/Card'
import type { WidgetProps } from '@/types'
import useStore from '@/store/useStore'

const todayEvents = [
  { time: '08:15', titleKey: 'lecture' },
  { time: '23:59', titleKey: 'project_report' },
]

export default function QuickOverviewWidget({ isEditing }: WidgetProps) {
  const navigate = useNavigate()
  const { t } = useStore()

  return (
    <Card className="widget-card h-full w-full flex flex-col">
      <Card.Header spacing="compact">
        <Text weight="bold" size="lg" className="card__title">{t('quick_overview')}</Text>
        <button
          type="button"
          className="text-sm text-primary dark:text-slate-200 font-semibold hover:underline cursor-pointer inline-flex items-center gap-[var(--space-2xs)] whitespace-nowrap transition-all hover:opacity-80 bg-transparent border-none p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm"
          onClick={() => !isEditing && navigate('/calendar')}
        >
          {t('go_to_calendar')}<ChevronRight size={14} strokeWidth={2} />
        </button>
      </Card.Header>

      <Card.Body spacing="compact">
        <div className="h-full w-full flex flex-col gap-[var(--space-xs)]">
          {todayEvents.map((event, index) => (
            <div
              key={event.titleKey}
              className={`flex items-center justify-start gap-[var(--space-xs)] py-[var(--space-2xs)] px-[var(--space-2xs)] ${index < todayEvents.length - 1 ? 'border-b border-border' : ''}`}
            >
              <span className="text-sm text-slate-500 dark:text-slate-300 font-medium">{event.time}</span>
              <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">{t(event.titleKey)}</span>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}
