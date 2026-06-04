import { useState } from 'react'
import type { Widget } from '@/lib/types'
import Card from '@/components/Card'
import { Stack } from '@/components/LayoutPrimitives'
import Button from '@/components/ui/Button'
import { Text } from '@/components/Typography'
import Dropdown from '@/components/Dropdown'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/Dialog'
import { IconCircle } from '@/components/Icon'
import { Edit, Plus, RotateCcw } from 'lucide-react'

interface WidgetCustomizerProps {
  hiddenWidgets: Widget[]
  widgetLabels: Record<string, string>
  toggleVisibility: (id: string) => void
  resetWidgets: () => void
  t: (key: string) => string
}

export function WidgetCustomizer({
  hiddenWidgets,
  widgetLabels,
  toggleVisibility,
  resetWidgets,
  t,
}: WidgetCustomizerProps) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  const handleReset = () => {
    resetWidgets()
    setResetDialogOpen(false)
  }

  return (
    <Card
      variant="default"
      accent="left"
      className="dashboard__edit-banner-card bg-bg-highlight mb-[var(--space-lg)] dark:bg-[rgba(var(--aau-light-blue-rgb),0.25)] shadow-[var(--shadow-sm)] min-h-[60px]"
    >
      <Card.Body className="dashboard__edit-banner-body p-[var(--space-md)_var(--space-lg)]">
        <Stack direction="row" align="center" gap="md">
          <IconCircle
            icon={Edit}
            size={32}
            className="bg-bg-highlight text-primary dark:bg-white/10 dark:text-white"
          />
          <Stack gap="2xs" className="flex-1">
            <Text size="sm" weight="bold" className="dashboard__edit-banner-title text-primary dark:text-white">
              {t('dashboard.edit_mode_active')}
            </Text>
            <Text size="xs" muted className="dark:text-white/70">
              {t('dashboard.edit_mode_hint')}
            </Text>
          </Stack>

          <Stack direction="row" gap="sm" className="shrink-0">
            <Dropdown
              trigger={
                <Button variant="secondary" size="sm" icon={Plus}>
                  {t('dashboard.add_widget')}
                </Button>
              }
              width="220px"
            >
              {hiddenWidgets.length > 0 ? (
                <ul className="space-y-3xs" role="menu">
                  {hiddenWidgets.map((w) => (
                    <li key={w.id} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        className="w-full text-left px-xs py-2xs rounded-[var(--radius-md)] text-sm hover:bg-bg-hover transition-colors flex items-center gap-[var(--space-sm)] focus-visible:outline-none focus-visible:shadow-focus"
                        onClick={() => toggleVisibility(w.id)}
                      >
                        <Plus size={14} strokeWidth={2} />
                        {(() => {
                          /* istanbul ignore next */ return widgetLabels[w.id] || w.id
                        })()}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text size="sm" muted className="px-xs py-2xs block">
                  {t('dashboard.all_widgets_added')}
                </Text>
              )}
            </Dropdown>

            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <DialogTrigger render={<Button variant="ghost" size="sm" icon={RotateCcw} aria-label={t('common.reset')} />}>
                {t('common.reset')}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dashboard.confirm_reset_title')}</DialogTitle>
                  <DialogDescription>{t('dashboard.confirm_reset_message')}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>{t('common.cancel')}</DialogClose>
                  <Button variant="danger" onClick={handleReset}>
                    {t('dashboard.reset_confirm')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Stack>
        </Stack>
      </Card.Body>
    </Card>
  )
}
