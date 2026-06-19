import { memo } from 'react';
import { Settings, Check, RotateCcw, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import Checkbox from '@/components/ui/Checkbox';
import type { DashboardWidgetConfig } from '@/store/slices/uiSlice';

interface DashboardHeaderProps {
  isEditing: boolean
  isModalOpen: boolean
  isResetDialogOpen: boolean
  dashboardLayout: DashboardWidgetConfig[]
  favorites: { readonly length: number } | readonly unknown[]
  onEdit: () => void
  onSave: () => void
  onCancelEdit: () => void
  onReset: () => void
  onOpenWidgetsModal: () => void
  onDismissWidgetsModal: () => void
  onDoneWidgetsModal: () => void
  onResetDialogChange: (open: boolean) => void
  onToggleWidget: (id: string, checked: boolean) => void
  t: (key: string) => string
  lang: string
}

function DashboardHeader({
  isEditing,
  isModalOpen,
  isResetDialogOpen,
  dashboardLayout,
  favorites,
  onEdit,
  onSave,
  onCancelEdit,
  onReset,
  onOpenWidgetsModal,
  onDismissWidgetsModal,
  onDoneWidgetsModal,
  onResetDialogChange,
  onToggleWidget,
  t,
  lang,
}: DashboardHeaderProps) {
  if (!isEditing) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        icon={Settings}
        className="text-text-muted hover:text-primary"
      >
        {t('dashboard.edit_dashboard')}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-xs flex-wrap">
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (open) {
          onOpenWidgetsModal()
        } else {
          onDismissWidgetsModal()
        }
      }}>
        <DialogTrigger>
          <Button variant="ghost" size="sm" icon={Plus} className="text-text-muted hover:text-primary">
            {lang === 'da' ? '+ Widgets' : '+ Widgets'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[420px] max-h-[calc(100dvh-96px)] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>{t('dashboard.add_remove_widgets')}</DialogTitle>
            <DialogDescription>
              {lang === 'da' ? 'Vælg de moduler, du vil have synlige på dit dashboard.' : 'Select modules to show on your dashboard.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-0 overflow-y-auto flex-1 -mx-[var(--space-md)] lg:-mx-[var(--space-lg)] px-[var(--space-md)] lg:px-[var(--space-lg)]">
            {(() => {
              const groups: { labelDa: string; labelEn: string; widgetIds: string[] }[] = [
                { labelDa: 'Dagligt overblik', labelEn: 'Daily overview', widgetIds: ['quickOverview', 'deadlines', 'calendar'] },
                { labelDa: 'Kommunikation', labelEn: 'Communication', widgetIds: ['messages', 'forumActivity'] },
                { labelDa: 'Genveje og fag', labelEn: 'Shortcuts & courses', widgetIds: ['favorites', 'shortcuts', 'courseProgress', 'support'] },
              ];
              const widgetMap = new Map(dashboardLayout.map(w => [w.id, w]));
              return groups.map((group, gi) => (
                <div key={gi}>
                  {gi > 0 && <div className="border-t border-[var(--border-color)]/20 mt-xs" />}
                  <div className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider px-xs pt-sm pb-2xs select-none">
                    {lang === 'da' ? group.labelDa : group.labelEn}
                  </div>
                  {group.widgetIds.map(widgetId => {
                    const widget = widgetMap.get(widgetId);
                    if (!widget) return null;
                    const isFavoritesEmpty = widget.id === 'favorites' && favorites.length === 0;
                    const isDisabled = widget.id === 'courseProgress';
                    return (
                      <div key={widget.id} className={`flex items-center gap-xs py-xs px-xs rounded-[var(--radius-sm)] transition-colors ${isDisabled ? 'opacity-50' : 'hover:bg-bg-hover'}`}>
                        <Checkbox
                          id={`widget-checkbox-${widget.id}`}
                          checked={widget.visible !== false}
                          onChange={(e) => onToggleWidget(widget.id, e.target.checked)}
                          disabled={isDisabled}
                        />
                        <div className="flex flex-col gap-3xs min-w-0 flex-1">
                          <label htmlFor={`widget-checkbox-${widget.id}`} className={`text-xs font-bold text-main cursor-pointer select-none ${isDisabled ? 'cursor-not-allowed' : ''}`}>
                            {t(`dashboard.widget_${widget.id}`)}
                          </label>
                          <span className="text-[11px] text-text-muted leading-relaxed">
                            {widget.id === 'favorites' && isFavoritesEmpty
                              ? (lang === 'da' ? 'Vises som tom widget, indtil du vælger favoritter.' : 'Shows as empty widget until you choose favorites.')
                              : widget.id === 'calendar'
                                ? (lang === 'da' ? 'Dagens program og kommende aftaler.' : "Today's schedule and upcoming events.")
                                : widget.id === 'courseProgress'
                                  ? (lang === 'da' ? 'Ikke tilgængelig — kræver dataintegration.' : 'Unavailable — requires data integration.')
                                  : widget.id === 'support'
                                    ? (lang === 'da' ? 'Hurtig adgang til teknisk hjælp.' : 'Quick access to technical support.')
                                    : widget.id === 'shortcuts'
                                      ? (lang === 'da' ? 'Genveje til AAU-systemer.' : 'Shortcuts to AAU systems.')
                                      : widget.id === 'quickOverview'
                                        ? (lang === 'da' ? 'Dagens aktiviteter, deadlines og ulæste beskeder.' : "Today's activities, deadlines, and unread messages.")
                                        : widget.id === 'deadlines'
                                          ? (lang === 'da' ? 'Kommende afleveringsfrister.' : 'Upcoming assignment deadlines.')
                                          : widget.id === 'messages'
                                            ? (lang === 'da' ? 'Nylige beskeder og notifikationer.' : 'Recent messages and notifications.')
                                            : widget.id === 'forumActivity'
                                              ? (lang === 'da' ? 'Seneste indlæg i kursusfora.' : 'Latest posts in course forums.')
                                              : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
          <DialogFooter className="flex gap-xs justify-end shrink-0 mt-sm">
            <Button variant="ghost" size="sm" onClick={onDismissWidgetsModal}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={onDoneWidgetsModal}>
              {t('common.done')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResetDialogOpen} onOpenChange={onResetDialogChange}>
        <DialogTrigger>
          <Button variant="ghost" size="sm" icon={RotateCcw} className="text-text-muted hover:text-danger">
            {lang === 'da' ? 'Nulstil' : 'Reset'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{lang === 'da' ? 'Nulstil dashboard?' : 'Reset dashboard?'}</DialogTitle>
            <DialogDescription>
              {lang === 'da'
                ? 'Dette gendanner standardlayoutet. Dine widget-tilpasninger fjernes.'
                : 'This restores the default layout. Your widget customizations will be removed.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-xs justify-end">
            <Button variant="secondary" size="sm" onClick={() => onResetDialogChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" size="sm" onClick={() => { onReset(); onResetDialogChange(false); }}>
              {lang === 'da' ? 'Nulstil dashboard' : 'Reset dashboard'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="sm"
        onClick={onCancelEdit}
        className="text-text-muted hover:text-danger"
      >
        {t('common.cancel')}
      </Button>

      <Button
        variant="success"
        size="sm"
        onClick={onSave}
        icon={Check}
      >
        {t('common.done')}
      </Button>
    </div>
  )
}

export default memo(DashboardHeader);
