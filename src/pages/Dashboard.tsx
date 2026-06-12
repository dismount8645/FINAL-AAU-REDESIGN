import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { WidgetGrid } from '@/components/Widgets/WidgetGrid';
import PageLayout from '@/components/Layout/PageLayout';
import useStore from '@/store';
import Button from '@/components/ui/Button';
import { Settings, Check, RotateCcw, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/Dialog';
import Checkbox from '@/components/ui/Checkbox';
import { mockDashboardDeadlines } from '@/lib/data';
import { PATHS } from '@/routes';

function Dashboard() {
  const t = useStore((state) => state.t)
  const dashboardLayout = useStore((state) => state.dashboardLayout)
  const setDashboardLayout = useStore((state) => state.setDashboardLayout)
  const resetDashboardLayout = useStore((state) => state.resetDashboardLayout)
  const location = useLocation()
  const navigate = useNavigate()

  const firstName = useStore((state) => state.firstName)
  const lang = useStore((state) => state.lang)
  const courses = useStore((state) => state.courses)
  const localize = useStore((state) => state.localize)
  
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleToggleWidget = (id: string, isChecked: boolean) => {
    const updated = dashboardLayout.map((widget) => {
      if (widget.id === id) {
        return {
          ...widget,
          visible: isChecked,
        }
      }
      return widget
    })
    setDashboardLayout(updated)
  }

  // Filter layouts to render only the visible ones
  const visibleWidgets = dashboardLayout.filter(w => w.visible !== false)

  const getGreeting = () => {
    const hours = new Date().getHours()
    if (lang === 'en') {
      if (hours < 12) return 'Good morning'
      if (hours < 18) return 'Good afternoon'
      return 'Good evening'
    } else {
      if (hours < 12) return 'Godmorgen'
      if (hours < 18) return 'Goddag'
      return 'Godaften'
    }
  }

  const nextDeadlineInfo = useMemo(() => {
    const firstDeadline = mockDashboardDeadlines[0]
    if (!firstDeadline) return null
    const course = courses.find(c => c.id === firstDeadline.courseId)
    const courseTitle = course ? localize(course, 'title') : ''
    const title = localize(firstDeadline, 'title')
    return {
      ...firstDeadline,
      courseTitle,
      title
    }
  }, [courses, localize])

  return (
    <PageLayout
      key={location.key}
      className="dashboard-page relative"
      pageKey="dashboard"
      title={t('dashboard.title')}
      subtitle={t('dashboard.subtitle')}
      flat
      gap="sm"
      actionsAlign="center"
      actions={
        <div className="flex items-center gap-[var(--space-xs)] flex-wrap">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger render={
              <Button variant="ghost" size="sm" icon={Plus} render={<span />} className="text-text-muted hover:text-primary">
                {t('dashboard.add_remove_widgets')}
              </Button>
            } />
            <DialogContent className="max-w-[420px]">
              <DialogHeader>
                <DialogTitle>{t('dashboard.add_remove_widgets')}</DialogTitle>
                <DialogDescription>
                  Vælg de moduler, du ønsker at have synlige på dit dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-sm my-xs">
                {dashboardLayout.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between py-xs border-b border-[var(--border-color)]/30 last:border-b-0">
                    <label htmlFor={`widget-checkbox-${widget.id}`} className="text-xs font-bold text-main cursor-pointer select-none">
                      {t(`dashboard.widget_${widget.id}`)}
                    </label>
                    <Checkbox
                      id={`widget-checkbox-${widget.id}`}
                      checked={widget.visible !== false}
                      onChange={(e) => handleToggleWidget(widget.id, e.target.checked)}
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <DialogClose render={
                  <Button variant="primary" size="sm" render={<span />}>
                    {t('common.done')}
                  </Button>
                } />
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {isEditing ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={resetDashboardLayout}
                icon={RotateCcw}
              >
                {t('dashboard.reset_dashboard')}
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => setIsEditing(false)}
                icon={Check}
              >
                {t('common.done')}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                icon={Settings}
                className="text-text-muted hover:text-primary"
              >
                {t('dashboard.edit_dashboard')}
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="dashboard-content-wrapper w-full pb-[var(--space-xl)] pt-2xs">
        {!isEditing && nextDeadlineInfo && (
          <div className="focus-banner animate-fade-in" data-testid="focus-banner">
            <div className="focus-banner-bg-pattern" />
            <div className="relative z-10 flex flex-col justify-between gap-y-xs">
              {/* Row 1: Greeting + priority status */}
              <div className="flex flex-wrap items-baseline gap-x-xs">
                <span className="text-sm font-extrabold text-white">
                  {getGreeting()}, {firstName}!
                </span>
                <span className="text-xs text-white/80 font-medium">
                  {lang === 'da' ? 'Du har en vigtig opgave, der kræver din opmærksomhed:' : 'You have an important task that requires your attention:'}
                </span>
              </div>
              
              {/* Row 2: Task details & compact CTA */}
              <div className="focus-banner-box mt-0">
                <div className="flex items-center gap-xs min-w-0">
                  <div className="p-1.5 bg-white/10 text-white rounded-full flex-shrink-0">
                    <AlertCircle size={14} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">{nextDeadlineInfo.title}</span>
                    <span className="text-[10px] text-white/70 block mt-3xs truncate">
                      {nextDeadlineInfo.courseTitle} · <span className="font-bold text-white">{t(nextDeadlineInfo.dateKey)}</span>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="focus-banner-btn flex-shrink-0"
                  onClick={() => navigate(PATHS.SUBMISSION(nextDeadlineInfo.courseId, nextDeadlineInfo.id))}
                >
                  <span>{lang === 'da' ? 'Gå til aflevering' : 'Go to assignment'}</span>
                  <ArrowRight size={12} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}
        {isEditing && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-[var(--radius-md)] text-xs text-main animate-pulse">
            {t('dashboard.edit_mode_hint')}
          </div>
        )}
        <WidgetGrid
          widgets={visibleWidgets}
          isEditing={isEditing}
          onLayoutChange={setDashboardLayout}
        />
      </div>
    </PageLayout>
  )
}

export default Dashboard


